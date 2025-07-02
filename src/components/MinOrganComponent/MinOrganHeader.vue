<template>
    <div class="bg-white h-20 w-full flex items-center space-x-[16px] p-[16px] border-b border-gray-300 relative">
      <div class="w-full border border-gray-400 flex items-center px-2 space-x-1 py-[5px] rounded-[8px]">
        <label for="search"><i class='bx bx-search text-lg text-gray-500 mt-1'></i></label>
        <input type="text" id="search" name="search" :placeholder="$t('search')" class="w-full outline-none">
      </div>
      <button @click="showModal" class="w-[200px] border text-[12px] font-[700] bg-[#07A920] rounded-[4px] text-white p-[12px]">
        {{$t('create')}}
      </button>
    </div>
  
    <!-- Fullscreen Modal -->
    <div v-if="openmodal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div class="modal-content bg-white rounded-lg shadow-xl w-full max-w-[800px] text-black relative">
        <!-- Close button -->
         <div class="bg-white border-b rounded-lg pl-4 border-gray-300 flex items-center justify-between">
            <p class="text-[15px] text-[#07A920] font-[700]">{{$t('create')}}</p> 
            <button @click="closeModal" class="text-gray-700 text-[42px] hover:text-red-500 border-l border-gray-300 px-4">&times;</button>
         </div>
        
         <div>
            <form @submit.prevent="login">
                <!-- Minorgan Select Field - Searchable versiyasi -->
<div class="mb-4 px-8 pt-8">
  <label class="block mb-2 text-sm font-bold text-gray-700" for="minorgan_select">
    {{ $t('minorgan') }}
  </label>
  <div class="relative">
    <!-- Searchable Input with Dropdown -->
    <div class="relative">
      <!-- Input field with search -->
      <input
        ref="searchInput"
        v-model="searchQuery"
        @focus="openDropdown"
        @blur="handleBlur"
        @input="handleInput"
        type="text"
        class="w-full px-4 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
        :class="{ 'border-blue-500 ring-2 ring-blue-500': isDropdownOpen }"
        :placeholder="selectedMinorgan ? getLocalizedName(selectedMinorgan) : $t('minorgan')"
      />
      
      <!-- Dropdown arrow -->
      <div 
        @click="toggleDropdown"
        class="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
      >
        <svg 
          class="w-5 h-5 text-gray-400 transition-transform duration-200"
          :class="{ 'rotate-180': isDropdownOpen }"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>

      <!-- Clear button -->
      <div 
        v-if="selectedMinorgan || searchQuery"
        @click="clearSelection"
        class="absolute inset-y-0 right-8 flex items-center pr-3 cursor-pointer hover:text-red-500"
      >
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>

      <!-- Dropdown Menu -->
      <div 
        v-if="isDropdownOpen" 
        class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
      >
        <!-- Loading -->
        <div v-if="loading" class="px-4 py-3 text-sm text-gray-500 flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{$t('loading')}}
        </div>

        <!-- Error Message -->
        <div v-else-if="error" class="px-4 py-3 text-sm text-red-600 bg-red-50">
          {{ error }}
        </div>

        <!-- Options -->
        <div v-else-if="filteredMinorganList.length > 0" class="py-1">
          <button
            v-for="item in filteredMinorganList"
            :key="item.id"
            type="button"
            @mousedown="selectMinorgan(item)"
            class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus:bg-blue-50"
            :class="{ 'bg-blue-100 text-blue-700': selectedMinorgan && selectedMinorgan.id === item.id }"
          >
            {{ getLocalizedName(item) }}
          </button>
        </div>

        <!-- No Data -->
        <div v-else class="px-4 py-3 text-sm text-gray-500">
          {{$t('no_data_found')}}
        </div>
      </div>
    </div>
  </div>
</div>

                <!-- Email va Password Fields -->
                <div class="flex items-center justify-between px-8 pb-8 space-x-[16px]">
                    <div class="mb-4 w-full">
                        <label class="block mb-2 text-sm font-bold" for="email">
                          {{$t('mail')}}
                        </label>
                        <div class="relative">
                          <input
                            v-model="email"
                            id="email"
                            type="email"
                            class="w-full px-4 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="example@mail.uz"
                            required
                          />
                        </div>
                      </div>
                      <div class="mb-4 w-full">
                        <label class="block mb-2 text-sm font-bold" for="password">
                          {{$t('formpassword')}}
                        </label>
                        <div class="relative">
                          <input
                            v-model="password"
                            id="password"
                            :type="showPassword ? 'text' : 'password'"
                            class="w-full px-4 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="• • • • • • • •"
                            required
                          />
                          <div 
                            @click="showPassword = !showPassword"
                            class="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-400"
                          >
                            <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
            </svg>
                          </div>
                        </div>
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
                      :disabled="!selectedMinorgan || !email || !password || loading"
                      class="w-full px-4 py-2 text-white bg-[#07A920] rounded-md hover:bg-green-700 focus:outline-none focus:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {{ loading ? $t('loading') : $t('create') }}
                    </button>
                </div>
              </form>
         </div>
      </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import { toast } from 'vue3-toastify';


const { t: $t, locale } = useI18n()

const showPassword = ref(false)
const openmodal = ref(false)
const isDropdownOpen = ref(false)
const loading = ref(false)
const error = ref('')
const searchQuery = ref('')
const searchInput = ref(null)


const generateTestData = () => {
  return [
    { id: 1, uz: "Iqtisodiyot va moliya vazirligi", oz: "Iqtisodiyot va moliya vazirligi", ru: "Министерство экономики и финансов", eng: "Ministry of Economy and Finance" },
    { id: 2, uz: "Transport vazirligi", oz: "Transport vazirligi", ru: "Министерство транспорта", eng: "Ministry of Transport" },
    { id: 3, uz: "Oliy ta'lim, fan va innovatsiyalar vazirligi", oz: "Oliy ta'lim, fan va innovatsiyalar vazirligi", ru: "Министерство высшего образования, науки и инноваций", eng: "Ministry of Higher Education, Science and Innovation" },
    { id: 4, uz: "Maktabgacha va maktab ta'limi vazirligi", oz: "Maktabgacha va maktab ta'limi vazirligi", ru: "Министерство дошкольного и школьного образования", eng: "Ministry of Preschool and School Education" },
    { id: 5, uz: "Sog'liqni saqlash vazirligi", oz: "Sog'liqni saqlash vazirligi", ru: "Министерство здравоохранения", eng: "Ministry of Health" },
    { id: 6, uz: "Raqamli texnologiyalar vazirligi", oz: "Raqamli texnologiyalar vazirligi", ru: "Министерство цифровых технологий", eng: "Ministry of Digital Technologies" },
    { id: 7, uz: "Qurilish va uy-joy kommunal xo'jaligi vazirligi", oz: "Qurilish va uy-joy kommunal xo'jaligi vazirligi", ru: "Министерство строительства и жилищно-коммунального хозяйства", eng: "Ministry of Construction and Housing and Communal Services" },
    { id: 8, uz: "Qishloq xo'jaligi vazirligi", oz: "Qishloq xo'jaligi vazirligi", ru: "Министерство сельского хозяйства", eng: "Ministry of Agriculture" },
    { id: 9, uz: "Suv xo'jaligi vazirligi", oz: "Suv xo'jaligi vazirligi", ru: "Министерство водного хозяйства", eng: "Ministry of Water Resources" },
    { id: 10, uz: "Energetika vazirligi", oz: "Energetika vazirligi", ru: "Министерство энергетики", eng: "Ministry of Energy" },
    { id: 11, uz: "Ekologiya, atrof-muhitni muhofaza qilish va iqlim o'zgarishi vazirligi", oz: "Ekologiya, atrof-muhitni muhofaza qilish va iqlim o'zgarishi vazirligi", ru: "Министерство экологии, охраны окружающей среды и изменения климата", eng: "Ministry of Ecology, Environmental Protection and Climate Change" },
    { id: 12, uz: "Tog'-kon sanoati va geologiya vazirligi", oz: "Tog'-kon sanoati va geologiya vazirligi", ru: "Министерство горнодобывающей промышленности и геологии", eng: "Ministry of Mining Industry and Geology" },
    { id: 13, uz: "O'rmon xo'jaligi agentligi", oz: "O'rmon xo'jaligi agentligi", ru: "Агентство лесного хозяйства", eng: "Forestry Agency" },
    { id: 14, uz: "Veterinariya va chorvachilikni rivojlantirish davlat qo'mitasi", oz: "Veterinariya va chorvachilikni rivojlantirish davlat qo'mitasi", ru: "Государственный комитет по развитию ветеринарии и животноводства", eng: "State Committee for Veterinary Development and Livestock" },
    { id: 15, uz: "Farmatsevtika tarmog'ini rivojlantirish agentligi", oz: "Farmatsevtika tarmog'ini rivojlantirish agentligi", ru: "Агентство развития фармацевтической отрасли", eng: "Pharmaceutical Industry Development Agency" },
    { id: 16, uz: "Gidrometeorologiya xizmati agentligi", oz: "Gidrometeorologiya xizmati agentligi", ru: "Агентство гидрометеорологической службы", eng: "Hydrometeorological Service Agency" },
    { id: 17, uz: "Hududgazta'minot AJ", oz: "Hududgazta'minot AJ", ru: "АО Худудгазтаминот", eng: "Hududgaztaminot JSC" },
    { id: 18, uz: "Issiqlik elektr stansiyalari AJ", oz: "Issiqlik elektr stansiyalari AJ", ru: "АО Тепловые электростанции", eng: "Thermal Power Plants JSC" },
    { id: 19, uz: "O'zbekiston milliy elektr tarmoqlari AJ", oz: "O'zbekiston milliy elektr tarmoqlari AJ", ru: "АО Национальные электрические сети Узбекистана", eng: "National Electric Networks of Uzbekistan JSC" },
    { id: 20, uz: "O'zbekgidroenergo AJ", oz: "O'zbekgidroenergo AJ", ru: "АО Узбекгидроэнерго", eng: "Uzbekhydroenergo JSC" },
    { id: 21, uz: "Hududiy elektr tarmoqlari AJ", oz: "Hududiy elektr tarmoqlari AJ", ru: "АО Региональные электрические сети", eng: "Regional Electric Networks JSC" },
    { id: 22, uz: "O'zbekiston temir yo'llari AJ", oz: "O'zbekiston temir yo'llari AJ", ru: "АО Узбекские железные дороги", eng: "Uzbekistan Railways JSC" },
    { id: 23, uz: "O'zsuvta'minot AJ", oz: "O'zsuvta'minot AJ", ru: "АО Узсувтаминот", eng: "Uzsuvtaminot JSC" },
    { id: 24, uz: "Avtomobil yo'llari qo'mitasi", oz: "Avtomobil yo'llari qo'mitasi", ru: "Комитет автомобильных дорог", eng: "Road Committee" }
  ]
}


// Form data
const selectedMinorgan = ref(null)
const minorganList = ref([])
const email = ref('')
const password = ref('')


const currentLanguage = computed(() => locale.value)

// Tildagi nomlarni olish funksiyasi
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

// Qidiruv uchun computed property
const filteredMinorganList = computed(() => {
  if (!searchQuery.value.trim()) {
    return minorganList.value
  }
  
  const query = searchQuery.value.toLowerCase().trim()
  return minorganList.value.filter(item => {
    const localizedName = getLocalizedName(item).toLowerCase()
    return localizedName.includes(query)
  })
})

// Yangi metodlar
const openDropdown = () => {
  isDropdownOpen.value = true
  if (minorganList.value.length === 0) {
    fetchMinorganData()
  }
}

const handleBlur = () => {
  // Timeout qo'yamiz shunda foydalanuvchi option ni bosganda blur ishlamaydi
  setTimeout(() => {
    isDropdownOpen.value = false
  }, 150)
}

const handleInput = () => {
  if (!isDropdownOpen.value) {
    isDropdownOpen.value = true
  }
}

const clearSelection = () => {
  selectedMinorgan.value = null
  searchQuery.value = ''
  searchInput.value?.focus()
}


// Modal functions
const showModal = () => {
  openmodal.value = true
  fetchMinorganData()
  resetForm()
}

const closeModal = () => {
  openmodal.value = false
  isDropdownOpen.value = false
}

const resetForm = () => {
  selectedMinorgan.value = null
  searchQuery.value = ''
  email.value = ''
  password.value = ''
  error.value = ''
}

// Dropdown functions
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
  if (isDropdownOpen.value && minorganList.value.length === 0) {
    fetchMinorganData()
  }
}

const selectMinorgan = (item) => {
  selectedMinorgan.value = item
  searchQuery.value = getLocalizedName(item)
  isDropdownOpen.value = false
}

// API function - yaxshilangan
const fetchMinorganData = async () => {
  loading.value = true
  error.value = ''
  
  // Avval test ma'lumotlarini yuklash
  const testData = generateTestData()
  minorganList.value = testData
  
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
    })

    let data = response.data

    // API javobini tekshirish
    if (!Array.isArray(data)) {
      if (data.data && Array.isArray(data.data)) {
        data = data.data
      } else if (data.items && Array.isArray(data.items)) {
        data = data.items
      } else {
        console.warn('API dan noto\'g\'ri format qaytarildi, faqat test ma\'lumotlari ishlatiladi')
        return
      }
    }

    // ID 29-64 oralig'ini filtrlash
    const filteredData = data.filter(item => {
      const id = parseInt(item.id)
      return id >= 29 && id <= 64
    })

    if (filteredData.length > 0) {
      // Ma'lumotlarni formatlash
      const apiData = filteredData.map(item => {
        const uzName = item.name_uz || item.uz || item.name?.uz
        
        return {
          id: item.id,
          uz: uzName,
          oz: item.name_oz || item.oz || item.name?.oz || uzName,
          ru: item.name_ru || item.ru || item.name?.ru,
          eng: item.name_eng || item.eng || item.name?.eng || item.name?.en,
          en: item.name_en || item.en || item.name?.en,
          name: item.name,
          title: item.title,
          label: item.label
        }
      })

      // Test ma'lumotlari + API ma'lumotlarini birlashtirish
      const allData = [...testData, ...apiData]
      
      // Dublikatlarni olib tashlash (ID bo'yicha)
      const uniqueData = allData.filter((item, index, self) => 
        index === self.findIndex(t => t.id === item.id)
      )
      
      // ID bo'yicha tartiblash
      minorganList.value = uniqueData.sort((a, b) => a.id - b.id)
      
      console.log('API va test ma\'lumotlari birlashtirildi')
    } else {
      console.warn('API dan ma\'lumot topilmadi, faqat test ma\'lumotlari ishlatilmoqda')
    }

  } catch (err) {
    console.error('API xatosi:', err)
    
    if (err.response) {
      error.value = `Server xatosi: ${err.response.status} - ${err.response.statusText}`
    } else if (err.request) {
      error.value = 'Tarmoq xatosi'
    } else {
      error.value = `Xato: ${err.message}`
    }

    console.warn('API xatosi tufayli faqat test ma\'lumotlari ishlatilmoqda')
    
  } finally {
    loading.value = false
  }
}

// Form submission
const login = async () => {
  if (!selectedMinorgan.value || !email.value || !password.value) {
    error.value = $t('fill_all_fields')
    return
  }

  loading.value = true
  
  try {
    const organizationName = getLocalizedName(selectedMinorgan.value)
    console.log('Forma ma\'lumotlari:', {
      organizations_id: selectedMinorgan.value.id,
      organizations_name: organizationName,
      email: email.value,
      password: password.value
    })

    const response = await axios.post('https://back.miit.uz/api/bisap/test/user/create', {
      organizations_id: selectedMinorgan.value.id,
      organizations_name: organizationName,
      email: email.value,
      password: password.value,
      role: 'USER'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      }
    })
    closeModal()
    
    toast.success('Foydalanuvchi muvaffaqiyatli yaratildi!', {
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
    window.location.reload()
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

// Click outside dropdown to close
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    isDropdownOpen.value = false
  }
}

// Mount lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
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

<style lang="css" scoped>
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