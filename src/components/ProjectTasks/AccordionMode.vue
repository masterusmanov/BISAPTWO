<!-- AccordionMode.vue -->
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
          <div v-if="isConceptionToReview" class="flex items-center text-orange-600 text-sm font-medium mr-2">
              <i class='bx bx-time-five text-[18px] mr-1'></i>
              <span>Qayta yuborildi</span>
            </div>
        </div>
        <div class="flex items-center space-x-2">

          <!-- Ish tarixi tugmasi - faqat tasdiqlanganda ko'rinadi v-if="isConceptionApproved"-->
          <button 
            @click="openHistoryModal('conception')"
            class="px-3 py-1 text-sm rounded transition-colors bg-[#F8F8F8] text-[#794A9A] font-bold hover:bg-gray-300"
          >
            <i class='bx bxs-briefcase-alt-2'></i> Ish tarixi
          </button>
          
          <!-- Tasdiqlangan holat ko'rsatish -->
          <div v-if="isConceptionApproved" class="flex items-center text-green-600 text-sm font-medium">
            <i class='bx bx-check-circle text-[18px] mr-1'></i>
            <span>Tasdiqlangan</span>
          </div>
          
          <!-- Tugmalar faqat tasdiqlanmagan holatda ko'rinadi -->
          <template v-else>
            <button 
              @click="showModal('revision')" 
              :disabled="isConceptionRevisionDisabled"
              :class="{
                'bg-[#4A51DD] hover:bg-[#46497d]': !isConceptionRevisionDisabled,
                'bg-gray-300 cursor-not-allowed': isConceptionRevisionDisabled
              }"
              class="text-white px-3 py-1 text-sm rounded transition-colors flex items-center space-x-1"
            >
              <i class='bx bx-refresh text-[16px]'></i> 
              <span>{{ $t('buttons.forrevison') }}</span>
            </button>
            <button 
              @click="showModal('comment')"
              :disabled="isConceptionCommentDisabled"
              :class="{
                'bg-[#FD5656] hover:bg-[#c57575]': !isConceptionCommentDisabled,
                'bg-gray-300 cursor-not-allowed': isConceptionCommentDisabled
              }"
              class="text-white px-3 py-1 text-sm rounded transition-colors flex items-center space-x-1"
            >
              <span class="font-bold">!</span> 
              <span>{{ $t('buttons.comment') }}</span>
            </button>
            <button 
              @click="showModal('approve')"
              :disabled="isConceptionApproveDisabled"
              :class="{
                'bg-[#07A920] hover:bg-[#62a962]': !isConceptionApproveDisabled,
                'bg-gray-300 cursor-not-allowed': isConceptionApproveDisabled
              }"
              class="text-white px-3 py-1 text-sm rounded transition-colors flex items-center space-x-1"
            >
              <i class='bx bx-check-double text-[16px]'></i> 
              <span>{{ $t('buttons.approve') }}</span>
            </button>
            <button 
              @click.stop="manualRefresh" 
              :disabled="loading"
              class="ml-2 p-1 text-white bg-blue-500 flex items-center hover:bg-blue-600 transition-colors rounded"
              title="Ma'lumotlarni yangilash"
            >
              <i :class="{ 'bx-spin': loading }" class='bx bx-refresh text-[16px]'></i>
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
                  <p class="text-sm text-gray-700">{{ item.date_time }}</p>
                  <p class="font-medium text-gray-700 text-sm">
                    <!-- {{ getDocumentTitle(item.filename) }} -->
                      {{ item.fileName }}
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
<div class="bg-white border-b border-gray-200 rounded-[8px]" :class="{ 'opacity-50': !canAccessTechnical }">
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
      <h3 class="text-[14px] font-medium text-gray-900">{{ $t('accordions.accordiontwo') }}</h3>
      <div v-if="isTechnicalToReview" class="flex items-center text-orange-600 text-sm font-medium mr-2">
        <i class='bx bx-time-five text-[18px] mr-1'></i>
        <span>Qayta yuborildi</span>
      </div>
      <span v-if="!isConceptionApproved" class="text-xs text-gray-500">(Konsepsiya tasdiqlanmagan)</span>
      <span v-else-if="!hasTechnicalDocuments" class="text-xs text-gray-500">(Ma'lumot yo'q)</span>
    </div>
    <div class="flex items-center space-x-2">

      <!-- Ish tarixi tugmasi - faqat tasdiqlanganda ko'rinadi v-if="isTechnicalApproved"-->
      <button 
        @click="openHistoryModal('technical')"
        class="px-3 py-1 text-sm rounded transition-colors bg-[#F8F8F8] text-[#794A9A] font-bold hover:bg-gray-300"
      >
        <i class='bx bxs-briefcase-alt-2'></i> Ish tarixi
      </button>

      <!-- Tasdiqlangan holat ko'rsatish -->
      <div v-if="isTechnicalApproved" class="flex items-center text-green-600 text-sm font-medium">
        <i class='bx bx-check-circle text-[18px] mr-1'></i>
        <span>Tasdiqlangan</span>
      </div>
      
      <!-- Tugmalar faqat tasdiqlanmagan holatda ko'rinadi -->
      <template v-else>
        <button 
          @click="showTechnicalModal('revision')" 
          :disabled="isTechnicalRevisionDisabled"
          :class="{
            'bg-[#4A51DD] hover:bg-[#46497d]': !isTechnicalRevisionDisabled,
            'bg-gray-300 cursor-not-allowed': isTechnicalRevisionDisabled
          }"
          class="text-white px-3 py-1 text-sm rounded transition-colors flex items-center space-x-1"
        >
          <i class='bx bx-refresh text-[16px]'></i>
          <span>{{ $t('buttons.forrevison') }}</span>
        </button>
        <button 
          @click="showTechnicalModal('comment')"
          :disabled="isTechnicalCommentDisabled"
          :class="{
            'bg-[#FD5656] hover:bg-[#c57575]': !isTechnicalCommentDisabled,
            'bg-gray-300 cursor-not-allowed': isTechnicalCommentDisabled
          }"
          class="text-white px-3 py-1 text-sm rounded transition-colors flex items-center space-x-1"
        >
          <span class="font-bold">!</span>
          <span>{{ $t('buttons.comment') }}</span>
        </button>
        <button 
          @click="showTechnicalModal('approve')"
          :disabled="isTechnicalApproveDisabled"
          :class="{
            'bg-[#07A920] hover:bg-[#62a962]': !isTechnicalApproveDisabled,
            'bg-gray-300 cursor-not-allowed': isTechnicalApproveDisabled
          }"
          class="text-white px-3 py-1 text-sm rounded transition-colors flex items-center space-x-1"
        >
          <i class='bx bx-check-double text-[16px]'></i>
          <span>{{ $t('buttons.approve') }}</span>
        </button>
        <button 
          @click.stop="manualRefresh" 
          :disabled="loadingTechnical"
          class="ml-2 p-1 text-white bg-blue-500 flex items-center hover:bg-blue-600 transition-colors rounded"
          title="Ma'lumotlarni yangilash"
        >
          <i :class="{ 'bx-spin': loadingTechnical }" class='bx bx-refresh text-[16px]'></i>
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
              <p class="text-sm text-gray-700">{{ item.created_at }}</p>
              <p class="font-medium text-gray-700 text-sm">
                {{ item.fileName }}
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
      <div v-if="isLBXToReview" class="flex items-center text-orange-600 text-sm font-medium mr-2">
        <i class='bx bx-time-five text-[18px] mr-1'></i>
        <span>Qayta yuborildi</span>
      </div>
      <span v-if="!isTechnicalApproved" class="text-xs text-gray-500">(Texnik vazifa tasdiqlanmagan)</span>
      <span v-else-if="!hasLBXDocuments" class="text-xs text-gray-500">(Ma'lumot yo'q)</span>
    </div>
    <div class="flex items-center space-x-2">

      <!-- Ish tarixi tugmasi - faqat tasdiqlanganda ko'rinadi v-if="isLBXApproved"-->
      <button 
        @click="openHistoryModal('lbx')"
        class="px-3 py-1 text-sm rounded transition-colors bg-[#F8F8F8] text-[#794A9A] font-bold hover:bg-gray-300"
      >
        <i class='bx bxs-briefcase-alt-2'></i> Ish tarixi
      </button>

      <!-- Tasdiqlangan holat ko'rsatish -->
      <div v-if="isLBXApproved" class="flex items-center text-green-600 text-sm font-medium">
        <i class='bx bx-check-circle text-[18px] mr-1'></i>
        <span>Tasdiqlangan</span>
      </div>
      
      <!-- Tugmalar faqat tasdiqlanmagan holatda ko'rinadi -->
      <template v-else>
        <button 
          @click="showLBXModal('revision')" 
          :disabled="isLBXRevisionDisabled"
          :class="{
            'bg-[#4A51DD] hover:bg-[#46497d]': !isLBXRevisionDisabled,
            'bg-gray-300 cursor-not-allowed': isLBXRevisionDisabled
          }"
          class="text-white px-3 py-1 text-sm rounded transition-colors flex items-center space-x-1"
        >
          <i class='bx bx-refresh text-[16px]'></i>
          <span>{{ $t('buttons.forrevison') }}</span>
        </button>
        <button 
          @click="showLBXModal('comment')"
          :disabled="isLBXCommentDisabled"
          :class="{
            'bg-[#FD5656] hover:bg-[#c57575]': !isLBXCommentDisabled,
            'bg-gray-300 cursor-not-allowed': isLBXCommentDisabled
          }"
          class="text-white px-3 py-1 text-sm rounded transition-colors flex items-center space-x-1"
        >
          <span class="font-bold">!</span>
          <span>{{ $t('buttons.comment') }}</span>
        </button>
        <button 
          @click="showLBXModal('approve')"
          :disabled="isLBXApproveDisabled"
          :class="{
            'bg-[#07A920] hover:bg-[#62a962]': !isLBXApproveDisabled,
            'bg-gray-300 cursor-not-allowed': isLBXApproveDisabled
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
    v-show="openSections.lbx && canAccessLBX"
    class="pb-4 transition-all duration-300 ease-in-out"
  >
    <div class="space-y-2 px-4">
      <!-- Loading state -->
      <div v-if="loadingLBX" class="text-center py-4">
        <i class='bx bx-loader-alt bx-spin text-2xl text-blue-500'></i>
        <p class="text-sm text-gray-600 mt-2">Yuklanmoqda...</p>
      </div>
      
      <!-- LBX Items from API -->
      <div v-else-if="filteredLbxDocuments.length > 0" class="space-y-4">
        <div v-for="(item, index) in filteredLbxDocuments" :key="item.id" class="flex items-center justify-between h-20 border border-gray-300 bg-gray-100 rounded-lg space-y-4">
          <div class="flex items-center space-x-3 mt-4">
            <div class="w-8 h-20 bg-blue-500 text-white rounded-l-lg flex items-center justify-center font-bold text-sm">
              {{ index + 1 }}
            </div>
            <div>
              <p class="text-sm text-gray-700">{{ item.created_at }}</p>
              <p class="font-medium text-gray-700 text-sm">
                {{ item.fileName }}
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
      <div v-else-if="!loadingLBX" class="text-center py-4 text-gray-500">
        <p>Ma'lumot topilmadi</p>
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

          <!-- File upload section (faqat ko'rib chiqish va izoh berish uchun) v-if="modalType !== 'approve'"-->
         <div class="space-y-3">
            <!-- File upload button -->
            <div class="flex items-center space-x-2">
              <input 
                type="file" 
                :id="modalType + '-file'"
                @change="handleFileUploadModal"
                class="hidden"
                accept=".pdf,.doc,.docx"
                multiple
              />
              <label 
                :for="modalType + '-file'"
                class="flex items-center space-x-1 text-[12px] px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors cursor-pointer"
              >
                <i class='bx bx-plus text-[12px]'></i>
                <span>Fayl qo'shish ({{ fileState.files.length }}/{{ fileState.maxFiles }})</span>
              </label>
            </div>

            <!-- Yuklangan fayllar ro'yxati -->
            <div v-if="fileState.files.length > 0" class="space-y-3">
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-40 overflow-y-auto">
    <div 
      v-for="(fileItem, index) in fileState.files" 
      :key="fileItem.id"
      class="relative bg-gray-50 rounded-lg border border-gray-200 p-3 hover:bg-gray-100 transition-colors"
    >
      <!-- O'chirish tugmasi -->
      <button 
        @click="removeFile(index)"
        class="absolute top-1 right-1 text-red-500 hover:text-red-700 bg-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-50 transition-colors"
        type="button"
        title="Faylni o'chirish"
      >
        ×
      </button>
      
      <!-- Fayl ma'lumotlari -->
      <div class="flex flex-col space-y-1">
        <!-- Fayl ikoni va yuklash holati -->
        <div class="flex items-center space-x-2">
          <i class='bx bxs-file text-blue-500 text-lg'></i>
          <div v-if="fileItem.uploading" class="flex items-center">
            <i class='bx bx-loader-alt bx-spin text-blue-500 text-sm'></i>
            <span class="text-xs text-blue-600 ml-1">Yuklanmoqda...</span>
          </div>
          <div v-else-if="fileItem.uploaded" class="flex items-center">
            <i class='bx bx-check-circle text-green-500 text-sm'></i>
            <span class="text-xs text-green-600 ml-1">Yuklandi</span>
          </div>
        </div>
        
        <!-- Fayl nomi -->
        <div class="pr-6">
          <p class="text-[12px] font-medium text-gray-800 truncate" :title="fileItem.name">
            {{ fileItem.name }}
          </p>
          <p class="text-xs text-gray-500">
            {{ formatFileSize(fileItem.size) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
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

        <!-- File upload section (faqat ko'rib chiqish va izoh berish uchun) v-if="technicalModalType !== 'approve'" -->
       <div class="space-y-3">
          <!-- File upload button -->
        <div class="flex items-center space-x-2">
          <input 
            type="file" 
            :id="technicalModalType + '-file'"
            @change="handleTechnicalFileUpload"
            class="hidden"
            accept=".pdf,.doc,.docx"
            multiple
          />
          <label 
            :for="technicalModalType + '-file'"
            class="flex items-center space-x-1 text-sm px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors cursor-pointer"
          >
            <i class='bx bx-plus text-[16px]'></i>
            <span>Fayl qo'shish ({{ technicalFileState.files.length }}/{{ technicalFileState.maxFiles }})</span>
          </label>
        </div>

        <!-- ========================= -->
         <div v-if="technicalFileState.files.length > 0" class="space-y-2">
  <div class="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-gray-50 rounded-lg">
    <div 
      v-for="(fileItem, index) in technicalFileState.files" 
      :key="fileItem.id"
      class="inline-flex items-center bg-white border border-gray-200 rounded-full px-3 py-1 text-sm hover:bg-gray-50 transition-colors max-w-xs"
    >
      <!-- Fayl ikoni -->
      <i class='bx bxs-file text-blue-500 text-sm mr-2'></i>
      
      <!-- Yuklash holati -->
      <div v-if="fileItem.uploading" class="flex items-center mr-2">
        <i class='bx bx-loader-alt bx-spin text-blue-500 text-xs'></i>
      </div>
      <div v-else-if="fileItem.uploaded" class="flex items-center mr-2">
        <i class='bx bx-check-circle text-green-500 text-xs'></i>
      </div>
      
      <!-- Fayl nomi va hajmi -->
      <div class="flex-1 min-w-0 mr-2">
        <span class="text-gray-800 truncate block" :title="fileItem.name">
          {{ fileItem.name }}
        </span>
        <span class="text-xs text-gray-500">
          ({{ formatFileSize(fileItem.size) }})
        </span>
      </div>
      
      <!-- O'chirish tugmasi -->
      <button 
        @click="removeTechnicalFile(index)"
        class="text-red-500 hover:text-red-700 ml-1 hover:bg-red-50 rounded-full w-4 h-4 flex items-center justify-center text-xs transition-colors"
        type="button"
        title="Faylni o'chirish"
      >
        ×
      </button>
    </div>
  </div>
</div>
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

<!-- LBX Modal -->
<div v-if="openLBXModal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
  <div class="modal-content bg-gray-200 rounded-lg shadow-xl w-full max-w-[800px] text-black relative">
    <!-- Modal header -->
    <div class="bg-white border-b rounded-t-lg pl-4 border-gray-300 flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <!-- Icon -->
        <i :class="lbxModalConfig.icon" class="text-[20px]"></i>
        <p class="text-[15px] font-[700]" :class="lbxModalConfig.titleColor">
          {{ lbxModalConfig.title }}
        </p>
      </div>
      <button 
        @click="closeLBXModal" 
        class="text-gray-700 text-[42px] hover:text-red-500 border-l border-gray-300 px-4 leading-none"
      >
        &times;
      </button>
    </div>

    <!-- Modal content -->
    <div class="bg-white p-4 m-4 rounded-md">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-[12px] font-[500]" :class="lbxModalConfig.titleColor">
            {{ lbxModalConfig.title }}
          </p>
          <p class="text-[12px] text-gray-500">
            {{ formatDate(new Date()) }}
          </p>
        </div>
      </div>

      <form @submit.prevent="handleSubmitLBXModal">
        <!-- Textarea -->
        <div class="my-4 border border-gray-300 rounded-md p-4">
          <textarea 
            v-model="lbxFormData.answare"
            :id="lbxModalType + '_textarea'"
            cols="30" 
            rows="5" 
            class="w-full outline-none text-[14px] resize-none" 
            :placeholder="lbxModalConfig.placeholder"
          ></textarea>
        </div>

        <!-- File upload section (faqat ko'rib chiqish va izoh berish uchun)   v-if="lbxModalType !== 'approve'" -->
     <div class="space-y-3">
  <!-- File upload button -->
  <div class="flex items-center space-x-2">
    <input 
      type="file" 
      :id="lbxModalType + '-file'"
      @change="handleLBXFileUpload"
      class="hidden"
      accept=".pdf,.doc,.docx"
      multiple
    />
    <label 
      :for="lbxModalType + '-file'"
      class="flex items-center space-x-1 text-sm px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors cursor-pointer"
    >
      <i class='bx bx-plus text-[16px]'></i>
      <span>Fayl qo'shish ({{ lbxFileState.files.length }}/{{ lbxFileState.maxFiles }})</span>
    </label>
  </div>
<!-- ============= -->

<div v-if="lbxFileState.files.length > 0" class="space-y-2">
  <div class="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 bg-gray-50 rounded-lg">
    <div 
      v-for="(fileItem, index) in lbxFileState.files" 
      :key="fileItem.id"
      class="inline-flex items-center bg-white border border-gray-200 rounded-full px-3 py-1 text-sm hover:bg-gray-50 transition-colors max-w-xs"
    >
      <!-- Fayl ikoni -->
      <i class='bx bxs-file text-blue-500 text-sm mr-2'></i>
      
      <!-- Yuklash holati -->
      <div v-if="fileItem.uploading" class="flex items-center mr-2">
        <i class='bx bx-loader-alt bx-spin text-blue-500 text-xs'></i>
      </div>
      <div v-else-if="fileItem.uploaded" class="flex items-center mr-2">
        <i class='bx bx-check-circle text-green-500 text-xs'></i>
      </div>
      
      <!-- Fayl nomi va hajmi -->
      <div class="flex-1 min-w-0 mr-2">
        <span class="text-gray-800 truncate block" :title="fileItem.name">
          {{ fileItem.name }}
        </span>
        <span class="text-xs text-gray-500">
          ({{ formatFileSize(fileItem.size) }})
        </span>
      </div>
      
      <!-- O'chirish tugmasi -->
      <button 
        @click="removeLBXFile(index)"
        class="text-red-500 hover:text-red-700 ml-1 hover:bg-red-50 rounded-full w-4 h-4 flex items-center justify-center text-xs transition-colors"
        type="button"
        title="Faylni o'chirish"
      >
        ×
      </button>
    </div>
  </div>
</div>
</div>
  
        <!-- Action buttons -->
        <div class="flex items-center justify-center space-x-4 my-4">
          <!-- Submit button -->
          <button 
            type="submit" 
            :disabled="isLBXSubmitting"
            :class="[
              lbxModalConfig.buttonClass, 
              'py-2 text-white rounded-md font-medium', 
              lbxModalType === 'approve' ? 'w-full' : 'w-[65%]',
              isLBXSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            ]"
          >
            <span v-if="!isLBXSubmitting">{{ lbxModalConfig.buttonText }}</span>
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

<!-- Ish tarixi Modal -->
<div 
  v-if="isHistoryModalOpen" 
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 bg-opacity-50"
  @click="closeHistoryModal"
>
  <div 
    class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 overflow-hidden"
    @click.stop
  >
    <!-- Modal Header -->
    <div class="bg-white p-4">
      <div class="flex items-center justify-between">
        <h2 class="text-[14px] text-[#794A9A] font-[600] flex items-center">
          <i class='bx bxs-briefcase-alt-2 mr-2 text-[18px]'></i>
          {{ getSectionTitle(currentHistorySection) }} - Ish tarixi
        </h2>
        <button 
          @click="closeHistoryModal"
          class="text-gray-500 hover:text-gray-400 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Modal Content -->
    <div class="max-h-[70vh] overflow-y-auto">
      <div class="space-y-2" v-if="getHistoryData(currentHistorySection).length > 0">
        <template v-for="(historyItem, historyIndex) in getHistoryData(currentHistorySection)" :key="historyItem.id">
          
          <!-- History item header -->
          <div class="flex items-center justify-between">
            <div class="space-y-2 bg-gray-100 w-full p-4 border-l-4" 
                 :class="{
                   'border-blue-400': historyItem.status === 'RESOLVED',
                   'border-red-400': historyItem.status === 'REJECTED',
                   'border-green-400': historyItem.status === 'ACCEPTED',
                   'border-purple-400': historyItem.status === 'TO_REVIEW'
                 }">
              <p class="text-[14px] font-semibold flex items-center"
                 :class="{
                   'text-[#6DA1F8]': historyItem.status === 'RESOLVED',
                   'text-[#F60000]': historyItem.status === 'REJECTED', 
                   'text-green-600': historyItem.status === 'ACCEPTED',
                   'text-[#4A51DD]': historyItem.status === 'TO_REVIEW'
                 }">
                <i class='bx text-[18px] mr-1'
                   :class="{
                     'bx-info-circle': historyItem.status === 'RESOLVED',
                     'bx-info-circle': historyItem.status === 'REJECTED',
                     'bx-check-circle': historyItem.status === 'ACCEPTED',
                     'bx-refresh': historyItem.status === 'TO_REVIEW'
                   }"></i>
                {{ getStatusText(historyItem.status) }}
              </p>
              <p class="text-[12px] text-gray-500 font-semibold">
                {{ historyItem.created_at.slice(0, 10) }} 
                {{ historyItem.created_at.slice(11, 16) }}
              </p>
            </div>
          </div>

          <!-- History item answer -->
          <div v-if="historyItem.answers && historyItem.answers.length > 0" 
               class="m-4 p-4 border-l-4 rounded"
               :class="{
                 'bg-blue-50 border-blue-400': historyItem.status === 'RESOLVED',
                 'bg-red-50 border-red-400': historyItem.status === 'REJECTED',
                 'bg-green-50 border-green-400': historyItem.status === 'ACCEPTED',
                 'bg-purple-50 border-purple-400': historyItem.status === 'TO_REVIEW'
               }">
            <p class="text-justify">{{ historyItem.answers[historyItem.answers.length - 1]?.answer || 'Izoh mavjud emas' }}</p>
          </div>

          <!-- History item files -->
          <div v-if="historyItem.documents && historyItem.documents.length > 0" 
               class="m-4 p-4 bg-gray-50 rounded">
            <div class="space-y-2">
              <div 
                v-for="(file, fileIndex) in historyItem.documents" 
                :key="file.id || fileIndex"
                class="flex items-center justify-between bg-gray-200 rounded p-1"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-10 bg-blue-500 text-white border border-blue-500 rounded flex items-center justify-center font-bold text-sm">
                    {{ fileIndex + 1 }}
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">{{ file.created_at.slice(0, 10) }} 
                      {{ file.created_at.slice(11, 16) }}</p>
                    <p class="text-sm font-semibold text-gray-700">{{ file.file?.name || 'Nomsiz fayl' }}</p>
                  </div>
                </div>
                <button 
                  @click="downloadProjectFile(file.file?.url, file.file?.name)"
                  class="px-3 py-1 rounded text-[12px] transition-colors flex items-center space-x-1"
                >
                  <span class="bg-white hover:bg-gray-100 p-2 rounded">Faylni yuklash</span>
                  <i class='bx bx-download text-[15px] bg-white hover:bg-blue-500 p-2 rounded-full text-green-500'></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Separator -->
          <div v-if="historyIndex < getHistoryData(currentHistorySection).length - 1" 
               class="border-t border-gray-200 my-4">
          </div>
        </template>
      </div>
      
      <!-- Bo'sh holat -->
      <div v-else class="p-8 text-center text-gray-500">
        Bu bo'lim uchun tarix mavjud emas
      </div>
    </div>
  </div>
</div>

</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import "vue3-toastify/dist/index.css";
import { toast } from 'vue3-toastify';
import axios from 'axios';


const clearAllCache = () => {
  console.log('🧹 Cache tozalanmoqda...');
  filesCache.value = null;
  filesCacheTime.value = null;
  projectData.value = null;
  lastLoadedProjectId.value = null;
  conceptionDocuments.value = [];
  technicalDocuments.value = [];
  lbxDocuments.value = [];
  console.log('✅ Cache tozalandi');
};

const isHistoryModalOpen = ref(false);
const currentHistorySection = ref('');


// 2. Forced refresh funktsiyasi
const fetchFilesConsepForced = async (bypassCache = true) => {
  console.log('🔄 Forced refresh boshlanmoqda');
  
  if (bypassCache) {
    clearAllCache();
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

  loading.value = true;
  error.value = '';

  try {
    const timestamp = new Date().getTime();
    
    const response = await axios.get(`https://back.miit.uz/api/bisap/test/project/${selectedProject.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      },
      params: {
        _t: timestamp
      }
    });
    
    console.log('📥 API javobi:', response.data);
    
    if (!response.data || !response.data.data) {
      throw new Error('Project ma\'lumotlari topilmadi');
    }
    
    projectData.value = response.data.data;
    lastLoadedProjectId.value = selectedProject.id;
    
    await processConceptionDocumentsNew();
    await processTechnicalDocumentsNew();
    await processLBXDocumentsNew();
    
    toast.success('Ma\'lumotlar yangilandi!', { autoClose: 1500 });
    return response.data;
    
  } catch (error) {
    console.error('❌ Forced refresh xatosi:', error);
    toast.error('Xatolik yuz berdi!', { autoClose: 2000 });
    return null;
  } finally {
    loading.value = false;
  }
};

const sortDocumentsByPredefinedOrder = (documents, section) => {
  if (!documents || !Array.isArray(documents)) return [];
  
  // Accordion.vue'dagi tartibni belgilash
  const orderMap = {
    conception: ['letter_file_id', 'concept_project_file_id', 'protocol_file_id', 'solution_file_id'],
    technical: ['letter_file_id', 'solution_file_id', 'concept_project_file_id', 'protocol_file_id'],
    lbx: ['letter_file_id', 'solution_file_id', 'concept_project_file_id', 'protocol_file_id']
  };
  
  // Type ni key ga o'zgartirish
  const typeToKey = {
    'LETTER': 'letter_file_id',
    'CONCEPT_PROJECT': 'concept_project_file_id',
    'PROTOCOL': 'protocol_file_id',
    'SOLUTION': 'solution_file_id'
  };
  
  const order = orderMap[section] || [];
  
  return documents.sort((a, b) => {
    const aKey = typeToKey[a.type] || a.type;
    const bKey = typeToKey[b.type] || b.type;
    
    const aIndex = order.indexOf(aKey);
    const bIndex = order.indexOf(bKey);
    
    // Agar topilmasa, oxiriga qo'yish
    const aOrder = aIndex !== -1 ? aIndex : 999;
    const bOrder = bIndex !== -1 ? bIndex : 999;
    
    return aOrder - bOrder;
  });
};

// 9. Konsepsiya hujjatlarini qayta ishlash
const processConceptionDocumentsNew = async () => {
  console.log('🔄 ProcessConceptionDocuments NEW');
  
  if (!projectData.value?.project_documents?.PROJECT_CONCEPT) {
    conceptionDocuments.value = [];
    return;
  }

  const projectConceptDoc = projectData.value.project_documents.PROJECT_CONCEPT;
  console.log('📋 PROJECT_CONCEPT:', projectConceptDoc);

  if (!projectConceptDoc.documents) {
    conceptionDocuments.value = [];
    return;
  }

  // Hujjatlarni qayta ishlash
  const processedDocuments = projectConceptDoc.documents.map((doc, index) => {
    console.log(`📄 Doc ${index + 1}:`, doc);
    
    const fileInfo = doc.file;
    console.log(`📎 File info:`, fileInfo);
    
    let fileUrl = null;
    if (fileInfo?.url) {
      fileUrl = fileInfo.url.startsWith('http') ? fileInfo.url : `https://back.miit.uz${fileInfo.url}`;
    }
    
    return {
      id: doc.id,
      date_time: doc.created_at,
      fileUrl: fileUrl,
      fileName: fileInfo?.name || 'Nomsiz fayl',
      fileId: fileInfo?.id,
      type: doc.type
    };
  });

  conceptionDocuments.value = sortDocumentsByPredefinedOrder(processedDocuments, 'conception');
  console.log('✅ Sorted conception documents:', conceptionDocuments.value);
};


// 10. Texnik hujjatlarni qayta ishlash
const processTechnicalDocumentsNew = async () => {
  console.log('🔧 ProcessTechnicalDocuments NEW');
  
  if (!projectData.value?.project_documents?.PROJECT_TS) {
    technicalDocuments.value = [];
    return;
  }

  const projectDoc = projectData.value.project_documents.PROJECT_TS;
  console.log('🔧 PROJECT_TS:', projectDoc);

  if (!projectDoc.documents || !Array.isArray(projectDoc.documents)) {
    technicalDocuments.value = [];
    return;
  }

  loadingTechnical.value = true;

  try {
    const processedDocuments = projectDoc.documents.map((doc, index) => {
      console.log(`🔧 Technical doc ${index + 1}:`, doc);
      
      const fileInfo = doc.file;
      
      let fileUrl = null;
      if (fileInfo?.url) {
        fileUrl = fileInfo.url.startsWith('http') ? fileInfo.url : `https://back.miit.uz${fileInfo.url}`;
      }
      
      return {
        id: doc.id,
        type: doc.type,
        file_id: fileInfo?.id,
        fileUrl: fileUrl,
        fileName: fileInfo?.name || 'Nomsiz fayl',
        projectId: projectData.value.id,
        created_at: doc.created_at
      };
    });

    technicalDocuments.value = sortDocumentsByPredefinedOrder(processedDocuments, 'technical');
    console.log('✅ Technical documents:', technicalDocuments.value);
  } finally {
    loadingTechnical.value = false;
  }
};


// 11. LBX hujjatlarini qayta ishlash (yangi qo'shildi)
const lbxDocuments = ref([]);
const loadingLBX = ref(false);

// 6. LBX hujjatlarini qayta ishlashni yaxshilash
const processLBXDocumentsNew = async () => {
  console.log('📊 ProcessLBXDocuments NEW');
  console.log('projectData.value:', projectData.value);
  
  if (!projectData.value?.project_documents) {
    console.log('project_documents mavjud emas');
    lbxDocuments.value = [];
    return;
  }
  
  if (!projectData.value.project_documents.PROJECT_EVALUATION_DOCUMENT) {
    console.log('PROJECT_EVALUATION_DOCUMENT mavjud emas');
    lbxDocuments.value = [];
    return;
  }

  const projectDoc = projectData.value.project_documents.PROJECT_EVALUATION_DOCUMENT;
  console.log('📊 PROJECT_EVALUATION_DOCUMENT:', projectDoc);

  if (!projectDoc.documents || !Array.isArray(projectDoc.documents)) {
    console.log('LBX documents array mavjud emas yoki array emas');
    lbxDocuments.value = [];
    return;
  }

  loadingLBX.value = true;

  try {
    const processedDocuments = projectDoc.documents.map((doc, index) => {
      console.log(`📊 LBX doc ${index + 1}:`, doc);
      
      const fileInfo = doc.file;
      console.log(`📎 LBX file info:`, fileInfo);
      
      let fileUrl = null;
      if (fileInfo?.url) {
        fileUrl = fileInfo.url.startsWith('http') ? fileInfo.url : `https://back.miit.uz${fileInfo.url}`;
      }
      
      return {
        id: doc.id,
        type: doc.type,
        file_id: fileInfo?.id,
        fileUrl: fileUrl,
        fileName: fileInfo?.name || 'Nomsiz fayl',
        projectId: projectData.value.id,
        created_at: doc.created_at
      };
    });

    lbxDocuments.value = sortDocumentsByPredefinedOrder(processedDocuments, 'lbx');
    console.log('✅ LBX documents processed:', lbxDocuments.value);
  } catch (error) {
    console.error('Error processing LBX documents:', error);
    lbxDocuments.value = [];
  } finally {
    loadingLBX.value = false;
  }
};

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
  files: [],
  maxFiles: 20
});

const lbxFileState = reactive({
  files: [],
  maxFiles: 20
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
  files: [], // Array of files
  maxFiles: 20 // Maksimal fayl soni
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

// 1. Konsepsiya tasdiqlanganligini tekshirish
const isConceptionApproved = computed(() => {
  console.log('isConceptionApproved check...');
  
  if (!projectData.value?.project_documents) {
    console.log('project_documents mavjud emas');
    return false;
  }
  
  const projectDocuments = projectData.value.project_documents;
  
  // Yangi strukturada PROJECT_CONCEPT ni tekshirish
  if (projectDocuments.PROJECT_CONCEPT) {
    const projectDoc = projectDocuments.PROJECT_CONCEPT;
    console.log('PROJECT_CONCEPT status:', projectDoc.status);
    return projectDoc.status === 'ACCEPTED';
  }
  
  return false;
});

// 2. Konsepsiya qayta ko'rib chiqishda ekanligini tekshirish
const isConceptionToReview = computed(() => {
  if (!projectData.value?.project_documents?.PROJECT_CONCEPT) {
    return false;
  }
  
  const projectDoc = projectData.value.project_documents.PROJECT_CONCEPT;
  return projectDoc.status === 'TO_REVIEW';
});

// 7. Texnik hujjatlar mavjudligini tekshirish
const hasTechnicalDocuments = computed(() => {
  console.log('hasTechnicalDocuments check...');
  
  if (!projectData.value?.project_documents?.PROJECT_TS) {
    console.log('PROJECT_TS mavjud emas');
    return false;
  }
  
  const projectDoc = projectData.value.project_documents.PROJECT_TS;
  console.log('PROJECT_TS documents:', projectDoc.documents);
  
  return projectDoc.documents && Array.isArray(projectDoc.documents) && projectDoc.documents.length > 0;
});

// 4. Texnik vazifa qayta ko'rib chiqishda ekanligini tekshirish
const isTechnicalToReview = computed(() => {
  if (!projectData.value?.project_documents?.PROJECT_TS) {
    return false;
  }
  
  const projectDoc = projectData.value.project_documents.PROJECT_TS;
  return projectDoc.status === 'TO_REVIEW';
});

// 5. LBX tasdiqlanganligini tekshirish
const isLBXApproved = computed(() => {
  if (!projectData.value?.project_documents?.PROJECT_EVALUATION_DOCUMENT) {
    return false;
  }
  
  const projectDoc = projectData.value.project_documents.PROJECT_EVALUATION_DOCUMENT;
  return projectDoc.status === 'ACCEPTED';
});

/// 5. Debug uchun console.log qo'shish
const hasLBXDocuments = computed(() => {
  console.log('hasLBXDocuments check...');
  console.log('projectData.value:', projectData.value);
  
  if (!projectData.value?.project_documents?.PROJECT_EVALUATION_DOCUMENT) {
    console.log('PROJECT_EVALUATION_DOCUMENT mavjud emas');
    return false;
  }
  
  const projectDoc = projectData.value.project_documents.PROJECT_EVALUATION_DOCUMENT;
  console.log('PROJECT_EVALUATION_DOCUMENT:', projectDoc);
  console.log('PROJECT_EVALUATION_DOCUMENT documents:', projectDoc.documents);
  
  const hasDocuments = projectDoc.documents && Array.isArray(projectDoc.documents) && projectDoc.documents.length > 0;
  console.log('Has LBX documents:', hasDocuments);
  
  return hasDocuments;
});

const canAccessTechnical = computed(() => {
  return isConceptionApproved.value;
});

const canAccessLBX = computed(() => {
  return isTechnicalApproved.value;
});

// 6. PROJECT_CONCEPT hujjatlari mavjudligini tekshirish
const hasProjectConceptDocuments = computed(() => {
  console.log('hasProjectConceptDocuments check...');
  
  if (!projectData.value?.project_documents?.PROJECT_CONCEPT) {
    console.log('PROJECT_CONCEPT mavjud emas');
    return false;
  }
  
  const projectDoc = projectData.value.project_documents.PROJECT_CONCEPT;
  console.log('PROJECT_CONCEPT documents:', projectDoc.documents);
  
  return projectDoc.documents && Array.isArray(projectDoc.documents) && projectDoc.documents.length > 0;
});

// 3. Texnik vazifa tasdiqlanganligini tekshirish
const isTechnicalApproved = computed(() => {
  if (!projectData.value?.project_documents?.PROJECT_TS) {
    return false;
  }
  
  const projectDoc = projectData.value.project_documents.PROJECT_TS;
  return projectDoc.status === 'ACCEPTED';
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

const lbxModalConfig = computed(() => {
  const configs = {
    revision: {
      title: "Ko'rib chiqish uchun yuborish (LBX)",
      titleColor: 'text-[#4A51DD]',
      icon: 'bx bx-refresh text-[#4A51DD]',
      placeholder: "LBX hujjati bo'yicha ko'rib chiqish uchun izoh yozing...",
      buttonText: "Ko'rib chiqish uchun yuborish",
      buttonClass: 'bg-[#4A51DD] hover:bg-[#3A41CD]'
    },
    comment: {
      title: "Izoh yuborish (LBX)",
      titleColor: 'text-[#FF4444]',
      icon: 'bx bx-message-square-error text-[#FF4444]',
      placeholder: "LBX hujjati bo'yicha izohingizni yozing...",
      buttonText: "Izoh yuborish",
      buttonClass: 'bg-[#FF4444] hover:bg-[#EE3333]'
    },
    approve: {
      title: "Tasdiqlash (LBX)",
      titleColor: 'text-[#07A920]',
      icon: 'bx bx-check-circle text-[#07A920]',
      placeholder: "LBX hujjati tasdiqlash izohi (ixtiyoriy)...",
      buttonText: "Tasdiqlash",
      buttonClass: 'bg-[#07A920] hover:bg-[#069A1E]'
    }
  };
  return configs[lbxModalType.value] || configs.revision;
});


// Konsepsiya button disable logic
const isConceptionRevisionDisabled = computed(() => {
  if (!hasProjectConceptDocuments.value || filteredConceptionDocuments.value.length === 0) return true;
  
  const projectDoc = projectData.value?.project_documents?.PROJECT_CONCEPT;
  if (!projectDoc) return false;
  
  // REJECTED bo'lsa, revision va approve disabled
  if (projectDoc.status === 'REJECTED') return true;
  
  return false;
});

const isConceptionCommentDisabled = computed(() => {
  if (!hasProjectConceptDocuments.value || filteredConceptionDocuments.value.length === 0) return true;
  
  const projectDoc = projectData.value?.project_documents?.PROJECT_CONCEPT;
  if (!projectDoc) return false;
  
  // RESOLVED bo'lsa, comment va approve disabled
  if (projectDoc.status === 'RESOLVED') return true;
  
  return false;
});

const isConceptionApproveDisabled = computed(() => {
  if (!hasProjectConceptDocuments.value || filteredConceptionDocuments.value.length === 0) return true;
  
  const projectDoc = projectData.value?.project_documents?.PROJECT_CONCEPT;
  if (!projectDoc) return false;
  
  // RESOLVED yoki REJECTED bo'lsa, approve disabled
  if (projectDoc.status === 'RESOLVED' || projectDoc.status === 'REJECTED') return true;
  
  return false;
});

// Technical uchun
const isTechnicalRevisionDisabled = computed(() => {
  if (!canAccessTechnical.value || !hasTechnicalDocuments.value) return true;
  
  const projectDoc = projectData.value?.project_documents?.PROJECT_TS;
  if (!projectDoc) return false;
  
  // REJECTED bo'lsa, revision va approve disabled
  if (projectDoc.status === 'REJECTED') return true;
  
  return false;
});

const isTechnicalCommentDisabled = computed(() => {
  if (!canAccessTechnical.value || !hasTechnicalDocuments.value) return true;
  
  const projectDoc = projectData.value?.project_documents?.PROJECT_TS;
  if (!projectDoc) return false;
  
  // RESOLVED bo'lsa, comment va approve disabled
  if (projectDoc.status === 'RESOLVED') return true;
  
  return false;
});

const isTechnicalApproveDisabled = computed(() => {
  if (!canAccessTechnical.value || !hasTechnicalDocuments.value) return true;
  
  const projectDoc = projectData.value?.project_documents?.PROJECT_TS;
  if (!projectDoc) return false;
  
  // RESOLVED yoki REJECTED bo'lsa, approve disabled
  if (projectDoc.status === 'RESOLVED' || projectDoc.status === 'REJECTED') return true;
  
  return false;
});

// LBX uchun
const isLBXRevisionDisabled = computed(() => {
  if (!canAccessLBX.value || !hasLBXDocuments.value) return true;
  
  const projectDoc = projectData.value?.project_documents?.PROJECT_EVALUATION_DOCUMENT;
  if (!projectDoc) return false;
  
  // REJECTED bo'lsa, revision va approve disabled
  if (projectDoc.status === 'REJECTED') return true;
  
  return false;
});

const isLBXCommentDisabled = computed(() => {
  if (!canAccessLBX.value || !hasLBXDocuments.value) return true;
  
  const projectDoc = projectData.value?.project_documents?.PROJECT_EVALUATION_DOCUMENT;
  if (!projectDoc) return false;
  
  // RESOLVED bo'lsa, comment va approve disabled
  if (projectDoc.status === 'RESOLVED') return true;
  
  return false;
});

const isLBXApproveDisabled = computed(() => {
  if (!canAccessLBX.value || !hasLBXDocuments.value) return true;
  
  const projectDoc = projectData.value?.project_documents?.PROJECT_EVALUATION_DOCUMENT;
  if (!projectDoc) return false;
  
  // RESOLVED yoki REJECTED bo'lsa, approve disabled
  if (projectDoc.status === 'RESOLVED' || projectDoc.status === 'REJECTED') return true;
  
  return false;
});
// 4. LBX submit funktsiyasini to'g'rilash
const handleSubmitLBXModal = async () => {
  if (!lbxFormData.answare || !lbxFormData.answare.trim()) {
    toast.error('Iltimos, javob kiriting!', { autoClose: 1500 });
    return;
  }

  isLBXSubmitting.value = true;
  let loadingToastId = null;
  
  try {
    loadingToastId = toast.info('Ma\'lumot yuborilmoqda...', {
      autoClose: false,
      closeButton: false
    });

    let fileIds = [];
    if (lbxFileState.files.length > 0) {
      console.log('📤 LBX fayllar yuklanmoqda:', lbxFileState.files.length);
      fileIds = await uploadMultipleFilesToServer(lbxFileState.files);
      
      if (fileIds.length === 0 && lbxFileState.files.length > 0) {
        if (loadingToastId) toast.remove(loadingToastId);
        toast.error('Fayllarni yuklashda xatolik!', { autoClose: 2000 });
        isLBXSubmitting.value = false;
        return;
      }
      console.log('✅ LBX yuklangan fayl IDlari:', fileIds);
    }

    const typeMap = {
      'revision': 'RESOLVED',
      'comment': 'REJECTED',
      'approve': 'ACCEPTED'
    };
    const answerType = typeMap[lbxModalType.value];

    const projectDoc = projectData.value?.project_documents?.PROJECT_EVALUATION_DOCUMENT;
    
    if (!projectDoc) {
      if (loadingToastId) toast.remove(loadingToastId);
      toast.error('PROJECT_EVALUATION_DOCUMENT hujjati topilmadi!', { autoClose: 2000 });
      isLBXSubmitting.value = false;
      return;
    }

    const answerData = {
      project_document_id: projectDoc.id,
      answer: lbxFormData.answare,
      type: answerType
    };

    if (fileIds.length > 0) {
      answerData.file_ids = fileIds;
      console.log('📎 LBX answer data ga file_ids qo\'shildi:', answerData.file_ids);
    }

    console.log('📨 LBX yuborilayotgan answer data:', answerData);
    await sendAnswer(answerData);

    if (loadingToastId) toast.remove(loadingToastId);
    toast.success(`${lbxModalConfig.value.title} muvaffaqiyatli yuborildi!`, { autoClose: 2000 });

    closeLBXModal();

    if (lbxModalType.value === 'approve') {
      if (projectData.value?.project_documents?.PROJECT_EVALUATION_DOCUMENT) {
        projectData.value.project_documents.PROJECT_EVALUATION_DOCUMENT.status = 'ACCEPTED';
      }
    }
    
    console.log('🔄 LBX modal yuborildi, forced refresh...');
    setTimeout(async () => {
      await fetchFilesConsepForced(true);
    }, 1000);

  } catch (error) {
    if (loadingToastId) toast.remove(loadingToastId);
    console.error('LBX javob yuborishda xato:', error);
    toast.error('Xatolik yuz berdi!', { autoClose: 2000 });
  } finally {
    isLBXSubmitting.value = false;
  }
};

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
  technicalFileState.files = [];
};

// Technical fayl yuklash
const handleTechnicalFileUpload = (event) => {
  const selectedFiles = Array.from(event.target.files);
  
  if (technicalFileState.files.length + selectedFiles.length > technicalFileState.maxFiles) {
    toast.error(`Maksimal ${technicalFileState.maxFiles} ta fayl yuklash mumkin!`, { autoClose: 2000 });
    return;
  }
  
  selectedFiles.forEach(file => {
    technicalFileState.files.push({
      id: Date.now() + Math.random(),
      file: file,
      name: file.name,
      size: file.size,
      uploading: false,
      uploaded: false
    });
  });
  
  event.target.value = '';
};

// 13. Technical modal submit funktsiyasida o'zgarish
const handleSubmitTechnicalModal = async () => {
  if (!technicalFormData.answare || !technicalFormData.answare.trim()) {
    toast.error('Iltimos, javob kiriting!', { autoClose: 1500 });
    return;
  }

  isTechnicalSubmitting.value = true;
  let loadingToastId = null;
  
  try {
    loadingToastId = toast.info('Ma\'lumot yuborilmoqda...', {
      autoClose: false,
      closeButton: false
    });

    let fileIds = [];
    if (technicalFileState.files.length > 0) {
      console.log('📤 Technical fayllar yuklanmoqda:', technicalFileState.files.length);
      fileIds = await uploadMultipleFilesToServer(technicalFileState.files);
      
      if (fileIds.length === 0 && technicalFileState.files.length > 0) {
        if (loadingToastId) toast.remove(loadingToastId);
        toast.error('Fayllarni yuklashda xatolik!', { autoClose: 2000 });
        isTechnicalSubmitting.value = false;
        return;
      }
      console.log('✅ Technical yuklangan fayl IDlari:', fileIds);
    }

    const typeMap = {
      'revision': 'RESOLVED',
      'comment': 'REJECTED',
      'approve': 'ACCEPTED'
    };
    const answerType = typeMap[technicalModalType.value];

    const projectDoc = projectData.value?.project_documents?.PROJECT_TS;
    
    if (!projectDoc) {
      if (loadingToastId) toast.remove(loadingToastId);
      toast.error('PROJECT_TS hujjati topilmadi!', { autoClose: 2000 });
      isTechnicalSubmitting.value = false;
      return;
    }

    const answerData = {
      project_document_id: projectDoc.id,
      answer: technicalFormData.answare,
      type: answerType
    };

    if (fileIds.length > 0) {
      answerData.file_ids = fileIds;
      console.log('📎 Technical answer data ga file_ids qo\'shildi:', answerData.file_ids);
    }

    console.log('📨 Technical yuborilayotgan answer data:', answerData);
    await sendAnswer(answerData);

    if (loadingToastId) toast.remove(loadingToastId);
    toast.success(`${technicalModalConfig.value.title} muvaffaqiyatli yuborildi!`, { autoClose: 2000 });

    closeTechnicalModal();

    if (technicalModalType.value === 'approve') {
      if (projectData.value?.project_documents?.PROJECT_TS) {
        projectData.value.project_documents.PROJECT_TS.status = 'ACCEPTED';
      }
    }
    
    console.log('🔄 Technical modal yuborildi, forced refresh...');
    setTimeout(async () => {
      await fetchFilesConsepForced(true);
    }, 1000);

  } catch (error) {
    if (loadingToastId) toast.remove(loadingToastId);
    console.error('Technical javob yuborishda xato:', error);
    toast.error('Xatolik yuz berdi!', { autoClose: 2000 });
  } finally {
    isTechnicalSubmitting.value = false;
  }
};

const filteredLbxDocuments = computed(() => {
  if (!lbxDocuments.value || lbxDocuments.value.length === 0) {
    return [];
  }
  
  const selectedProject = getSelectedProject();
  if (!selectedProject || !selectedProject.id) {
    return [];
  }
  
  return lbxDocuments.value;
});

// LBX qayta ko'rib chiqishda ekanligini tekshirish
const isLBXToReview = computed(() => {
  if (!projectData.value?.project_documents?.PROJECT_EVALUATION_DOCUMENT) {
    return false;
  }
  
  const projectDoc = projectData.value.project_documents.PROJECT_EVALUATION_DOCUMENT;
  return projectDoc.status === 'TO_REVIEW';
});

// LBX modal holatlari
const openLBXModal = ref(false);
const lbxModalType = ref('');
const isLBXSubmitting = ref(false);

// LBX form data
const lbxFormData = reactive({
  answare: ''
});

// 2. LBX modal funktsiyasini to'g'rilash
const showLBXModal = (type) => {
  if (!canAccessLBX.value) {
    toast.warning('Avval texnik vazifa tasdiqlanishi kerak!', { autoClose: 2000 });
    return;
  }
  
  // hasLBXDocuments tekshiruvini olib tashlash yoki ixtiyoriy qilish
  if (!hasLBXDocuments.value) {
    toast.warning('PROJECT_EVALUATION_DOCUMENT tipidagi hujjatlar topilmadi!', { autoClose: 2000 });
    return;
  }
  
  lbxModalType.value = type;
  openLBXModal.value = true;
  resetLBXForm();
};

const closeLBXModal = () => {
  openLBXModal.value = false;
  lbxModalType.value = '';
  resetLBXForm();
};

const resetLBXForm = () => {
  lbxFormData.answare = '';
  lbxFileState.files = [];
};

// LBX fayl yuklash
const handleLBXFileUpload = (event) => {
  const selectedFiles = Array.from(event.target.files);
  
  if (lbxFileState.files.length + selectedFiles.length > lbxFileState.maxFiles) {
    toast.error(`Maksimal ${lbxFileState.maxFiles} ta fayl yuklash mumkin!`, { autoClose: 2000 });
    return;
  }
  
  selectedFiles.forEach(file => {
    lbxFileState.files.push({
      id: Date.now() + Math.random(),
      file: file,
      name: file.name,
      size: file.size,
      uploading: false,
      uploaded: false
    });
  });
  
  event.target.value = '';
};



// Manual refresh funktsiyasi
const manualRefresh = async () => {
  console.log('🔄 Manual refresh bosildi');
  toast.info('Ma\'lumotlar yangilanmoqda...', { autoClose: 1000 });
  await fetchFilesConsepForced(true);
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
      placeholder: "Tasdiqlash izohi ...",
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
  if (!hasProjectConceptDocuments.value || filteredConceptionDocuments.value.length === 0) {
    toast.warning('Hujjatlar mavjud emas!', { autoClose: 2000 });
    return;
  }
  
  modalType.value = type;
  openmodal.value = true;
  resetForm();
};

const closeModal = () => {
  openmodal.value = false;
  modalType.value = '';
  resetForm();
};
  
const resetForm = () => {
  formData.answare = '';
  fileState.files = [];
};

// Fayl yuklash - modal uchun
const handleFileUploadModal = (event) => {
  const selectedFiles = Array.from(event.target.files);
  
  // Maksimal fayl soni tekshiruvi
  if (fileState.files.length + selectedFiles.length > fileState.maxFiles) {
    toast.error(`Maksimal ${fileState.maxFiles} ta fayl yuklash mumkin!`, { autoClose: 2000 });
    return;
  }
  
  // Yangi fayllarni qo'shish
  selectedFiles.forEach(file => {
    fileState.files.push({
      id: Date.now() + Math.random(), // Unique ID
      file: file,
      name: file.name,
      size: file.size,
      uploading: false,
      uploaded: false
    });
  });
  
  // Input ni tozalash
  event.target.value = '';
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
  console.log('🚀 Javob yuborish boshlanmoqda...');
  console.log('📋 Answer data:', JSON.stringify(answerData, null, 2));
  
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

    console.log('✅ Javob yuborish muvaffaqiyatli:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Javob yuborishda xato:', error);
    if (error.response) {
      console.error('Server xatosi:', error.response.data);
    }
    throw error;
  }
};

// Faylni o'chirish
const removeFile = (index) => {
  fileState.files.splice(index, 1);
};

const removeTechnicalFile = (index) => {
  technicalFileState.files.splice(index, 1);
};

const removeLBXFile = (index) => {
  lbxFileState.files.splice(index, 1);
};

// Fayl hajmini formatlash
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Ko'p fayllarni yuklash funktsiyasi
const uploadMultipleFilesToServer = async (files) => {
  const fileIds = [];
  
  for (const fileItem of files) {
    try {
      fileItem.uploading = true;
      const fileId = await uploadFileToServer(fileItem.file);
      if (fileId) {
        fileIds.push(fileId);
        fileItem.uploaded = true;
        console.log(`✅ Fayl yuklandi: ${fileItem.name}, ID: ${fileId}`);
      }
    } catch (error) {
      console.error(`Fayl yuklashda xato: ${fileItem.name}`, error);
      fileItem.uploading = false;
      throw new Error(`${fileItem.name} faylini yuklashda xato`);
    } finally {
      fileItem.uploading = false;
    }
  }
  
  console.log('📋 Barcha yuklangan fayl IDlari:', fileIds);
  return fileIds;
};

// 12. Modal submit funktsiyasida o'zgarish
const handleSubmitModal = async () => {
  if (!formData.answare || !formData.answare.trim()) {
    toast.error('Iltimos, javob kiriting!', { autoClose: 1500 });
    return;
  }

  isSubmitting.value = true;
  let loadingToastId = null;
  
  try {
    loadingToastId = toast.info('Ma\'lumot yuborilmoqda...', {
      autoClose: false,
      closeButton: false
    });

    // Ko'p fayllarni yuklash
    let fileIds = [];
    if (fileState.files.length > 0) {
      console.log('📤 Fayllar yuklanmoqda:', fileState.files.length);
      fileIds = await uploadMultipleFilesToServer(fileState.files);
      
      if (fileIds.length === 0 && fileState.files.length > 0) {
        if (loadingToastId) toast.remove(loadingToastId);
        toast.error('Fayllarni yuklashda xatolik!', { autoClose: 2000 });
        isSubmitting.value = false;
        return;
      }
      console.log('✅ Yuklangan fayl IDlari:', fileIds);
    }

    const typeMap = {
      'revision': 'RESOLVED',
      'comment': 'REJECTED',
      'approve': 'ACCEPTED'
    };
    const answerType = typeMap[modalType.value];

    const projectDoc = projectData.value?.project_documents?.PROJECT_CONCEPT;
    
    if (!projectDoc) {
      if (loadingToastId) toast.remove(loadingToastId);
      toast.error('PROJECT_CONCEPT hujjati topilmadi!', { autoClose: 2000 });
      isSubmitting.value = false;
      return;
    }

    // Answer data tuzish
    const answerData = {
      project_document_id: projectDoc.id,
      answer: formData.answare,
      type: answerType
    };

    // Fayllar mavjud bo'lsa, file_ids qo'shish
    if (fileIds.length > 0) {
      answerData.file_ids = fileIds;
      console.log('📎 Answer data ga file_ids qo\'shildi:', answerData.file_ids);
    }

    console.log('📨 Yuborilayotgan answer data:', answerData);
    await sendAnswer(answerData);

    if (loadingToastId) toast.remove(loadingToastId);
    toast.success(`${modalConfig.value.title} muvaffaqiyatli yuborildi!`, { autoClose: 2000 });

    closeModal();

    // Status ni yangilash
    if (modalType.value === 'approve') {
      if (projectData.value?.project_documents?.PROJECT_CONCEPT) {
        projectData.value.project_documents.PROJECT_CONCEPT.status = 'ACCEPTED';
      }
    }

    console.log('🔄 Modal yuborildi, forced refresh...');
    setTimeout(async () => {
      await fetchFilesConsepForced(true);
    }, 1000);

  } catch (error) {
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
    
    // Base URL ni qo'shish (agar kerak bo'lsa)
    const fullUrl = fileUrl.startsWith('http') ? fileUrl : `https://back.miit.uz${fileUrl}`;
    
    window.open(fullUrl, '_blank');
    
    setTimeout(() => {
      toast.success('Fayl muvaffaqiyatli yuklandi!', { autoClose: 1000 });
    }, 1000);
  } catch (error) {
    console.error("Fayl yuklashda xato:", error);
    toast.error('Fayl yuklashda xatolik yuz berdi!', { autoClose: 1000 });
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
  await processConceptionDocumentsNew();
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
    await processLBXDocuments(); // <=== BU QO'SHILDI
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
    await processLBXDocuments(); // <=== BU HAM QO'SHILDI
    
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
  await processTechnicalDocumentsNew();
};

// processLBXDocuments funktsiyasi
const processLBXDocuments = async () => {
  await processLBXDocumentsNew();
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


// Ish tarixi modal funksiyalari
const openHistoryModal = (section) => {
  currentHistorySection.value = section;
  isHistoryModalOpen.value = true;
};

const closeHistoryModal = () => {
  isHistoryModalOpen.value = false;
  currentHistorySection.value = '';
};

// Helper funksiyalar
const getSectionTitle = (section) => {
  const titles = {
    conception: 'Konsepsiya',
    technical: 'Texnik vazifa',
    lbx: 'LBX'
  };
  return titles[section] || section;
};

// History ma'lumotlarini olish
const getHistoryData = (section) => {
  if (!projectData.value?.history) {
    return [];
  }
  
  let historyKey = '';
  switch(section) {
    case 'conception':
      historyKey = 'PROJECT_CONCEPT';
      break;
    case 'technical':
      historyKey = 'PROJECT_TS';
      break;
    case 'lbx':
      historyKey = 'PROJECT_EVALUATION_DOCUMENT';
      break;
    default:
      return [];
  }
  
  const historyArray = projectData.value.history[historyKey] || [];
  return historyArray.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

// Status matnini olish
const getStatusText = (status) => {
  const statusTexts = {
    'RESOLVED': 'Qayta ko\'rib chiqish uchun',
    'REJECTED': 'Izoh',
    'ACCEPTED': 'Tasdiqlangan',
    'TO_REVIEW': 'Ko\'rib chiqilmoqda',
    'NEW': 'Yangi'
  };
  return statusTexts[status] || status;
};

// Fayl yuklash funksiyasi (agar mavjud bo'lmasa)
const downloadProjectFile = async (fileUrl, fileName) => {
  console.log('Download bosdi:', fileUrl, fileName);
  
  if (!fileUrl) {
    toast.error('Fayl URL manzili topilmadi!', { autoClose: 2000 });
    return;
  }

  try {
    toast.info('Fayl yuklanmoqda...', { autoClose: 1000 });
    const fullUrl = fileUrl.startsWith('http') ? fileUrl : `https://back.miit.uz${fileUrl}`;
    window.open(fullUrl, '_blank');
    
    setTimeout(() => {
      toast.success('Fayl muvaffaqiyatli yuklandi!', { autoClose: 1000 });
    }, 1000);
  } catch (error) {
    console.error("Fayl yuklashda xato:", error);
    toast.error('Fayl yuklashda xatolik yuz berdi!', { autoClose: 2000 });
  }
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