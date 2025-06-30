<template>
  <div class="sidebar-wrapper" :class="{ 'collapsed': isCollapsed }">
    <!-- Toggle tugmasi sidebar tashqarisida -->
    <button 
      @click="toggleSidebar"
      class="toggle-btn fixed bg-gradient-to-r from-[#34548C] to-[#052C71] text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300"
      :style="{ 
        left: isCollapsed ? '5px' : '230px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 99999
      }"
    >
      <i class='bx text-[18px]' :class="isCollapsed ? 'bx-chevron-right' : 'bx-chevron-left'"></i>
    </button>

    <!-- Sidebar -->
    <nav class="sidebar rounded-l-[16px] h-full" :class="{ 'collapsed': isCollapsed }">
      <ul class="space-y-[8px] font-medium mt-[16px]" :class="isCollapsed ? 'ml-0' : 'ml-[20px]'">
        <li v-for="link in navlink" :key="link.id" 
            class="li p-[1px] rounded-lg transition-transform hover:bg-gradient-to-r from-white via-gray-500 to-[#052C71]"
            :class="{
              'bg-gradient-to-r from-white via-gray-500 to-[#052C71] px-[2px]': $route.path.startsWith(link.link),
              'hover:scale-115': !isCollapsed,
              'hover:scale-105': isCollapsed
            }">
          <router-link
            :to="link.link"
            class="w-full flex items-center p-2 rounded-lg text-[14px] bg-gradient-to-r from-[#34548C] via-[#1E417F] to-[#052C71] text-white overflow-hidden"
            :class="isCollapsed ? 'justify-center' : ''"
          >
            <img :src="link.icon" :alt="$t(link.title) + ' icon'" class="min-w-[20px]">
            <span v-if="!isCollapsed" class="ml-3 whitespace-nowrap transition-opacity duration-300">
              {{ $t(`${link.title}`) }}
            </span>
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getNavLinks } from "../../constants/navLinks";

const navlink = ref([]);
const isCollapsed = ref(false);

// Sidebar holatini localStorage'da saqlash
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
  localStorage.setItem('sidebarCollapsed', isCollapsed.value);
};

onMounted(() => {
  navlink.value = getNavLinks();
  
  // Oldingi holatni yuklash
  const savedState = localStorage.getItem('sidebarCollapsed');
  if (savedState) {
    isCollapsed.value = savedState === 'true';
  }
});
</script>

<style scoped>
.sidebar-wrapper {
  position: relative;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar {
  width: 240px;
  background: #052C71;
  padding: 1rem;
  overflow-y: auto;
  position: relative;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: left center;
}

/* To'liq yopiq holat */
.sidebar.collapsed {
  width: 0;
  padding: 0;
  opacity: 0;
  transform: translateX(-100%);
  visibility: hidden;
}

/* Toggle tugma animatsiyasi */
.toggle-btn {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.toggle-btn:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Icon aylanish animatsiyasi */
.toggle-btn i {
  transition: transform 0.3s ease;
}

/* Hover effect */
.sidebar:not(.collapsed) .li:hover {
  transform: scale(1.02);
}

/* Router link animatsiyasi */
.router-link-exact-active {
  transform: scale(1.01);
}

/* Smooth transitions */
.sidebar * {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Parent container uchun */
:deep(.parent-container) {
  transition: margin-left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>