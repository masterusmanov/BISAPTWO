<template>
    <div class="flex items-center justify-between px-[20px] w-[100%] py-[15px] border-b border-gray-300">
        <div class="flex items-center space-x-4 w-[70%]">
            <div>
                <img :src="gerb" alt="Gerb" class="w-[50px]">
                <p class="w-[8px] h-[8px] rounded-full bg-green-500 float-right"></p>
            </div>
            <div>
                <p class="text-[16px] text-justify font-bold">{{ getLocalizedName(minorganListwo[0])}}</p>
                <p class="font-bold text-[11px]">{{$t('ministry.project')}}: <span class="font-normal">{{$t(`${selectMinistry.name}`).slice(0, 100)}}</span></p>
            </div>
        </div>
        <p v-if="selectMinistry.note" class="text-[11px] px-[5px] rounded-full text-white bg-red-500">{{$t(`${selectMinistry.note}`)}}</p>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios'
import gerb from "../../assets/images/sign/gerb.png"
import { useI18n } from 'vue-i18n'

const { t: $t, locale } = useI18n()
const loading = ref(false)
const error = ref('')
const minorganListwo = ref([])
const currentLanguage = ref('uz') // yoki computed dan oling
const errorMessage = ref('')
const meInfo = ref(null)
const organizationId = ref(null)

const selectMinistry = ref(JSON.parse(sessionStorage.getItem('selectMinistry')))
console.log(selectMinistry);

const getLocalizedName = (item) => {
if (!item) return ''

const lang = currentLanguage.value

// Avval hozirgi tilni tekshirish
if (item[lang]) return item[lang]

// name obyektidan izlash
if (item.name && typeof item.name === 'object') {
  if (item.name[lang]) return item.name[lang]
  // Fallback tartibi: oz uchun uz dan foydalanish, keyin boshqalar
  if (lang === 'oz' && item.name.uz) return item.name.uz
  
  const fallbackOrder = ['uz', 'ru', 'eng', 'en']
  for (const fallbackLang of fallbackOrder) {
    if (item.name[fallbackLang]) return item.name[fallbackLang]
  }
  // Agar hech qaysi til topilmasa, birinchi qiymatni qaytarish
  const firstKey = Object.keys(item.name)[0]
  if (firstKey) return item.name[firstKey]
}

// oz tili uchun uz dan fallback
if (lang === 'oz' && item.uz) return item.uz

// Oddiy string nom
if (typeof item.name === 'string') return item.name

// Fallback qiymatlar
const fallbackFields = ['title', 'label', 'text']
for (const field of fallbackFields) {
  if (item[field]) {
    if (typeof item[field] === 'object') {
      if (item[field][lang]) return item[field][lang]
      if (lang === 'oz' && item[field].uz) return item[field].uz
    } else if (typeof item[field] === 'string') {
      return item[field]
    }
  }
}

// Default: ID bilan
return `${$t('organization')} ${item.id}`
}
// ========================================================= xozircha shart emas

const fetchMinorganIdData = async (orgId) => {
    loading.value = true;
    error.value = '';

    try {
        const response = await axios.get('https://shartnoma.miit.uz/api/api_directory', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            params: {
                start_id: 29,
                end_id: 64,
            }
        });

        let data = response.data;

        // Agar API javobi array emas bo'lsa, ma'lumotlarni qayta ishlash
        if (!Array.isArray(data)) {
            if (data.data && Array.isArray(data.data)) {
                data = data.data;
            } else if (data.items && Array.isArray(data.items)) {
                data = data.items;
            } else {
                throw new Error('API noto‘g‘ri formatda javob qaytardi');
            }
        }

        // ID bo'yicha filter qilish (orgId ga mos keladigan ma'lumotni topish)
        const filteredData = data.filter(item => {
            const id = parseInt(item.id);
            return id === orgId; // Faqat berilgan ID ga mos keladigan ma'lumot
        });

        // Agar ma'lumot topilsa, uni ko'rsatish
        if (filteredData.length > 0) {
            const selectedOrg = filteredData[0];
            minorganListwo.value = [{
                id: selectedOrg.id,
                uz: selectedOrg.name_uz || selectedOrg.uz || selectedOrg.name?.uz,
                oz: selectedOrg.name_oz || selectedOrg.oz || selectedOrg.name?.oz,
                ru: selectedOrg.name_ru || selectedOrg.ru || selectedOrg.name?.ru,
                en: selectedOrg.name_en || selectedOrg.en || selectedOrg.name?.en,
            }];
        } else {
            throw new Error('Berilgan ID ga mos ma‘lumot topilmadi');
        }

    } catch (err) {
        console.error('Xatolik:', err);
        error.value = err.message;
        minorganListwo.value = []; // Agar xatolik bo'lsa, ro'yxatni tozalash
    } finally {
        loading.value = false;
    }
};


const getUserMe = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
        errorMessage.value = 'Token topilmadi';
        return null;
    }
    try {
        const response = await axios.get(import.meta.env.VITE_APP_BASE_URL + '/user/me', {
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
        organizationId.value = meInfo.value.data.organizations_id; // ID ni saqlash
        fetchMinorganIdData(organizationId.value); // ID ni fetchMinorganData ga uzatish
    }
});

// ====================================================



</script>

<style lang="scss" scoped>

</style>