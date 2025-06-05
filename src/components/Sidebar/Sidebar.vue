<template>
  <nav class="sidebar rounded-l-[16px] h-full">
      <ul class="space-y-[8px] font-medium mt-[16px] ml-[20px]">
          <li v-for="link in navlink" :key="link.id" class="li p-[1px] rounded-lg transition-transform hover:scale-115 hover:bg-gradient-to-r from-white via-gray-500 to-[#052C71]"
          :class="{
            'bg-gradient-to-r from-white via-gray-500 to-[#052C71] px-[2px]': $route.path.startsWith(link.link)
          }">
            <router-link
              :to="link.link"
              class="w-full flex items-center p-2 rounded-lg text-[14px] bg-gradient-to-r from-[#34548C] via-[#1E417F] to-[#052C71] text-white"
            >
            <img :src="link.icon" :alt="$t(link.title) + ' icon'">
            <span class="ml-3">{{ $t(`${link.title}`) }}</span>
            </router-link>
          </li>
        </ul>
  </nav>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getNavLinks } from "../../constants/navLinks"; // IMPORT QOSHILDI

const navlink = ref([]);

onMounted(() => {
  navlink.value = getNavLinks(); // TO'G'RILANDI
});
</script>

<style scoped>
.sidebar {
  width: 240px;
  background: #052C71;
  padding: 1rem;
  overflow-y: auto;
}
.router-link-exact-active {
  transform: scale(1.01);
}
</style>