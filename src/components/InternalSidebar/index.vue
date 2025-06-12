<template>
  <div class="flex w-full ">
    <div class="sidebar rounded-lb-[16px] h-full bg-white border-r border-gray-300">
      <div class="border border-gray-400 flex items-center px-2 space-x-1 py-[5px] rounded-[8px] mt-[10px]">
          <label for="search"><i class='bx bx-search text-lg text-gray-500 mt-1'></i></label>
          <input type="text" id="search" name="search" :placeholder="$t(`search`)" class=" w-full outline-none">
      </div>
      <button @click="showModal" class="flex items-center space-x-4 p-4 w-full my-[16px] border border-dashed border-black rounded-[8px] bg-[#F8F8F8]">
          <i class='bx bx-plus text-[36px] bg-gray-200 p-4 rounded-[8px]'></i>
          <p class="text-[18px] font-[500]">{{$t('createproject')}}</p>
      </button>
      
      <!-- Loyihalar ro'yxati -->
      <div v-for="el of projectsList.slice().reverse()" :key="el.id" class="mt-[16px]">
        <div @click="handleClick(el)" 
             class="flex items-center space-x-2 p-2 rounded-[8px] bg-[#F8F8F8] cursor-pointer transition-all duration-200"
             :class="{'bg-white border border-blue-500 shadow-sm': selectedProject && selectedProject.id === el.id}">
            <div class="relative w-[50px] h-[50px] flex-shrink-0">
                <img :src="gerb" alt="Gerb" class="w-full h-full object-contain">
                <div class="absolute bottom-1 -right-1 w-[8px] h-[8px] rounded-full bg-green-500"></div>
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-[12px] font-bold truncate">{{ getLocalizedName(minorganListwo[0]) }}</p>
                <p class="font-bold text-[10px] truncate">
                    {{$t('ministry.project')}}: 
                    <span class="font-normal">{{$t(`${el.name}`)}}</span>
                </p>
            </div>
        </div>
    </div>
  </div>

  <!-- Modal -->
  <div v-if="openmodal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div class="modal-content bg-white rounded-lg shadow-xl w-full max-w-[800px] text-black relative">
          <!-- Close button -->
           <div class="bg-white border-b rounded-lg pl-4 border-gray-300 flex items-center justify-between">
              <p class="text-[15px] text-[#07A920] font-[700]">{{$t('create')}}</p> 
              <button @click="closeModal" class="text-gray-700 text-[42px] hover:text-red-500 border-l border-gray-300 px-4">&times;</button>
           </div>
          
           <div>
              <form @submit.prevent="login">
                  <!-- Nameproject uchun dropdown/input kombo -->
                  <div class="mb-4 w-full px-8 py-8">
                    <label class="block mb-2 text-sm font-bold" for="nameproject">
                      {{$t('nameproject')}}
                    </label>
                    <div class="relative">
                      <input
                        v-model="nameproject"
                        id="nameproject"
                        type="text"
                        class="w-full px-4 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm pr-10"
                        :placeholder="$t('nameproject')"
                        @focus="showProjectDropdown = true"
                        @input="filterProjects"
                        required
                      />
                      <!-- Dropdown tugmasi -->
                      <button
                        type="button"
                        @click="toggleProjectDropdown"
                        class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        <i class='bx bx-chevron-down text-lg' :class="{'rotate-180': showProjectDropdown}"></i>
                      </button>
                      
                      <!-- Dropdown ro'yxati -->
                      <div
                        v-if="showProjectDropdown && filteredProjects.length > 0"
                        class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
                      >
                        <div
                          v-for="project in filteredProjects"
                          :key="project.id || project.name"
                          @click="selectProject(project)"
                          class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        >
                          {{ project.name }}
                        </div>
                        
                        <!-- Agar hech narsa topilmasa -->
                        <div v-if="filteredProjects.length === 0 && nameproject" class="px-4 py-2 text-gray-500 text-sm">
                          {{$t('no_results_found')}}
                        </div>
                      </div>
                    </div>
                  </div>
    
                  <div class="flex items-center justify-between px-8 pb-8 space-x-[16px]">
                      <div class="mb-4 w-full">
                          <label class="block mb-2 text-sm font-bold" for="amount">
                            {{$t('amount')}}
                          </label>
                          <div class="relative">
                            <input
                              v-model="amount"
                              id="amount"
                              type="text"
                              class="w-full px-4 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              :placeholder="`${$t('amount')} . . . ${$t('sum')}`"
                               @input="validateAmount"
                              @keydown="preventNegativeInput"
                              required
                            />
                          </div>
                        </div>
                        <div class="mb-4 w-full">
                          <label class="block mb-2 text-sm font-bold" for="amount">
                              {{$t('createdata')}}
                            </label>
                          <p class="border border-gray-500 p-2 rounded-md text-[14px]">{{new Date().toLocaleDateString(currentLanguage, {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                            })}}</p>
                        </div>
                  </div>
  
                  <!-- Form Buttons -->
                  <div class="flex items-center p-4 space-x-6">
                      <button 
                       @click="closeModal"
                       type="button"
                        class="w-full px-4 py-2 bg-[#DCDCDC] rounded-md hover:bg-gray-400 focus:outline-none focus:bg-gray-400"
                      >
                      {{$t('cancel')}}
                      </button>
                      <button 
                        type="submit"
                        :disabled="!nameproject || !amount || loading"
                        class="w-full px-4 py-2 text-white bg-[#07A920] rounded-md hover:bg-green-700 focus:outline-none focus:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {{ loading ? $t('loading') : $t('create') }}
                      </button>
                  </div>
                </form>
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
      <div>
        <p class="text-justify font-bold">{{ getLocalizedName(minorganListwo[0]) }}</p>
        <p class="text-sm"><strong>{{$t('ministry.project')}}:</strong> {{ selectedProject.name }}</p>
      </div>
    </div>
    <div class="p-4">
      <Accordion v-if="showComponent"/>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick  } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import { toast } from 'vue3-toastify';
import "vue3-toastify/dist/index.css";
import notificationministry from "../../constants/notificationministry"
import gerb from '../../assets/images/sign/gerb.png';
import Accordion from '../Ministry/Accordion.vue';

const notfministry = ref(notificationministry)
const { t: $t, locale } = useI18n()

// Tanlangan loyiha uchun reaktiv o'zgaruvchi
const selectedProject = ref(null)

const handleClick = (el) => {
  saveToLocalStorage(el)
  refreshComponent()
}

const showComponent = ref(true)

const refreshComponent = async () => {
  showComponent.value = false
  await nextTick()
  showComponent.value = true
}

const saveToLocalStorage = (selectItem) => {
  selectedProject.value = selectItem // Reaktiv o'zgaruvchini yangilash
  sessionStorage.setItem('selectMinistry', JSON.stringify(selectItem))
  // location.reload()
}

const openmodal = ref(false)
const isDropdownOpen = ref(false)
const loading = ref(false)
const error = ref('')
const meInfo = ref(null);
const organizationId = ref(null);
const selectedMinorgan = ref(null)
const minorganList = ref([])
const minorganListwo = ref([])
const nameproject = ref('')
const amount = ref('')
const showProjectDropdown = ref(false)
const projectsList = ref([]) // Backenddan kelgan loyihalar ro'yxati
const filteredProjects = ref([])

const validateAmount = (event) => {
  // Faqat raqam, nuqta va vergulni qabul qilish
  let value = event.target.value;
  
  // Manfiy belgini olib tashlash
  if (value.includes('-')) {
    value = value.replace(/-/g, '');
  }
  
  // Faqat raqam va bitta nuqta/vergulni qoldirish
  value = value.replace(/[^0-9.,]/g, '');
  
  // Bitta nuqta/verguldan ko'p bo'lsa, faqat birinchisini qoldirish
  const dotCount = (value.match(/[.,]/g) || []).length;
  if (dotCount > 1) {
    const firstDotIndex = value.search(/[.,]/);
    value = value.substring(0, firstDotIndex + 1) + value.substring(firstDotIndex + 1).replace(/[.,]/g, '');
  }
  
  // Vergulni nuqtaga almashtirish (o'zbek formatida)
  value = value.replace(',', '.');
  
  // Input qiymatini yangilash
  amount.value = value;
  event.target.value = value;
}

const preventNegativeInput = (event) => {
  // Minus (-) tugmasini bosishni oldini olish
  if (event.key === '-' || event.key === 'Minus') {
    event.preventDefault();
  }
  
  // E, +, - kabi belgilarni oldini olish
  if (['e', 'E', '+', '-'].includes(event.key)) {
    event.preventDefault();
  }
}

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

const showModal = () => {
  openmodal.value = true
  resetForm()
}

const closeModal = () => {
  openmodal.value = false
  isDropdownOpen.value = false
}

const resetForm = () => {
  selectedMinorgan.value = null
  amount.value = ''
  error.value = ''
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

const getUserMe = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
        error.value = 'Token topilmadi';
        return null;
    }
    try {
        const response = await axios.get('https://back.miit.uz/api/bisap/test/user/me', {
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
    const response = await axios.get('https://back.miit.uz/api/bisap/test/project/list?limit=10000&page=1', {
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

// Dropdown ni ochish/yopish
const toggleProjectDropdown = () => {
  showProjectDropdown.value = !showProjectDropdown.value
  if (showProjectDropdown.value && projectsList.value.length === 0) {
    fetchProjectsList()
  }
}

// Loyihani tanlash
const selectProject = (project) => {
  nameproject.value = project.name
  showProjectDropdown.value = false
}

// Loyihalarni qidirish/filtrlash
const filterProjects = () => {
  if (!nameproject.value) {
    filteredProjects.value = projectsList.value
  } else {
    filteredProjects.value = projectsList.value.filter(project => 
      project.name.toLowerCase().includes(nameproject.value.toLowerCase())
    )
  }
  showProjectDropdown.value = true
}

// Dropdown tashqarisiga bosilganda yopish
const handleProjectClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showProjectDropdown.value = false
  }
}

const login = async () => {
  if (!nameproject.value || !amount.value) {
    error.value = $t('fill_all_fields')
    return
  }

  loading.value = true

  try {
    console.log('Forma ma\'lumotlari:', {
      name: nameproject.value,
      amount: amount.value,
    })
    
    const requestData = {
      name: nameproject.value.trim(),
      amount: parseInt(amount.value) || parseFloat(amount.value), // Raqamga aylantirish
    };
    
    console.log(requestData);

    const response = await axios.post('https://back.miit.uz/api/bisap/test/project/create', 
      requestData,
      {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      }
    })
    
    closeModal()
    
    toast.success('Loyiha muvaffaqiyatli yaratildi!', {
        position: 'top-right',
        timeout: 3000,
        closeOnClick: true,
        pauseOnFocusLoss: true,
        pauseOnHover: true,
        draggable: true,
        draggablePercent: 0.6,
        showCloseButtonOnHover: false,
        hideProgressBar: false,
        closeButton: 'button',
        icon: true,
        rtl: false
      })
    
    // Loyihalar ro'yxatini yangilash
    fetchProjectsList()
    
  } catch (err) {
    error.value = `${$t('error')}: ${err.response?.data?.message || err.message}`
    toast.error(`Ma'lumot yuborishda xato!, ${error.value}`, {
        position: 'top-right',
        timeout: 4000
      })
  } finally {
    loading.value = false
  }
}

const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    isDropdownOpen.value = false
  }
}

// Mount lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('click', handleProjectClickOutside)
  fetchProjectsList() // Sahifa yuklanganda loyihalar ro'yxatini oling
  
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