<template>
    <div class="bg-white flex items-center h-24 rounded-t-[14px] border-b border-gray-300">
        <div class="w-full flex items-center justify-between px-[16px] py-[14px]">
            <div class="flex items-center space-x-6">
                <img :src="gerb" :alt="$t('signheader.country_gerb')" class="w-14">
                <img :src="flags" class="w-[2px]">
                <h2 class="uppercase text-[11px] font-medium max-w-[250px]">
                    {{$t('signheader.organization_name')}}
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
                        <p class="font-bold">{{selectUser}}</p>
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
                            class="absolute right-0 top-[60px] w-[200px] bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                            
                            <!-- Foydalanuvchi ma'lumotlari -->
                            <div class="px-4 py-3 border-b border-gray-100">
                                <p class="text-sm font-semibold text-gray-800">{{ userName }}</p>
                                <p class="text-xs text-gray-500">{{ userEmail }}</p>
                            </div>

                            <!-- Menyu elementlari -->
                            <div class="py-1">
                                <!-- Profil tugmasi qo'shildi -->
                                <a 
                                    href="#" 
                                    @click.prevent="goToProfile"
                                    class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                                    <svg class="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                                    </svg>
                                    {{ $t('profile') }}
                                </a>
                                
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
        
        <div class="h-full flex items-center px-[16px] border-l border-gray-300">
            <i class='bx bx-menu text-[36px] text-gray-500'></i>
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

import LanguageSwitcher from "../AuthSign/LanguageSwitcher.vue";



const { t, locale } = useI18n();
const router = useRouter(); 
const isDropdownOpen = ref(false)
const userName = ref('Foydalanuvchi Ismi')
const userEmail = ref('user@example.com')

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
</style>