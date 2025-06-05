<template>
  <div class="bg-white h-20 w-full flex items-center space-x-[16px] p-[16px] border-b border-gray-300 relative">
    <div class="w-full border border-gray-400 flex items-center px-2 space-x-1 py-[5px] rounded-[8px]">
      <label for="search"><i class='bx bx-search text-lg text-gray-500 mt-1'></i></label>
      <input type="text" id="search" name="search" :placeholder="$t(`search`)" class="w-full outline-none">
    </div>
    <button @click="showModal" class="w-[200px] border text-[12px] font-[700] bg-[#07A920] rounded-[4px] text-white p-[12px]">
      {{$t('newmoderator')}}
    </button>
  </div>

  <!-- Fullscreen Modal -->
  <div v-if="openmodal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
    <div class="modal-content bg-white rounded-lg shadow-xl w-full max-w-[800px] text-black relative">
      <!-- Close button -->
       <div class="bg-white border-b rounded-lg pl-4 border-gray-300 flex items-center justify-between">
          <p class="text-[15px] text-[#07A920] font-[700]">{{$t(`newmoderator`)}}</p> 
          <button @click="closeModal" class="text-gray-700 text-[42px] hover:text-red-500 border-l border-gray-300 px-4">&times;</button>
       </div>
      
       <div>
          <form @submit.prevent="addModerator">
              <div class="grid grid-cols-2 p-8 space-x-[16px]">
                  <div class="">
                      <div class="mb-4">
                          <label class="block mb-2 text-sm font-bold" for="firstname">
                            {{ $t('firstname') }}
                          </label>
                          <div class="relative">
                            <input
                              v-model="createmoderator.first_name"
                              id="firstname"
                              type="text"
                              class="w-full px-4 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              :placeholder="$t('firstname')"
                              required
                            />
                          </div>
                        </div>
                        <div class="mb-4">
                          <label class="block mb-2 text-sm font-bold" for="lastname">
                            {{ $t('lastname') }}
                          </label>
                          <div class="relative">
                            <input
                              v-model="createmoderator.last_name"
                              id="lastname"
                              type="text"
                              class="w-full px-4 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              :placeholder="$t('lastname')"
                              required
                            />
                          </div>
                        </div>
                        <div class="mb-4">
                          <label class="block mb-2 text-sm font-bold" for="fathername">
                            {{ $t('fathername') }}
                          </label>
                          <div class="relative">
                            <input
                              v-model="createmoderator.father_name"
                              id="fathername"
                              type="text"
                              class="w-full px-4 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              :placeholder="$t('fathername')"
                              required
                            />
                          </div>
                        </div>
                  </div>
                  <div>
                      <div class="mb-4">
                          <label class="block mb-2 text-sm font-bold" for="email">
                            {{$t('mail')}}
                          </label>
                          <div class="relative">
                            <input
                              v-model="createmoderator.email"
                              @input="onEmailChange($event.target.value)"
                              id="email"
                              type="email"
                              class="w-full px-4 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              :class="{ 'border-red-500': emailError }"
                              placeholder="example@mail.uz"
                              required
                            />
                            <div v-if="emailError" class="text-red-500 text-xs mt-1">
                              {{ emailError }}
                            </div>
                          </div>
                        </div>
                        <div class="mb-4">
                          <label class="block mb-2 text-sm font-bold" for="phone_number">
                            {{$t('phone')}}
                          </label>
                          <div class="relative">
                            <input
                              v-mask="'+998 (##) ###-##-##'"
                              v-model="createmoderator.phone_number"
                              @input="onPhoneChange($event.target.value)"
                              id="phone_number"
                              type="tel"
                              class="w-full px-4 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              :class="{ 'border-red-500': phoneError }"
                              placeholder="+998 (__) ___-__-__ "
                              required
                            />
                            <div v-if="phoneError" class="text-red-500 text-xs mt-1">
                              {{ phoneError }}
                            </div>
                          </div>
                        </div>
                        <div class="mb-6">
                          <label class="block mb-2 text-sm font-bold" for="password">
                            {{$t('formpassword')}}
                          </label>
                          <div class="relative">
                            <input
                              v-model="createmoderator.password"
                              id="password"
                              :type="showPassword ? 'text' : 'password'"
                              class="w-full px-4 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              placeholder="• • • • • • • •"
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
                  </div>
              </div>
              <div class="flex items-center p-4 space-x-6">
                  <button 
                   @click="closeModal"
                   type="button"
                    class="w-full px-4 py-2 bg-[#DCDCDC] rounded-md hover:bg-gray-400 focus:outline-none focus:bg-gray-400"
                  >
                  {{$t('cancel')}}
                  </button>
                  <button 
                    type="submit"
                    class="w-full px-4 py-2 text-white bg-[#07A920] rounded-md hover:bg-green-700 focus:outline-none focus:bg-blue-600"
                  >
                    {{$t('create')}}
                  </button>
              </div>
          </form>
       </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, reactive, onMounted } from 'vue'
  import { moderatorStore } from '../../stores/moderatorStore';
  import { useModerator } from '../../service/moderator/index.js';
  import { useRouter } from 'vue-router'
  import { toast } from 'vue3-toastify';
   
  const showPassword = ref(false)
  const openmodal = ref(false)
  const router = useRouter();
  const store = moderatorStore();
  const emailError = ref('')
  const phoneError = ref('')
  const emailTimeout = ref(null)
  const phoneTimeout = ref(null)
  
  // Modal yopish funksiyasi
  const closeModal = () => {
    openmodal.value = false
  }
  
  // Modal ochish funksiyasi
  const showModal = () => {
    // Formani tozalash
    createmoderator.first_name = ''
    createmoderator.last_name = ''
    createmoderator.father_name = ''
    createmoderator.email = ''
    createmoderator.phone_number = ''
    createmoderator.password = ''
    
    // Xato xabarlarini tozalash
    emailError.value = ''
    phoneError.value = ''
    
    // Modalni ochish
    openmodal.value = true
  }
  
  const createmoderator = reactive({
    first_name: '',
    last_name: '',
    father_name: '',
    email: '',
    phone_number: '',
    password: ''
  });
  
  // Email tekshirish funksiyasi
  const checkEmailAvailability = async (email) => {
    if (!email || !email.includes('@')) return;
  
    try {
      emailError.value = ''
      const response = await useModerator.checkEmail(email);
      if (response.data.exists) {
        emailError.value = 'Bu email allaqachon ishlatilgan'
      }
    } catch (error) {
      if (store.checkEmailExists(email)) {
        emailError.value = 'Bu email allaqachon ishlatilgan'
      }
    }
  }
  
  // Telefon tekshirish funksiyasi  
  const checkPhoneAvailability = async (phone) => {
    if (!phone || phone.length < 9) return;
  
    try {
      phoneError.value = ''
      const response = await useModerator.checkPhone(phone);
      if (response.data.exists) {
        phoneError.value = 'Bu telefon raqami allaqachon ishlatilgan'
      }
    } catch (error) {
      if (store.checkPhoneExists(phone)) {
        phoneError.value = 'Bu telefon raqami allaqachon ishlatilgan'
      }
    }
  }
  
  // Email input'da o'zgarish
  const onEmailChange = (email) => {
    clearTimeout(emailTimeout.value)
    emailTimeout.value = setTimeout(() => {
      checkEmailAvailability(email)
    }, 500)
  }
  
  // Phone inputdan faqat raqamlarni ajratib olish funksiyasi
  const cleanPhoneNumber = (phone) => {
    if (!phone) return '';
    return phone.replace(/\D/g, '').replace(/^998/, '');
  }
  
  // Phone input'da o'zgarish
  const onPhoneChange = (phone) => {
    clearTimeout(phoneTimeout.value)
    phoneTimeout.value = setTimeout(() => {
      const cleanPhone = cleanPhoneNumber(phone);
      checkPhoneAvailability(cleanPhone)
    }, 500)
  }
  
  const addModerator = (event) => {
    event.preventDefault();
    
    // Telefon raqamini tozalash
    const cleanedPhone = cleanPhoneNumber(createmoderator.phone_number);
    
    const moderator = {
      first_name: createmoderator.first_name,
      last_name: createmoderator.last_name,
      father_name: createmoderator.father_name,
      email: createmoderator.email,
      phone_number: cleanedPhone,
      password: createmoderator.password,
      role: 'MODERATOR' // Har doim MODERATOR sifatida yaratish
    }
  
    useModerator.create(moderator).then((res) => {
      if(res.status === 200 || res.status === 201) {
        // Formani tozalash
        createmoderator.first_name = ''
        createmoderator.last_name = ''
        createmoderator.father_name = ''
        createmoderator.email = ''
        createmoderator.phone_number = ''
        createmoderator.password = ''
        emailError.value = ''
        phoneError.value = ''
        
        closeModal()
        
        if(res.data && res.data.user) {
          store.addModerator(res.data.user)
        }
        
        toast.success('Moderator muvaffaqiyatli yaratildi!', {
          position: 'top-right',
          timeout: 3000
        })
        window.location.reload()
      }
    }).catch((error) => {
      if(error.response?.status === 401 || error.message === 'token expired' || error.message === 'token not found'){
        router.push({name: 'login'})
        return
      }
      
      if(error.response?.status === 403) {
        toast.error('Bu amalni bajarish uchun ruxsatingiz yo\'q!', {
          position: 'top-right',
          timeout: 4000
        })
        return
      }
      
      if(error.response?.status === 409) {
        const errorMessage = error.response?.data?.message || 'Bu email yoki telefon raqami allaqachon mavjud!'
        toast.error(errorMessage, {
          position: 'top-right',
          timeout: 4000
        })
      }
      else if(error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || 'Ma\'lumotlar noto\'g\'ri kiritilgan!'
        toast.error(errorMessage, {
          position: 'top-right',
          timeout: 4000
        })
      }
      else if(error.response?.status === 422) {
        const errorMessage = error.response?.data?.message || 'Validation xatoligi!'
        toast.error(errorMessage, {
          position: 'top-right',
          timeout: 4000
        })
      }
      else if(error.response?.status === 500) {
        toast.error('Server xatoligi yuz berdi!', {
          position: 'top-right',
          timeout: 4000
        })
      }
      else if(!error.response) {
        toast.error('Internet bilan bog\'lanishda muammo!', {
          position: 'top-right',
          timeout: 4000
        })
      }
      else {
        const errorMessage = error.response?.data?.message || 'Moderator yaratishda xatolik yuz berdi!'
        toast.error(errorMessage, {
          position: 'top-right',
          timeout: 3000
        })
      }
    })
  }
  </script>