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
        <!-- Navigation links -->
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

        <!-- MODERATOR dropdown -->
        <li v-if="isModerator" class="relative">
          <button @click="isOpen = !isOpen"
            class="w-full flex items-center p-2 rounded-lg text-[14px] bg-gradient-to-r from-[#34548C] via-[#1E417F] to-[#052C71] text-white overflow-hidden cursor-pointer">
            <i class='bx bxs-file-archive text-[18px] ml-[3px] mr-[15px]'></i>
            <span v-if="!isCollapsed">Xisobot yuklash</span>
            <i class='bx bx-chevron-down ml-auto' v-if="!isCollapsed"></i>
          </button>

          <!-- Dropdown -->
          <ul
            v-show="isOpen"
            class="absolute z-50 mt-1 w-full bg-[#052C71] text-white  rounded shadow-md text-sm overflow-hidden"
          >
            <li
              v-for="item in reportOptions"
              :key="item.value"
              @click="downloadReport(item.value)"
              class="px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer"
            >
              {{ item.label }}
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { getNavLinks } from "../../constants/navLinks";
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const navlink = ref([]);
const isCollapsed = ref(true);
const isModerator = ref(false);
const isOpen = ref(false);

const reportOptions = [
  { label: "Konsepsiya", value: "PROJECT_CONCEPT" },
  { label: "Texnik vazifa", value: "PROJECT_TS" },
  { label: "LBX", value: "PROJECT_EVALUATION_DOCUMENT" },
];

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
  localStorage.setItem("sidebarCollapsed", isCollapsed.value);
};

const downloadReport = async (type: string) => {
  isOpen.value = false;
  try {
    const response = await axios.post(
      "https://back.miit.uz/api/bisap/test/project/export-excel",
      { type },
       {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        timeout: 30000, // 30 sekund timeout
        // responseType: 'json' // Response turini aniq belgilang
      }
    );
    const fileUrl = response.data?.data;
    if (fileUrl) {
      window.open(fileUrl, "_blank"); // yangi oynada ochiladi
    } else {
      toast.error("Xisobot faylini olishda muammo yuz berdi.");
    }
  } catch (err) {
    console.error("Xatolik:", err);
    toast.error("Xisobot yuklashda xatolik yuz berdi.");
  }
};

onMounted(() => {
  navlink.value = getNavLinks();
  const savedState = localStorage.getItem("sidebarCollapsed");
  if (savedState) {
    isCollapsed.value = savedState === "true";
  }

  const role = sessionStorage.getItem("userRole");
  isModerator.value = role === "MODERATOR";
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

.sidebar.collapsed {
  width: 0;
  padding: 0;
  opacity: 0;
  transform: translateX(-100%);
  visibility: hidden;
}

.toggle-btn {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.toggle-btn:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
              0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.toggle-btn i {
  transition: transform 0.3s ease;
}

.sidebar:not(.collapsed) .li:hover {
  transform: scale(1.02);
}

.router-link-exact-active {
  transform: scale(1.01);
}

.sidebar * {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.parent-container) {
  transition: margin-left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
