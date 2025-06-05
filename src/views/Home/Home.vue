<template>
    <div class="bg-white min-h-screen p-4 w-full">
        <section id="main" class="flex-1 flex flex-col border-2 rounded-[16px] border-gray-200 overflow-hidden">
            <div class="flex">
              <div class="w-[100%]">
                  <!-- <HeaderNote/> -->
                  <router-view></router-view>
              </div>
            </div>
          </section>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
</style>