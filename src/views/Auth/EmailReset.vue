<template>
    <div class="bg-gray-100 min-h-screen flex items-center justify-center">
        <div class="container mx-auto min-h-screen">
            <div class="w-full min-h-screen flex items-center justify-center">
                <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                    <h1 class="text-2xl font-bold mb-4">Parolingizni unutdingizmi?</h1>
                    
                    <!-- Email yuborish qismi (kod yuborilmagan bo'lsa ko'rinadi) -->
                    <div v-if="!emailSent">
                        <p class="mb-6 text-[12px]">Iltimos, parolni qayta tiklash uchun elektron pochta manzilingizni kiriting!</p>
                        <form @submit.prevent="submitForm">
                            <div class="mb-4">
                                <label for="email" class="block text-sm font-medium text-gray-700">Emailni kiriting!</label>
                                <input type="email" id="email" v-model="email" required
                                       class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                            </div>
                            <button type="submit"
                                    :disabled="isEmailLoading"
                                    :class="[
                                        'w-full py-2 px-4 font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center',
                                        isEmailLoading ? 'bg-blue-400 text-white cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
                                    ]">
                                <svg v-if="isEmailLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {{ isEmailLoading ? 'Yuborilmoqda...' : 'Yuborish' }}
                            </button>
                        </form>
                    </div>

                    <!-- Kod kiritish qismi (email yuborilgandan keyin ko'rinadi) -->
                    <div v-if="emailSent && !codeVerified">
                        <p class="mb-6 text-[12px]">{{ email }} manziliga yuborilgan 6 raqamli kodni kiriting!</p>
                        
                        <!-- 6 ta input maydon -->
                        <div class="flex justify-center space-x-2 mb-4">
                            <input 
                                v-for="(digit, index) in otpCode" 
                                :key="index"
                                type="text" 
                                maxlength="6"
                                v-model="otpCode[index]"
                                @input="handleOtpInput(index, $event)"
                                @keydown="handleKeydown(index, $event)"
                                @paste="handlePaste(index, $event)"
                                :ref="`otp-${index}`"
                                class="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <!-- Hisoblagich va qayta yuborish tugmasi -->
                        <div class="text-center mb-4">
                            <p class="text-sm text-gray-600 mb-2">
                                Kodni ololmadingizmi?
                            </p>
                            <div v-if="countdown > 0" class="text-sm text-gray-500">
                                {{ countdown }} sekund kutib turing
                            </div>
                            <button 
                                v-else
                                @click="resendCode"
                                class="text-blue-600 text-sm hover:underline">
                                Kodni qayta yuborish
                            </button>
                        </div>

                        <button 
                            @click="verifyCode"
                            :disabled="!isOtpComplete || isCodeLoading"
                            :class="[
                                'w-full py-2 px-4 font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center',
                                (isOtpComplete && !isCodeLoading) ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            ]">
                            <svg v-if="isCodeLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {{ isCodeLoading ? 'Tekshirilmoqda...' : 'Tasdiqlash' }}
                        </button>

                        <!-- Orqaga qaytish tugmasi -->
                        <button 
                            @click="goBackToEmail"
                            class="w-full mt-3 py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 focus:outline-none">
                            ← Emailni o'zgartirish
                        </button>
                    </div>

                    <!-- Yangi parol qo'yish qismi (kod tasdiqlangandan keyin ko'rinadi) -->
                    <div v-if="codeVerified">
                        <p class="mb-6 text-[12px]">Hisobingiz uchun yangi parol kiriting!</p>
                        
                        <form @submit.prevent="resetPassword">
                            <div class="mb-4">
                                <label for="newPassword" class="block text-sm font-medium text-gray-700">Yangi parol</label>
                                <input 
                                    type="password" 
                                    id="newPassword" 
                                    v-model="newPassword" 
                                    required
                                    minlength="6"
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Kamida 6 ta belgi">
                            </div>
                            
                            <div class="mb-6">
                                <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Parolni tasdiqlang</label>
                                <input 
                                    type="password" 
                                    id="confirmPassword" 
                                    v-model="confirmPassword" 
                                    required
                                    minlength="6"
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    :class="{'border-red-500': confirmPassword && newPassword !== confirmPassword}"
                                    placeholder="Parolni qayta kiriting">
                                
                                <!-- Parol mos kelmasa xabar -->
                                <p v-if="confirmPassword && newPassword !== confirmPassword" class="mt-1 text-sm text-red-600">
                                    Parollar mos kelmayapti
                                </p>
                            </div>

                            <button 
                                type="submit"
                                :disabled="!newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 6 || isPasswordLoading"
                                :class="[
                                    'w-full py-2 px-4 font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center',
                                    (newPassword && confirmPassword && newPassword === confirmPassword && newPassword.length >= 6 && !isPasswordLoading) 
                                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                ]">
                                <svg v-if="isPasswordLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {{ isPasswordLoading ? 'O\'zgartirilmoqda...' : 'Parolni o\'zgartirish' }}
                            </button>
                        </form>

                        <!-- Orqaga qaytish -->
                        <button 
                            @click="goBackToOtp"
                            class="w-full mt-3 py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 focus:outline-none">
                            ← Kodga qaytish
                        </button>
                    </div>

                    <!-- Login sahifasiga qaytish havolasi -->
                    <router-link to="/login" class="text-gray-400 font-semibold text-[12px] hover:underline flex items-center justify-center mt-[20px]">
                        <span class="">⇽</span> Tizimga kirishga qaytish
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, reactive, computed, onMounted, onUnmounted } from "vue";    
    import axios from "axios";
    import { toast } from "vue3-toastify";
    import "vue3-toastify/dist/index.css";
    
    const email = ref('');
    const emailSent = ref(false);  // Email yuborilganini belgilovchi
    const otpCode = ref(['', '', '', '', '', '']);  // 6 ta raqam uchun
    const countdown = ref(0);  // Hisoblagich
    const codeVerified = ref(false);  // Kod tasdiqlangani
    const resetToken = ref('');  // Reset token
    const newPassword = ref('');  // Yangi parol
    const confirmPassword = ref('');  // Parolni tasdiqlash
    const isEmailLoading = ref(false);  // Email yuborish loading holati
    const isCodeLoading = ref(false);  // Kod tasdiqlash loading holati
    const isPasswordLoading = ref(false);  // Parol o'zgartirish loading holati
    let countdownInterval = null;  // Interval uchun o'zgaruvchi

    // OTP to'liq kiritilganini tekshirish
    const isOtpComplete = computed(() => {
        return otpCode.value.every(digit => digit !== '');
    });

    // Email yuborish funksiyasi
    const submitForm = async () => {
        isEmailLoading.value = true;  // Loading boshlanishi
        try {
            const response = await axios.post('https://back.miit.uz/api/bisap/test/otps/forgot-password', { email: email.value });
            if (response.data) {
                toast.success('Parolni tiklash uchun elektron pochta yuborildi!', {autoClose: 1000});
                emailSent.value = true;  // Email yuborildi deb belgilaymiz
                startCountdown();  // Hisoblagichni boshlaymiz
                // Birinchi inputga fokus qo'yamiz
                setTimeout(() => {
                    const firstInput = document.querySelector('[ref="otp-0"]');
                    if (firstInput) firstInput.focus();
                }, 100);
            } else {
                toast.error('Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.', {autoClose: 1000});
            }
        } catch (error) {
            toast.error('Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.', {autoClose: 1000});
        } finally {
            isEmailLoading.value = false;  // Loading tugashi
        }
    };

    // 60 sekund hisoblagichni boshlash
    const startCountdown = () => {
        countdown.value = 60;
        countdownInterval = setInterval(() => {
            countdown.value--;
            if (countdown.value <= 0) {
                clearInterval(countdownInterval);
            }
        }, 1000);
    };

    // Copy-paste hodisasini boshqarish
    const handlePaste = (index, event) => {
        event.preventDefault();
        const pastedData = (event.clipboardData || window.clipboardData).getData('text');
        
        // Faqat raqamlarni olish va 6 ta belgi bilan cheklash
        const numbers = pastedData.replace(/\D/g, '').slice(0, 6);
        
        if (numbers.length === 6) {
            // 6 ta raqamni alohida kataklarga tarqatish
            const digits = numbers.split('');
            for (let i = 0; i < 6; i++) {
                otpCode.value[i] = digits[i] || '';
            }
            // Oxirgi inputga fokus qo'yish
            const lastInput = document.querySelector(`[ref="otp-5"]`);
            if (lastInput) {
                lastInput.focus();
                lastInput.select();
            }
        } else if (numbers.length > 0) {
            // Agar 6 tadan kam bo'lsa, joriy pozitsiyadan boshlab to'ldirish
            const digits = numbers.split('');
            for (let i = 0; i < digits.length && (index + i) < 6; i++) {
                otpCode.value[index + i] = digits[i];
            }
            // Oxirgi to'ldirilgan inputdan keyingisiga fokus
            const nextIndex = Math.min(index + digits.length, 5);
            const nextInput = document.querySelector(`[ref="otp-${nextIndex}"]`);
            if (nextInput) {
                nextInput.focus();
                nextInput.select();
            }
        }
    };

    // OTP input boshqaruvi
    const handleOtpInput = (index, event) => {
        const value = event.target.value;
        
        // Copy-paste qilingan kodni tekshirish (uzunligi 6 bo'lsa)
        if (value.length === 6 && /^\d{6}$/.test(value)) {
            // 6 ta raqamni alohida kataklarga tarqatish
            const digits = value.split('');
            for (let i = 0; i < 6; i++) {
                otpCode.value[i] = digits[i] || '';
            }
            // Oxirgi inputga fokus qo'yish
            const lastInput = document.querySelector(`[ref="otp-5"]`);
            if (lastInput) lastInput.focus();
            return;
        }
        
        // Faqat raqamlarni qabul qilish
        if (!/^\d*$/.test(value)) {
            event.target.value = otpCode.value[index];
            return;
        }

        // Eski qiymatni tozalash va yangi qiymat qo'yish
        otpCode.value[index] = value.slice(-1); // Faqat oxirgi belgini olish

        // Keyingi inputga avtomatik o'tish
        if (value && index < 5) {
            const nextInput = document.querySelector(`[ref="otp-${index + 1}"]`);
            if (nextInput) {
                nextInput.focus();
                nextInput.select(); // Keyingi inputdagi matnni tanlash
            }
        }
    };

    // Klaviatura hodisalarini boshqarish
    const handleKeydown = (index, event) => {
        // Backspace bosilganda oldingi inputga o'tish
        if (event.key === 'Backspace' && !otpCode.value[index] && index > 0) {
            const prevInput = document.querySelector(`[ref="otp-${index - 1}"]`);
            if (prevInput) {
                prevInput.focus();
                otpCode.value[index - 1] = '';
            }
        }
    };

    // Kodni tasdiqlash
    const verifyCode = async () => {
        const code = otpCode.value.join('');
        isCodeLoading.value = true;  // Loading boshlanishi
        try {
            const response = await axios.post('https://back.miit.uz/api/bisap/test/otps/verify-otp', {
                email: email.value,
                otp: code
            });
            
            if (response.data && response.data.status && response.data.data.token) {
                resetToken.value = response.data.data.token;
                codeVerified.value = true;
                toast.success('Kod muvaffaqiyatli tasdiqlandi!', {autoClose: 1000});
            } else {
                toast.error('Kod noto\'g\'ri yoki muddati tugagan!', {autoClose: 1000});
                // Kodlarni tozalash
                otpCode.value = ['', '', '', '', '', ''];
                // Birinchi inputga fokus
                setTimeout(() => {
                    const firstInput = document.querySelector('[ref="otp-0"]');
                    if (firstInput) firstInput.focus();
                }, 100);
            }
        } catch (error) {
            console.error('Verify error:', error);
            toast.error('Kod noto\'g\'ri yoki muddati tugagan!', {autoClose: 1000});
            // Kodlarni tozalash
            otpCode.value = ['', '', '', '', '', ''];
            // Birinchi inputga fokus
            setTimeout(() => {
                const firstInput = document.querySelector('[ref="otp-0"]');
                if (firstInput) firstInput.focus();
            }, 100);
        } finally {
            isCodeLoading.value = false;  // Loading tugashi
        }
    };

    // Kodni qayta yuborish
    const resendCode = async () => {
        try {
            const response = await axios.post('https://back.miit.uz/api/bisap/test/otps/forgot-password', { email: email.value });
            if (response.data) {
                toast.success('Kod qayta yuborildi!', {autoClose: 1000});
                startCountdown();
                // OTP kodlarini tozalash
                otpCode.value = ['', '', '', '', '', ''];
                // Birinchi inputga fokus
                setTimeout(() => {
                    const firstInput = document.querySelector('[ref="otp-0"]');
                    if (firstInput) firstInput.focus();
                }, 100);
            }
        } catch (error) {
            toast.error('Kod yuborishda xatolik!', {autoClose: 1000});
        }
    };

    // Yangi parol o'rnatish
    const resetPassword = async () => {
        if (newPassword.value !== confirmPassword.value) {
            toast.error('Parollar mos kelmayapti!', {autoClose: 1000});
            return;
        }

        if (newPassword.value.length < 6) {
            toast.error('Parol kamida 6 ta belgidan iborat bo\'lishi kerak!', {autoClose: 1000});
            return;
        }

        isPasswordLoading.value = true;  // Loading boshlanishi
        try {
            const response = await axios.put('https://back.miit.uz/api/bisap/test/otps/reset-password', {
                email: email.value,
                new_password: newPassword.value
            }, {
                headers: {
                    'Authorization': `Bearer ${resetToken.value}`
                }
            });

            if (response.data && response.data.status) {
                toast.success('Parol muvaffaqiyatli o\'zgartirildi!', {autoClose: 1500});
                // Login sahifasiga yo'naltirish
                setTimeout(() => {
                    // router.push('/login');
                    window.location.href = '/login';
                }, 1500);
            } else {
                toast.error('Parolni o\'zgartirishda xatolik yuz berdi!', {autoClose: 1000});
            }
        } catch (error) {
            console.error('Reset password error:', error);
            toast.error('Parolni o\'zgartirishda xatolik yuz berdi!', {autoClose: 1000});
        } finally {
            isPasswordLoading.value = false;  // Loading tugashi
        }
    };

    // OTP qismiga qaytish
    const goBackToOtp = () => {
        codeVerified.value = false;
        newPassword.value = '';
        confirmPassword.value = '';
    };

    // Email kiritish qismiga qaytish
    const goBackToEmail = () => {
        emailSent.value = false;
        codeVerified.value = false;
        otpCode.value = ['', '', '', '', '', ''];
        newPassword.value = '';
        confirmPassword.value = '';
        resetToken.value = '';
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
        countdown.value = 0;
    };

    // Component ochirilganda intervalni tozalash
    onUnmounted(() => {
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
    });
</script>

<style lang="scss" scoped>
    // OTP input uchun maxsus stil
    input[type="text"]:focus {
        transform: scale(1.05);
        transition: transform 0.2s ease;
    }
</style>