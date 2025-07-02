<template>
    <div class="flex flex-col items-center justify-center min-h-screen w-full">
        <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
            <h2 class="text-2xl font-bold text-center mb-6">Profile</h2>
            
            <!-- Loading state -->
            <div v-if="loading" class="flex justify-center items-center mb-4">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span class="ml-2">Ma'lumotlar yuklanmoqda...</span>
            </div>
            
            <!-- Error message -->
            <div v-if="errorMessage" class="text-red-500 text-center mb-4">
                {{ errorMessage }}
            </div>
            
            <!-- Debug info -->
            <div v-if="!loading" class="mb-4 p-2 bg-gray-100 rounded text-xs">
                <strong>Debug:</strong> 
                <br>meInfo: {{ meInfo ? 'Mavjud' : 'Yo\'q' }}
                <br>Data structure: {{ JSON.stringify(meInfo, null, 2) }}
            </div>
            
            <!-- User info -->
            <div v-if="meInfo && !loading" class="space-y-4">
                <!-- Avatar -->
                <div class="flex items-center justify-center mb-6">
                    <img 
                        :src="meInfo?.avatar || '/images/logo.svg'" 
                        alt="User Avatar" 
                        class="w-20 h-20 rounded-full border-4 border-gray-200"
                    >
                </div>
                
                <!-- User details -->
                <div class="space-y-3 grid grid-cols-3">
                    <div class="bg-gray-50 p-3 rounded">
                        <label class="text-sm font-medium text-gray-600">ID:</label>
                        <p class="text-lg font-semibold">{{ meInfo?.id || 'N/A' }}</p>
                    </div>
                    
                    <div class="bg-gray-50 p-3 rounded">
                        <label class="text-sm font-medium text-gray-600">Ism:</label>
                        <p class="text-lg font-semibold">{{ meInfo?.name || 'N/A' }}</p>
                    </div>
                    
                    <div class="bg-gray-50 p-3 rounded">
                        <label class="text-sm font-medium text-gray-600">Email:</label>
                        <p class="text-lg font-semibold">{{ meInfo?.email || 'N/A' }}</p>
                    </div>
                    
                    <div class="bg-gray-50 p-3 rounded">
                        <label class="text-sm font-medium text-gray-600">Telefon:</label>
                        <p class="text-lg font-semibold">{{ meInfo?.phone || 'N/A' }}</p>
                    </div>
                    
                    <div class="bg-gray-50 p-3 rounded">
                        <label class="text-sm font-medium text-gray-600">Tashkilot ID:</label>
                        <p class="text-lg font-semibold">{{ meInfo?.organizations_id || 'N/A' }}</p>
                    </div>
                    
                    <div class="bg-gray-50 p-3 rounded">
                        <label class="text-sm font-medium text-gray-600">Yaratilgan vaqti:</label>
                        <p class="text-lg font-semibold">{{ formatDate(meInfo?.created_at) || 'N/A' }}</p>
                    </div>
                    
                    <div class="bg-gray-50 p-3 rounded">
                        <label class="text-sm font-medium text-gray-600">Yangilangan vaqti:</label>
                        <p class="text-lg font-semibold">{{ formatDate(meInfo?.updated_at) || 'N/A' }}</p>
                    </div>
                </div>
                
                <!-- Parol yangilash modal -->
<div v-if="showPasswordModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Parolni yangilash</h3>
        
        <!-- Xato xabari -->
        <div v-if="passwordError" class="text-red-500 text-sm mb-4">
            {{ passwordError }}
        </div>
        
        <!-- Muvaffaqiyat xabari -->
        <div v-if="passwordSuccess" class="text-green-500 text-sm mb-4">
            {{ passwordSuccess }}
        </div>
        
        <form @submit.prevent="updatePassword">
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Joriy parol:
                </label>
                <input 
                    type="password" 
                    v-model="passwordForm.currentPassword"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                >
            </div>
            
            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Yangi parol:
                </label>
                <input 
                    type="password" 
                    v-model="passwordForm.newPassword"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                >
            </div>
            
            <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Yangi parolni tasdiqlang:
                </label>
                <input 
                    type="password" 
                    v-model="passwordForm.confirmPassword"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                >
            </div>
            
            <div class="flex space-x-3">
                <button 
                    type="submit" 
                    class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
                    :disabled="passwordLoading"
                >
                    <span v-if="passwordLoading">Yangilanmoqda...</span>
                    <span v-else>Yangilash</span>
                </button>
                
                <button 
                    type="button" 
                    @click="closePasswordModal"
                    class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors"
                >
                    Bekor qilish
                </button>
            </div>
        </form>
    </div>
</div>


                <!-- Action buttons -->
              <!-- Action buttons -->
<div class="flex space-x-3 mt-6">
    <button 
        @click="refreshUserInfo" 
        class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
        :disabled="loading"
    >
        Ma'lumotlarni yangilash
    </button>
    
    <button 
        @click="openPasswordModal" 
        class="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors"
    >
        Parolni o'zgartirish
    </button>
    
    <button 
        @click="logout" 
        class="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors"
    >
        Chiqish
    </button>
</div>
            </div>
            
            <!-- Agar ma'lumot yo'q bo'lsa -->
            <div v-if="!meInfo && !loading && !errorMessage" class="text-center text-gray-500">
                Ma'lumot topilmadi
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Reactive variables
const meInfo = ref(null);
const errorMessage = ref(null);
const loading = ref(false);
const showPasswordModal = ref(false);
const passwordLoading = ref(false);
const passwordError = ref(null);
const passwordSuccess = ref(null);
const passwordForm = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
});


// Get user info function
const getUserMe = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
        errorMessage.value = 'Token topilmadi. Iltimos, qayta login qiling.';
        return null;
    }
    
    loading.value = true;
    errorMessage.value = null;
    
    try {
        const response = await axios.get('https://back.miit.uz/api/bisap/test/user/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Full API Response:', response?.data?.data);
        console.log('User data:', response.data.data);
        
        // API response ni to'g'ri qaytarish
        if (response.data && response.data.data) {
            return response.data.data;
        } else {
            console.error('API response structure unexpected:', response.data);
            errorMessage.value = 'API dan noto\'g\'ri ma\'lumot keldi';
            return null;
        }
    } catch (err) {
        console.error('API Error:', err);
        if (err.response?.status === 401) {
            errorMessage.value = 'Avtorizatsiya muddati tugagan. Qayta login qiling.';
            sessionStorage.removeItem('token');
        } else {
            errorMessage.value = 'Ma\'lumotlarni olishda xato: ' + (err.response?.data?.message || err.message);
        }
        return null;
    } finally {
        loading.value = false;
    }
};

// Refresh user info
const refreshUserInfo = async () => {
    console.log('Refreshing user info...');
    const data = await getUserMe();
    console.log('Received data:', data);
    
    if (data) {
        meInfo.value = data;
        sessionStorage.setItem('meInfo', JSON.stringify(data));
        console.log('meInfo updated:', meInfo.value);
    } else {
        console.log('No data received');
    }
};

// Format date function
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('uz-UZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return dateString;
    }
};

// Logout function
const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('meInfo');
    window.location.href = '/login';
};


// Parol modal funksiyalari
const openPasswordModal = () => {
    showPasswordModal.value = true;
    passwordError.value = null;
    passwordSuccess.value = null;
    // Formani tozalash
    passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    };
};

const closePasswordModal = () => {
    showPasswordModal.value = false;
    passwordError.value = null;
    passwordSuccess.value = null;
    passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    };
};

// Parolni yangilash funksiyasi
const updatePassword = async () => {
    // Validatsiya
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        passwordError.value = 'Yangi parollar mos kelmaydi';
        return;
    }
    
    if (passwordForm.value.newPassword.length < 3) {
        passwordError.value = 'Yangi parol kamida 3 ta belgidan iborat bo\'lishi kerak';
        return;
    }
    
    const token = sessionStorage.getItem('token');
    if (!token) {
        passwordError.value = 'Token topilmadi. Qayta login qiling.';
        return;
    }
    
    passwordLoading.value = true;
    passwordError.value = null;
    passwordSuccess.value = null;
    
    try {
        const response = await axios.put('https://back.miit.uz/api/bisap/test/user/update-password', {
            new_password: passwordForm.value.newPassword,
            password: passwordForm.value.currentPassword
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Password update response:', response.data);
        
        // Muvaffaqiyatli yangilanganda
        passwordSuccess.value = 'Parol muvaffaqiyatli yangilandi!';
        
        // 2 soniyadan keyin modalni yopish
        setTimeout(() => {
            closePasswordModal();
        }, 2000);
        
    } catch (err) {
        console.error('Password update error:', err);
        
        if (err.response?.status === 401) {
            passwordError.value = 'Joriy parol noto\'g\'ri yoki avtorizatsiya muddati tugagan';
        } else if (err.response?.status === 400) {
            passwordError.value = 'Noto\'g\'ri ma\'lumot yuborildi';
        } else {
            passwordError.value = 'Parolni yangilashda xato: ' + (err.response?.data?.message || err.message);
        }
    } finally {
        passwordLoading.value = false;
    }
};

// Component mounted
onMounted(async () => {
    console.log('Component mounted');
    
    // Avval sessionStorage dan ma'lumot olishga harakat qilish
    const savedInfo = sessionStorage.getItem('meInfo');
    if (savedInfo) {
        try {
            const parsedInfo = JSON.parse(savedInfo);
            console.log('Saved info loaded:', parsedInfo);
            meInfo.value = parsedInfo;
        } catch (e) {
            console.error('Saved info parsing error:', e);
        }
    }
    
    // API dan yangi ma'lumot olish
    await refreshUserInfo();
});
</script>

<style lang="scss" scoped>
.text-red-500 {
    color: red;
    text-align: center;
}

.animate-spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.fixed {
    position: fixed;
}

.inset-0 {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}

.bg-opacity-50 {
    background-color: rgba(0, 0, 0, 0.5);
}

.z-50 {
    z-index: 50;
}

// Form input focus effect
input:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

// Success text color
.text-green-500 {
    color: #10b981;
}

// Button hover effects
.bg-green-500:hover {
    background-color: #059669;
}

.bg-gray-500:hover {
    background-color: #4b5563;
}
</style>