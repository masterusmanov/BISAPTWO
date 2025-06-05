<template>
    <div class="flex flex-col items-center justify-center min-h-screen w-full">
        <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
            <h2 class="text-2xl font-bold text-center mb-6">Profile</h2>
            <div class="flex items-center justify-center mb-4">
                <img :src="meInfo?.avatar || '/images/logo.svg'" alt="Logo" class="w-16 h-16 rounded-full">
                <p v-if="meInfo">{{ meInfo.name }}</p>
                <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const meInfo = ref(null);
const errorMessage = ref(null);

const getUserMe = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
        errorMessage.value = 'Token topilmadi';
        return null;
    }
    try {
        const response = await axios.get('https://back.miit.uz/api/bisap/test/user/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (err) {
        errorMessage.value = 'Xato yuz berdi: ' + err.message;
        return null;
    }
};

getUserMe().then(data => {
    if (data) {
        meInfo.value = data;
    }
    sessionStorage.setItem('meInfo', JSON.stringify(data));
    console.log(meInfo.value.data.organizations_id);
    
});
</script>

<style lang="scss" scoped>
.text-red-500 {
    color: red;
    text-align: center;
}
</style>