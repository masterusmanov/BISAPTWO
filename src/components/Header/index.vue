<template>
    <div class="bg-white flex items-center h-24 rounded-t-[14px] border-b border-gray-300">
        <div class="w-full flex items-center justify-between px-[16px] py-[14px]">
            <div class="flex items-center space-x-6">
                <img :src="gerb" :alt="$t('signheader.country_gerb')" class="w-14">
                <img :src="flags" class="w-[2px]">
                <h2 class="uppercase text-[11px] font-medium max-w-[250px]">
                    {{meInfo?.organizations_name || $t('signheader.organization_name') }}
                </h2>
            </div>
            
            <div class="w-[50%] flex items-center space-x-[50px]">
                <div class="flex items-center space-x-4">
                    <img :src="logo" alt="Logo" class="w-[50px]">
                    <h1 class="uppercase text-black font-medium text-[11px] max-w-[250px]">{{ $t("investment_project") }}</h1>
                </div>
                <img
                    src="../../assets/images/sign/building.png"
                    alt="main-header-img" 
                    class="w-[214px]"
                />
            </div>
            
            <div class="flex items-center space-x-3 relative">
                <LanguageSwitcher/>
                <div class="flex items-center space-x-4">
                    <div class="text-right text-[11px]">
                        <p class="font-bold">{{meInfo?.email}}</p>
                    </div>
                    
                    <!-- User dropdown container - RELATIVE pozitsiya qo'shildi -->
                    <div class="relative">
                        <div @click="toggleDropdown" 
                             class="cursor-pointer hover:opacity-80 transition-opacity">
                            <img :src="user" alt="Foydalanuvchi" class="w-[50px] h-[50px] rounded-full object-cover border-2 border-gray-200">
                        </div>

                        <!-- Dropdown menu -->
                        <div 
                            v-show="isDropdownOpen" 
                            class="absolute right-0 top-[60px] w-[200px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
                            
                            <!-- Foydalanuvchi ma'lumotlari -->
                            <!-- <div class="px-4 py-3 border-b border-gray-100">
                                <p class="text-sm font-semibold text-gray-800">{{ userName }}</p>
                                <p class="text-xs text-gray-500">{{ meInfo?.email || userEmail }}</p>
                            </div> -->

                            <!-- Menyu elementlari -->
                            <div class="py-1">
                                 <button 
                                    @click="openPasswordModal" 
                                    class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    🔑 Parol yangilash
                                </button>
                                <!-- Profil tugmasi qo'shildi -->
                                <div class="border-t border-gray-100 my-1"></div>
                                <!-- <a 
                                    href="#" 
                                    @click.prevent="goToProfile"
                                    class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                    <svg class="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                                    </svg>
                                    {{ $t('profile') }}
                                </a> -->
                                
                                <!-- Ajratuvchi chiziq -->
                                <div class="border-t border-gray-100 my-1"></div>

                                <!-- Chiqish tugmasi -->
                                <a 
                                    href="#" 
                                    @click.prevent="logout"
                                    class="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                    <svg class="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"></path>
                                    </svg>
                                    {{ $t('logout') }}
                                </a>
                            </div>
                        </div>

                        <!-- Tashqi joyga bosish uchun overlay -->
                        <div 
                            v-show="isDropdownOpen" 
                            @click="closeDropdown"
                            class="fixed inset-0 z-40">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- <div class="h-full flex items-center px-[16px] border-l border-gray-300">
            <i class='bx bx-menu text-[36px] text-gray-500'></i>
        </div> -->
    </div>
                    <!-- Parol yangilash modal -->
<div v-if="showPasswordModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Parolni yangilash</h3>
        
        <!-- Xato xabari -->
        <div v-if="passwordError" class="text-red-500 text-sm mb-4">
            {{ passwordError }}
        </div>
        
        <!-- Muvaffaqiyat xabari -->
        <div v-if="passwordSuccess" class="text-green-500 text-sm mb-4">
            {{ passwordSuccess }}
        </div>
        
        <form @submit.prevent="updatePassword">
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Joriy parol:
                </label>
                <input 
                    type="password" 
                    v-model="passwordForm.currentPassword"
                    class="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                >
            </div>
            
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Yangi parol:
                </label>
                <input 
                    type="password" 
                    v-model="passwordForm.newPassword"
                    class="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                >
            </div>
            
            <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Yangi parolni tasdiqlang:
                </label>
                <input 
                    type="password" 
                    v-model="passwordForm.confirmPassword"
                    class="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                >
            </div>
            
            <div class="flex space-x-3">
                <button 
                    type="submit" 
                    class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded transition-colors"
                    :disabled="passwordLoading"
                >
                    <span v-if="passwordLoading">Yangilanmoqda...</span>
                    <span v-else>Yangilash</span>
                </button>
                
                <button 
                    type="button" 
                    @click="closePasswordModal"
                    class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-1 px-4 rounded transition-colors"
                >
                    Bekor qilish
                </button>
            </div>
        </form>
    </div>
</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from "vue-i18n";
import { useRouter } from 'vue-router'; // Router qo'shildi
import gerb from "../../assets/images/sign/gerb.png"
import flags from "../../assets/images/sign/flags.svg"
import user from "../../assets/images/header/user.svg"
import logo from "/images/logo.svg";
import axios from 'axios';

import LanguageSwitcher from "../AuthSign/LanguageSwitcher.vue";

const { t, locale } = useI18n();
const router = useRouter(); 
const isDropdownOpen = ref(false)
const userName = ref('Foydalanuvchi Ismi')
const userEmail = ref('user@example.com')
// Parol yangilash uchun qo'shimcha ref-lar
const showPasswordModal = ref(false);
const passwordLoading = ref(false);
const passwordError = ref(null);
const passwordSuccess = ref(null);
const passwordForm = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
});

const selectUser = ref(sessionStorage.getItem('userRole'))

// Dropdown functions
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const goToProfile = () => {
  console.log('Profilga o\'tish')
  router.push('/dashboard/profile') 
  closeDropdown()
}

const logout = () => {
  console.log('Tizimdan chiqish')
  sessionStorage.clear()
  localStorage.clear()
  router.push('/login') 
  closeDropdown()
}

// Parol modal funksiyalari
const openPasswordModal = () => {
    showPasswordModal.value = true;
    passwordError.value = null;
    passwordSuccess.value = null;
    // Formani tozalash
    passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    };
};

const closePasswordModal = () => {
    showPasswordModal.value = false;
    passwordError.value = null;
    passwordSuccess.value = null;
    passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    };
};

// Parolni yangilash funksiyasi
const updatePassword = async () => {
    // Validatsiya
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        passwordError.value = 'Yangi parollar mos kelmaydi';
        return;
    }
    
    if (passwordForm.value.newPassword.length < 3) {
        passwordError.value = 'Yangi parol kamida 3 ta belgidan iborat bo\'lishi kerak';
        return;
    }
    
    const token = sessionStorage.getItem('token');
    if (!token) {
        passwordError.value = 'Token topilmadi. Qayta login qiling.';
        return;
    }
    
    passwordLoading.value = true;
    passwordError.value = null;
    passwordSuccess.value = null;
    
    try {
        const response = await axios.put('https://back.miit.uz/api/bisap/test/user/update-password', {
            password: passwordForm.value.currentPassword,
            new_password: passwordForm.value.newPassword
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Password update response:', response.data);
        
        // Muvaffaqiyatli yangilanganda
        passwordSuccess.value = 'Parol muvaffaqiyatli yangilandi!';
        
        // 2 soniyadan keyin modalni yopish
        setTimeout(() => {
            closePasswordModal();
        }, 2000);
        
    } catch (err) {
        console.error('Password update error:', err);
        
        if (err.response?.status === 401) {
            passwordError.value = 'Joriy parol noto\'g\'ri yoki avtorizatsiya muddati tugagan';
        } else if (err.response?.status === 400) {
            passwordError.value = 'Noto\'g\'ri ma\'lumot yuborildi';
        } else {
            passwordError.value = 'Parolni yangilashda xato: ' + (err.response?.data?.message || err.message);
        }
    } finally {
        passwordLoading.value = false;
    }
};

// Keyboard events
const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    closeDropdown()
  }
}

// User info
const getUserInfo = () => {
  const storedUser = sessionStorage.getItem('userData')
  if (storedUser) {
    try {
      const userData = JSON.parse(storedUser)
      userName.value = userData.name || 'Foydalanuvchi'
      userEmail.value = userData.email || 'user@example.com'
    } catch (error) {
      console.error('User ma\'lumotlarini parse qilishda xatolik:', error)
    }
  }
}

// Lifecycle hooks
onMounted(() => {
  getUserInfo()
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// ================================================

// Reactive variables
const meInfo = ref(null);
const errorMessage = ref(null);
const loading = ref(false);

// Get user info function
const getUserMe = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
        errorMessage.value = 'Token topilmadi. Iltimos, qayta login qiling.';
        return null;
    }
    
    loading.value = true;
    errorMessage.value = null;
    
    try {
        const response = await axios.get('https://back.miit.uz/api/bisap/test/user/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Full API Response:', response?.data?.data);
        console.log('User data:', response.data.data);
        
        // API response ni to'g'ri qaytarish
        if (response.data && response.data.data) {
            return response.data.data;
        } else {
            console.error('API response structure Headerda:', response.data);
            errorMessage.value = 'API dan noto\'g\'ri ma\'lumot keldi';
            return null;
        }
    } catch (err) {
        console.error('API Error:', err);
        if (err.response?.status === 401) {
            errorMessage.value = 'Avtorizatsiya muddati tugagan. Qayta login qiling.';
            sessionStorage.removeItem('token');
        } else {
            errorMessage.value = 'Ma\'lumotlarni olishda xato: ' + (err.response?.data?.message || err.message);
        }
        return null;
    } finally {
        loading.value = false;
    }
};

// Refresh user info
const refreshUserInfo = async () => {
    console.log('Refreshing user info...');
    const data = await getUserMe();
    console.log('Received data:', data);
    
    if (data) {
        meInfo.value = data;
        sessionStorage.setItem('meInfo', JSON.stringify(data));
        console.log('meInfo updated:', meInfo.value);
    } else {
        console.log('No data received');
    }
};

// Component mounted
onMounted(async () => {
    console.log('Component mounted');
    
    // Avval sessionStorage dan ma'lumot olishga harakat qilish
    const savedInfo = sessionStorage.getItem('meInfo');
    if (savedInfo) {
        try {
            const parsedInfo = JSON.parse(savedInfo);
            console.log('Saved info loaded header:', parsedInfo);
            meInfo.value = parsedInfo;
        } catch (e) {
            console.error('Saved info parsing error:', e);
        }
    }
    
    // API dan yangi ma'lumot olish
    await refreshUserInfo();
});

// ================================================
</script>

<style lang="scss" scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fixed {
    position: fixed;
}

.inset-0 {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}

.bg-opacity-50 {
    background-color: rgba(0, 0, 0, 0.5);
}

.z-50 {
    z-index: 50;
}

// Form input focus effect
input:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

// Success text color
.text-green-500 {
    color: #10b981;
}

// Button hover effects
.bg-green-500:hover {
    background-color: #059669;
}

.bg-gray-500:hover {
    background-color: #4b5563;
}
</style>