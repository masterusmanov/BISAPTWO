<template>
  <div class="flex w-full">
    <div class="sidebar rounded-lb-[16px] h-full bg-white border-r border-gray-300">
      <div class="border border-gray-400 flex items-center px-2 space-x-1 py-[5px] rounded-[8px] mt-[10px]">
        <label for="search"><i class='bx bx-search text-lg text-gray-500 mt-1'></i></label>
        <input 
          type="text" 
          id="search" 
          name="search" 
          v-model="searchQuery"
          :placeholder="$t(`search`)" 
          class="w-full outline-none"
          @input="filterProjectsBySearch"
        >
      </div>
      
      <!-- Tashkilotlar bo'yicha accordion -->
      <div class="space-y-2 mt-4">
        <div v-for="organization in groupedProjectsByOrganization" :key="organization.id" class="border border-gray-200 rounded-lg">
          <!-- Accordion Header -->
          <button
            @click="toggleOrganizationAccordion(organization.id)"
            class="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-t-lg transition-colors"
            :class="{'rounded-lg': !openAccordions.includes(organization.id)}"
          >
            <div class="flex items-center space-x-3">
              <img :src="gerb" alt="Gerb" class="w-[40px]">
              <div class="text-left">
                <p class="text-[12px] font-bold text-gray-800">
                  {{ organization.name.slice(0, 25) }}...
                </p>
                <p class="text-[10px] text-gray-500">
                  {{$t('Loyihalar')}}: {{ `${organization.projects.length} ta` }}
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <!-- <div class="w-[8px] h-[8px] rounded-full bg-green-500"></div> -->
               <div class="flex items-center space-x-2">
                <!-- <div class="w-[8px] h-[8px] rounded-full bg-green-500"></div> -->
              <div 
                class="w-[8px] h-[8px] rounded-full transition-colors duration-300"
                :class="getOrganizationIndicatorColor(organization.projects)"
                :title="getDominantStatusText(organization.projects)"
              ></div>
                <!-- <i 
                  class='bx text-lg text-gray-600 transition-transform duration-200'
                  :class="openAccordions.includes(organization.id) ? 'bx-chevron-up' : 'bx-chevron-down'"
                ></i> -->
              </div>
              <i 
                class='bx text-lg text-gray-600 transition-transform duration-200'
                :class="openAccordions.includes(organization.id) ? 'bx-chevron-up' : 'bx-chevron-down'"
              ></i>
            </div>
          </button>
          
          <!-- Accordion Content -->
          <div 
            v-show="openAccordions.includes(organization.id)"
            class="border-t border-gray-200 bg-white rounded-b-lg overflow-hidden"
          >
            <div class="max-h-60 overflow-y-auto" >
              <div 
                v-for="project in organization.projects.slice()" 
                :key="project.id" 
                @click="saveToLocalStorage(project, organization.name)"
                class="flex items-center space-x-2 p-3 hover:bg-gray-50 cursor-pointer transition-all duration-200 border-b border-gray-100 last:border-b-0"
                :class="{
                  'bg-white border-l-4 border-l-blue-500': selectedProject && selectedProject.id === project.id,
                  'bg-white': project.status === 'NEW'
                }"
              >
                <div class="flex-shrink-0">
                  <div class="w-[40px] h-[40px] bg-blue-100 rounded-lg flex items-center justify-center">
                    <img :src="gerb" alt="Gerb" class="w-[25px]">
                  </div>
                </div>
                <div class="flex-1 items min-w-0" >
                  <p class="font-bold text-[11px] text-gray-800 truncate">
                    {{$t('ministry.project')}}: <span class="font-normal">{{project.name ? project.name.slice(0, 20) : 'No name'}}...</span>
                  </p>
                </div>
                <div v-if="project.status === 'NEW' " class="w-[10px] h-[10px] rounded-full bg-green-600 float-right"></div>
                <div v-else-if="project.status === 'RESOLVED'" class="w-[10px] h-[10px] rounded-full bg-yellow-500 float-right"></div>
                <div v-else-if="project.status === 'TO_REVIEW'" class="w-[10px] h-[10px] rounded-full bg-purple-500 float-right"></div>
                <div v-else-if="project.status === 'REJECTED'" class="w-[10px] h-[10px] rounded-full bg-red-500 float-right"></div>
                <div v-else-if="project.status === 'ACCEPTED' && project.is_approved !== true" class="w-[10px] h-[10px] rounded-full bg-blue-500 float-right"></div>
                <div v-else-if="project.is_approved === true" class="w-[10px] h-[10px] rounded-full bg-gray-400 float-right"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Agar hech qanday tashkilot topilmasa -->
        <div v-if="groupedProjectsByOrganization.length === 0" class="text-center py-8 text-gray-500">
          <i class='bx bx-search text-4xl mb-2'></i>
          <p class="text-sm">{{$t('no_organizations_found')}}</p>
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
          <p class="text-sm font-[700]">{{ selectedProject.organizations_name }}</p>
          <p class="text-sm"><strong>{{$t('ministry.project')}}:</strong> {{ selectedProject.name }}</p>
          <p class="text-xs text-gray-500">Project ID: {{ selectedProject.id }}</p>
        </div>
      </div>
      <div class="p-4">
        <AccordionMode/>
      </div>
    </div>
    
    <!-- Debug info (remove in production) -->
    <div v-if="!selectedProject" class="ml-4 w-[100%] bg-red-50 p-4 rounded-lg border border-red-200">
      <p class="text-red-600">Hech qanday loyiha tanlanmagan. Loyihani tanlash uchun ustiga bosing.</p>
      <p class="text-xs text-gray-500 mt-2">Nosozlikni tuzatish: tanlanganLoyiha = {{ selectedProject }}</p>
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

// Yangi state-lar
const openAccordions = ref([]) // Ochiq accordionlar
const searchQuery = ref('') // Qidiruv uchun
const groupedProjectsByOrganization = ref([]) // Tashkilotlar bo'yicha guruhlangan loyihalar

// Mavjud state-lar
const selectedProject = ref(null)
const loading = ref(false)
const error = ref('')
const meInfo = ref(null);
const organizationId = ref(null);
const organizationNames = ref({})
const minorganListwo = ref([])
const projectsList = ref([])
const organizationList = ref([])
const filteredProjects = ref([])

const saveToLocalStorage = (selectItem, organizationName = null) => {
  console.log('saveToLocalStorage called with:', selectItem, organizationName);
  
  // Organization nomini olish
  const orgName = organizationName || getOrgName(selectItem.organizations_id);
  
  // selectItem ga organization nomini qo'shish
  const itemWithOrgName = {
    ...selectItem,
    organizationName: orgName
  };
  
  console.log('Setting selectedProject to:', itemWithOrgName);
  selectedProject.value = itemWithOrgName;
  sessionStorage.setItem('selectMinistry', JSON.stringify(itemWithOrgName));
  
  // Force reactivity update
  console.log('selectedProject.value after setting:', selectedProject.value);
}

// Organization uchun indikator rangini hisoblash funksiyasi (eng ko'p status bo'yicha)
// Organization uchun indikator rangini hisoblash funksiyasi (eng oxirgi status bo'yicha)
const getOrganizationIndicatorColor = (projects) => {
  if (!projects || projects.length === 0) {
    return 'bg-gray-400'
  }
  
  // Eng oxirgi loyihani topish (updated_at yoki created_at bo'yicha)
  let latestProject = projects[0]
  
  projects.forEach(project => {
    const currentDate = new Date(project.updated_at || project.created_at)
    const latestDate = new Date(latestProject.updated_at || latestProject.created_at)
    
    if (currentDate > latestDate) {
      latestProject = project
    }
  })
  
  // Eng oxirgi loyiha statusiga mos rang qaytarish
  if (latestProject.is_approved === true) {
    return 'bg-gray-400' // Tasdiqlangan
  } else if (latestProject.status === 'NEW') {
    return 'bg-green-500' // Yangi
  } else if (latestProject.status === 'RESOLVED') {
    return 'bg-yellow-500' // Hal qilingan
  } else if (latestProject.status === 'TO_REVIEW') {
    return 'bg-purple-500' // Ko'rib chiqilmoqda
  } else if (latestProject.status === 'REJECTED') {
    return 'bg-red-500' // Rad etilgan
  } else if (latestProject.status === 'ACCEPTED') {
    return 'bg-blue-500' // Qabul qilingan
  } else {
    return 'bg-gray-300' // Default
  }
}

// Eng ko'p statusni matn ko'rinishida qaytarish
const getDominantStatusText = (projects) => {
  if (!projects || projects.length === 0) {
    return 'Loyiha yo\'q'
  }
  
  const statusCounts = {
    NEW: 0,
    RESOLVED: 0,
    TO_REVIEW: 0,
    REJECTED: 0,
    ACCEPTED: 0,
    APPROVED: 0
  }
  
  projects.forEach(project => {
    if (project.is_approved === true) {
      statusCounts.APPROVED++
    } else if (project.status === 'NEW') {
      statusCounts.NEW++
    } else if (project.status === 'RESOLVED') {
      statusCounts.RESOLVED++
    } else if (project.status === 'TO_REVIEW') {
      statusCounts.TO_REVIEW++
    } else if (project.status === 'REJECTED') {
      statusCounts.REJECTED++
    } else if (project.status === 'ACCEPTED') {
      statusCounts.ACCEPTED++
    }
  })
  
  let maxCount = 0
  let dominantStatus = 'APPROVED'
  
  Object.entries(statusCounts).forEach(([status, count]) => {
    if (count > maxCount) {
      maxCount = count
      dominantStatus = status
    }
  })
  
  const statusNames = {
    NEW: 'Yangi',
    RESOLVED: 'Hal qilingan',
    TO_REVIEW: 'Ko\'rib chiqilmoqda',
    REJECTED: 'Rad etilgan',
    ACCEPTED: 'Qabul qilingan',
    APPROVED: 'Tasdiqlangan'
  }
  
  return `${maxCount} ta ${statusNames[dominantStatus]}`
}

// Accordion funksiyalari
const toggleOrganizationAccordion = (organizationId) => {
  const index = openAccordions.value.indexOf(organizationId)
  if (index > -1) {
    openAccordions.value.splice(index, 1)
  } else {
    openAccordions.value.push(organizationId)
  }
}

// Loyihalarni tashkilot bo'yicha guruhlash
const groupProjectsByOrganization = () => {
  const grouped = new Map()
  
  projectsList.value.forEach(project => {
    if (project.organizations_id) {
      const orgId = project.organizations_id
      const orgName = project.organizations_name || getOrgName(orgId)
      
      if (!grouped.has(orgId)) {
        grouped.set(orgId, {
          id: orgId,
          name: orgName,
          projects: []
        })
      }
      
      grouped.get(orgId).projects.push(project)
    }
  })
  
  groupedProjectsByOrganization.value = Array.from(grouped.values())
}

// Qidiruv funksiyasi
const filterProjectsBySearch = () => {
  if (!searchQuery.value.trim()) {
    groupProjectsByOrganization()
    return
  }
  
  const filtered = new Map()
  
  projectsList.value.forEach(project => {
    if (project.organizations_id) {
      const orgId = project.organizations_id
      const orgName = project.organizations_name || getOrgName(orgId)
      
      // Tashkilot nomi yoki loyiha nomi bo'yicha qidirish
      const matchesOrganization = orgName.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesProject = project.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      
      if (matchesOrganization || matchesProject) {
        if (!filtered.has(orgId)) {
          filtered.set(orgId, {
            id: orgId,
            name: orgName,
            projects: []
          })
        }
        
        filtered.get(orgId).projects.push(project)
      }
    }
  })
  
  groupedProjectsByOrganization.value = Array.from(filtered.values())
}

// Format funksiyalari
const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('uz-UZ')
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
  
  // Tashkilotlar nomlarini yuklash tugagach, gruppalash
  groupProjectsByOrganization()
}

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
    const response = await axios.get('https://back.miit.uz/api/bisap/test/project/list?limit=100000&page=1', {
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
    
  } catch (err) {
    console.error('Organization ro\'yxatini olishda xato:', err)
  }
}

// Mount lifecycle
onMounted(async () => {
  await fetchProjectsList()
  await fetchOrganizationList()
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

/* Accordion animations */
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.3s ease;
}

.accordion-enter-from {
  opacity: 0;
  max-height: 0;
}

.accordion-enter-to {
  opacity: 1;
  max-height: 300px;
}

.accordion-leave-from {
  opacity: 1;
  max-height: 300px;
}

.accordion-leave-to {
  opacity: 0;
  max-height: 0;
}

/* Smooth hover transitions */
.hover-transition {
  transition: all 0.2s ease-in-out;
}

/* Selected project highlight */
.selected-project {
  background: linear-gradient(90deg, #dbeafe 0%, #f3f4f6 100%);
  border-left: 4px solid #3b82f6;
  transform: translateX(4px);
}

/* Organization accordion hover effect */
.organization-accordion:hover {
  background: linear-gradient(45deg, #f8fafc, #f1f5f9);
}

/* Project item hover effect */
.project-item:hover {
  background: linear-gradient(45deg, #f9fafb, #f3f4f6);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Search input focus effect */
input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Chevron rotation animation */
.chevron-transition {
  transition: transform 0.2s ease;
}

/* Scrollbar customization for sidebar */
.sidebar::-webkit-scrollbar {
  width: 8px;
}

.sidebar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Empty state styling */
.empty-state {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Badge animations */
.badge-pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    max-width: 280px;
  }
}

@media (max-width: 640px) {
  .modal-content {
    margin: 1rem;
    width: calc(100% - 2rem);
  }
}
</style>