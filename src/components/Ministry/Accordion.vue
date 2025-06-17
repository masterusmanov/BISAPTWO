<template>
  <div class="space-y-4">
    <!-- Konsepsiya Section -->
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
          <h3 class="text-[14px] font-medium text-gray-900">Konsepsiya</h3>
        </div>
        <div class="flex items-center space-x-4">
          <p v-if="projectDatatwo === 'TO_REVIEW'" class="text-[#4A51DD] text-[14px] font-[500]">
            <i class='bx bx-refresh text-[18px]'></i> Ko'rib chiqish
          </p>
          <p v-if="projectDatatwo === 'REJECTED'" class="text-[#FD5656] text-[14px] font-[500]">
            ! Izoh
          </p>
          <p v-if="projectDatatwo === 'ACCEPTED'" class="text-green-600 text-[14px] font-[500]">
            <i class='bx bx-check-circle text-[18px]'></i> Tasdiqlangan
          </p>
          <button v-if="projectDatatwo !== 'ACCEPTED'"
            @click="openHistoryModal('conception')"
            class="px-3 py-1 text-sm rounded transition-colors bg-[#F8F8F8] text-[#794A9A] font-bold hover:bg-gray-300"
          >
            <i class='bx bxs-briefcase-alt-2'></i> Ish tarixi
          </button>
          <button 
            v-if="projectDatatwo !== 'ACCEPTED'"
            :disabled="!allConceptionFilesUploaded || isLoading.conception || sectionStatuses.conception === 'ACCEPTED'"
            @click="sendConceptionFiles"
            :class="{
              'bg-blue-500 hover:bg-blue-600 text-white': allConceptionFilesUploaded && !isLoading.conception && sectionStatuses.conception !== 'ACCEPTED',
              'bg-gray-300 text-gray-500 cursor-not-allowed': !allConceptionFilesUploaded || isLoading.conception || sectionStatuses.conception === 'ACCEPTED'
            }"
            class="px-3 py-1 text-sm rounded transition-colors"
          >
            <i v-if="!isLoading.conception" class='bx bxl-telegram'></i>
            <i v-else class='bx bx-loader-alt animate-spin'></i>
            {{ isLoading.conception ? 'Yuborilmoqda...' : 'Yuborish' }}
          </button>
        </div>
      </div>
      
      <!-- Konsepsiya section content -->
      <div 
        v-show="openSections.conception"
        class="pb-4 transition-all duration-300 ease-in-out"
      >
        <div class="space-y-2 px-4">      
          <div v-for="(item, index) in conceptionItems" :key="item.key" class="flex items-center justify-between bg-gray-100 rounded-lg">
            <div class="flex items-center space-x-3">
              <div 
                :class="{
                  'bg-blue-500': fileStates.conception[item.key].uploaded,
                  'bg-gray-300': !fileStates.conception[item.key].uploaded
                }"
                class="w-8 h-16 text-white rounded-l flex items-center justify-center font-bold text-sm transition-colors"
              >
                {{ index + 2 }}
              </div>
              <div>
                <p class="text-sm text-gray-700">{{ formatDate(new Date()) }}</p>
                <p class="font-medium text-gray-700 text-sm">
                  {{ item.title }}
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-2 pr-4">
              <!-- Agar projectDatatwo ACCEPTED bo'lsa, "Tasdiqlandi" ko'rsatish -->
              <div v-if="projectDatatwo === 'ACCEPTED'" class="flex items-center text-green-600 text-sm font-medium px-2">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path 
                    fill-rule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                    clip-rule="evenodd"
                  />
                </svg>
                Tasdiqlandi
              </div>
              
              <!-- Agar projectDatatwo ACCEPTED bo'lmasa, file upload ko'rsatish -->
              <template v-else>
                <input 
                  type="file" 
                  :id="`conception-file${index + 2}`"
                  @change="handleFileUpload($event, 'conception', item.key)"
                  class="hidden"
                  accept=".pdf"
                  :disabled="projectDatatwo === 'ACCEPTED'"
                />
                <label 
                  :for="`conception-file${index + 2}`"
                  :class="{
                    'bg-blue-500 hover:bg-blue-600 text-white': fileStates.conception[item.key].uploaded,
                    'bg-gray-200 hover:bg-gray-300 text-gray-600': !fileStates.conception[item.key].uploaded,
                    'cursor-not-allowed opacity-50': sectionStatuses.conception === 'ACCEPTED'
                  }"
                  class="flex items-center space-x-1 text-sm px-2 py-1 rounded transition-colors cursor-pointer"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 17a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 12a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 7a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V7z"/>
                  </svg>
                  <span>{{ fileStates.conception[item.key].uploaded ? fileStates.conception[item.key].fileName : 'Fayl biriktirish' }}</span>
                </label>
                
                <div 
                  v-if="fileStates.conception[item.key].uploaded && sectionStatuses.conception !== 'ACCEPTED'"
                >
                  <button 
                    v-if="!fileStates.conception[item.key].saved"
                    @click="saveFile('conception', item.key)"
                    :disabled="isLoading.files[`conception_${item.key}`]"
                    class="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {{ isLoading.files[`conception_${item.key}`] ? 'Saqlanmoqda...' : 'Saqlash' }}
                  </button>
            
                  <div 
                    v-else
                    class="flex items-center space-x-2"
                  >
                    <div class="flex items-center text-green-600 text-sm font-medium">
                      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path 
                          fill-rule="evenodd" 
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                          clip-rule="evenodd"
                        />
                      </svg>
                      Saqlandi
                    </div>
                    <button 
                      @click="deleteFile('conception', item.key)"
                      :disabled="isLoading.files[`delete_conception_${item.key}`]"
                      class="bg-red-500 hover:bg-red-600 text-white p-1 rounded text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      <i v-if="!isLoading.files[`delete_conception_${item.key}`]" class='bx bx-x'></i>
                      <i v-else class='bx bx-loader-alt animate-spin'></i>
                      <!-- {{ isLoading.files[`delete_conception_${item.key}`] ? '' : 'O\'chirish' }} -->
                    </button>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

   <!-- Texnik vazifa Section -->
<div class="bg-white rounded-[8px]" :class="{ 'opacity-50': !isTechnicalEnabled }">
  <div class="w-full flex items-center justify-between px-4 py-2 text-left transition-colors">
    <div 
      @click="isTechnicalEnabled && toggleSection('technical')" 
      class="flex items-center space-x-2"
      :class="{ 'cursor-pointer': isTechnicalEnabled, 'cursor-not-allowed': !isTechnicalEnabled }"
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
      <h3 class="font-medium text-gray-900 text-sm">Texnik vazifa</h3>
      <span v-if="!isTechnicalEnabled" class="text-xs text-gray-500">(Konsepsiya tasdiqlanmagan)</span>
    </div>
    <div class="flex items-center space-x-4">
      <p v-if="technicalProjectStatus === 'TO_REVIEW'" class="text-[#4A51DD] text-[14px] font-[500]">
        <i class='bx bx-refresh text-[18px]'></i> Ko'rib chiqish
      </p>
      <p v-if="technicalProjectStatus === 'REJECTED'" class="text-[#FD5656] text-[14px] font-[500]">
        ! Izoh
      </p>
      <p v-if="technicalProjectStatus === 'ACCEPTED'" class="text-green-600 text-[14px] font-[500]">
        <i class='bx bx-check-circle text-[18px]'></i> Tasdiqlangan
      </p>
      <button 
        v-if="isTechnicalEnabled && technicalProjectStatus !== 'ACCEPTED'"
        @click="openHistoryModal('technical')"
        class="px-3 py-1 text-sm rounded transition-colors bg-[#F8F8F8] text-[#794A9A] font-bold hover:bg-gray-300"
      >
        <i class='bx bxs-briefcase-alt-2'></i> Ish tarixi
      </button>
      <button 
        v-if="isTechnicalEnabled && technicalProjectStatus !== 'ACCEPTED'"
        :disabled="!allTechnicalFilesUploaded || isLoading.technical"
        @click="sendTechnicalFiles"
        :class="{
          'bg-blue-500 hover:bg-blue-600 text-white': allTechnicalFilesUploaded && !isLoading.technical,
          'bg-gray-300 text-gray-500 cursor-not-allowed': !allTechnicalFilesUploaded || isLoading.technical
        }"
        class="px-3 py-1 text-sm rounded transition-colors"
      >
        <i v-if="!isLoading.technical" class='bx bxl-telegram'></i>
        <i v-else class='bx bx-loader-alt animate-spin'></i>
        {{ isLoading.technical ? 'Yuborilmoqda...' : 'Yuborish' }}
      </button>
    </div>
  </div>
  
  <!-- Technical section content -->
  <div 
    v-show="openSections.technical && isTechnicalEnabled"
    class="pb-4 transition-all duration-300 ease-in-out"
  >
    <div class="space-y-2 px-4">
      <div v-for="(item, index) in technicalItems" :key="item.key" class="flex items-center justify-between rounded-lg" :class="index === 0 ? 'bg-[#F8F8F8]' : 'bg-gray-100'">
        <div class="flex items-center space-x-3">
          <div 
            :class="{
              'bg-blue-500': fileStates.technical[item.key].uploaded,
              'bg-gray-300': !fileStates.technical[item.key].uploaded
            }"
            class="w-8 h-16 text-white rounded-l flex items-center justify-center font-bold text-sm transition-colors"
          >
            {{ index + 1 }}
          </div>
          <div>
            <p class="text-sm text-gray-700">{{ formatDate(new Date()) }}</p>
            <p class="font-medium text-gray-700 text-sm">
              {{ item.title }}
            </p>
          </div>
        </div>
        <div class="flex items-center space-x-2 pr-4">
          <!-- Agar technicalProjectStatus ACCEPTED bo'lsa, "Tasdiqlandi" ko'rsatish -->
          <div v-if="technicalProjectStatus === 'ACCEPTED'" class="flex items-center text-green-600 text-sm font-medium px-2">
            <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path 
                fill-rule="evenodd" 
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                clip-rule="evenodd"
              />
            </svg>
            Tasdiqlandi
          </div>
          
          <!-- Agar technicalProjectStatus ACCEPTED bo'lmasa, file upload ko'rsatish -->
          <template v-else>
            <input 
              type="file" 
              :id="`technical-file${index + 1}`"
              @change="handleFileUpload($event, 'technical', item.key)"
              class="hidden"
              accept=".pdf,.doc,.docx"
              :disabled="technicalProjectStatus === 'ACCEPTED'"
            />
            <label 
              :for="`technical-file${index + 1}`"
              :class="{
                'bg-blue-500 hover:bg-blue-600 text-white': fileStates.technical[item.key].uploaded,
                'bg-gray-200 hover:bg-gray-300 text-gray-600': !fileStates.technical[item.key].uploaded,
                'cursor-not-allowed opacity-50': technicalProjectStatus === 'ACCEPTED'
              }"
              class="flex items-center space-x-1 text-sm px-2 py-1 rounded transition-colors cursor-pointer"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 17a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 12a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 7a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V7z"/>
              </svg>
              <span>{{ fileStates.technical[item.key].uploaded ? fileStates.technical[item.key].fileName : 'Fayl biriktirish' }}</span>
            </label>
            
            <div 
              v-if="fileStates.technical[item.key].uploaded && technicalProjectStatus !== 'ACCEPTED'"
            >
              <button 
                v-if="!fileStates.technical[item.key].saved"
                @click="saveFile('technical', item.key)"
                :disabled="isLoading.files[`technical_${item.key}`]"
                class="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50"
              >
                {{ isLoading.files[`technical_${item.key}`] ? 'Saqlanmoqda...' : 'Saqlash' }}
              </button>
              
              <div 
                v-else
                class="flex items-center space-x-2"
              >
                <div class="flex items-center text-green-600 text-sm font-medium">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path 
                      fill-rule="evenodd" 
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                      clip-rule="evenodd"
                    />
                  </svg>
                  Saqlandi
                </div>
                <button 
                  @click="deleteFile('technical', item.key)"
                  :disabled="isLoading.files[`delete_technical_${item.key}`]"
                  class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <i v-if="!isLoading.files[`delete_technical_${item.key}`]" class='bx bx-trash'></i>
                  <i v-else class='bx bx-loader-alt animate-spin'></i>
                  {{ isLoading.files[`delete_technical_${item.key}`] ? '' : 'O\'chirish' }}
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</div>

    <!-- LBX Section -->
    <div class="bg-white rounded-[8px]" :class="{ 'opacity-50': !isLbxEnabled }">
      <div class="w-full flex items-center justify-between px-4 py-2 text-left transition-colors">
        <div 
          @click="isLbxEnabled && toggleSection('lbx')" 
          class="flex items-center space-x-2"
          :class="{ 'cursor-pointer': isLbxEnabled, 'cursor-not-allowed': !isLbxEnabled }"
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
          <h3 class="font-medium text-gray-900 text-sm">LBX</h3>
          <span v-if="!isLbxEnabled" class="text-xs text-gray-500">(Texnik vazifa tasdiqlanmagan)</span>
        </div>
        <div class="flex items-center space-x-4">
          <p v-if="sectionStatuses.lbx === 'TO_REVIEW'" class="text-[#4A51DD] text-[14px] font-[500]">
            <i class='bx bx-refresh text-[18px]'></i> Ko'rib chiqish
          </p>
          <p v-if="sectionStatuses.lbx === 'REJECTED'" class="text-[#FD5656] text-[14px] font-[500]">
            ! Izoh
          </p>
          <p v-if="sectionStatuses.lbx === 'ACCEPTED'" class="text-green-600 text-[14px] font-[500]">
            <i class='bx bx-check-circle text-[18px]'></i> Tasdiqlangan
          </p>
          <button 
            v-if="isLbxEnabled"
            @click="openHistoryModal('lbx')"
            class="px-3 py-1 text-sm rounded transition-colors bg-[#F8F8F8] text-[#794A9A] font-bold hover:bg-gray-300"
          >
            <i class='bx bxs-briefcase-alt-2'></i> Ish tarixi
          </button>
          <button 
            v-if="isLbxEnabled && sectionStatuses.lbx !== 'ACCEPTED'"
            :disabled="!allLbxFilesUploaded || isLoading.lbx"
            @click="sendLbxFiles"
            :class="{
              'bg-blue-500 hover:bg-blue-600 text-white': allLbxFilesUploaded && !isLoading.lbx,
              'bg-gray-300 text-gray-500 cursor-not-allowed': !allLbxFilesUploaded || isLoading.lbx
            }"
            class="px-3 py-1 text-sm rounded transition-colors"
          >
            <i v-if="!isLoading.lbx" class='bx bxl-telegram'></i>
            <i v-else class='bx bx-loader-alt animate-spin'></i>
            {{ isLoading.lbx ? 'Yuborilmoqda...' : 'Yuborish' }}
          </button>
        </div>
      </div>
      
      <!-- LBX section content -->
      <div 
        v-show="openSections.lbx && isLbxEnabled"
        class="pb-4 transition-all duration-300 ease-in-out"
      >
        <div class="space-y-2 px-4">
          <div v-for="(item, index) in lbxItems" :key="item.key" class="flex items-center justify-between rounded-lg" :class="index === 0 ? 'bg-[#F8F8F8]' : 'bg-gray-100'">
            <div class="flex items-center space-x-3">
              <div 
                :class="{
                  'bg-blue-500': fileStates.lbx[item.key].uploaded,
                  'bg-gray-300': !fileStates.lbx[item.key].uploaded
                }"
                class="w-8 h-16 text-white rounded-l flex items-center justify-center font-bold text-sm transition-colors"
              >
                {{ index + 1 }}
              </div>
              <div>
                <p class="text-sm text-gray-700">{{ formatDate(new Date()) }}</p>
                <p class="font-medium text-gray-700 text-sm">
                  {{ item.title }}
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-2 pr-4">
              <input 
                type="file" 
                :id="`lbx-file${index + 1}`"
                @change="handleFileUpload($event, 'lbx', item.key)"
                class="hidden"
                accept=".pdf,.doc,.docx"
                :disabled="sectionStatuses.lbx === 'ACCEPTED'"
              />
              <label 
                :for="`lbx-file${index + 1}`"
                :class="{
                  'bg-blue-500 hover:bg-blue-600 text-white': fileStates.lbx[item.key].uploaded,
                  'bg-gray-200 hover:bg-gray-300 text-gray-600': !fileStates.lbx[item.key].uploaded,
                  'cursor-not-allowed opacity-50': sectionStatuses.lbx === 'ACCEPTED'
                }"
                class="flex items-center space-x-1 text-sm px-2 py-1 rounded transition-colors cursor-pointer"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 17a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 12a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 7a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V7z"/>
                </svg>
                <span>{{ fileStates.lbx[item.key].uploaded ? fileStates.lbx[item.key].fileName : 'Fayl biriktirish' }}</span>
              </label>
              
              <div v-if="fileStates.lbx[item.key].uploaded && sectionStatuses.lbx !== 'ACCEPTED'">
                <button 
                  v-if="!fileStates.lbx[item.key].saved"
                  @click="saveFile('lbx', item.key)"
                  :disabled="isLoading.files[`lbx_${item.key}`]"
                  class="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {{ isLoading.files[`lbx_${item.key}`] ? 'Saqlanmoqda...' : 'Saqlash' }}
                </button>
                <div 
                  v-else
                  class="flex items-center space-x-2"
                >
                  <div class="flex items-center text-green-600 text-sm font-medium">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                    Saqlandi
                  </div>
                  <button 
                    @click="deleteFile('lbx', item.key)"
                    :disabled="isLoading.files[`delete_lbx_${item.key}`]"
                    class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    <i v-if="!isLoading.files[`delete_lbx_${item.key}`]" class='bx bx-trash'></i>
                    <i v-else class='bx bx-loader-alt animate-spin'></i>
                    {{ isLoading.files[`delete_lbx_${item.key}`] ? '' : 'O\'chirish' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
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
              {{ getSectionTitle(currentSection) }} - {{ $t('historywork')}}
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
        <div class=" max-h-[70vh] overflow-y-auto">
          <div class="space-y-2">
            
            <!-- Status history -->
            <div v-if="projectDatatwo === 'TO_REVIEW'" class="flex items-center justify-between">
              <div class="space-y-2 bg-gray-200 w-full p-4">
                <p class="text-[14px] font-semibold text-[#6DA1F8] flex items-center">
                  <i class='bx bx-info-circle text-[18px] mr-1'></i>
                  {{"Qayta ko'rib chiqish uchun"}}
                </p>
                <p class="text-[12px] text-gray-500 font-semibold">{{ projectDatatthree.slice(0, 10) }} {{projectDatatthree.slice(12, 16)}}</p>
              </div>
            </div>

            <div v-if="projectDatatwo === 'TO_REVIEW'" class="m-4 mt-[50px] p-4 bg-red-50 border-l-4 border-red-400 rounded">
              <p class="text-justify">{{ projectDatatwoansware || 'Izoh mavjud emas' }}</p>
            </div>

            <div v-else-if="projectDatatwo === 'REJECTED'" class="flex items-center justify-between">
              <div class="space-y-2 bg-gray-200 w-full p-4">
                <p class="text-[14px] font-semibold text-[#F60000] flex items-center">
                  <i class='bx bx-info-circle text-[18px] mr-1'></i>
                  {{$t('remark')}}
                </p>
                <p class="text-[12px] text-gray-500 font-semibold">{{ projectDatatthree.slice(0, 10) }} {{projectDatatthree.slice(12, 16)}}</p>
              </div>
            </div>

            <div v-if="projectDatatwo === 'REJECTED'" class="m-4 mt-[50px] p-4 bg-red-50 border-l-4 border-red-400 rounded">
              <p class="text-justify">{{ projectDatatwoansware || 'Izoh mavjud emas' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { toast } from 'vue3-toastify';
import "vue3-toastify/dist/index.css";
import axios from 'axios';




// Loyihani saqlash uchun reactive ref
const projectData = ref(null);
const loading = ref(false);
const error = ref(null);

// Computed property holatiga o'tkazamiz
const projectDatatwo = computed(() => {
  return projectData.value?.project_documents[0]?.status || '';
});
const projectDatatthree = computed(() => {
  return projectData.value?.project_documents[0]?.documents[0]?.answers[0]?.created_at || '';
});

const projectDatatwoansware = computed(() => {
  return projectData.value?.project_documents[0]?.documents[0]?.answers[0]?.answer || '';
});



// Ma'lumotni olish funksiyasi
const fetchProjectData = async () => {
  const selectedMinistry = JSON.parse(sessionStorage.getItem('selectMinistry'));
  console.log("Tanlangan vazirlik ma'lumotlari:", selectedMinistry);

  const selectedMinistryId = selectedMinistry?.id;
  console.log("Tanlangan vazirlik idsi:", selectedMinistryId);

  if (!selectedMinistryId) {
    error.value = 'Vazirlik ID topilmadi';
    return;
  }

  loading.value = true;
  try {
    const getAuthToken = () => {
      return localStorage.getItem('token') || sessionStorage.getItem('token') || '';
    };
    const response = await axios.get(`https://back.miit.uz/api/bisap/test/project/${selectedMinistryId}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });
    projectData.value = response.data.data;
    console.log("Project data now:", projectData.value?.project_documents[0]?.documents[0]?.answers[0]?.answer);
  } catch (err) {
    console.error(err);
    error.value = 'Ma\'lumotni olishda xatolik yuz berdi';
  } finally {
    loading.value = false;
  }
};


// API Base URL
const API_BASE_URL = 'https://back.miit.uz/api/bisap/test';

// Get auth token from localStorage or sessionStorage
const getAuthToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token') || '';
};

// Axios instance with auth header
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${getAuthToken()}`
  }
});

// Section items configuration
const conceptionItems = ref([
  { key: 'item1', title: 'Konsepsiya loyihasi', fileKey: 'concept_project_file_id' },
  { key: 'item2', title: 'Konsepsiya loyihasi', fileKey: 'letter_file_id' },
  { key: 'item3', title: 'Ilmiy-texnik kengash protokoli (ITK)', fileKey: 'protocol_file_id' },
  { key: 'item4', title: 'Xorijiy delegatlar tahlili natijalari - Kengash qarori', fileKey: 'solution_file_id' }
]);

const technicalItems = ref([
  { key: 'item1', title: 'Texnik vazifa', fileKey: 'technical_task_file_id' },
  { key: 'item2', title: 'Texnik hujjatlar', fileKey: 'technical_docs_file_id' },
  { key: 'item3', title: 'Sxemalar va chizmalar', fileKey: 'schemas_file_id' },
  { key: 'item4', title: 'Qo\'shimcha texnik materiallar', fileKey: 'additional_tech_file_id' }
]);

const lbxItems = ref([
  { key: 'item1', title: 'LBX hujjat', fileKey: 'lbx_document_file_id' },
  { key: 'item2', title: 'LBX spesifikatsiya', fileKey: 'lbx_specification_file_id' },
  { key: 'item3', title: 'LBX test protokoli', fileKey: 'lbx_test_protocol_file_id' },
  { key: 'item4', title: 'LBX hisobot', fileKey: 'lbx_report_file_id' }
]);

// Document IDs storage
const documentIds = reactive({
  conception: null,
  technical: null,
  lbx: null
});

// Accordion states
const openSections = reactive({
  conception: true,
  technical: false,
  lbx: false
});

// File upload states
const fileStates = reactive({
  conception: {
    item1: { uploaded: false, fileName: '', file: null, saved: false, fileId: null },
    item2: { uploaded: false, fileName: '', file: null, saved: false, fileId: null },
    item3: { uploaded: false, fileName: '', file: null, saved: false, fileId: null },
    item4: { uploaded: false, fileName: '', file: null, saved: false, fileId: null }
  },
  technical: {
    item1: { uploaded: false, fileName: '', file: null, saved: false, fileId: null },
    item2: { uploaded: false, fileName: '', file: null, saved: false, fileId: null },
    item3: { uploaded: false, fileName: '', file: null, saved: false, fileId: null },
    item4: { uploaded: false, fileName: '', file: null, saved: false, fileId: null }
  },
  lbx: {
    item1: { uploaded: false, fileName: '', file: null, saved: false, fileId: null },
    item2: { uploaded: false, fileName: '', file: null, saved: false, fileId: null },
    item3: { uploaded: false, fileName: '', file: null, saved: false, fileId: null },
    item4: { uploaded: false, fileName: '', file: null, saved: false, fileId: null }
  }
});

// Loading states
const isLoading = reactive({
  conception: false,
  technical: false,
  lbx: false,
  files: {}
});

// Section statuses
const sectionStatuses = reactive({
  conception: 'NEW',
  technical: 'NEW',
  lbx: 'NEW'
});

// Rejection comments
const rejectionComments = reactive({
  conception: '',
  technical: '',
  lbx: ''
});

// Modal states
const isHistoryModalOpen = ref(false);
const currentSection = ref('');

// File IDs storage for API
const fileIds = reactive({
  conception: {},
  technical: {},
  lbx: {}
});



// Computed properties
const allConceptionFilesUploaded = computed(() => 
  Object.values(fileStates.conception).every(state => state.saved)
);

const allTechnicalFilesUploaded = computed(() => 
  Object.values(fileStates.technical).every(state => state.saved)
);

const allLbxFilesUploaded = computed(() => 
  Object.values(fileStates.lbx).every(state => state.saved)
);

const isTechnicalEnabled = computed(() => 
  projectDatatwo.value === 'ACCEPTED'
);



// Methods
const toggleSection = (section) => {
  openSections[section] = !openSections[section];
};

const formatDate = (date) => {
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const handleFileUpload = (event, section, item) => {
  const file = event.target.files[0];
  if (file) {
    fileStates[section][item] = {
      uploaded: true,
      fileName: file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name,
      file: file,
      saved: false,
      fileId: null
    };
  }
};

const saveFile = async (section, item) => {
  const fileData = fileStates[section][item];
  if (!fileData.file) return;

  // Create unique key for loading state
  const loadingKey = `${section}_${item}`;
  isLoading.files[loadingKey] = true;

  try {
    const formData = new FormData();
    formData.append('file', fileData.file);

    const response = await api.post('/files/create', formData, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log(response.data.data);
    
    if (response.data && response.data.data.id) {
      // Update file state
      fileStates[section][item].saved = true;
      fileStates[section][item].fileId = response.data.data.id;
      
      // Find the correct fileKey from items configuration
      let fileKey = '';
      const sectionItems = section === 'conception' ? conceptionItems.value : 
                         section === 'technical' ? technicalItems.value : 
                         lbxItems.value;
      
      const itemConfig = sectionItems.find(i => i.key === item);
      if (itemConfig) {
        fileKey = itemConfig.fileKey;
        fileIds[section][fileKey] = response.data.data.id;
        console.log(fileData.fileName, 'saved with ID:', response.data.data.id);
        console.log(fileData.fileName, 'saved with ID fileIDS:', fileIds[section][fileKey]);
      }
      
      toast.success(`Fayl "${fileData.fileName}" muvaffaqiyatli saqlandi!`, {
        autoClose: 2000
      });
    }
  } catch (error) {
    console.error('File upload error:', error);
    toast.error('Faylni saqlashda xatolik yuz berdi!', {
      autoClose: 3000
    });
  } finally {
    isLoading.files[loadingKey] = false;
  }
};

// Yangi deleteFile funksiyasi
const deleteFile = async (section, item) => {
  const fileData = fileStates[section][item];
  if (!fileData.fileId) return;

  // Create unique key for loading state
  const loadingKey = `delete_${section}_${item}`;
  isLoading.files[loadingKey] = true;

  try {
    // API ga delete so'rovi yuborish (agar kerak bo'lsa)
    // await api.delete(`/files/${fileData.fileId}`);
    
    // File state ni tozalash
    fileStates[section][item] = {
      uploaded: false,
      fileName: '',
      file: null,
      saved: false,
      fileId: null
    };
    
    // fileIds dan ham o'chirish
    const sectionItems = section === 'conception' ? conceptionItems.value : 
                       section === 'technical' ? technicalItems.value : 
                       lbxItems.value;
    
    const itemConfig = sectionItems.find(i => i.key === item);
    if (itemConfig) {
      delete fileIds[section][itemConfig.fileKey];
    }
    
    // Input elementini tozalash - bu muhim!
    const inputId = section === 'conception' ? `conception-file${conceptionItems.value.findIndex(i => i.key === item) + 2}` :
                    section === 'technical' ? `technical-file${technicalItems.value.findIndex(i => i.key === item) + 1}` :
                    `lbx-file${lbxItems.value.findIndex(i => i.key === item) + 1}`;
    
    const inputElement = document.getElementById(inputId);
    if (inputElement) {
      inputElement.value = '';
    }
    
    toast.success('Fayl muvaffaqiyatli o\'chirildi!', {
      autoClose: 2000
    });
  } catch (error) {
    console.error('File delete error:', error);
    toast.error('Faylni o\'chirishda xatolik yuz berdi!', {
      autoClose: 3000
    });
  } finally {
    isLoading.files[loadingKey] = false;
  }
};

const createProjectDocument = async (type, projectId) => {
  try {

    const projectDoc = {
      status: 'NEW',
      type: type,
      project_id: projectId
    }

    const response = await api.post('/project-documents/create', projectDoc, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Project document created response:', response.data);
    
    // Response dan to'g'ri project document ID ni qaytarish
    if (response.data && response.data.data && response.data.data.id) {
      return response.data.data.id; // Project document ID
    } else {
      throw new Error('Project document ID not found in response');
    }
  } catch (error) {
    console.error('Project document creation error:', error);
    throw error;
  }
};

const sendConceptionFiles = async () => {
  isLoading.conception = true;
  try {
    // Get ministry ID from sessionStorage
    const ministryId = JSON.parse(sessionStorage.getItem('selectMinistry'));
    console.log('Ministry ID:', ministryId.id);
    if (!ministryId.id) {
      throw new Error('Ministry ID not found in sessionStorage');
    }

    // Create project document
    const projectDocumentResponse = await createProjectDocument('PROJECT_CONCEPT', ministryId.id);
    console.log("Project document response:", projectDocumentResponse);
    
    // projectDocumentResponse ni to'g'ri olish
    const projectDocumentId = projectDocumentResponse; // yoki projectDocumentResponse.id agar response object bo'lsa
    
    sessionStorage.setItem('conceptionDocumentId', projectDocumentId);
    documentIds.conception = projectDocumentId;

    // Prepare document data - to'g'ri project_document_id ishlatish
    const documentData = {
      project_document_id: projectDocumentId, // Bu projectDocumentId bo'lishi kerak, ministryId.id emas
      letter_file_id: fileIds.conception.letter_file_id,
      solution_file_id: fileIds.conception.solution_file_id,
      concept_project_file_id: fileIds.conception.concept_project_file_id,
      protocol_file_id: fileIds.conception.protocol_file_id
    };

    console.log("Document data being sent:", documentData);
    
    // Send document data
    const response = await api.post('/documents/create', documentData, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    console.log("Documents create response:", response.data);

    if (response.data) {
      sectionStatuses.conception = 'TO_REVIEW';
      toast.success('Konsepsiya hujjatlari muvaffaqiyatli yuborildi!', {
        autoClose: 3000
      });
    }
  } catch (error) {
    console.error('Send conception files error:', error);
    toast.error('Konsepsiya hujjatlarini yuborishda xatolik yuz berdi!', {
      autoClose: 3000
    });
  } finally {
    isLoading.conception = false;
  }
};

const sendTechnicalFiles = async () => {
  isLoading.technical = true;

  try {
    const ministryId = JSON.parse(sessionStorage.getItem('selectMinistry'));
    console.log('Ministry ID:', ministryId.id);

    if (!ministryId.id) {
      throw new Error('Ministry ID not found in sessionStorage');
    }

    // Create project document for technical
    const projectDocumentId = await createProjectDocument('PROJECT_TS', ministryId.id);
    sessionStorage.setItem('technicalDocumentId', projectDocumentId);
    documentIds.technical = projectDocumentId;

    // Prepare document data
    const documentData = {
      project_document_id: projectDocumentId,
      technical_task_file_id: fileIds.technical.technical_task_file_id,
      technical_docs_file_id: fileIds.technical.technical_docs_file_id,
      schemas_file_id: fileIds.technical.schemas_file_id,
      additional_tech_file_id: fileIds.technical.additional_tech_file_id
    };

    // Send document data
    const response = await api.post('/documents/create', documentData, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    console.log("Technical Documents create response:", response.data);

    if (response.data) {
      sectionStatuses.technical = 'TO_REVIEW';
      toast.success('Texnik vazifa hujjatlari muvaffaqiyatli yuborildi!', {
        autoClose: 3000
      });
    }
  } catch (error) {
    console.error('Send technical files error:', error);
    toast.error('Texnik vazifa hujjatlarini yuborishda xatolik yuz berdi!', {
      autoClose: 3000
    });
  } finally {
    isLoading.technical = false;
  }
};

const sendLbxFiles = async () => {
  isLoading.lbx = true;

  try {
    const ministryId = sessionStorage.getItem('selectMinistry');
    if (!ministryId) {
      throw new Error('Ministry ID not found in sessionStorage');
    }

    // Create project document for LBX
    const projectDocumentId = await createProjectDocument('PROJECT_EVALUATION_DOCUMENT', ministryId);
    documentIds.lbx = projectDocumentId;
    sessionStorage.setItem('lbxDocumentId', projectDocumentId);

    // Prepare document data
    const documentData = {
      project_document_id: projectDocumentId,
      lbx_document_file_id: fileIds.lbx.item1,
      lbx_specification_file_id: fileIds.lbx.item2,
      lbx_test_protocol_file_id: fileIds.lbx.item3,
      lbx_report_file_id: fileIds.lbx.item4
    };

    // Send document data
    const response = await api.post('/documents/create', documentData);

    if (response.data) {
      sectionStatuses.lbx = 'TO_REVIEW';
      toast.success('LBX hujjatlari muvaffaqiyatli yuborildi!', {
        autoClose: 3000
      });
    }
  } catch (error) {
    console.error('Send LBX files error:', error);
    toast.error('LBX hujjatlarini yuborishda xatolik yuz berdi!', {
      autoClose: 3000
    });
  } finally {
    isLoading.lbx = false;
  }
};

const openHistoryModal = (section) => {
  currentSection.value = section;
  isHistoryModalOpen.value = true;
};

const closeHistoryModal = () => {
  isHistoryModalOpen.value = false;
  currentSection.value = '';
};

const getSectionTitle = (section) => {
  const titles = {
    conception: 'Konsepsiya',
    technical: 'Texnik vazifa',
    lbx: 'LBX'
  };
  return titles[section] || section;
};

const getSectionItems = (section) => {
  const items = {
    conception: conceptionItems.value,
    technical: technicalItems.value,
    lbx: lbxItems.value
  };
  return items[section] || [];
};

const downloadFile = async (section, itemKey) => {
  const fileId = fileStates[section][itemKey].fileId;
  if (!fileId) {
    toast.error('Fayl topilmadi!', { autoClose: 2000 });
    return;
  }

  try {
    const response = await api.get(`/files/download/${fileId}`, {
      responseType: 'blob'
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileStates[section][itemKey].fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    toast.success('Fayl muvaffaqiyatli yuklandi!', { autoClose: 2000 });
  } catch (error) {
    console.error('Download error:', error);
    toast.error('Faylni yuklashda xatolik yuz berdi!', { autoClose: 3000 });
  }
};

// Check document statuses on mount
const checkDocumentStatuses = async () => {
  try {
    const conceptionId = sessionStorage.getItem('conceptionDocumentId');
    const technicalId = sessionStorage.getItem('technicalDocumentId');
    const lbxId = sessionStorage.getItem('lbxDocumentId');

    if (conceptionId) {
      const response = await api.get(`/project-documents/${conceptionId}`);
      if (response.data) {
        sectionStatuses.conception = response.data.status;
        if (response.data.comment) {
          rejectionComments.conception = response.data.comment;
        }
      }
    }

    if (technicalId) {
      const response = await api.get(`/project-documents/${technicalId}`);
      if (response.data) {
        sectionStatuses.technical = response.data.status;
        if (response.data.comment) {
          rejectionComments.technical = response.data.comment;
        }
      }
    }

    if (lbxId) {
      const response = await api.get(`/project-documents/${lbxId}`);
      if (response.data) {
        sectionStatuses.lbx = response.data.status;
        if (response.data.comment) {
          rejectionComments.lbx = response.data.comment;
        }
      }
    }
  } catch (error) {
    console.error('Error checking document statuses:', error);
  }
};


// technikal section ============================
// Texnik vazifa uchun computed properties
const technicalProjectStatus = computed(() => {
  // Texnik vazifa uchun project document index ni topish
  const technicalDoc = projectData.value?.project_documents?.find(doc => doc.type === 'PROJECT_TS');
  return technicalDoc?.status || '';
});

const technicalProjectCreatedAt = computed(() => {
  const technicalDoc = projectData.value?.project_documents?.find(doc => doc.type === 'PROJECT_TS');
  return technicalDoc?.documents?.[0]?.answers?.[0]?.created_at || '';
});

const technicalProjectAnswer = computed(() => {
  const technicalDoc = projectData.value?.project_documents?.find(doc => doc.type === 'PROJECT_TS');
  return technicalDoc?.documents?.[0]?.answers?.[0]?.answer || '';
});

// LBX uchun computed properties
const lbxProjectStatus = computed(() => {
  const lbxDoc = projectData.value?.project_documents?.find(doc => doc.type === 'PROJECT_EVALUATION_DOCUMENT');
  return lbxDoc?.status || '';
});

const lbxProjectCreatedAt = computed(() => {
  const lbxDoc = projectData.value?.project_documents?.find(doc => doc.type === 'PROJECT_EVALUATION_DOCUMENT');
  return lbxDoc?.documents?.[0]?.answers?.[0]?.created_at || '';
});

const lbxProjectAnswer = computed(() => {
  const lbxDoc = projectData.value?.project_documents?.find(doc => doc.type === 'PROJECT_EVALUATION_DOCUMENT');
  return lbxDoc?.documents?.[0]?.answers?.[0]?.answer || '';
});

// Modal content uchun section bo'yicha ma'lumot olish
const getCurrentSectionData = (section) => {
  if (section === 'conception') {
    return {
      status: projectDatatwo.value,
      createdAt: projectDatatthree.value,
      answer: projectDatatwoansware.value
    };
  } else if (section === 'technical') {
    return {
      status: technicalProjectStatus.value,
      createdAt: technicalProjectCreatedAt.value,
      answer: technicalProjectAnswer.value
    };
  } else if (section === 'lbx') {
    return {
      status: lbxProjectStatus.value,
      createdAt: lbxProjectCreatedAt.value,
      answer: lbxProjectAnswer.value
    };
  }
  return {
    status: '',
    createdAt: '',
    answer: ''
  };
};

// isLbxEnabled ni yangilash
const isLbxEnabled = computed(() => 
  technicalProjectStatus.value === 'ACCEPTED'
);

// Modal content ni yangilash
const updateModalContent = () => {
  // Modal content templateni yangilash kerak bo'ladi
  // currentSection.value ga qarab tegishli ma'lumotlarni ko'rsatish
  const sectionData = getCurrentSectionData(currentSection.value);
  
  return {
    status: sectionData.status,
    createdAt: sectionData.createdAt,
    answer: sectionData.answer
  };
};

// / technical section ==============================================

watch(() => sessionStorage.getItem('selectMinistry'), (newVal) => {
  if (newVal) {
    // Loyiha o'zgarganda file states ni tozalash
    Object.keys(fileStates).forEach(section => {
      Object.keys(fileStates[section]).forEach(item => {
        fileStates[section][item] = {
          uploaded: false,
          fileName: '',
          file: null,
          saved: false,
          fileId: null
        };
      });
    });
    
    // Yangi loyiha ma'lumotlarini olish
    fetchProjectData();
  }
});


// Lifecycle hooks
onMounted(() => {
  fetchProjectData()
  checkDocumentStatuses();
});
</script>

<style scoped>
/* Custom scrollbar styles */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Animation for loading spinner */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>