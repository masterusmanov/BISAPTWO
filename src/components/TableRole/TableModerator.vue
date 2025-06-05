<template>
  <div class="bg-white">
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="bg-blue-500 text-white">
            <th class="px-4 py-3 text-left font-medium">№</th>
            <th class="px-4 py-3 text-left font-medium">{{$t('tabmod.tabname')}}</th>
            <th class="px-4 py-3 text-left font-medium">
              {{$t('tabmod.mail')}}
              <svg class="inline ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12l-5-5 1.41-1.41L10 9.17l3.59-3.58L15 7l-5 5z"/>
              </svg>
            </th>
            <th class="px-4 py-3 text-left font-medium">{{$t('phone')}}</th>
            <th class="px-4 py-3 text-left font-medium">
              {{$t('tabmod.createDate')}}
              <svg class="inline ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12l-5-5 1.41-1.41L10 9.17l3.59-3.58L15 7l-5 5z"/>
              </svg>
            </th>
            <th class="px-4 py-3 text-left font-medium">{{$t('tabmod.action')}}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in paginatedData"
            :key="item.id"
            :class="index % 2 === 0 ? 'bg-blue-50' : 'bg-white'"
          >
            <td class="px-4 py-3 text-sm">
              {{ (currentPage - 1) * itemsPerPage + index + 1 }}
            </td>
            <td class="px-4 py-3 text-sm">{{ item.fio || `${item.first_name} ${item.last_name} ${item.father_name}` }}</td>
            <td class="px-4 py-3 text-sm text-blue-600">{{ item.email }}</td>
            <td class="px-4 py-3 text-sm">{{ item.phone_number }}</td>
            <td class="px-4 py-3 text-sm">{{ formatDate(item.created_at) }}</td>
            <td class="px-4 py-3">
              <div class="flex gap-2">
                <button
                  @click="handleEdit(item.id)"
                  class="text-blue-500 hover:text-blue-700"
                  title="Tahrirlash"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="handleDelete(item.id)"
                  class="text-red-500 hover:text-red-700"
                  title="O'chirish"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="store.state.load">
            <td colspan="6" class="px-4 py-3 text-center text-sm">
              Yuklanmoqda...
            </td>
          </tr>
          <tr v-if="!store.state.load && store.state.list.length === 0">
            <td colspan="6" class="px-4 py-3 text-center text-sm">
              Ma'lumot topilmadi
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex items-center justify-end px-4 py-3 bg-white border-t border-gray-200">
      <div class="flex items-center text-sm text-gray-700 mt-2">
        {{$t('page')}} {{ currentPage }} / {{ totalPages }}
      </div>

      <div class="flex items-center space-x-1">
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
          ‹
        </button>

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
          ›
        </button>
      </div>
    </div>

    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-[800px]">
        <div class="bg-white border-b rounded-lg pl-4 border-gray-300 flex items-center justify-between">
          <p class="text-[15px] text-[#07A920] font-[700]">{{$t(`updatemoderator`)}}</p>
          <button @click="closeEditModal" class="text-gray-700 text-[42px] hover:text-red-500 border-l border-gray-300 px-4">&times;</button>
        </div>
        <div>
          <form @submit.prevent="confirmEdit">
            <div class="grid grid-cols-2 p-8 space-x-[16px]">
              <div class="">
                <div class="mb-4">
                  <label class="block mb-2 text-sm font-bold" for="firstname">
                    {{ $t('firstname') }}
                  </label>
                  <input
                    v-model="editItem.firstname"
                    id="firstname"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    :placeholder="$t('firstname')"
                    required
                  />
                </div>
                <div class="mb-4">
                  <label class="block mb-2 text-sm font-bold" for="lastname">
                    {{ $t('lastname') }}
                  </label>
                  <input
                    v-model="editItem.lastname"
                    id="lastname"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    :placeholder="$t('lastname')"
                    required
                  />
                </div>
                <div class="mb-4">
                  <label class="block mb-2 text-sm font-bold" for="fathername">
                    {{ $t('fathername') }}
                  </label>
                  <input
                    v-model="editItem.fathername"
                    id="fathername"
                    type="text"
                    class="w-full px-4 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    :placeholder="$t('fathername')"
                  />
                </div>
              </div>
              <div>
                <div class="mb-4">
                  <label class="block mb-2 text-sm font-bold" for="email">
                    {{$t('mail')}}
                  </label>
                  <input
                    v-model="editItem.email"
                    id="email"
                    type="email"
                    class="w-full px-4 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="example@mail.uz"
                    required
                  />
                </div>
                <div class="mb-4">
                  <label class="block mb-2 text-sm font-bold" for="phone_number">
                    {{$t('phone')}}
                  </label>
                  <input
                    v-mask="'+998 (##) ###-##-##'"
                    v-model="editItem.phone_number"
                    id="phone_number"
                    type="tel"
                    class="w-full px-4 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="+998 (__) ___-__-__ "
                    required
                  />
                </div>
                <div class="mb-6">
                  <label class="block mb-2 text-sm font-bold" for="password">
                    {{$t('formpassword')}} (yangilash uchun)
                  </label>
                  <div class="relative">
                    <input
                      v-model="editItem.password"
                      id="password"
                      :type="showPassword ? 'text' : 'password'"
                      class="w-full px-4 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="• • • • • • • •"
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
            </div>
            <div class="flex items-center p-4 space-x-6">
              <button
                @click="closeEditModal"
                type="button"
                class="w-full px-4 py-2 bg-[#DCDCDC] rounded-md hover:bg-gray-400 focus:outline-none focus:bg-gray-400"
              >
                {{$t('cancel')}}
              </button>
              <button
                type="submit"
                class="w-full px-4 py-2 text-white bg-[#07A920] rounded-md hover:bg-green-700 focus:outline-none focus:bg-blue-600"
                :disabled="isUpdating"
              >
                <span v-if="isUpdating">Yuklanmoqda...</span>
                <span v-else>{{$t('update')}}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-[400px]">
        <div class="bg-white border-b rounded-lg pl-4 border-gray-300 flex items-center justify-between">
          <p class="text-[15px] text-[#07A920] font-[700]">{{$t(`delmod`)}}</p>
          <button @click="closeDeleteModal" class="text-gray-700 text-[42px] hover:text-red-500 border-l border-gray-300 px-4">&times;</button>
        </div>
        <p class="text-[10px] text-center mb-6 px-[20px] py-[40px]">
          {{$t('quesdelmod')}}
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
            class="w-full px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
            :disabled="isDeleting"
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
import { ref, computed, onMounted, watch } from 'vue'; // watch ni qo'shdik
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useModerator } from '../../service/moderator/index.js';
import { moderatorStore } from '../../stores/moderatorStore.js';

const { t: $t } = useI18n();
const router = useRouter();
const store = moderatorStore();

// Ma'lumotlar va holatlar
const showPassword = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(13); // Default limit 10 bo'lsin
const totalItems = ref(0); // Backenddan keladigan umumiy elementlar soni

const showModal = ref(false);
const showEditModal = ref(false);
const isUpdating = ref(false);
const isDeleting = ref(false);
const deleteId = ref(null);

const editItem = ref({
  id: null,
  firstname: '',
  lastname: '',
  fathername: '',
  email: '',
  phone_number: '',
  password: ''
});

// Hisoblangan qiymatlar
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / itemsPerPage.value)));
const paginatedData = computed(() => {
    // Ikkita roldagi ma'lumotlar birlashgani uchun slice ishlatamiz
    // Agar backend pagination qilsa, bu qism o'zgaradi
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return store.state.list.slice(start, end);
});


const visiblePages = computed(() => {
  const pages = [];
  const current = currentPage.value;
  const total = totalPages.value;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else if (current <= 4) {
    for (let i = 1; i <= 5; i++) pages.push(i);
    pages.push('...', total);
  } else if (current >= total - 3) {
    pages.push(1, '...');
    for (let i = total - 4; i <= total; i++) pages.push(i);
  } else {
    pages.push(1, '...');
    for (let i = current - 1; i <= current + 1; i++) pages.push(i);
    pages.push('...', total);
  }
  return pages;
});

// Funksiyalar
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

const getList = async () => {
  try {
    store.state.load = true;
    store.state.errorMessage = '';

    // Faqat MODERATOR roli uchun so'rov
    const response = await useModerator.list({
      limit: 1000,
      page: 1
    });

    // API dan kelgan ma'lumotlarni olish
    const allUsers = response?.data?.data?.results || [];
    
    // Faqat MODERATOR roli bo'lganlarni filterlash
    const moderatorUsers = allUsers.filter(user => user.role === 'MODERATOR');

    store.state.list = moderatorUsers;
    totalItems.value = moderatorUsers.length;

    if (currentPage.value > totalPages.value && totalPages.value > 0) {
      currentPage.value = 1;
    }

  } catch (error) {
    console.error('API Error:', error);
    store.state.errorMessage = 'Ma\'lumotlarni yuklashda xatolik yuz berdi';

    if (error.response?.status === 401 || error.message?.includes('token')) {
      router.push({ name: 'login' });
    }
  } finally {
    store.state.load = false;
  }
};

const handleEdit = (id) => {
  const item = store.state.list.find(i => i.id === id);
  if (item) {
    editItem.value = {
      id: item.id,
      firstname: item.first_name,
      lastname: item.last_name,
      fathername: item.father_name,
      email: item.email,
      phone_number: item.phone_number,
      password: ''
    };
    showEditModal.value = true;
  }
};

const confirmEdit = async () => {
  try {
    isUpdating.value = true;

    const data = {
      first_name: editItem.value.firstname,
      last_name: editItem.value.lastname,
      father_name: editItem.value.fathername,
      email: editItem.value.email,
      phone: editItem.value.phone_number
    };

    if (editItem.value.password) {
      data.password = editItem.value.password;
    }

    await useModerator.update(editItem.value.id, data);
    await getList();
    closeEditModal();

  } catch (error) {
    console.error('Error updating moderator:', error);
    store.state.errorMessage = 'Yangilashda xatolik yuz berdi';
  } finally {
    isUpdating.value = false;
  }
};

const closeEditModal = () => {
  showEditModal.value = false;
  editItem.value = {
    id: null,
    firstname: '',
    lastname: '',
    fathername: '',
    email: '',
    phone_number: '',
    password: ''
  };
};

const handleDelete = (id) => {
  deleteId.value = id;
  showModal.value = true;
};

const confirmDelete = async () => {
  try {
    isDeleting.value = true;

    await useModerator.remove(deleteId.value);
    await getList(currentPage.value); 

    
    if (currentPage.value > 1 && paginatedData.value.length === 0 && store.state.list.length > 0) {
      currentPage.value -= 1;
    }

    closeDeleteModal();

  } catch (error) {
    console.error('Error deleting moderator:', error);
    store.state.errorMessage = 'O\'chirishda xatolik yuz berdi';
  } finally {
    isDeleting.value = false;
  }
};

const closeDeleteModal = () => {
  showModal.value = false;
  deleteId.value = null;
};

// Pagination funksiyalari
const goToPage = (page) => {
  if (typeof page === 'number' && page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const goToPrevious = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const goToNext = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

watch(itemsPerPage, () => {
    currentPage.value = 1;
});


onMounted(() => {
  getList();
});
</script>

<style scoped>
</style>