<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import Sidebar from "../components/Sidebar/Sidebar.vue";
import Header from "../components/Header/index.vue";
import InternalSidebar from "../components/InternalSidebar/index.vue";

const selectUser = ref(sessionStorage.getItem("userRole"));
const route = useRoute();

const shouldShowInternalSidebar = computed(() => {
  return selectUser.value === "USER" && !route.meta.hideInternalSidebar;
});
</script>

<template>
  <div class="flex justify-center items-center gap-[150px] bg-yellow-400 overflow-hidden absolute z-50 w-full">
    <div
      class="whitespace-nowrap animate-marquee text-black font-semibold text-[14px]"
    >
      {{ $t("marquetext") }}
    </div>
    <div
      class="whitespace-nowrap animate-marquee text-black font-semibold text-[14px]"
    >
      {{ $t("marquetext") }}
    </div>
     <div
      class="whitespace-nowrap animate-marquee text-black font-semibold text-[14px]"
    >
      {{ $t("marquetext") }}
    </div>
  </div>
  <main class="relative flex h-screen rounded-r-[28px]">
    <div
      class="m-3 w-full bg-[#052C71] rounded-[16px] rounded-r-[20px] flex overflow-hidden"
    >
      <Sidebar />
      <section
        id="main"
        class="flex-1 flex flex-col border-2 rounded-[16px] border-gray-200"
      >
        <Header />
        <div
          class="flex bg-white min-h-0 flex-1 p-4 w-full overflow-hidden rounded-b-[14px]"
        >
          <!-- Ichki scroll ishlashi uchun InternalSidebar'ga height va scroll qo'shamiz -->
          <InternalSidebar
            v-if="shouldShowInternalSidebar"
            class="h-full overflow-y-auto"
          />
          <router-view class="flex-1 h-full overflow-y-auto" />
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
@keyframes marquee {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.animate-marquee {
  /* display: inline-block; */
  animation: marquee 20s linear infinite;
}
</style>
