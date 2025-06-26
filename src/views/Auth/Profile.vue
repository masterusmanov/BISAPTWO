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
                <div class="space-y-3">
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

        console.log('Full API Response:', response.data);
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
</style>