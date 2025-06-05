<template>
    <div>
        <Header/>
        <div class="container mx-auto flex items-center h-[80vh] justify-between space-x-[222px]">
            <div class=" w-[50%] flex items-center space-x-[16px]">
                <img :src="logo" alt="Logo">
                <h1 class="uppercase text-black font-medium text-[28px] w-[500px] leading-[120%]">{{ $t("investment_project") }}</h1>
            </div>
            <div class="w-[500px] mx-auto space-y-[48px]">
              <h2 class="text-center text-[#265098] font-bold text-[32px]">
                {{ $t("login") }}
              </h2>
              <form @submit.prevent="login">
                <div class="flex items-center justify-between ">
                    <div class="mb-4">
                        <label class="block mb-2 text-sm font-bold text-[#265098]" for="firstname">
                          {{ $t('firstname') }}
                        </label>
                        <div class="relative">
                          <input
                            v-model="firstname"
                            id="firstname"
                            type="text"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            :placeholder="$t('firstname')"
                            required
                          />
                        </div>
                      </div>
                      <div class="mb-4">
                        <label class="block mb-2 text-sm font-bold text-[#265098]" for="lastname">
                          {{ $t('lastname') }}
                        </label>
                        <div class="relative">
                          <input
                            v-model="lastname"
                            id="lastname"
                            type="text"
                            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            :placeholder="$t('lastname')"
                            required
                          />
                        </div>
                      </div>
                </div>

                  <div class="flex items-center justify-between ">
                    <div class="mb-4">
                        <label class="block mb-2 text-sm font-bold text-[#265098]" for="organization_id">
                          {{ $t('organization') }}
                        </label>
                        <select>
                            <option value="">1</option>
                            <option value="">1</option>
                            <option value="">1</option>
                            <option value="">1</option>
                        </select>
                      </div>
                      <div class="mb-4">
                        <label class="block mb-2 text-sm font-bold text-[#265098]" for="organization_id">
                          {{ $t('organization') }}
                        </label>
                        <select>
                            <option value="">1</option>
                            <option value="">1</option>
                            <option value="">1</option>
                            <option value="">1</option>
                        </select>
                      </div>
                  </div>


                <div class="mb-4">
                  <label class="block mb-2 text-sm font-bold text-[#265098]" for="email">
                    Email
                  </label>
                  <div class="relative">
                    <input
                      v-model="email"
                      id="email"
                      type="email"
                      class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="example@mail.uz"
                      required
                    />
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fill-rule="evenodd" d="M10 0a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 100-16 8 8 0 000 16z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div class="mb-6">
                  <label class="block mb-2 text-sm font-bold text-[#265098]" for="password">
                    {{$t('formpassword')}}
                  </label>
                  <div class="relative">
                    <input
                      v-model="password"
                      id="password"
                      :type="showPassword ? 'text' : 'password'"
                      class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="••••••••"
                      required
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
                
                <button 
                  type="submit"
                  class="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                >
                  Kirish
                </button>
              </form>
              <router-link to="/register" class="mx-[120px] text-[14px] text-[#178BF1] font-bold">{{$t(`login`)}}</router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import Header from '../../components/AuthSign/Header.vue'
import { useI18n } from "vue-i18n";
import logo from "/images/logo.svg";
import { ref } from 'vue';

const { t, locale } = useI18n();
const email = ref('')
const password = ref('')
const showPassword = ref(false)
</script>

<style lang="scss" scoped>

</style>