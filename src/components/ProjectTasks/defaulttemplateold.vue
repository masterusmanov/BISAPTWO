<template>
    <div class="flex w-full ">
      <div class="sidebar rounded-lb-[16px] h-full bg-white border-r border-gray-300">
        <div class="border border-gray-400 flex items-center px-2 space-x-1 py-[5px] rounded-[8px] mt-[10px]">
            <label for="search"><i class='bx bx-search text-lg text-gray-500 mt-1'></i></label>
            <input type="text" id="search" name="search" :placeholder="$t(`search`)" class=" w-full outline-none">
        </div>
        
        <!-- Loyihalar ro'yxati -->
        <div v-for="el of projectsList" :key="el.id" class="mt-[16px]">
            <div @click="saveToLocalStorage(el)" 
                 class="flex items-center space-x-2 p-2 rounded-[8px] bg-[#F8F8F8]  cursor-pointer transition-all duration-200"
                 :class="{'bg-white border border-blue-500 shadow-sm': selectedProject && selectedProject.id === el.id}">
                <div>
                    <img :src="gerb" alt="Gerb" class="w-[50px]">
                    <p class="w-[8px] h-[8px] rounded-full bg-green-500 float-right"></p>
                </div>
                <div>
                  <p class="text-[14px] font-[700]">{{ getOrgName(el.organizations_id).slice(0, 30) }}</p>
                    <p class="text-[12px] font-bold">{{$t('ministry.project')}}: <span class="font-normal">{{$t(`${el.name}`).slice(0, 25)}}</span></p>
                </div>
            </div>
        </div>
    </div>
  
    <!-- Tanlangan loyiha ma'lumotlarini ko'rsatish -->
    <div v-if="selectedProject" class="ml-4 w-[100%] bg-gray-100 rounded-lg border border-blue-200">
      <div class="bg-white p-4 rounded-lg flex items-center space-x-6">
        <div>
          <img :src="gerb" alt="Gerb" class="w-[50px]">
          <p class="w-[8px] h-[8px] rounded-full bg-green-500 float-right"></p>
        </div>
        <div class="space-y-2">
          <p class="text-sm font-[700]">{{selectedProject.organizationName}}</p>
          <p class="text-sm"><strong>{{$t('ministry.project')}}:</strong> {{ selectedProject.name }}</p>
        </div>
      </div>
      <div class="p-4">
        <AccordionMode/>
      </div>
    </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import axios from 'axios'
  import { toast } from 'vue3-toastify';
  import "vue3-toastify/dist/index.css";
  import notificationministry from "../../constants/notificationministry"
  import gerb from '../../assets/images/sign/gerb.png';
  import AccordionMode from './AccordionMode.vue';
  
  const notfministry = ref(notificationministry)
  const { t: $t, locale } = useI18n()
  
  // Tanlangan loyiha uchun reaktiv o'zgaruvchi
  const selectedProject = ref(null)
  
  const saveToLocalStorage = (selectItem) => {
  // Organization nomini olish
  const orgName = getOrgName(selectItem.organizations_id);
  
  // selectItem ga organization nomini qo'shish
  const itemWithOrgName = {
    ...selectItem,
    organizationName: orgName
  };
  
  selectedProject.value = itemWithOrgName; // Reaktiv o'zgaruvchini yangilash
  sessionStorage.setItem('selectMinistry', JSON.stringify(itemWithOrgName));
}
  
  const loading = ref(false)
  const error = ref('')
  const meInfo = ref(null);
  const organizationId = ref(null);
  const organizationNames = ref({})
  const minorganListwo = ref([])
  const projectsList = ref([]) // Backenddan kelgan loyihalar ro'yxati
  const organizationList = ref([]) // Backenddan kelgan loyihalar ro'yxati
  const filteredProjects = ref([])
  
    
  const currentLanguage = computed(() => locale.value)
  
  const getLocalizedName = (item) => {
    if (!item) return ''
  
    const lang = currentLanguage.value
  
    // Avval hozirgi tilni tekshirish
    if (item[lang]) return item[lang]
  
    // name obyektidan izlash
    if (item.name && typeof item.name === 'object') {
      if (item.name[lang]) return item.name[lang]
      // Fallback tartibi: oz uchun uz dan foydalanish, keyin boshqalar
      if (lang === 'oz' && item.name.uz) return item.name.uz
      
      const fallbackOrder = ['uz', 'ru', 'eng', 'en']
      for (const fallbackLang of fallbackOrder) {
        if (item.name[fallbackLang]) return item.name[fallbackLang]
      }
      // Agar hech qaysi til topilmasa, birinchi qiymatni qaytarish
      const firstKey = Object.keys(item.name)[0]
      if (firstKey) return item.name[firstKey]
    }
  
    // oz tili uchun uz dan fallback
    if (lang === 'oz' && item.uz) return item.uz
  
    // Oddiy string nom
    if (typeof item.name === 'string') return item.name
  
    // Fallback qiymatlar
    const fallbackFields = ['title', 'label', 'text']
    for (const field of fallbackFields) {
      if (item[field]) {
        if (typeof item[field] === 'object') {
          if (item[field][lang]) return item[field][lang]
          if (lang === 'oz' && item[field].uz) return item[field].uz
        } else if (typeof item[field] === 'string') {
          return item[field]
        }
      }
    }
  
    // Default: ID bilan
    return `${$t('organization')} ${item.id}`
  }
  
  const fetchMinorganIdData = async (orgId) => {
      loading.value = true;
      error.value = '';
  
      try {
          const response = await axios.get('https://shartnoma.miit.uz/api/api_directory', {
              headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
              },
              params: {
                  start_id: 29,
                  end_id: 64,
              }
          });
  
        let data = response.data;
          console.log(data);
          
  
          // Agar API javobi array emas bo'lsa, ma'lumotlarni qayta ishlash
          if (!Array.isArray(data)) {
              if (data.data && Array.isArray(data.data)) {
                  data = data.data;
              } else if (data.items && Array.isArray(data.items)) {
                  data = data.items;
              } else {
                  throw new Error("API noto'g'ri formatda javob qaytardi");
              }
          }
  
          // ID bo'yicha filter qilish (orgId ga mos keladigan ma'lumotni topish)
          const filteredData = data.filter(item => {
              const id = parseInt(item.id);
              return id === orgId; // Faqat berilgan ID ga mos keladigan ma'lumot
          });
  
          // Agar ma'lumot topilsa, uni ko'rsatish
          if (filteredData.length > 0) {
              const selectedOrg = filteredData[0];
              minorganListwo.value = [{
                  id: selectedOrg.id,
                  uz: selectedOrg.name_uz || selectedOrg.uz || selectedOrg.name?.uz,
                  oz: selectedOrg.name_oz || selectedOrg.oz || selectedOrg.name?.oz,
                  ru: selectedOrg.name_ru || selectedOrg.ru || selectedOrg.name?.ru,
                  en: selectedOrg.name_en || selectedOrg.en || selectedOrg.name?.en,
              }];
          } else {
              throw new Error("Berilgan ID ga mos ma'lumot topilmadi");
          }
  
      } catch (err) {
          console.error('Xatolik:', err);
          error.value = err.message;
          minorganListwo.value = []; // Agar xatolik bo'lsa, ro'yxatni tozalash
      } finally {
          loading.value = false;
      }
  };

  const getOrganizationName = async (orgId) => {
  // Agar allaqachon yuklangan bo'lsa, uni qaytarish
  if (organizationNames.value[orgId]) {
    return organizationNames.value[orgId]
  }

  try {
    const response = await axios.get('https://shartnoma.miit.uz/api/api_directory', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      params: {
        start_id: 29,
        end_id: 64,
      }
    });

    let data = response.data;
    
    if (!Array.isArray(data)) {
      if (data.data && Array.isArray(data.data)) {
        data = data.data;
      } else if (data.items && Array.isArray(data.items)) {
        data = data.items;
      }
    }

    const filteredData = data.filter(item => {
      const id = parseInt(item.id);
      return id === orgId;
    });

    if (filteredData.length > 0) {
      const selectedOrg = filteredData[0];
      const orgName = getLocalizedName({
        uz: selectedOrg.name_uz || selectedOrg.uz,
        oz: selectedOrg.name_oz || selectedOrg.oz,
        ru: selectedOrg.name_ru || selectedOrg.ru,
        en: selectedOrg.name_en || selectedOrg.en,
      });
      
      // Reaktiv obyektga saqlash
      organizationNames.value[orgId] = orgName;
      return orgName;
    }
    
    return `Tashkilot ${orgId}`;
  } catch (err) {
    console.error('Xatolik:', err);
    return `Xatolik: ${orgId}`;
  }
  }

  const preloadOrganizationNames = async () => {
  for (const project of projectsList.value) {
    if (project.organizations_id && !organizationNames.value[project.organizations_id]) {
      await getOrganizationName(project.organizations_id);
    }
  }
}
  
  const getUserMe = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
          error.value = 'Token topilmadi';
          return null;
      }
      try {
          const response = await axios.get(import.meta.env.VITE_APP_BASE_URL + '/user/me', {
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          });
          return response.data;
      } catch (err) {
          error.value = 'Xato yuz berdi: ' + err.message;
          return null;
      }
  };
  
  // Loyihalar ro'yxatini backenddan olish
  const fetchProjectsList = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_APP_BASE_URL + '/project/list?limit=100000&page=1', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      })
      
      projectsList.value = response.data?.data?.results || response.data || []
      filteredProjects.value = projectsList.value
      
    } catch (err) {
      console.error('Loyihalar ro\'yxatini olishda xato:', err)
    }
  }

  const fetchOrganizationList = async () => {
    try {
      const response = await axios.get('https://shartnoma.miit.uz/api/api_directory', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      })
      
      organizationList.value = response.data?.data?.results || response.data || []
      console.log('Organization List:', organizationList.value);
      
      // filteredProjects.value = organizationList.value
      
    } catch (err) {
      console.error('Organization ro\'yxatini olishda xato:', err)
    }
  }

  // Mount lifecycle
  onMounted(async () => {
   await fetchProjectsList()
   await fetchOrganizationList()// Sahifa yuklanganda loyihalar ro'yxatini oling
   await preloadOrganizationNames()
    // Sahifa yuklanganda sessionStorage dan tanlangan loyihani olish
    const savedProject = sessionStorage.getItem('selectMinistry')
    if (savedProject) {
      try {
        selectedProject.value = JSON.parse(savedProject)
      } catch (err) {
        console.error('SessionStorage dan ma\'lumot olishda xato:', err)
      }
    }
    
    // User ma'lumotlarini olish
    getUserMe().then(data => {
      if (data) {
        meInfo.value = data;
        organizationId.value = meInfo.value.data.organizations_id;
        fetchMinorganIdData(organizationId.value);
      }
    });
  })

  const getOrgName = (orgId) => {
  return organizationNames.value[orgId] || 'Yuklanmoqda...'
}
  
  // Tilni o'zgartirish funksiyasi
  const changeLanguage = (lang) => {
    locale.value = lang
  }
  
  // Tilni tekshirish uchun debug funksiya
  const debugCurrentLanguage = () => {
    console.log('Hozirgi til:', currentLanguage.value)
    console.log('Locale:', locale.value)
  }
  
  // Export qilish agar boshqa komponentlarda kerak bo'lsa
  defineExpose({
    changeLanguage,
    debugCurrentLanguage,
    currentLanguage: currentLanguage
  })
  </script>
  
  <style lang="scss" scoped>
    .sidebar {
        width: 280px;
        padding: 4px;
        overflow-y: scroll;
    }
    
    .router-link-exact-active {
        background: white !important;
        border: 1px solid #3b82f6 !important;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
  
    @keyframes fade-slide-in {
        0% {
          opacity: 0;
          transform: translateY(-20px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .modal-content {
        animation: fade-slide-in 0.4s ease-out;
      }
      
      .rotate-180 {
        transform: rotate(180deg);
      }
      
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      
      .animate-spin {
        animation: spin 1s linear infinite;
      }
      
      .max-h-60::-webkit-scrollbar {
        width: 6px;
      }
      
      .max-h-60::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 3px;
      }
      
      .max-h-60::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 3px;
      }
      
      .max-h-60::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
      }
  </style>