<template>
  <div class="space-y-4">
    <!-- Koncepсiya Section -->
    <div class="bg-white border-b border-gray-200 rounded-[8px]">
      <div class="w-full flex items-center justify-between px-4 py-2 text-left transition-colors">
        <div @click="toggleSection('conception')" class="flex items-center space-x-2 cursor-pointer">
          <svg 
            :class="{ 'rotate-90': openSections.conception }" 
            class="w-4 h-4 transform transition-transform duration-200" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
          <h3 class="text-[14px] font-medium text-gray-900">{{ $t('accordions.accordionone') }}</h3>
        </div>
        <div class="flex items-center space-x-2">
          <!-- Tasdiqlangan holat ko'rsatish -->
          <div v-if="isConceptionApproved" class="flex items-center text-green-600 text-sm font-medium">
            <i class='bx bx-check-circle text-[18px] mr-1'></i>
            <span>Tasdiqlangan</span>
          </div>
          
          <!-- Tugmalar faqat tasdiqlanmagan holatda ko'rinadi -->
          <template v-else>
            <button 
              @click="showModal('revision')" 
              :disabled="!hasProjectConceptDocuments || filteredConceptionDocuments.length === 0"
              :class="{
                'bg-[#4A51DD] hover:bg-[#46497d]': hasProjectConceptDocuments && filteredConceptionDocuments.length > 0,
                'bg-gray-300 cursor-not-allowed': !hasProjectConceptDocuments || filteredConceptionDocuments.length === 0
              }"
              class="text-white px-3 py-1 text-sm rounded transition-colors flex items-center space-x-1"
            >
              <i class='bx bx-refresh text-[16px]'></i> 
              <span>{{ $t('buttons.forrevison') }}</span>
            </button>
            <button 
              @click="showModal('comment')"
              :disabled="!hasProjectConceptDocuments || filteredConceptionDocuments.length === 0"
              :class="{
                'bg-[#FD5656] hover:bg-[#c57575]': hasProjectConceptDocuments && filteredConceptionDocuments.length > 0,
                'bg-gray-300 cursor-not-allowed': !hasProjectConceptDocuments || filteredConceptionDocuments.length === 0
              }"
              class="text-white px-3 py-1 text-sm rounded transition-colors flex items-center space-x-1"
            >
              <span class="font-bold">!</span> 
              <span>{{ $t('buttons.comment') }}</span>
            </button>
            <button 
              @click="showModal('approve')"
              :disabled="!hasProjectConceptDocuments || filteredConceptionDocuments.length === 0"
              :class="{
                'bg-[#07A920] hover:bg-[#62a962]': hasProjectConceptDocuments && filteredConceptionDocuments.length > 0,
                'bg-gray-300 cursor-not-allowed': !hasProjectConceptDocuments || filteredConceptionDocuments.length === 0
              }"
              class="text-white px-3 py-1 text-sm rounded transition-colors flex items-center space-x-1"
            >
              <i class='bx bx-check-double text-[16px]'></i> 
              <span>{{ $t('buttons.approve') }}</span>
            </button>
          </template>
        </div>
      </div>
      
      <div 
        v-show="openSections.conception"
        class="pb-4 transition-all duration-300 ease-in-out"
      >
        <div class="space-y-2 px-4">
          <!-- Loading state -->
          <div v-if="loading" class="text-center py-4">
            <i class='bx bx-loader-alt bx-spin text-2xl text-blue-500'></i>
            <p class="text-sm text-gray-600 mt-2">Yuklanmoqda...</p>
          </div>
          
          <!-- Conception Items from API -->
          <div v-else-if="filteredConceptionDocuments.length > 0" class="space-y-4">
            <div v-for="(item, index) in filteredConceptionDocuments" :key="item.id" class="flex items-center justify-between h-20 border border-gray-300  bg-gray-100 rounded-lg space-y-4">
              <div class="flex items-center space-x-3 mt-4">
                <div class="w-8 h-20 bg-blue-500 text-white rounded-l-lg flex items-center justify-center font-bold text-sm">
                  {{ index + 1 }}
                </div>
                <div>
                  <p class="text-sm text-gray-700">{{ formatDate(new Date()) }}</p>
                  <p class="font-medium text-gray-700 text-sm">
                    {{ getDocumentTitle(item.type) }}
                  </p>
                </div>
              </div>
              <div class="flex items-center space-x-2 pr-4">
                <button 
                  @click="downloadFile(item.fileUrl, item.fileName)" 
                  class="bg-white px-8 py-2 rounded text-sm font-medium transition-colors flex items-center text-[#4A51DD] hover:bg-gray-50"
                  :disabled="!item.fileUrl"
                >
                  <i class='bx bxs-file-blank mr-[4px] text-[18px]'></i>
                  <span>{{ $t('downfile') }}</span>
                </button>
              </div>
            </div>
          </div>
          
          <!-- No data state -->
          <div v-else-if="!loading" class="text-center py-4 text-gray-500">
            <p>Ma'lumot topilmadi</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Technical Section -->
    <div class="bg-white rounded-[8px]" :class="{ 'opacity-50': !canAccessTechnical }">
      <div class="w-full flex items-center justify-between px-4 py-2 text-left transition-colors">
        <div 
          @click="canAccessTechnical && toggleSection('technical')" 
          class="flex items-center space-x-2"
          :class="{ 'cursor-pointer': canAccessTechnical, 'cursor-not-allowed': !canAccessTechnical }"
        >
          <svg 
            :class="{ 'rotate-90': openSections.technical }" 
            class="w-4 h-4 transform transition-transform duration-200" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
          <h3 class="font-medium text-gray-900 text-sm my-[8px]">{{ $t('accordions.accordiontwo') }}</h3>
          <span v-if="!isConceptionApproved" class="text-xs text-gray-500">(Konsepsiya tasdiqlanmagan)</span>
          <span v-else-if="!hasTechnicalDocuments" class="text-xs text-gray-500">(Ma'lumot yo'q)</span>
        </div>
        <div class="flex items-center space-x-2">
          <!-- Tasdiqlangan holat ko'rsatish -->
          <div v-if="isTechnicalApproved" class="flex items-center text-green-600 text-sm font-medium">
            <i class='bx bx-check-circle text-[18px] mr-1'></i>
            <span>Tasdiqlangan</span>
          </div>
          
          <!-- Tugmalar faqat tasdiqlanmagan holatda ko'rinadi -->
          <template v-else>
            <button 
              @click="showTechnicalModal('revision')" 
              :disabled="!canAccessTechnical || !hasTechnicalDocuments"
              :class="{
                'bg-[#4A51DD] hover:bg-[#46497d]': canAccessTechnical && hasTechnicalDocuments,
                'bg-gray-300 cursor-not-allowed': !canAccessTechnical || !hasTechnicalDocuments
              }"
              class="text-white px-3 py-1 text-sm rounded transition-colors flex items-center space-x-1"
            >
              <i class='bx bx-refresh text-[16px]'></i>
              <span>{{ $t('buttons.forrevison') }}</span>
            </button>
            <button 
              @click="showTechnicalModal('comment')"
              :disabled="!canAccessTechnical || !hasTechnicalDocuments"
              :class="{
                'bg-[#FD5656] hover:bg-[#c57575]': canAccessTechnical && hasTechnicalDocuments,
                'bg-gray-300 cursor-not-allowed': !canAccessTechnical || !hasTechnicalDocuments
              }"
              class="text-white px-3 py-1 text-sm rounded transition-colors flex items-center space-x-1"
            >
              <span class="font-bold">!</span>
              <span>{{ $t('buttons.comment') }}</span>
            </button>
            <button 
              @click="showTechnicalModal('approve')"
              :disabled="!canAccessTechnical || !hasTechnicalDocuments"
              :class="{
                'bg-[#07A920] hover:bg-[#62a962]': canAccessTechnical && hasTechnicalDocuments,
                'bg-gray-300 cursor-not-allowed': !canAccessTechnical || !hasTechnicalDocuments
              }"
              class="text-white px-3 py-1 text-sm rounded transition-colors flex items-center space-x-1"
            >
              <i class='bx bx-check-double text-[16px]'></i>
              <span>{{ $t('buttons.approve') }}</span>
            </button>
          </template>
        </div>
      </div>
      
      <div 
        v-show="openSections.technical && canAccessTechnical"
        class="pb-4 transition-all duration-300 ease-in-out"
      >
        <div class="space-y-2 px-4">
          <!-- Loading state -->
          <div v-if="loadingTechnical" class="text-center py-4">
            <i class='bx bx-loader-alt bx-spin text-2xl text-blue-500'></i>
            <p class="text-sm text-gray-600 mt-2">Yuklanmoqda...</p>
          </div>
          
          <!-- Technical Items from API -->
          <div v-else-if="filteredTechnicalDocuments.length > 0" class="space-y-4">
            <div v-for="(item, index) in filteredTechnicalDocuments" :key="item.id" class="flex items-center justify-between h-20 border border-gray-300 bg-gray-100 rounded-lg space-y-4">
              <div class="flex items-center space-x-3 mt-4">
                <div class="w-8 h-20 bg-blue-500 text-white rounded-l-lg flex items-center justify-center font-bold text-sm">
                  {{ index + 1 }}
                </div>
                <div>
                  <p class="text-sm text-gray-700">{{ formatDate(new Date()) }}</p>
                  <p class="font-medium text-gray-700 text-sm">
                    {{ getTechnicalDocumentTitle(item.type) }}
                  </p>
                </div>
              </div>
              <div class="flex items-center space-x-2 pr-4">
                <button 
                  @click="downloadFile(item.fileUrl, item.fileName)" 
                  class="bg-white px-8 py-2 rounded text-sm font-medium transition-colors flex items-center text-[#4A51DD] hover:bg-gray-50"
                  :disabled="!item.fileUrl"
                >
                  <i class='bx bxs-file-blank mr-[4px] text-[18px]'></i>
                  <span>{{ $t('downfile') }}</span>
                </button>
              </div>
            </div>
          </div>
          
          <!-- No data state -->
          <div v-else-if="!loadingTechnical" class="text-center py-4 text-gray-500">
            <p>Ma'lumot topilmadi</p>
          </div>
        </div>
      </div>
    </div>

    <!-- LBX Section -->
   <div class="bg-white rounded-[8px]" :class="{ 'opacity-50': !canAccessLBX }">
      <div class="w-full flex items-center justify-between px-4 py-2 text-left transition-colors">
        <div 
          @click="canAccessLBX && toggleSection('lbx')" 
          class="flex items-center space-x-2"
          :class="{ 'cursor-pointer': canAccessLBX, 'cursor-not-allowed': !canAccessLBX }"
        >
          <svg 
            :class="{ 'rotate-90': openSections.lbx }" 
            class="w-4 h-4 transform transition-transform duration-200" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
          <h3 class="font-medium text-gray-900 text-sm">{{ $t('accordions.accordionthree') }}</h3>
          <span v-if="!isTechnicalApproved" class="text-xs text-gray-500">(Texnik vazifa tasdiqlanmagan)</span>
          <span v-else-if="!hasLBXDocuments" class="text-xs text-gray-500">(Ma'lumot yo'q)</span>
        </div>
        <div class="flex items-center space-x-2">
          <button 
            @click="showModal('revision')" 
            :disabled="!canAccessLBX"
            :class="{
              'bg-[#4A51DD] hover:bg-[#46497d]': canAccessLBX,
              'bg-gray-300 cursor-not-allowed': !canAccessLBX
            }"
            class="text-white px-3 py-1 text-sm rounded transition-colors flex items-center space-x-1"
          >
            <i class='bx bx-refresh text-[16px]'></i>
            <span>{{ $t('buttons.forrevison') }}</span>
          </button>
          <button 
            @click="showModal('comment')"
            :disabled="!canAccessLBX"
            :class="{
              'bg-[#FD5656] hover:bg-[#c57575]': canAccessLBX,
              'bg-gray-300 cursor-not-allowed': !canAccessLBX
            }"
            class="text-white px-3 py-1 text-sm rounded transition-colors flex items-center space-x-1"
          >
            <span class="font-bold">!</span>
            <span>{{ $t('buttons.comment') }}</span>
          </button>
          <button 
            @click="showModal('approve')"
            :disabled="!canAccessLBX"
            :class="{
              'bg-[#07A920] hover:bg-[#62a962]': canAccessLBX,
              'bg-gray-300 cursor-not-allowed': !canAccessLBX
            }"
            class="text-white px-3 py-1 text-sm rounded transition-colors flex items-center space-x-1"
          >
            <i class='bx bx-check-double text-[16px]'></i>
            <span>{{ $t('buttons.approve') }}</span>
          </button>
        </div>
      </div>
      
      <div 
        v-show="openSections.lbx"
        class="pb-4 transition-all duration-300 ease-in-out"
      >
        <div class="space-y-2 px-4">
          <!-- LBX Items -->
          <div v-for="(item, index) in lbxItems" :key="item.key" class="flex items-center justify-between bg-[#F8F8F8] rounded-lg">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-16 bg-blue-500 text-white rounded-l-lg flex items-center justify-center font-bold text-sm">
                {{ index + 1 }}
              </div>
              <div>
                <p class="text-sm text-gray-700">{{ formatDate(new Date()) }}</p>
                <p class="font-medium text-sm text-gray-700">{{ $t(`${item.title}`) }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-2 pr-4">
              <button @click="downloadFile()" class="bg-white px-8 py-2 rounded text-sm font-medium transition-colors flex items-center text-[#4A51DD] hover:bg-gray-50">
                <i class='bx bxs-file-blank mr-[4px] text-[18px]'></i>
                <span>{{ $t('downfile') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- konsepsiya Modal -->
  <div v-if="openmodal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
    <div class="modal-content bg-gray-200 rounded-lg shadow-xl w-full max-w-[800px] text-black relative">
      <!-- Modal header -->
      <div class="bg-white border-b rounded-t-lg pl-4 border-gray-300 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <!-- Icon -->
          <i :class="modalConfig.icon" class="text-[20px]"></i>
          <p class="text-[15px] font-[700]" :class="modalConfig.titleColor">
            {{ modalConfig.title }}
          </p>
        </div>
        <button 
          @click="closeModal" 
          class="text-gray-700 text-[42px] hover:text-red-500 border-l border-gray-300 px-4 leading-none"
        >
          &times;
        </button>
      </div>

      <!-- Modal content -->
      <div class="bg-white p-4 m-4 rounded-md">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[12px] font-[500]" :class="modalConfig.titleColor">
              {{ modalConfig.title }}
            </p>
            <p class="text-[12px] text-gray-500">
              {{ formatDate(new Date()) }}
            </p>
          </div>
        </div>

        <form @submit.prevent="handleSubmitModal">
          <!-- Textarea -->
          <div class="my-4 border border-gray-300 rounded-md p-4">
            <textarea 
              v-model="formData.answare"
              :id="modalType + '_textarea'"
              cols="30" 
              rows="5" 
              class="w-full outline-none text-[14px] resize-none" 
              :placeholder="modalConfig.placeholder"
            ></textarea>
          </div>

          <!-- File upload section (faqat ko'rib chiqish va izoh berish uchun) -->
          <div v-if="modalType !== 'approve'" class="flex items-center space-x-2 pr-4">
            <input 
              type="file" 
              :id="modalType + '-file'"
              @change="handleFileUploadModal"
              class="hidden"
              accept=".pdf"
            />
            <label 
              :for="modalType + '-file'"
              :class="{
                'bg-blue-500 hover:bg-blue-600 text-white': fileState.uploaded,
                'bg-blue-400 hover:bg-blue-600 text-white': !fileState.uploaded
              }"
              class="flex items-center space-x-1 text-sm px-2 py-1 rounded transition-colors cursor-pointer"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 17a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 12a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 7a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V7z"/>
              </svg>
              <span>{{ fileState.uploaded ? fileState.fileName : 'Fayl biriktirish' }}</span>
            </label>
          </div>

          <!-- Action buttons -->
          <div class="flex items-center justify-center space-x-4 my-4">
            <!-- Submit button -->
            <button 
              type="submit" 
              :disabled="isSubmitting"
              :class="[
                modalConfig.buttonClass, 
                'py-2 text-white rounded-md font-medium', 
                modalType === 'approve' ? 'w-full' : 'w-[65%]',
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              ]"
            >
              <span v-if="!isSubmitting">{{ modalConfig.buttonText }}</span>
              <span v-else class="flex items-center justify-center">
                <i class='bx bx-loader-alt bx-spin mr-2'></i>
                Yuborilmoqda...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Technical Modal (konsepsiya modal dan alohida) -->
<div v-if="openTechnicalModal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
  <div class="modal-content bg-gray-200 rounded-lg shadow-xl w-full max-w-[800px] text-black relative">
    <!-- Modal header -->
    <div class="bg-white border-b rounded-t-lg pl-4 border-gray-300 flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <!-- Icon -->
        <i :class="technicalModalConfig.icon" class="text-[20px]"></i>
        <p class="text-[15px] font-[700]" :class="technicalModalConfig.titleColor">
          {{ technicalModalConfig.title }}
        </p>
      </div>
      <button 
        @click="closeTechnicalModal" 
        class="text-gray-700 text-[42px] hover:text-red-500 border-l border-gray-300 px-4 leading-none"
      >
        &times;
      </button>
    </div>

    <!-- Modal content -->
    <div class="bg-white p-4 m-4 rounded-md">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-[12px] font-[500]" :class="technicalModalConfig.titleColor">
            {{ technicalModalConfig.title }}
          </p>
          <p class="text-[12px] text-gray-500">
            {{ formatDate(new Date()) }}
          </p>
        </div>
      </div>

      <form @submit.prevent="handleSubmitTechnicalModal">
        <!-- Textarea -->
        <div class="my-4 border border-gray-300 rounded-md p-4">
          <textarea 
            v-model="technicalFormData.answare"
            :id="technicalModalType + '_textarea'"
            cols="30" 
            rows="5" 
            class="w-full outline-none text-[14px] resize-none" 
            :placeholder="technicalModalConfig.placeholder"
          ></textarea>
        </div>

        <!-- File upload section (faqat ko'rib chiqish va izoh berish uchun) -->
        <div v-if="technicalModalType !== 'approve'" class="flex items-center space-x-2 pr-4">
          <input 
            type="file" 
            :id="technicalModalType + '-file'"
            @change="handleTechnicalFileUpload"
            class="hidden"
            accept=".pdf"
          />
          <label 
            :for="technicalModalType + '-file'"
            :class="{
              'bg-blue-500 hover:bg-blue-600 text-white': technicalFileState.uploaded,
              'bg-blue-400 hover:bg-blue-600 text-white': !technicalFileState.uploaded
            }"
            class="flex items-center space-x-1 text-sm px-2 py-1 rounded transition-colors cursor-pointer"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 17a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 12a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 7a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V7z"/>
            </svg>
            <span>{{ technicalFileState.uploaded ? technicalFileState.fileName : 'Fayl biriktirish' }}</span>
          </label>
        </div>

        <!-- Action buttons -->
        <div class="flex items-center justify-center space-x-4 my-4">
          <!-- Submit button -->
          <button 
            type="submit" 
            :disabled="isTechnicalSubmitting"
            :class="[
              technicalModalConfig.buttonClass, 
              'py-2 text-white rounded-md font-medium', 
              technicalModalType === 'approve' ? 'w-full' : 'w-[65%]',
              isTechnicalSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            ]"
          >
            <span v-if="!isTechnicalSubmitting">{{ technicalModalConfig.buttonText }}</span>
            <span v-else class="flex items-center justify-center">
              <i class='bx bx-loader-alt bx-spin mr-2'></i>
              Yuborilmoqda...
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import "vue3-toastify/dist/index.css";
import { toast } from 'vue3-toastify';
import axios from 'axios';

// Modal holatlari
const openmodal = ref(false);
const modalType = ref('');
const isSubmitting = ref(false);

const openTechnicalModal = ref(false);
const technicalModalType = ref('');
const isTechnicalSubmitting = ref(false);

// Loading states
const loading = ref(false);
const loadingTechnical = ref(false);

// Technical file upload holati
const technicalFileState = reactive({
  uploaded: false,
  fileName: '',
  file: null
});

// Form data
const formData = reactive({
  answare: ''
});

// Technical form data
const technicalFormData = reactive({
  answare: ''
});

// File upload holati
const fileState = reactive({
  uploaded: false,
  fileName: '',
  file: null
});

// Accordion holatlari
const openSections = reactive({
  conception: true,
  technical: false,
  lbx: false
});

// Project data
const projectData = ref(null);
const filesData = ref(null);
const error = ref('');

// technical items
const technicalDocuments = ref([]);

// API dan kelgan hujjatlar
const conceptionDocuments = ref([]);

// LBX items
const lbxItems = ref([
  { key: 'lbx1', title: 'lbx.accone' },
  { key: 'lbx2', title: 'lbx.acctwo' },
  { key: 'lbx3', title: 'lbx.accthree' },
  { key: 'lbx4', title: 'lbx.accfour' }
]);

// Cache
const filesCache = ref(null);
const filesCacheTime = ref(null);
const CACHE_DURATION = 5 * 60 * 1000; // 5 daqiqa

// Computed properties
const isConceptionApproved = computed(() => {
  if (!projectData.value?.project_documents) return false;
  
  const projectConceptDoc = projectData.value.project_documents.find(
    doc => doc.type === 'PROJECT_CONCEPT'
  );
  
  return projectConceptDoc?.status === 'ACCEPTED';
});

const hasTechnicalDocuments = computed(() => {
  if (!projectData.value?.project_documents) return false;
  
  const technicalDoc = projectData.value.project_documents.find(
    doc => doc.type === 'PROJECT_TS'
  );
  
  return technicalDoc && technicalDoc.documents && technicalDoc.documents.length > 0;
});

const hasLBXDocuments = computed(() => {
  // LBX hujjatlar mavjudligini tekshirish
  return false; // Hozircha false
});

const canAccessTechnical = computed(() => {
  return isConceptionApproved.value;
});

const canAccessLBX = computed(() => {
  return isTechnicalApproved.value && hasLBXDocuments.value;
});

// PROJECT_CONCEPT tipidagi hujjatlar mavjudligini tekshirish
const hasProjectConceptDocuments = computed(() => {
  if (!projectData.value || !projectData.value.project_documents) {
    return false;
  }
  
  const projectConceptDoc = projectData.value.project_documents.find(
    doc => doc.type === 'PROJECT_CONCEPT'
  );
  
  return projectConceptDoc && projectConceptDoc.documents && projectConceptDoc.documents.length > 0;
});

const isTechnicalApproved = computed(() => {
  if (!projectData.value?.project_documents) return false;
  
  const technicalDoc = projectData.value.project_documents.find(
    doc => doc.type === 'PROJECT_TS'
  );
  
  return technicalDoc?.status === 'ACCEPTED';
});

const filteredTechnicalDocuments = computed(() => {
  if (!technicalDocuments.value || technicalDocuments.value.length === 0) {
    return [];
  }
  
  const selectedProject = getSelectedProject();
  if (!selectedProject || !selectedProject.id) {
    return [];
  }
  
  return technicalDocuments.value;
});

// Technical modal konfiguratsiyasi
const technicalModalConfig = computed(() => {
  const configs = {
    revision: {
      title: "Ko'rib chiqish uchun yuborish (Texnik)",
      titleColor: 'text-[#4A51DD]',
      icon: 'bx bx-refresh text-[#4A51DD]',
      placeholder: "Texnik vazifa bo'yicha ko'rib chiqish uchun izoh yozing...",
      buttonText: "Ko'rib chiqish uchun yuborish",
      buttonClass: 'bg-[#4A51DD] hover:bg-[#3A41CD]'
    },
    comment: {
      title: "Izoh yuborish (Texnik)",
      titleColor: 'text-[#FF4444]',
      icon: 'bx bx-message-square-error text-[#FF4444]',
      placeholder: "Texnik vazifa bo'yicha izohingizni yozing...",
      buttonText: "Izoh yuborish",
      buttonClass: 'bg-[#FF4444] hover:bg-[#EE3333]'
    },
    approve: {
      title: "Tasdiqlash (Texnik)",
      titleColor: 'text-[#07A920]',
      icon: 'bx bx-check-circle text-[#07A920]',
      placeholder: "Texnik vazifa tasdiqlash izohi (ixtiyoriy)...",
      buttonText: "Tasdiqlash",
      buttonClass: 'bg-[#07A920] hover:bg-[#069A1E]'
    }
  };
  return configs[technicalModalType.value] || configs.revision;
});


// Technical modal funktsiyalari
const showTechnicalModal = (type) => {
  if (!canAccessTechnical.value) {
    toast.warning('Avval konsepsiya tasdiqlanishi kerak!', { autoClose: 2000 });
    return;
  }
  
  if (!hasTechnicalDocuments.value) {
    toast.warning('PROJECT_TS tipidagi hujjatlar topilmadi!', { autoClose: 2000 });
    return;
  }
  
  technicalModalType.value = type;
  openTechnicalModal.value = true;
  resetTechnicalForm();
};

const closeTechnicalModal = () => {
  openTechnicalModal.value = false;
  technicalModalType.value = '';
  resetTechnicalForm();
};

const resetTechnicalForm = () => {
  technicalFormData.answare = '';
  Object.assign(technicalFileState, {
    uploaded: false,
    fileName: '',
    file: null
  });
};

// Technical fayl yuklash
const handleTechnicalFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    technicalFileState.uploaded = true;
    technicalFileState.fileName = file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name;
    technicalFileState.file = file;
  }
};

// Technical form yuborish
const handleSubmitTechnicalModal = async () => {
  if (!technicalFormData.answare || !technicalFormData.answare.trim()) {
    toast.error('Iltimos, javob kiriting!', { autoClose: 1500 });
    return;
  }

  isTechnicalSubmitting.value = true;
  let loadingToastId = null;
  
  try {
    // Loading toast ko'rsatish
    loadingToastId = toast.info('Ma\'lumot yuborilmoqda...', {
      autoClose: false,
      closeButton: false
    });

    let fileId = null;

    // 1. Agar fayl yuklangan bo'lsa, avval faylni serverga yuklash
    if (technicalFileState.file && technicalModalType.value !== 'approve') {
      fileId = await uploadFileToServer(technicalFileState.file);
      if (!fileId) {
        if (loadingToastId) toast.remove(loadingToastId);
        toast.error('Faylni yuklashda xatolik!', { autoClose: 2000 });
        isTechnicalSubmitting.value = false;
        return;
      }
    }

    // 2. Type ni aniqlash
    const typeMap = {
      'revision': 'TO_REVIEW',
      'comment': 'REJECTED',
      'approve': 'ACCEPTED'
    };
    const answerType = typeMap[technicalModalType.value];

    // 3. PROJECT_TS tipidagi hujjatni olish
    const technicalDoc = projectData.value?.project_documents?.find(
      doc => doc.type === 'PROJECT_TS'
    );

    if (!technicalDoc) {
      if (loadingToastId) toast.remove(loadingToastId);
      toast.error('PROJECT_TS hujjati topilmadi!', { autoClose: 2000 });
      isTechnicalSubmitting.value = false;
      return;
    }

    // 4. Birinchi document ni olish
    const firstDocument = technicalDoc.documents?.[0];
    if (!firstDocument) {
      if (loadingToastId) toast.remove(loadingToastId);
      toast.error('Texnik hujjat topilmadi!', { autoClose: 2000 });
      isTechnicalSubmitting.value = false;
      return;
    }

    // 5. Javobni yuborish
    const answerData = {
      project_document_id: technicalDoc.id,
      documents_id: firstDocument.id,
      answer: technicalFormData.answare,
      type: answerType
    };

    // Agar fayl ID mavjud bo'lsa, qo'shish
    if (fileId) {
      answerData.file_id = fileId;
    }

    await sendAnswer(answerData);

    // Loading toast ni yopish
    if (loadingToastId) toast.remove(loadingToastId);
    
    toast.success(`${technicalModalConfig.value.title} muvaffaqiyatli yuborildi!`, {
      autoClose: 2000
    });

    closeTechnicalModal();
    
    // Ma'lumotlarni yangilash
    await fetchFilesConsep();

    if (technicalModalType.value === 'approve') {
      // Technical document status ni yangilash
      if (projectData.value?.project_documents) {
        const technicalDoc = projectData.value.project_documents.find(
          doc => doc.type === 'PROJECT_TS'
        );
        if (technicalDoc) {
          technicalDoc.status = 'ACCEPTED';
        }
      }
    }

  } catch (error) {
    // Loading toast ni yopish
    if (loadingToastId) toast.remove(loadingToastId);
    
    console.error('Technical javob yuborishda xato:', error);
    toast.error('Xatolik yuz berdi!', { autoClose: 2000 });
  } finally {
    isTechnicalSubmitting.value = false;
  }
};


// SessionStorage'dagi selectMinistry bilan moslikni tekshirish
const filteredConceptionDocuments = computed(() => {
  if (!conceptionDocuments.value || conceptionDocuments.value.length === 0) {
    return [];
  }
  
  const selectedProject = getSelectedProject();
  if (!selectedProject || !selectedProject.id) {
    return [];
  }
  
  return conceptionDocuments.value;
});

// Sana formatlash funktsiyasi
const formatDate = (date) => {
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

// Hujjat tipiga qarab nomni olish
const getDocumentTitle = (type) => {
  const titles = {
    'LETTER': 'Taklif xati',
    'CONCEPT_PROJECT': 'Konsepsiya loyihasi',
    'PROTOCOL': 'Bayonnoma',
    'SOLUTION': 'Yechim'
  };
  return titles[type] || type;
};

// Technical hujjat tipiga qarab nomni olish
const getTechnicalDocumentTitle = (type) => {
  const titles = {
    'TECHNICAL_TASK': 'Texnik topshiriq',
    'TECHNICAL_PROJECT': 'Texnik loyiha',
    'TECHNICAL_SPEC': 'Texnik spetsifikatsiya',
    'TECHNICAL_DOC': 'Texnik hujjat'
  };
  return titles[type] || type;
};

// Modal konfiguratsiyasi
const modalConfig = computed(() => {
  const configs = {
    revision: {
      title: "Ko'rib chiqish uchun yuborish",
      titleColor: 'text-[#4A51DD]',
      icon: 'bx bx-refresh text-[#4A51DD]',
      placeholder: "Ko'rib chiqish uchun izoh yozing...",
      buttonText: "Ko'rib chiqish uchun yuborish",
      buttonClass: 'bg-[#4A51DD] hover:bg-[#3A41CD]'
    },
    comment: {
      title: "Izoh yuborish",
      titleColor: 'text-[#FF4444]',
      icon: 'bx bx-message-square-error text-[#FF4444]',
      placeholder: "Izohingizni yozing...",
      buttonText: "Izoh yuborish",
      buttonClass: 'bg-[#FF4444] hover:bg-[#EE3333]'
    },
    approve: {
      title: "Tasdiqlash",
      titleColor: 'text-[#07A920]',
      icon: 'bx bx-check-circle text-[#07A920]',
      placeholder: "Tasdiqlash izohi (ixtiyoriy)...",
      buttonText: "Tasdiqlash",
      buttonClass: 'bg-[#07A920] hover:bg-[#069A1E]'
    }
  };
  return configs[modalType.value] || configs.revision;
});

// Selected project ni olish
const getSelectedProject = () => {
  try {
    const savedProject = sessionStorage.getItem('selectMinistry');
    if (savedProject) {
      return JSON.parse(savedProject);
    }
    return null;
  } catch (error) {
    console.error('SessionStorage dan ma\'lumot olishda xato:', error);
    return null;
  }
};

// Modal funktsiyalari
const showModal = (type) => {
  const showModal = (type) => {
  if (!hasProjectConceptDocuments.value || filteredConceptionDocuments.value.length === 0) {
    toast.warning('Hujjatlar mavjud emas!', { autoClose: 2000 });
    return;
  }
  
  modalType.value = type;
  openmodal.value = true;
  resetForm();
};
};

const closeModal = () => {
  openmodal.value = false;
  modalType.value = '';
  resetForm();
};

const resetForm = () => {
  formData.answare = '';
  Object.assign(fileState, {
    uploaded: false,
    fileName: '',
    file: null
  });
};

// Fayl yuklash - modal uchun
const handleFileUploadModal = (event) => {
  const file = event.target.files[0];
  if (file) {
    fileState.uploaded = true;
    fileState.fileName = file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name;
    fileState.file = file;
  }
};

// YANGI: Faylni serverga yuklash funktsiyasi
const uploadFileToServer = async (file) => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('Token topilmadi');
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post('https://back.miit.uz/api/bisap/test/files/create', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log('Fayl yuklash javobi:', response.data);

    if (response.data && response.data.data && response.data.data.id) {
      return response.data.data.id;
    }
    
    throw new Error('Fayl ID si topilmadi');
  } catch (error) {
    console.error('Faylni yuklashda xato:', error);
    throw error;
  }
};

// YANGI: Javobni yuborish funktsiyasi
const sendAnswer = async (answerData) => {
  console.log('Javob yuborish ma\'lumotlari:', answerData);
  const token = sessionStorage.getItem('token');
  if (!token) {
    throw new Error('Token topilmadi');
  }

  try {
    const response = await axios.post('https://back.miit.uz/api/bisap/test/answers/create', answerData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Javob yuborish natijasi:', response.data);
    return response.data;
  } catch (error) {
    console.error('Javob yuborishda xato:', error);
    throw error;
  }
};

// YANGILANGAN: Form yuborish funktsiyasi
const handleSubmitModal = async () => {
  if (!formData.answare || !formData.answare.trim()) {
    toast.error('Iltimos, javob kiriting!', { autoClose: 1500 });
    return;
  }

  isSubmitting.value = true;
  let loadingToastId = null;
  
  try {
    // Loading toast ko'rsatish
    loadingToastId = toast.info('Ma\'lumot yuborilmoqda...', {
      autoClose: false,
      closeButton: false
    });

    let fileId = null;

    // 1. Agar fayl yuklangan bo'lsa, avval faylni serverga yuklash
    if (fileState.file && modalType.value !== 'approve') {
      fileId = await uploadFileToServer(fileState.file);
      if (!fileId) {
        if (loadingToastId) toast.remove(loadingToastId);
        toast.error('Faylni yuklashda xatolik!', { autoClose: 2000 });
        isSubmitting.value = false;
        return;
      }
    }

    // 2. Type ni aniqlash
    const typeMap = {
      'revision': 'TO_REVIEW',
      'comment': 'REJECTED',
      'approve': 'ACCEPTED'
    };
    const answerType = typeMap[modalType.value];

    // 3. PROJECT_CONCEPT tipidagi birinchi hujjatni olish
    const projectConceptDoc = projectData.value?.project_documents?.find(
      doc => doc.type === 'PROJECT_CONCEPT'
    );

    if (!projectConceptDoc) {
      if (loadingToastId) toast.remove(loadingToastId);
      toast.error('PROJECT_CONCEPT hujjati topilmadi!', { autoClose: 2000 });
      isSubmitting.value = false;
      return;
    }

    // 4. Birinchi document ni olish
    const firstDocument = projectConceptDoc.documents?.[0];
    if (!firstDocument) {
      if (loadingToastId) toast.remove(loadingToastId);
      toast.error('Hujjat topilmadi!', { autoClose: 2000 });
      isSubmitting.value = false;
      return;
    }

    // 5. Javobni yuborish
    const answerData = {
      project_document_id: projectConceptDoc.id,
      documents_id: firstDocument.id,
      answer: formData.answare,
      type: answerType
    };

    // Agar fayl ID mavjud bo'lsa, qo'shish
    if (fileId) {
      answerData.file_id = fileId;
    }

    await sendAnswer(answerData);

    // Loading toast ni yopish
    if (loadingToastId) toast.remove(loadingToastId);
    
    toast.success(`${modalConfig.value.title} muvaffaqiyatli yuborildi!`, {
      autoClose: 2000
    });

    closeModal();
    
    // Ma'lumotlarni yangilash
    await fetchFilesConsep();

    if (modalType.value === 'approve') {
      // Project document status ni yangilash
      if (projectData.value?.project_documents) {
        const projectConceptDoc = projectData.value.project_documents.find(
          doc => doc.type === 'PROJECT_CONCEPT'
        );
        if (projectConceptDoc) {
          projectConceptDoc.status = 'ACCEPTED';
        }
      }
    }

  } catch (error) {
    // Loading toast ni yopish
    if (loadingToastId) toast.remove(loadingToastId);
    
    console.error('Javob yuborishda xato:', error);
    toast.error('Xatolik yuz berdi!', { autoClose: 2000 });
  } finally {
    isSubmitting.value = false;
  }
};

// Accordion section ochish/yopish
const toggleSection = (section) => {
  // Technical sectionni ochishdan oldin tekshirish
  if (section === 'technical' && !canAccessTechnical.value) {
    toast.warning('Avval konsepsiya tasdiqlanishi kerak!', { autoClose: 2000 });
    return;
  }
  
  openSections[section] = !openSections[section];
};

// Fayl yuklash - asosiy funktsiya
const downloadFile = async (fileUrl, fileName) => {
  console.log('Download bosdi, fileUrl:', fileUrl, 'fileName:', fileName);
  
  if (!fileUrl) {
    console.error('Fayl URL manzili yo\'q');
    toast.error('Fayl URL manzili topilmadi!', { autoClose: 1500 });
    return;
  }

  try {
    toast.info('Fayl yuklanmoqda...', { autoClose: 1000 });
    
    window.open(fileUrl, '_blank');
    
    setTimeout(() => {
      toast.success('Fayl muvaffaqiyatli yuklandi!', {
        autoClose: 1000
      });
    }, 1000);
  } catch (error) {
    console.error("Fayl yuklashda xato:", error);
    toast.error('Fayl yuklashda xatolik yuz berdi!', {
      autoClose: 1000
    });
  }
};

// Fayllar ro'yxatini olish (optimallashtirilgan)
const fetchFilesList = async () => {
  console.log('FetchFilesList ishlayapti');
  
  // Cache ni tekshirish
  if (filesCache.value && filesCacheTime.value) {
    const now = new Date().getTime();
    if (now - filesCacheTime.value < CACHE_DURATION) {
      console.log('Fayllar cache dan olindi');
      return filesCache.value;
    }
  }

  const token = sessionStorage.getItem('token');
  if (!token) {
    console.error('Token topilmadi');
    return null;
  }

  try {
    console.log('Fayllar ro\'yxatini API dan olish...');
    const response = await axios.get('https://back.miit.uz/api/bisap/test/files/list', {
      params: {
        page: 1,
        limit: 100000
      },
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Files API response:', response.data);

    if (response.data && response.data.data && response.data.data.results) {
      filesCache.value = response.data.data.results;
      filesCacheTime.value = new Date().getTime();
      console.log('Fayllar soni:', response.data.data.results.length);
      return response.data.data.results;
    }
    return null;
  } catch (error) {
    console.error('Fayllar ro\'yxatini olishda xato:', error);
    return null;
  }
};

// Fayl ID orqali fayl ma'lumotini olish
const getFileById = (fileId, filesList) => {
  if (!filesList || !Array.isArray(filesList)) return null;
  return filesList.find(file => file.id === fileId);
};

// Conception hujjatlarini qayta ishlash
const processConceptionDocuments = async () => {
  console.log('ProcessConceptionDocuments ishlayapti');
  
  if (!projectData.value) {
    console.log('ProjectData yo\'q');
    return;
  }

  const projectConceptDoc = projectData.value.project_documents?.find(
    doc => doc.type === 'PROJECT_CONCEPT'
  );

  console.log('ProjectConceptDoc2025:', projectConceptDoc);
  // sessionStorage.setItem('selectstatus', projectConceptDoc.status);

  if (!projectConceptDoc || !projectConceptDoc.documents) {
    console.log('PROJECT_CONCEPT tipidagi hujjatlar topilmadi');
    conceptionDocuments.value = [];
    return;
  }

  const filesList = await fetchFilesList();
  
  console.log('Fayllar ro\'yxati:', filesList);
  
  if (!filesList) {
    console.log('Fayllar ro\'yxati olinmadi');
    conceptionDocuments.value = [];
    return;
  }

  const selectedProject = getSelectedProject();
  
  const processedDocuments = projectConceptDoc.documents.map(doc => {
    const fileInfo = getFileById(doc.file_id, filesList);
    console.log(`File ID: ${doc.file_id}, File Info:`, fileInfo);
    
    return {
      id: doc.id,
      type: doc.type,
      file_id: doc.file_id,
      fileUrl: fileInfo?.url || null,
      fileName: fileInfo?.name || 'Nomsiz fayl',
      projectId: doc.project_id || projectData.value.id
    };
  });

  conceptionDocuments.value = processedDocuments;

  console.log('Conception hujjatlari tayyor:', conceptionDocuments.value);
};

// Oxirgi yuklangan project ID ni saqlash
const lastLoadedProjectId = ref(null);
let intervalId = null;

const fetchFilesConsep = async () => {
  if (loading.value) {
    console.log('Ma\'lumot yuklanish jarayonida, kutib turing...');
    return null;
  }

  const token = sessionStorage.getItem('token');
  
  if (!token) {
    error.value = 'Token topilmadi';
    toast.error('Token topilmadi!', { autoClose: 2000 });
    return null;
  }

  const selectedProject = getSelectedProject();
  
  if (!selectedProject || !selectedProject.id) {
    error.value = 'Loyiha tanlanmagan';
    toast.error('Loyiha tanlanmagan!', { autoClose: 2000 });
    return null;
  }

  if (lastLoadedProjectId.value === selectedProject.id && projectData.value) {
    console.log('Bu project uchun ma\'lumot allaqachon yuklangan');
    await processConceptionDocuments();
    await processTechnicalDocuments();
    return projectData.value;
  }

  loading.value = true;
  error.value = '';

  try {
    console.log('Project ID:', selectedProject.id);
    
    const response = await axios.get(`https://back.miit.uz/api/bisap/test/project/${selectedProject.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    console.log('API javobi:', response.data);
    
    if (!response.data || !response.data.data) {
      throw new Error('Project ma\'lumotlari topilmadi');
    }
    
    projectData.value = response.data.data;
    lastLoadedProjectId.value = selectedProject.id;
    
    await processConceptionDocuments();
    await processTechnicalDocuments();
    
    if (!hasProjectConceptDocuments.value) {
      toast.info('Hujjatlar mavjud emas', { autoClose: 2000 });
    } else {
      toast.success('Ma\'lumotlar muvaffaqiyatli olindi!', { autoClose: 1000 });
    }
    
    return response.data;
    
  } catch (error) {
    console.error("Ma'lumotlarni olishda xato:", error);
    
    if (error.response) {
      console.error('Server xatosi:', error.response.status, error.response.data);
      error.value = `Server xatosi: ${error.response.status}`;
      toast.error(`Server xatosi: ${error.response.status}`, { autoClose: 2000 });
    } else if (error.request) {
      console.error('Tarmoq xatosi:', error.request);
      error.value = 'Tarmoq xatosi';
      toast.error('Tarmoq xatosi!', { autoClose: 2000 });
    } else {
      console.error('Xato:', error.message);
      error.value = error.message;
      toast.error('Xatolik yuz berdi!', { autoClose: 2000 });
    }
    
    return null;
  } finally {
    loading.value = false;
  }
};

// Loyiha ma'lumotlarini kuzatish (optimallashtirilgan)
const processTechnicalDocuments = async () => {
  console.log('ProcessTechnicalDocuments ishlayapti');
  
  if (!projectData.value) {
    console.log('ProjectData yo\'q');
    return;
  }

  const technicalDoc = projectData.value.project_documents?.find(
    doc => doc.type === 'PROJECT_TS'
  );

  console.log('TechnicalDoc:', technicalDoc);

  if (!technicalDoc || !technicalDoc.documents) {
    console.log('PROJECT_TS tipidagi hujjatlar topilmadi');
    technicalDocuments.value = [];
    return;
  }

  loadingTechnical.value = true;

  try {
    const filesList = await fetchFilesList();
    
    console.log('Technical uchun fayllar ro\'yxati:', filesList);
    
    if (!filesList) {
      console.log('Fayllar ro\'yxati olinmadi');
      technicalDocuments.value = [];
      return;
    }

    const processedDocuments = technicalDoc.documents.map(doc => {
      const fileInfo = getFileById(doc.file_id, filesList);
      console.log(`Technical File ID: ${doc.file_id}, File Info:`, fileInfo);
      
      return {
        id: doc.id,
        type: doc.type,
        file_id: doc.file_id,
        fileUrl: fileInfo?.url || null,
        fileName: fileInfo?.name || 'Nomsiz fayl',
        projectId: doc.project_id || projectData.value.id
      };
    });

    technicalDocuments.value = processedDocuments;

    console.log('Technical hujjatlari tayyor:', technicalDocuments.value);
  } finally {
    loadingTechnical.value = false;
  }
};

const watchSelectedProject = () => {
  if (intervalId) {
    clearInterval(intervalId);
  }
  
  intervalId = setInterval(() => {
    const currentProject = getSelectedProject();
    
    if (!currentProject || !currentProject.id) {
      return;
    }
    
    if (currentProject.id !== lastLoadedProjectId.value) {
      console.log('Yangi loyiha tanlandi:', currentProject.id);
      console.log('Oldingi ID:', lastLoadedProjectId.value);
      fetchFilesConsep();
    }
  }, 3000);
};

// Interval ni tozalash
const clearProjectWatcher = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

onMounted(async () => {
  console.log('AccordionMode yuklandi');
  
  const selectedProject = getSelectedProject();
  if (selectedProject && selectedProject.id) {
    lastLoadedProjectId.value = selectedProject.id;
    await fetchFilesConsep();
  }
  
  watchSelectedProject();
});

onUnmounted(() => {
  clearProjectWatcher();
});

// Component properties ni expose qilish
defineExpose({
  fetchFilesConsep,
  projectData,
  filesData,
  conceptionDocuments,
  technicalDocuments,
  loading,
  loadingTechnical,
  error
});
</script>