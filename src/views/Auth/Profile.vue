<template>
  <div class="mt-[50px] p-6 min-h-screen w-full">
    <div class="w-full px-6 bg-white rounded-lg">
      <button
        @click="refreshUserInfo"
        class="flex ml-auto bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        :disabled="loading"
      >
        <i class="bx bx-refresh text-[20px]"></i>
      </button>
      <h2 class="text-2xl font-bold text-center mb-6">Foydalanuvchi ma'lumotlari</h2>

      <!-- Loading state -->
      <div v-if="loading" class="flex mb-4">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"
        ></div>
        <span class="ml-2">Ma'lumotlar yuklanmoqda...</span>
      </div>

      <!-- Error message -->
      <div v-if="errorMessage" class="text-red-500 text-center mb-4">
        {{ errorMessage }}
      </div>

      <!-- User info -->
      <div v-if="meInfo && !loading" class="space-y-4">
        <!-- Avatar -->
        <div class="flex items-center mb-6">
          <img
            :src="meInfo?.avatar || user"
            alt="User Avatar"
            class="w-30 h-30 rounded-full border-4 border-gray-200"
          />
        </div>

        <!-- User details -->
        <div class="space-y-3 grid grid-cols-3 gap-6">
          <div class="bg-gray-50 p-3 rounded">
            <label class="text-md font-semibold text-gray-600"
              >Ismi, familiyasi (F.I.O):</label
            >
            <p class="text-lg font-semibold">
              {{ meInfo?.first_name }} {{ meInfo?.last_name }}
              {{ meInfo?.father_name }}
            </p>
          </div>

          <div class="bg-gray-50 p-3 rounded">
            <label class="text-md font-semibold text-gray-600">Email:</label>
            <p class="text-lg font-semibold">{{ meInfo?.email || "N/A" }}</p>
          </div>

          <div class="bg-gray-50 p-3 rounded">
            <label class="text-md font-semibold text-gray-600">Telefon:</label>
            <p class="text-lg font-semibold">
              {{ meInfo?.phone_number || "N/A" }}
            </p>
          </div>

          <div class="bg-gray-50 p-3 rounded">
            <label class="text-md font-semibold text-gray-600"
              >Tashkilot:</label
            >
            <p class="text-lg font-semibold">
              {{ meInfo?.organizations_name || "N/A" }}
            </p>
          </div>

          <div v-if="meInfo.role === 'USER'" class="bg-gray-50 p-3 rounded">
            <label class="text-md font-semibold text-gray-600"
              >Pozitsiya:</label
            >
            <p class="text-lg font-semibold">Foydalanuvchi</p>
          </div>
        </div>

        <!-- Foydalanuvchi ma'lumotlarini yangilash modal -->
        <div
          v-if="showUpdateModal"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div class="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 class="text-xl font-bold mb-4">Ma'lumotlarni yangilash</h3>

            <form @submit.prevent="updateUserInfo" class="space-y-4">
              <div class="flex space-x-3 items-center mt-[50px]">
                <label for="first_name" class="font-semibold text-[14px]"
                  >Ismi</label
                >
                <input
                  v-model="updateForm.first_name"
                  placeholder="Ism"
                  class="input w-full border border-gray-300 rounded-md p-1 px-2 text-[14px]"
                />
              </div>
              <div class="flex space-x-3 items-center">
                <label for="last_name" class="font-semibold text-[14px]"
                  >Familiyasi</label
                >
                <input
                  v-model="updateForm.last_name"
                  type="text"
                  placeholder="Familiya"
                  class="input w-full border border-gray-300 rounded-md p-1 px-2 text-[14px]"
                />
              </div>
              <div class="flex space-x-3 items-center">
                <label for="father_name" class="font-semibold text-[14px]"
                  >Otasining ismi</label
                >
                <input
                  v-model="updateForm.father_name"
                  placeholder="Otasining ismi"
                  class="input w-full border border-gray-300 rounded-md p-1 px-2 text-[14px]"
                />
              </div>
              <div class="flex space-x-3 items-center">
                <label for="email" class="font-semibold text-[14px]"
                  >Email</label
                >
                <input
                  v-model="updateForm.email"
                  type="email"
                  placeholder="Email"
                  class="input w-full border border-gray-300 rounded-md p-1 px-2 text-[14px]"
                />
              </div>
              <div class="flex space-x-3 items-center">
                <label for="phone_number" class="font-semibold text-[14px]"
                  >Telefon raqami</label
                >
                <input
                  v-model="updateForm.phone_number"
                  type="tel"
                  placeholder="Telefon"
                  class="input w-full border border-gray-300 rounded-md p-1 px-2 text-[14px]"
                />
              </div>
              <div class="flex space-x-3 items-center">
                <label for="paswword" class="font-semibold text-[14px]"
                  >Paroli</label
                >
                <div class="flex space-x-2 w-full">
                  <input
                  :type="showPassword ? 'text' : 'password'"
                    v-model="updateForm.password"
                    placeholder="Yangi parol"
                    class="input w-full border border-gray-300 rounded-md p-1 px-2 text-[14px]"
                  />
                  <span
                    class="flex items-center cursor-pointer"
                    @click="showPassword = !showPassword"
                  >
                    <svg
                      v-if="!showPassword"
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.967 9.967 0 013.623-4.568M6.875 6.825A10.05 10.05 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.967 9.967 0 01-3.623 4.568M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 3l18 18"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              <div class="flex space-x-3 mt-6">
                <button
                  type="submit"
                  class="flex-1 bg-blue-500 text-white py-2 rounded"
                >
                  Saqlash
                </button>
                <button
                  type="button"
                  @click="closeUpdateModal"
                  class="flex-1 bg-gray-500 text-white py-2 rounded"
                >
                  Bekor qilish
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="w-[20%] flex ml-auto space-x-3 mt-6">
          <button
            @click="openUpdateModal"
            class="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
          >
            Ma'lumotlarni tahrirlash
          </button>

          <!-- <button
            @click="logout"
            class="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          >
            Chiqish
          </button> -->
        </div>
      </div>

      <!-- Agar ma'lumot yo'q bo'lsa -->
      <div
        v-if="!meInfo && !loading && !errorMessage"
        class="text-center text-gray-500"
      >
        Ma'lumot topilmadi
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import user from "../../assets/images/header/user.svg";

// Reactive variables
const meInfo = ref(null);
const errorMessage = ref(null);
const loading = ref(false);
const showUpdateModal = ref(false);
const showPassword = ref(false);
const updateForm = ref({
  first_name: "",
  last_name: "",
  father_name: "",
  email: "",
  phone_number: "",
  password: "",
});

// Get user info function
const getUserMe = async () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    errorMessage.value = "Token topilmadi. Iltimos, qayta login qiling.";
    return null;
  }

  loading.value = true;
  errorMessage.value = null;

  try {
    const response = await axios.get(
      "https://back.miit.uz/api/bisap/test/user/me",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Full API Response:", response?.data?.data);
    console.log("User data:", response.data.data);

    // API response ni to'g'ri qaytarish
    if (response.data && response.data.data) {
      return response.data.data;
    } else {
      console.error("API response structure unexpected:", response.data);
      errorMessage.value = "API dan noto'g'ri ma'lumot keldi";
      return null;
    }
  } catch (err) {
    console.error("API Error:", err);
    if (err.response?.status === 401) {
      errorMessage.value = "Avtorizatsiya muddati tugagan. Qayta login qiling.";
      sessionStorage.removeItem("token");
    } else {
      errorMessage.value =
        "Ma'lumotlarni olishda xato: " +
        (err.response?.data?.message || err.message);
    }
    return null;
  } finally {
    loading.value = false;
  }
};

// Refresh user info
const refreshUserInfo = async () => {
  console.log("Refreshing user info...");
  const data = await getUserMe();
  console.log("Received data:", data);

  if (data) {
    meInfo.value = data;
    sessionStorage.setItem("meInfo", JSON.stringify(data));
    console.log("meInfo updated:", meInfo.value);
  } else {
    console.log("No data received");
  }
};

// Logout function
const logout = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("meInfo");
  window.location.href = "/login";
};

const openUpdateModal = () => {
  if (meInfo.value) {
    updateForm.value = {
      first_name: meInfo.value.first_name || "",
      last_name: meInfo.value.last_name || "",
      father_name: meInfo.value.father_name || "",
      email: meInfo.value.email || "",
      phone_number: meInfo.value.phone_number || "",
      password: "",
    };
  }
  showUpdateModal.value = true;
};

// Modalni yopish
const closeUpdateModal = () => {
  showUpdateModal.value = false;
};

// Ma'lumotlarni yangilash
const updateUserInfo = async () => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    alert("Token topilmadi. Qayta login qiling.");
    return;
  }

  try {
    const res = await axios.patch(
      "https://back.miit.uz/api/bisap/test/user/update",
      {
        id: meInfo.id,
        ...updateForm.value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Ma'lumotlar muvaffaqiyatli yangilandi!");
    closeUpdateModal();
    refreshUserInfo(); // qayta yuklash
  } catch (err) {
    console.error(err);
    alert("Xatolik: " + (err.response?.data?.message || err.message));
  }
};

// Component mounted
onMounted(async () => {
  console.log("Component mounted");

  // Avval sessionStorage dan ma'lumot olishga harakat qilish
  const savedInfo = sessionStorage.getItem("meInfo");
  if (savedInfo) {
    try {
      const parsedInfo = JSON.parse(savedInfo);
      console.log("Saved info loaded:", parsedInfo);
      meInfo.value = parsedInfo;
    } catch (e) {
      console.error("Saved info parsing error:", e);
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
.input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500;
}
</style>
