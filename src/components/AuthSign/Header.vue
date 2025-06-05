<template>
    <div class="bg-white flex items-center h-24">
        <div class="container mx-auto flex items-center justify-between">
            <div class="flex items-center space-x-6">
                <img :src="gerb" :alt="$t('signheader.country_gerb')"  class="w-14">
                <img :src="flags" class="w-[3px]">
                <h2 class="uppercase text-sm font-medium max-w-[250px]">
                    {{$t('signheader.organization_name')}}
                  </h2>
            </div>
            <div class="flex items-center space-x-10">
                <div class="flex items-center gap-10">
                  <div class="flex items-center flex-col gap-1">
                    <span class="h-5 w-[1px] bg-[#265098]" />
                    <img src="/images/Call.svg" alt="phone" />
                    <span class="h-5 w-[1px] bg-[#265098]" />
                  </div>
                  <div>
                    <p class="text-primary text-[10px] leading-none">
                      {{ $t("signheader.trust_phone") }}:
                    </p>
                    <a
                      href="tel:+998 (71) 238-50-00"
                      class="text-primary text-xs font-bold"
                      >+998 (71) 238-50-00</a
                    >
                  </div>
                  <div class="ml-2">
                    <p class="text-primary text-[10px] leading-none">
                      {{ $t("signheader.office_phone") }}:
                    </p>
                    <a
                      href="tel:+998 (71) 238-50-00"
                      class="text-primary text-xs font-bold"
                      >+998 (71) 238-50-00</a
                    >
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <div class="flex items-center flex-col gap-1">
                    <span class="h-[20px] w-[1px] bg-[#265098]" />
                    <img src="/images/Email.svg" alt="phone" />
                    <span class="h-[20px] w-[1px] bg-[#265098]" />
                  </div>
                  <div>
                    <p class="text-primary text-[10px] leading-none">
                      {{ $t("signheader.corporate_mail") }}:
                    </p>
                    <a
                      href="mainto: info@miit.uz "
                      class="text-primary text-xs font-bold"
                      >info@miit.uz </a
                    >
                    <a
                      href="mainto: miit@exat.uz"
                      class="text-primary text-xs font-bold ml-2"
                      >miit@exat.uz</a
                    >
                  </div>
                </div>
    
                <img
                  src="../../assets/images/sign/building.png"
                  alt="main-header-img" class="w-[275px]"
                />
              </div>
              <LanguageSwitcher/>
        </div>
    </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import gerb from "../../assets/images/sign/gerb.png"
import flags from "../../assets/images/sign/flags.svg"
import LanguageSwitcher from "./LanguageSwitcher.vue";

const { t, locale } = useI18n();
</script>

<style lang="scss" scoped>

</style>