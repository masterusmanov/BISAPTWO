<template>
    <div class="relative" ref="dropdownRef">
      <!-- Dropdown trigger -->
      <div
        @click="toggleDropdown"
        class="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-md hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
        :class="{ 'rounded-none': isAuth }"
      >
        <span 
          v-if="!isAuth" 
          class="text-base font-medium"
        >
          {{ locales[currentLanguage] }}
        </span>
        <span
          v-else
          class="text-sm font-medium text-black transition-colors duration-200"
          :class="{ 'group-hover:text-blue-500': isAuth }"
        >
          {{ locales[currentLanguage] }}
        </span>
        <svg 
          class="w-3 h-3 text-gray-500 transition-transform duration-200"
          :class="{ 'rotate-180': isDropdownOpen }"
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fill-rule="evenodd" 
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
            clip-rule="evenodd" 
          />
        </svg>
      </div>
      
      <!-- Dropdown menu -->
      <div 
        v-if="isDropdownOpen" 
        class="absolute right-0 mt-1 min-w-[120px] bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50"
      >
        <div 
          v-for="(label, key) in locales" 
          :key="key"
          @click="changeLanguage(key)"
          class="flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer"
        >
          <span>{{ label }}</span>
          <span v-if="currentLanguage === key" class="text-blue-500">✓</span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, ref, onMounted, onUnmounted } from "vue";
  import { useI18n } from "vue-i18n";
  import { useRoute } from "vue-router";
  
  const { locale } = useI18n();
  const route = useRoute();
  const dropdownRef = ref<HTMLElement | null>(null);
  const isDropdownOpen = ref(false);
  
  const currentLanguage = computed(() => locale.value);
  const isAuth = computed(() => route.name === "auth");
  
  // Load saved language on component mount
  onMounted(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      locale.value = savedLanguage;
    }
    
    // Add global click event listener to close dropdown when clicking outside
    document.addEventListener("click", handleClickOutside);
  });
  
  onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
  });
  
  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
      isDropdownOpen.value = false;
    }
  };
  
  const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value;
  };
  
  const changeLanguage = (key: string) => {
    locale.value = key;
    localStorage.setItem("language", key);
    isDropdownOpen.value = false;
    // window.location.reload();
  };
  
  const locales = {
    uz: "O'zbek",
    oz: "Ўзбек",
    ru: "Русский",
    en: "English",
  };
  </script>