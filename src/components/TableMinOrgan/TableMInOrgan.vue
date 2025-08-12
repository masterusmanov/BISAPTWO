<!-- tableminorgan -->
<template>
  <div class="bg-white"> 
    <!-- Loading state -->
    <div v-if="store.state.load" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <span class="ml-2 text-gray-600">Ma'lumotlar yuklanmoqda...</span>
    </div>

    <!-- Error state -->
    <div v-else-if="store.state.errorMessage" class="text-center py-8">
      <div class="text-red-500 mb-2">Xatolik yuz berdi!</div>
      <div class="text-gray-600 text-sm">{{ store.state.errorMessage }}</div>
      <button 
        @click="getList" 
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Qayta urinish
      </button>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="bg-blue-500 text-white">
            <th class="px-4 py-3 text-left font-medium">№</th>
            <!-- <th class="px-4 py-3 text-left font-medium">{{$t('tabmod.tabname')}}</th> -->
            <th class="px-4 py-3 text-left font-medium">
              {{$t('minorganname')}}
             
            </th>
            <th class="px-4 py-3 text-left font-medium">
              {{$t('tabmod.mail')}}
              <!-- <svg class="inline ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12l-5-5 1.41-1.41L10 9.17l3.59-3.58L15 7l-5 5z"/>
              </svg> -->
            </th>
            <th class="px-4 py-3 text-left font-medium">
              {{$t('tabmod.createDate')}}
              <!-- <svg class="inline ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12l-5-5 1.41-1.41L10 9.17l3.59-3.58L15 7l-5 5z"/>
              </svg> -->
            </th>
            <th class="px-4 py-3 text-left font-medium">{{$t('tabmod.action')}}</th>
          </tr>
        </thead>
        <tbody>
          <!-- Empty state -->
          <tr v-if="!currentPageData.length" class="bg-gray-50">
            <td colspan="5" class="px-4 py-8 text-center text-gray-500">
              Ma'lumot topilmadi
            </td>
          </tr>
          <!-- Data rows -->
          <tr 
            v-else
            v-for="(item, index) in currentPageData" 
            :key="item.id" 
            :class="index % 2 === 0 ? 'bg-blue-50' : 'bg-white'"
          >
            <td class="px-4 py-3 text-sm">
              {{ (currentPage - 1) * itemsPerPage + index + 1 }}
            </td>
            <td class="px-4 py-3 text-sm">
              <span v-if="minorganLoading">
                Yuklanmoqda...
              </span>
              <span v-else>
                <!-- {{ getOrganizationName(item.organizations_id) }} -->
                {{ item.organizations_name }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm text-blue-600">
              {{ item.email || 'N/A' }}
            </td>
            <td class="px-4 py-3 text-sm">
              {{ formatDate(item.created_at || item.createdAt || item.date) }}
            </td>
            <td class="px-4 py-3">
              <div class="flex gap-2">
                <button
                  @click="handleEdit(item.id)"
                  class="text-blue-500 hover:text-blue-700"
                  title="Редактировать"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="handleDelete(item.id)"
                  class="text-red-500 hover:text-red-700"
                  title="Удалить"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-end px-4 py-3 bg-white border-t border-gray-200">
      <div class="flex items-center text-sm text-gray-700 mt-2">
        {{$t('page')}} {{ currentPage }} / {{ totalPages }}
      </div>
      
      <div class="flex items-center space-x-1">
        <!-- Oldingi sahifa -->
        <button
          @click="goToPrevious"
          :disabled="currentPage === 1"
          :class="[
            'px-3 py-2 text-sm font-medium rounded-md',
            currentPage === 1
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          ]"
        >
        <i class='bx bx-chevron-left text-[24px] text-gray-600' ></i>
        </button>

        <!-- Sahifa raqamlari -->
        <button
          v-for="(page, index) in visiblePages"
          :key="index"
          @click="goToPage(page)"
          :disabled="page === '...'"
          :class="[
            'px-3 py-2 text-sm font-medium rounded-md',
            page === currentPage
              ? 'bg-blue-500 text-white'
              : page === '...'
              ? 'text-gray-400 cursor-default'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
          ]"
        >
          {{ page }}
        </button>

        <!-- Keyingi sahifa -->
        <button
          @click="goToNext"
          :disabled="currentPage === totalPages"
          :class="[
            'px-3 py-2 text-sm font-medium rounded-md',
            currentPage === totalPages
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          ]"
        >
          <i class='bx bx-chevron-right text-[24px] text-gray-600'></i>
        </button>
      </div>
    </div>

    <!-- Debug info (faqat development uchun) -->
    <div v-if="false" class="p-4 bg-gray-100 text-sm">
      <p>Total Items: {{ totalItems }}</p>
      <p>Total Pages: {{ totalPages }}</p>
      <p>Current Page: {{ currentPage }}</p>
      <p>Items per page: {{ itemsPerPage }}</p>
      <p>Store list length: {{ store.state.list?.length || 0 }}</p>
      <p>Table data length: {{ tableData.length }}</p>
      <p>Visible pages: {{ visiblePages }}</p>
    </div>

    <!-- Edit (Update) modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-[800px]">
        <div class="bg-white border-b rounded-lg pl-4 border-gray-300 flex items-center justify-between">
          <p class="text-[15px] text-[#07A920] font-[700]">{{$t('updatecreate')}}</p> 
          <button @click="closeEditModal" class="text-gray-700 text-[42px] hover:text-red-500 border-l border-gray-300 px-4">&times;</button>
        </div>
        <div>
          <form @submit.prevent="confirmEdit">
            <div class="flex items-center justify-between px-8 py-8 space-x-[16px]">
              <!-- <div class="mb-4 w-full">
                <label class="block mb-2 text-sm font-bold" for="editName">
                  {{$t('tabmod.tabname')}}
                </label> -->
                <!-- <div class="relative">
                  <input
                    v-model="editItem.name"
                    id="editName"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Ф.И.О"
                    required
                  />
                </div> -->
              <!-- </div> -->
              <div class="mb-4 w-full">
                <label class="block mb-2 text-sm font-bold" for="editEmail">
                  {{$t('tabmod.mail')}}
                </label>
                <div class="relative">
                  <input
                    v-model="editItem.email"
                    id="editEmail"
                    type="email"
                    class="w-full px-4 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="example@mail.uz"
                    required
                  />
                </div>
              </div>
              <div class="px-8 mb-4 w-full">
                <label class="block mb-2 text-sm font-bold" for="password">
                  {{ $t("formpassword") }}
                </label>
                <div class="relative">
                  <input
                    v-model="editItem.password"
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
                    <svg
                      v-if="showPassword"
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-5 h-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fill-rule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clip-rule="evenodd"
                      />
                      <path
                        d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"
                      />
                    </svg>
                    <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-5 h-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fill-rule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex items-center p-4 space-x-6">
              <button 
                type="button"
                @click="closeEditModal"
                class="w-full px-4 py-2 bg-[#DCDCDC] rounded-md hover:bg-gray-400 focus:outline-none focus:bg-gray-400"
              >
                {{$t('cancel')}}
              </button>
              <button 
                type="submit"
                :disabled="isUpdating"
                class="w-full px-4 py-2 text-white bg-[#07A920] rounded-md hover:bg-green-700 focus:outline-none focus:bg-blue-600 disabled:opacity-50"
              >
                <span v-if="isUpdating">Yangilanmoqda...</span>
                <span v-else>{{$t('updatecreate')}}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete confirmation modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-[400px]">
        <div class="bg-white border-b rounded-lg pl-4 border-gray-300 flex items-center justify-between">
          <p class="text-[15px] text-red-500 font-[700]">{{$t('delete')}}</p> 
          <button @click="closeDeleteModal" class="text-gray-700 text-[42px] hover:text-red-500 border-l border-gray-300 px-4">&times;</button>
        </div>
        <p class="text-[10px] text-center mb-6 px-[20px] py-[40px]">
          {{$t('quesdel')}}
        </p>
        <div class="flex justify-between space-x-2 p-4">
          <button
            @click="closeDeleteModal"
            class="w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
          >
            {{$t('no')}}
          </button>
          <button
            @click="confirmDelete"
            :disabled="isDeleting"
            class="w-full px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
          >
            <span v-if="isDeleting">O'chirilmoqda...</span>
            <span v-else>{{$t('delete')}}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useMinorgan } from '../../service/minorgan/index.js'
import { minorganStore } from '../../stores/minorganStore.js'
import axios from 'axios'

const { t: $t, locale } = useI18n()
const router = useRouter()
const store = minorganStore()

// State variables
const currentPage = ref(1)
const itemsPerPage = ref(13)
const isUpdating = ref(false)
const isDeleting = ref(false)
const selectedRole = ref('USER')
// Modal states
const showModal = ref(false)
const showEditModal = ref(false)
const deleteId = ref(null)
const editItem = ref({
  id: null,
  // name: '',
  email: '',
  password: ''
})

const minorganList = ref([])
const minorganLoading = ref(false)

// API function with better error handling
const getList = async (page = currentPage.value) => {
  try {
    store.state.load = true;
    store.state.errorMessage = "";

    console.log("Fetching data..."); // Debug log

    // Parametrlarni to'g'ri berish
    const params = {
      limit: itemsPerPage.value,
      page: page, // Bu yerda 'page' parametri to'g'ri aniqlangan
      role: selectedRole.value,
    };

    // params obyektini useMinorgan.list() ga berish
    const response = await useMinorgan.list(params);
    console.log("API Response:", response); // Debug log

    // API response structure ni to'g'ri qayta ishlash
    if (
      response &&
      response.data &&
      response.data.data &&
      response.data.data.results
    ) {
      // API dan kelayotgan actual results array'ni saqlash
      store.state.list = response.data.data.results;
      console.log("Data stored:", store.state.list); // Debug log
    } else if (response && response.data && Array.isArray(response.data)) {
      // Agar to'g'ridan-to'g'ri array kelsa
      store.state.list = response.data;
    } else {
      console.warn("Invalid response structure:", response);
      store.state.list = [];
    }

    // Current page ni yangilash
    currentPage.value = page;
  } catch (error) {
    console.error("API Error:", error); // Debug log

    store.state.errorMessage = "Ma'lumotlarni yuklashda xatolik yuz berdi";

    if (
      error.response?.status === 401 ||
      error.message === "token expired" ||
      error.message === "token not found"
    ) {
      console.log("Authentication error, redirecting to login");
      router.push({ name: "login" });
    }
  } finally {
    store.state.load = false;
  }
};

// Minorgan ma'lumotlarini olish funktsiyasi
const fetchMinorganData = async () => {
  minorganLoading.value = true
  
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

    if (!Array.isArray(data)) {
      if (data.data && Array.isArray(data.data)) {
        data = data.data
      } else if (data.items && Array.isArray(data.items)) {
        data = data.items
      }
    }

    const filteredData = data.filter(item => {
      const id = parseInt(item.id)
      return id >= 29 && id <= 64
    })

    minorganList.value = filteredData.map(item => ({
      id: item.id,
      uz: item.name_uz || item.uz || item.name?.uz,
      oz: item.name_oz || item.oz || item.name?.oz,
      ru: item.name_ru || item.ru || item.name?.ru,
      name: item.name
    }))

  } catch (error) {
    console.error('Minorgan ma\'lumotlarini olishda xato:', error)
  } finally {
    minorganLoading.value = false
  }
}

// Tashkilot nomini olish funktsiyasi
const getOrganizationName = (orgId) => {
  if (!orgId || !minorganList.value.length) return 'N/A'
  
  const org = minorganList.value.find(item => item.id == orgId)
  if (org) {
    return org.uz || org.name || org.ru || 'Noma\'lum tashkilot'
  }
  return 'Noma\'lum tashkilot'
}

// Format date function
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    // Agar sana allaqachon formatted bo'lsa (25.05.2025 12:07:46 formatida)
    if (typeof dateString === 'string' && dateString.includes('.')) {
      return dateString
    }
    
    const date = new Date(dateString)
    return date.toLocaleDateString('uz-UZ') + ' ' + date.toLocaleTimeString('uz-UZ', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  } catch (error) {
    return dateString
  }
}

// Display name function - ismni ko'rsatish uchun
const getDisplayName = (item) => {
  // first_name va last_name ni birlashtirish
  if (item.first_name || item.last_name) {
    return `${item.first_name || ''} ${item.last_name || ''}`.trim()
  }
  
  // Boshqa mumkin bo'lgan name fieldlar
  return item.name || item.fio || item.fullName || item.email || 'N/A'
}

// Computed properties - tuzatilgan versiya
const tableData = computed(() => {
  console.log('Computing table data:', store.state.list) // Debug log
  
  // Store list ni tekshirish
  const list = store.state.list
  if (Array.isArray(list) && list.length > 0) {
    console.log('Table data computed:', list.length, 'items')
    return list
  }
  
  console.log('No table data available')
  return []
})

const totalItems = computed(() => {
  return store.state.totalCount || tableData.value?.length || 0;
})

const totalPages = computed(() => {
  if (totalItems.value === 0) {
    console.log('Total pages: 0 (no items)')
    return 0
  }
  
  const pages = Math.ceil(totalItems.value / itemsPerPage.value)
  console.log('Total pages computed:', pages, '(items:', totalItems.value, ', per page:', itemsPerPage.value, ')') // Debug log
  return pages
})

const currentPageData = computed(() => {
  return tableData.value;
})

const visiblePages = computed(() => {
  const pages = []
  const current = currentPage.value
  const total = totalPages.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else if (current <= 4) {
    for (let i = 1; i <= 5; i++) pages.push(i)
    pages.push('...', total)
  } else if (current >= total - 3) {
    pages.push(1, '...')
    for (let i = total - 4; i <= total; i++) pages.push(i)
  } else {
    pages.push(1, '...')
    for (let i = current - 1; i <= current + 1; i++) pages.push(i)
    pages.push('...', total)
  }
  return pages
})

// Event handlers
const handleEdit = (id) => {
  console.log('Editing item with ID:', id) // Debug log
  const item = tableData.value.find(i => i.id === id)
  if (item) {
    editItem.value = {
      id: item.id,
      email: item.email || '',
      password: item.password || ''
    }
    showEditModal.value = true
  }
}

const confirmEdit = async () => {
  try {
    isUpdating.value = true
    
    await useMinorgan.update({
      id: editItem.value.id,
      email: editItem.value.email,
      password: editItem.value.password
    })
    
    // Ma'lumotlarni qayta yuklash
    await getList()
    closeEditModal()
    
  } catch (error) {
    console.error('Error updating item:', error)
    store.state.errorMessage = 'Yangilashda xatolik yuz berdi'
  } finally {
    isUpdating.value = false
  }
}

const closeEditModal = () => {
  showEditModal.value = false
  editItem.value = { id: null, email: '', password: '' }
}

const handleDelete = (id) => {
  console.log('Deleting item with ID:', id) // Debug log
  deleteId.value = id
  showModal.value = true
}

const confirmDelete = async () => {
  try {
    isDeleting.value = true
    
    await useMinorgan.remove(deleteId.value)
    
    // Ma'lumotlarni qayta yuklash
    await getList(currentPage.value)

    if (currentPageData.value.length === 0 && currentPage.value > 1) {
      await getList(currentPage.value - 1);
    }

    closeDeleteModal()
    
  } catch (error) {
    console.error('Error deleting item:', error)
    store.state.errorMessage = 'O\'chirishda xatolik yuz berdi'
  } finally {
    isDeleting.value = false
  }
}

const closeDeleteModal = () => {
  showModal.value = false
  deleteId.value = null
}

// Pagination functions - tuzatilgan
const goToPage = (page) => {
  if (typeof page === 'number' && page >= 1 && page <= totalPages.value) {
    getList(page);
  }
}

const goToPrevious = () => {
  if (currentPage.value > 1) {
    getList(currentPage.value - 1);
  }
}

const goToNext = () => {
  if (currentPage.value < totalPages.value) {
    getList(currentPage.value + 1);
  }
}

const changeRole = (newRole) => {
  selectedRole.value = newRole;
  currentPage.value = 1; // Birinchi sahifaga qaytish
  getList(1);
};

// Items per page o'zgarganda
const changeItemsPerPage = (newLimit) => {
  itemsPerPage.value = newLimit;
  currentPage.value = 1; // Birinchi sahifaga qaytish
  getList(1);
};

// Store state ni kuzatish
watch(() => store.state.list, (newList, oldList) => {
  console.log('Store list changed:', {
    oldLength: oldList?.length || 0,
    newLength: newList?.length || 0,
    newList
  }) // Debug log
}, { deep: true })

// Current page ni kuzatish
watch(currentPage, (newPage, oldPage) => {
  console.log('Current page changed from', oldPage, 'to', newPage) // Debug log
})

// Lifecycle
onMounted(async() => {
  console.log('Component mounted, fetching data...') // Debug log
  await fetchMinorganData()
  getList()
})
</script>

<style scoped>
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

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>



<!-- const getList = async (page = currentPage.value) => {
  try {
    store.state.load = true;
    store.state.errorMessage = "";

    console.log("Fetching data for both USER and LIMITED_USER...");

    // 1. USER rolini olish
    const userParams = {
      limit: itemsPerPage.value,
      page: page,
      role: 'USER',
    };
    
    console.log('USER uchun parametrlar:', userParams);
    const userResponse = await useMinorgan.list(userParams);
    console.log('USER response:', userResponse);
    
    // 2. LIMITED_USER rolini olish
    const limitedUserParams = {
      limit: itemsPerPage.value,
      page: page,
      role: 'LIMITED_USER',
    };
    
    console.log('LIMITED_USER uchun parametrlar:', limitedUserParams);
    const limitedUserResponse = await useMinorgan.list(limitedUserParams);
    console.log('LIMITED_USER response:', limitedUserResponse);
    
    // 3. Natijalarni olish
    let userList = [];
    let limitedUserList = [];
    
    // USER ma'lumotlarini olish
    if (userResponse?.data?.data?.results) {
      userList = userResponse.data.data.results;
    } else if (userResponse?.data && Array.isArray(userResponse.data)) {
      userList = userResponse.data;
    }
    
    // LIMITED_USER ma'lumotlarini olish
    if (limitedUserResponse?.data?.data?.results) {
      limitedUserList = limitedUserResponse.data.data.results;
    } else if (limitedUserResponse?.data && Array.isArray(limitedUserResponse.data)) {
      limitedUserList = limitedUserResponse.data;
    }
    
    // 4. Ikkala ro'yxatni birlashtirish
    const combinedList = [...userList, ...limitedUserList];
    
    console.log('USER ma\'lumotlari:', userList.length, 'ta');
    console.log('LIMITED_USER ma\'lumotlari:', limitedUserList.length, 'ta');
    console.log('Jami birlashtirilgan:', combinedList.length, 'ta');
    
    // 5. Store ga saqlash
    store.state.list = combinedList;
    
    // 6. Rollarni tekshirish
    console.log("Barcha rollar:", combinedList.map(item => ({ 
      id: item.id, 
      role: item.role,
      email: item.email 
    })));

    currentPage.value = page;
    
  } catch (error) {
    console.error("API Error:", error);
    store.state.errorMessage = "Ma'lumotlarni yuklashda xatolik yuz berdi";
    
    if (
      error.response?.status === 401 ||
      error.message === "token expired" ||
      error.message === "token not found"
    ) {
      console.log("Authentication error, redirecting to login");
      router.push({ name: "login" });
    }
  } finally {
    store.state.load = false;
  }
}; -->