<!-- Accordion.vue -->
<template>
  <div class="space-y-4">
    <!-- Konsepsiya Section -->
    <div class="bg-white border-b border-gray-200 rounded-[8px]">
      <div
        class="w-full flex items-center justify-between px-4 py-2 text-left transition-colors"
      >
        <div
          @click="toggleSection('conception')"
          class="flex items-center space-x-2 cursor-pointer"
        >
          <svg
            :class="{ 'rotate-90': openSections.conception }"
            class="w-4 h-4 transform transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
          <h3 class="text-[14px] font-medium text-gray-900">Konsepsiya</h3>
        </div>
        <div class="flex items-center space-x-4">
          <p
            v-if="projectDatatwo === 'RESOLVED'"
            class="text-[#4A51DD] text-[14px] font-[500]"
          >
            <i class="bx bx-refresh text-[18px]"></i> Ko'rib chiqish
          </p>
          <p
            v-if="projectDatatwo === 'REJECTED'"
            class="text-[#FD5656] text-[14px] font-[500]"
          >
            ! Izoh
          </p>
          <button
            @click="openHistoryModal('conception')"
            class="px-3 py-1 text-sm rounded transition-colors bg-[#F8F8F8] text-[#794A9A] font-bold hover:bg-gray-300"
          >
            <i class="bx bxs-briefcase-alt-2"></i> Ish tarixi
          </button>
          <p
            v-if="projectDatatwo === 'ACCEPTED'"
            class="text-green-600 text-[14px] font-[500]"
          >
            <i class="bx bx-check-circle text-[18px]"></i> Tasdiqlangan
          </p>
          <button
            v-if="projectDatatwo !== 'ACCEPTED'"
            :disabled="
              !allConceptionFilesUploaded ||
              isLoading.conception ||
              sectionStatuses.conception === 'ACCEPTED'
            "
            @click="sendConceptionFiles"
            :class="{
              'bg-blue-500 hover:bg-blue-600 text-white':
                allConceptionFilesUploaded &&
                !isLoading.conception &&
                sectionStatuses.conception !== 'ACCEPTED',
              'bg-gray-300 text-gray-500 cursor-not-allowed':
                !allConceptionFilesUploaded ||
                isLoading.conception ||
                sectionStatuses.conception === 'ACCEPTED',
            }"
            class="px-3 py-1 text-sm rounded transition-colors"
          >
            <i v-if="!isLoading.conception" class="bx bxl-telegram"></i>
            <i v-else class="bx bx-loader-alt animate-spin"></i>
            {{ isLoading.conception ? "Yuborilmoqda..." : "Yuborish" }}
          </button>
        </div>
      </div>

      <!-- Konsepsiya section content -->
      <div
        v-show="openSections.conception"
        class="pb-4 transition-all duration-300 ease-in-out"
      >
        <div v-if="projectDatatwo !== 'ACCEPTED'" class="mb-4 w-full flex px-4 py-3 space-x-4">
          <input
            v-model="docDateData.docnumberconcep"
            type="text"
            class="w-[200px] ml-auto px-4 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Hujjat raqami №. . ."
          />
          <input v-model="docDateData.selectedDate" type="date" class="w-[150px] px-4 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Sanani tanlang">
        </div>
        <div class="space-y-2 px-4">
          <div
            v-for="(item, index) in conceptionItems"
            :key="item.key"
            class="flex items-center justify-between bg-gray-100 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <div
                :class="{
                  'bg-blue-500': fileStates.conception[item.key].uploaded,
                  'bg-gray-300': !fileStates.conception[item.key].uploaded,
                }"
                class="w-8 h-16 text-white rounded-l flex items-center justify-center font-bold text-sm transition-colors"
              >
                {{ index + 1 }}
              </div>
              <div>
                <p class="text-sm text-gray-700">
                  {{ formatDate(new Date()) }}
                </p>
                <p class="font-medium text-gray-700 text-sm">
                  {{ item.title }}
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-2 pr-4">
              <!-- Agar projectDatatwo ACCEPTED bo'lsa, "Tasdiqlandi" ko'rsatish -->
              <div
                v-if="projectDatatwo === 'ACCEPTED'"
                class="flex items-center text-green-600 text-sm font-medium px-2"
              >
                <svg
                  class="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
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
                    'bg-blue-500 hover:bg-blue-600 text-white':
                      fileStates.conception[item.key].uploaded,
                    'bg-gray-200 hover:bg-gray-300 text-gray-600':
                      !fileStates.conception[item.key].uploaded,
                    'cursor-not-allowed opacity-50':
                      sectionStatuses.conception === 'ACCEPTED',
                  }"
                  class="flex items-center space-x-1 text-sm px-2 py-1 rounded transition-colors cursor-pointer"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M3 17a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 12a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 7a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V7z"
                    />
                  </svg>
                  <span>{{
                    fileStates.conception[item.key].uploaded
                      ? fileStates.conception[item.key].fileName
                      : "Fayl biriktirish"
                  }}</span>
                </label>

                <div
                  v-if="
                    fileStates.conception[item.key].uploaded &&
                    sectionStatuses.conception !== 'ACCEPTED'
                  "
                >
                  <button
                    v-if="!fileStates.conception[item.key].saved"
                    @click="saveFile('conception', item.key)"
                    :disabled="isLoading.files[`conception_${item.key}`]"
                    class="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {{
                      isLoading.files[`conception_${item.key}`]
                        ? "Saqlanmoqda..."
                        : "Saqlash"
                    }}
                  </button>

                  <div v-else class="flex items-center space-x-2">
                    <div
                      class="flex items-center text-green-600 text-sm font-medium"
                    >
                      <svg
                        class="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
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
                      :disabled="
                        isLoading.files[`delete_conception_${item.key}`]
                      "
                      class="bg-red-500 hover:bg-red-600 text-white p-1 rounded text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      <i
                        v-if="!isLoading.files[`delete_conception_${item.key}`]"
                        class="bx bx-x"
                      ></i>
                      <i v-else class="bx bx-loader-alt animate-spin"></i>
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

    <!-- Technical Section -->
    <div
      class="bg-white border-b border-gray-200 rounded-[8px]"
      :class="{ 'opacity-50': !isTechnicalEnabled }"
    >
      <div
        class="w-full flex items-center justify-between px-4 py-2 text-left transition-colors"
      >
        <div
          @click="isTechnicalEnabled && toggleSection('technical')"
          class="flex items-center space-x-2"
          :class="{
            'cursor-pointer': isTechnicalEnabled,
            'cursor-not-allowed': !isTechnicalEnabled,
          }"
        >
          <svg
            :class="{ 'rotate-90': openSections.technical }"
            class="w-4 h-4 transform transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
          <h3 class="text-[14px] font-medium text-gray-900">Texnik vazifa</h3>
          <span v-if="!isTechnicalEnabled" class="text-xs text-gray-500"
            >(Konsepsiya tasdiqlanmagan)</span
          >
        </div>
        <div class="flex items-center space-x-4">
          <!-- Status ko'rsatish -->
          <p
            v-if="technicalProjectStatus === 'RESOLVED'"
            class="text-[#4A51DD] text-[14px] font-[500]"
          >
            <i class="bx bx-refresh text-[18px]"></i> Ko'rib chiqish
          </p>
          <p
            v-if="technicalProjectStatus === 'REJECTED'"
            class="text-[#FD5656] text-[14px] font-[500]"
          >
            ! Izoh
          </p>

          <button
            v-if="isTechnicalEnabled"
            @click="openHistoryModal('technical')"
            class="px-3 py-1 text-sm rounded transition-colors bg-[#F8F8F8] text-[#794A9A] font-bold hover:bg-gray-300"
          >
            <i class="bx bxs-briefcase-alt-2"></i> Ish tarixi
          </button>
          <p
            v-if="technicalProjectStatus === 'ACCEPTED'"
            class="text-green-600 text-[14px] font-[500]"
          >
            <i class="bx bx-check-circle text-[18px]"></i> Tasdiqlangan
          </p>
          <button
            v-if="isTechnicalEnabled && technicalProjectStatus !== 'ACCEPTED'"
            :disabled="!allTechnicalFilesUploaded || isLoading.technical"
            @click="sendTechnicalFiles"
            :class="{
              'bg-blue-500 hover:bg-blue-600 text-white':
                allTechnicalFilesUploaded && !isLoading.technical,
              'bg-gray-300 text-gray-500 cursor-not-allowed':
                !allTechnicalFilesUploaded || isLoading.technical,
            }"
            class="px-3 py-1 text-sm rounded transition-colors"
          >
            <i v-if="!isLoading.technical" class="bx bxl-telegram"></i>
            <i v-else class="bx bx-loader-alt animate-spin"></i>
            {{ isLoading.technical ? "Yuborilmoqda..." : "Yuborish" }}
          </button>
        </div>
      </div>

      <!-- Technical section content -->
      <div
        v-show="openSections.technical && isTechnicalEnabled"
        class="pb-4 transition-all duration-300 ease-in-out"
      >
      <div v-if="technicalProjectStatus !== 'ACCEPTED'" class="mb-4 w-full flex px-4 py-3 space-x-4">
          <input
            v-model="docDateDataTech.docnumberTech"
            type="text"
            class="w-[200px] ml-auto px-4 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Hujjat raqami №. . ."
          />
          <input v-model="docDateDataTech.selectedDateTech" type="date" class="w-[150px] px-4 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Sanani tanlang">
        </div>
        <div class="space-y-2 px-4">
          <div
            v-for="(item, index) in technicalItems"
            :key="item.key"
            class="flex items-center justify-between bg-gray-100 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <div
                :class="{
                  'bg-blue-500': fileStates.technical[item.key].uploaded,
                  'bg-gray-300': !fileStates.technical[item.key].uploaded,
                }"
                class="w-8 h-16 text-white rounded-l flex items-center justify-center font-bold text-sm transition-colors"
              >
                {{ index + 1 }}
              </div>
              <div>
                <p class="text-sm text-gray-700">
                  {{ formatDate(new Date()) }}
                </p>
                <p class="font-medium text-gray-700 text-sm">
                  {{ item.title }}
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-2 pr-4">
              <!-- Agar technicalProjectStatus ACCEPTED bo'lsa, "Tasdiqlandi" ko'rsatish -->
              <div
                v-if="technicalProjectStatus === 'ACCEPTED'"
                class="flex items-center text-green-600 text-sm font-medium px-2"
              >
                <svg
                  class="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                Tasdiqlandi
              </div>

              <!-- File upload qismi -->
              <template v-else>
                <input
                  type="file"
                  :id="`technical-file${index + 1}`"
                  @change="handleFileUpload($event, 'technical', item.key)"
                  class="hidden"
                  accept=".pdf"
                  :disabled="technicalProjectStatus === 'ACCEPTED'"
                />
                <label
                  :for="`technical-file${index + 1}`"
                  :class="{
                    'bg-blue-500 hover:bg-blue-600 text-white':
                      fileStates.technical[item.key].uploaded,
                    'bg-gray-200 hover:bg-gray-300 text-gray-600':
                      !fileStates.technical[item.key].uploaded,
                    'cursor-not-allowed opacity-50':
                      technicalProjectStatus === 'ACCEPTED',
                  }"
                  class="flex items-center space-x-1 text-sm px-2 py-1 rounded transition-colors cursor-pointer"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M3 17a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 12a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 7a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V7z"
                    />
                  </svg>
                  <span>{{
                    fileStates.technical[item.key].uploaded
                      ? fileStates.technical[item.key].fileName
                      : "Fayl biriktirish"
                  }}</span>
                </label>

                <div
                  v-if="
                    fileStates.technical[item.key].uploaded &&
                    technicalProjectStatus !== 'ACCEPTED'
                  "
                >
                  <button
                    v-if="!fileStates.technical[item.key].saved"
                    @click="saveFile('technical', item.key)"
                    :disabled="isLoading.files[`technical_${item.key}`]"
                    class="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {{
                      isLoading.files[`technical_${item.key}`]
                        ? "Saqlanmoqda..."
                        : "Saqlash"
                    }}
                  </button>

                  <div v-else class="flex items-center space-x-2">
                    <div
                      class="flex items-center text-green-600 text-sm font-medium"
                    >
                      <svg
                        class="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
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
                      :disabled="
                        isLoading.files[`delete_technical_${item.key}`]
                      "
                      class="bg-red-500 hover:bg-red-600 text-white p-1 rounded text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      <i
                        v-if="!isLoading.files[`delete_technical_${item.key}`]"
                        class="bx bx-x"
                      ></i>
                      <i v-else class="bx bx-loader-alt animate-spin"></i>
                    </button>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. LBX SECTION ni yangilash -->
    <div
      class="bg-white rounded-[8px]"
      :class="{ 'opacity-50': !isLbxEnabled }"
    >
      <div
        class="w-full flex items-center justify-between px-4 py-2 text-left transition-colors"
      >
        <div
          @click="isLbxEnabled && toggleSection('lbx')"
          class="flex items-center space-x-2"
          :class="{
            'cursor-pointer': isLbxEnabled,
            'cursor-not-allowed': !isLbxEnabled,
          }"
        >
          <svg
            :class="{ 'rotate-90': openSections.lbx }"
            class="w-4 h-4 transform transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
          <h3 class="text-[14px] font-medium text-gray-900">LBX</h3>
          <span v-if="!isLbxEnabled" class="text-xs text-gray-500"
            >(Texnik vazifa tasdiqlanmagan)</span
          >
        </div>
        <div class="flex items-center space-x-4">
          <!-- LBX status ko'rsatish - Konsepsiya kabi -->
          <p
            v-if="lbxProjectStatus === 'RESOLVED'"
            class="text-[#4A51DD] text-[14px] font-[500]"
          >
            <i class="bx bx-refresh text-[18px]"></i> Ko'rib chiqish
          </p>
          <p
            v-if="lbxProjectStatus === 'REJECTED'"
            class="text-[#FD5656] text-[14px] font-[500]"
          >
            ! Izoh
          </p>

          <!-- Ish tarixi tugmasi -->
          <button
            v-if="isLbxEnabled"
            @click="openHistoryModal('lbx')"
            class="px-3 py-1 text-sm rounded transition-colors bg-[#F8F8F8] text-[#794A9A] font-bold hover:bg-gray-300"
          >
            <i class="bx bxs-briefcase-alt-2"></i> Ish tarixi
          </button>
          <p
            v-if="lbxProjectStatus === 'ACCEPTED'"
            class="text-green-600 text-[14px] font-[500]"
          >
            <i class="bx bx-check-circle text-[18px]"></i> Tasdiqlangan
          </p>

          <!-- Yuborish tugmasi -->
          <button
            v-if="isLbxEnabled && lbxProjectStatus !== 'ACCEPTED'"
            :disabled="!allLbxFilesUploaded || isLoading.lbx"
            @click="sendLbxFiles"
            :class="{
              'bg-blue-500 hover:bg-blue-600 text-white':
                allLbxFilesUploaded && !isLoading.lbx,
              'bg-gray-300 text-gray-500 cursor-not-allowed':
                !allLbxFilesUploaded || isLoading.lbx,
            }"
            class="px-3 py-1 text-sm rounded transition-colors"
          >
            <i v-if="!isLoading.lbx" class="bx bxl-telegram"></i>
            <i v-else class="bx bx-loader-alt animate-spin"></i>
            {{ isLoading.lbx ? "Yuborilmoqda..." : "Yuborish" }}
          </button>
        </div>
      </div>

      <!-- LBX section content -->
      <div
        v-show="openSections.lbx && isLbxEnabled"
        class="pb-4 transition-all duration-300 ease-in-out"
      >
      <div v-if="lbxProjectStatus !== 'ACCEPTED'" class="mb-4 w-full flex px-4 py-3 space-x-4">
          <input
            v-model="docDateDataLBX.docnumberLBX"
            type="text"
            class="w-[200px] ml-auto px-4 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            placeholder="Hujjat raqami №. . ."
          />
          <input v-model="docDateDataLBX.selectedDateLBX" type="date" class="w-[150px] px-4 py-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" placeholder="Sanani tanlang">
        </div>
        <div class="space-y-2 px-4">
          <div
            v-for="(item, index) in lbxItems"
            :key="item.key"
            class="flex items-center justify-between bg-gray-100 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <div
                :class="{
                  'bg-blue-500': fileStates.lbx[item.key].uploaded,
                  'bg-gray-300': !fileStates.lbx[item.key].uploaded,
                }"
                class="w-8 h-16 text-white rounded-l flex items-center justify-center font-bold text-sm transition-colors"
              >
                {{ index + 1 }}
              </div>
              <div>
                <p class="text-sm text-gray-700">
                  {{ formatDate(new Date()) }}
                </p>
                <p class="font-medium text-gray-700 text-sm">
                  {{ item.title }}
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-2 pr-4">
              <!-- Agar lbxProjectStatus ACCEPTED bo'lsa, "Tasdiqlandi" ko'rsatish -->
              <div
                v-if="lbxProjectStatus === 'ACCEPTED'"
                class="flex items-center text-green-600 text-sm font-medium px-2"
              >
                <svg
                  class="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                Tasdiqlandi
              </div>

              <!-- File upload qismi -->
              <template v-else>
                <input
                  type="file"
                  :id="`lbx-file${index + 1}`"
                  @change="handleFileUpload($event, 'lbx', item.key)"
                  class="hidden"
                  accept=".pdf"
                  :disabled="lbxProjectStatus === 'ACCEPTED'"
                />
                <label
                  :for="`lbx-file${index + 1}`"
                  :class="{
                    'bg-blue-500 hover:bg-blue-600 text-white':
                      fileStates.lbx[item.key].uploaded,
                    'bg-gray-200 hover:bg-gray-300 text-gray-600':
                      !fileStates.lbx[item.key].uploaded,
                    'cursor-not-allowed opacity-50':
                      lbxProjectStatus === 'ACCEPTED',
                  }"
                  class="flex items-center space-x-1 text-sm px-2 py-1 rounded transition-colors cursor-pointer"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M3 17a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 12a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 7a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V7z"
                    />
                  </svg>
                  <span>{{
                    fileStates.lbx[item.key].uploaded
                      ? fileStates.lbx[item.key].fileName
                      : "Fayl biriktirish"
                  }}</span>
                </label>

                <div
                  v-if="
                    fileStates.lbx[item.key].uploaded &&
                    lbxProjectStatus !== 'ACCEPTED'
                  "
                >
                  <button
                    v-if="!fileStates.lbx[item.key].saved"
                    @click="saveFile('lbx', item.key)"
                    :disabled="isLoading.files[`lbx_${item.key}`]"
                    class="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {{
                      isLoading.files[`lbx_${item.key}`]
                        ? "Saqlanmoqda..."
                        : "Saqlash"
                    }}
                  </button>

                  <div v-else class="flex items-center space-x-2">
                    <div
                      class="flex items-center text-green-600 text-sm font-medium"
                    >
                      <svg
                        class="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      Saqlandi
                    </div>
                    <button
                      @click="deleteFile('lbx', item.key)"
                      :disabled="isLoading.files[`delete_lbx_${item.key}`]"
                      class="bg-red-500 hover:bg-red-600 text-white p-1 rounded text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      <i
                        v-if="!isLoading.files[`delete_lbx_${item.key}`]"
                        class="bx bx-x"
                      ></i>
                      <i v-else class="bx bx-loader-alt animate-spin"></i>
                    </button>
                  </div>
                </div>
              </template>
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
              <i class="bx bxs-briefcase-alt-2 mr-2 text-[18px]"></i>
              {{ getSectionTitle(currentSection) }} - Ish tarixi
            </h2>
            <button
              @click="closeHistoryModal"
              class="text-gray-500 hover:text-gray-400 transition-colors"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal Content -->
        <div class="max-h-[70vh] overflow-y-auto">
          <div class="space-y-2">
            <!-- ====================== USER YUBORGAN FAYLLAR BIRINCHI ====================== -->

            <!-- USER FILES SECTION - Foydalanuvchi yuborgan fayllar -->
            <template
              v-if="
                getCurrentSectionData(currentSection).files &&
                getCurrentSectionData(currentSection).files.length > 0
              "
            >
              <!-- User files header -->
              <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                <h3
                  class="text-lg font-semibold text-blue-800 mb-3 flex items-center"
                >
                  <i class="bx bx-file text-xl mr-2"></i>
                  Yuborilgan hujjatlar
                </h3>
                <p class="text-sm text-blue-600">
                  Sana:
                  {{
                    getCurrentSectionData(currentSection).createdAt.slice(0, 10)
                  }}
                  {{
                    getCurrentSectionData(currentSection).createdAt.slice(
                      11,
                      16
                    )
                  }}
                </p>
              </div>

              <!-- User files list -->
              <div class="m-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div class="space-y-2">
                  <div
                    v-for="(file, index) in getCurrentSectionData(
                      currentSection
                    ).files"
                    :key="file.id || index"
                    class="flex items-center justify-between bg-gray-200 rounded-lg border border-gray-100 hover:border-blue-200 transition-all"
                  >
                    <div class="flex items-center space-x-3">
                      <div
                        class="w-7 h-10 bg-blue-500 text-white border border-blue-500 rounded-lg flex items-center justify-center font-bold text-sm"
                      >
                        {{ index + 1 }}
                      </div>
                      <div>
                        <p class="text-xs text-gray-500">
                          {{
                            getCurrentSectionData(
                              currentSection
                            ).createdAt.slice(0, 10)
                          }}
                          {{
                            getCurrentSectionData(
                              currentSection
                            ).createdAt.slice(11, 16)
                          }}
                        </p>
                        <p class="text-sm font-semibold text-gray-800">
                          {{ file.fileName }}
                        </p>
                      </div>
                    </div>
                    <button
                      @click="downloadProjectFile(file.fileUrl, file.fileName)"
                      class="px-4 py-2 rounded-lg text-[12px] transition-colors flex items-center space-x-2"
                      :disabled="!file.fileUrl"
                      :class="{
                        'bg-gray-200 cursor-not-allowed text-gray-500':
                          !file.fileUrl,
                      }"
                    >
                      <span class="bg-white p-2 rounded-sm"
                        >Faylni yuklash</span
                      >
                      <i
                        class="bx bx-download text-sm rounded-full p-2 text-green-500 bg-white"
                      ></i>
                    </button>
                  </div>
                </div>
              </div>
            </template>

            <!-- ====================== STATUS VA JAVOB QISMI ====================== -->

            <!-- Dynamic content based on current section status -->
            <template v-if="getCurrentSectionData(currentSection).status">
              <!-- ==================== RESOLVED HOLATI ==================== -->
              <div
                v-if="
                  getCurrentSectionData(currentSection).status === 'RESOLVED'
                "
                class="flex items-center justify-between"
              >
                <div class="space-y-2 bg-gray-200 w-full p-4">
                  <p
                    class="text-[14px] font-semibold text-[#6DA1F8] flex items-center"
                  >
                    <i class="bx bx-info-circle text-[18px] mr-1"></i>
                    Qayta ko'rib chiqish uchun
                  </p>
                  <p class="text-[12px] text-gray-500 font-semibold">
                    {{
                      getCurrentSectionData(currentSection).createdAt.slice(
                        0,
                        10
                      )
                    }}
                    {{
                      getCurrentSectionData(currentSection).createdAt.slice(
                        11,
                        16
                      )
                    }}
                  </p>
                </div>
              </div>

              <div
                v-if="
                  getCurrentSectionData(currentSection).status === 'RESOLVED'
                "
                class="m-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded"
              >
                <p class="text-justify">
                  {{
                    getCurrentSectionData(currentSection).answer ||
                    "Izoh mavjud emas"
                  }}
                </p>
              </div>

              <div
                v-if="
                  getCurrentSectionData(currentSection).status === 'RESOLVED' &&
                  getCurrentSectionData(currentSection).answerFiles &&
                  getCurrentSectionData(currentSection).answerFiles.length > 0
                "
                class="m-4 p-4 bg-blue-100 rounded-lg border border-blue-200"
              >
                <p
                  class="text-sm font-semibold text-blue-800 mb-3 flex items-center"
                >
                  <i class="bx bx-paperclip text-lg mr-2"></i>
                  Javob bilan biriktirilgan fayllar:
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    v-for="(answerFile, idx) in getCurrentSectionData(
                      currentSection
                    ).answerFiles"
                    :key="answerFile.id || idx"
                    class="bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
                    @click="
                      downloadProjectFile(answerFile.url, answerFile.name)
                    "
                  >
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0">
                        <div
                          class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
                        >
                          <i class="bx bxs-file-pdf text-blue-600 text-xl"></i>
                        </div>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">
                          {{ answerFile.name || `Fayl ${idx + 1}` }}
                        </p>
                        <p class="text-xs text-gray-500">
                          {{ answerFile.created_at?.slice(0, 10) || "" }}
                        </p>
                      </div>
                      <div class="flex-shrink-0">
                        <i class="bx bx-download text-blue-600 text-lg"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ==================== TO_REVIEW HOLATI ==================== -->
              <div
                v-else-if="
                  getCurrentSectionData(currentSection).status === 'TO_REVIEW'
                "
                class="flex items-center justify-between"
              >
                <div class="space-y-2 bg-gray-200 w-full p-4">
                  <p
                    class="text-[14px] font-semibold text-[#4A51DD] flex items-center"
                  >
                    <i class="bx bx-refresh text-[18px] mr-1"></i>
                    Ko'rib chiqilmoqda
                  </p>
                  <p class="text-[12px] text-gray-500 font-semibold">
                    {{
                      getCurrentSectionData(currentSection).createdAt.slice(
                        0,
                        10
                      )
                    }}
                    {{
                      getCurrentSectionData(currentSection).createdAt.slice(
                        11,
                        16
                      )
                    }}
                  </p>
                </div>
              </div>

              <div
                v-if="
                  getCurrentSectionData(currentSection).status === 'TO_REVIEW'
                "
                class="m-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded"
              >
                <p class="text-justify">
                  {{
                    getCurrentSectionData(currentSection).answer ||
                    "Ko'rib chiqilmoqda..."
                  }}
                </p>
              </div>

              <!-- ==================== REJECTED HOLATI ==================== -->
              <div
                v-else-if="
                  getCurrentSectionData(currentSection).status === 'REJECTED'
                "
                class="flex items-center justify-between"
              >
                <div class="space-y-2 bg-gray-200 w-full p-4">
                  <p
                    class="text-[14px] font-semibold text-[#F60000] flex items-center"
                  >
                    <i class="bx bx-info-circle text-[18px] mr-1"></i>
                    Izoh
                  </p>
                  <p class="text-[12px] text-gray-500 font-semibold">
                    {{
                      getCurrentSectionData(currentSection).createdAt.slice(
                        0,
                        10
                      )
                    }}
                    {{
                      getCurrentSectionData(currentSection).createdAt.slice(
                        11,
                        16
                      )
                    }}
                  </p>
                </div>
              </div>

              <div
                v-if="
                  getCurrentSectionData(currentSection).status === 'REJECTED'
                "
                class="m-4 p-4 bg-red-50 border-l-4 border-red-400 rounded"
              >
                <p class="text-justify">
                  {{
                    getCurrentSectionData(currentSection).answer ||
                    "Izoh mavjud emas"
                  }}
                </p>
              </div>

              <div
                v-if="
                  getCurrentSectionData(currentSection).status === 'REJECTED' &&
                  getCurrentSectionData(currentSection).answerFiles &&
                  getCurrentSectionData(currentSection).answerFiles.length > 0
                "
                class="m-4 p-4 bg-red-100 rounded-lg border border-red-200"
              >
                <p
                  class="text-[12px] font-semibold text-red-800 mb-3 flex items-center"
                >
                  <i class="bx bx-paperclip text-lg mr-2"></i>
                  Javob bilan biriktirilgan fayllar:
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div
                    v-for="(answerFile, idx) in getCurrentSectionData(
                      currentSection
                    ).answerFiles"
                    :key="answerFile.id || idx"
                    class="bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
                    @click="
                      downloadProjectFile(answerFile.url, answerFile.name)
                    "
                  >
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0">
                        <div
                          class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center"
                        >
                          <i class="bx bxs-file-pdf text-red-600 text-xl"></i>
                        </div>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">
                          {{ answerFile.name || `Fayl ${idx + 1}` }}
                        </p>
                        <p class="text-xs text-gray-500">
                          {{ answerFile.created_at?.slice(0, 10) || "" }}
                        </p>
                      </div>
                      <div class="flex-shrink-0">
                        <i class="bx bx-download text-red-600 text-lg"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- ==================== ACCEPTED HOLATI ==================== -->
              <div
                v-else-if="
                  getCurrentSectionData(currentSection).status === 'ACCEPTED'
                "
                class="flex items-center justify-between"
              >
                <div class="space-y-2 bg-gray-200 w-full p-4">
                  <p
                    class="text-[14px] font-semibold text-green-600 flex items-center"
                  >
                    <i class="bx bx-check-circle text-[18px] mr-1"></i>
                    Tasdiqlangan
                  </p>
                  <p class="text-[12px] text-gray-500 font-semibold">
                    {{
                      getCurrentSectionData(currentSection).createdAt.slice(
                        0,
                        10
                      )
                    }}
                    {{
                      getCurrentSectionData(currentSection).createdAt.slice(
                        11,
                        16
                      )
                    }}
                  </p>
                </div>
              </div>

              <div
                v-if="
                  getCurrentSectionData(currentSection).status === 'ACCEPTED'
                "
                class="m-4 p-4 bg-green-50 border-l-4 border-green-400 rounded"
              >
                <p class="text-justify">
                  {{
                    getCurrentSectionData(currentSection).answer ||
                    "Tasdiqlandi"
                  }}
                </p>
              </div>

              <div
                v-if="
                  getCurrentSectionData(currentSection).status === 'ACCEPTED' &&
                  getCurrentSectionData(currentSection).answerFiles &&
                  getCurrentSectionData(currentSection).answerFiles.length > 0
                "
                class="m-4 p-4 bg-green-100 rounded-lg border border-green-200"
              >
                <p
                  class="text-sm font-semibold text-green-800 mb-3 flex items-center"
                >
                  <i class="bx bx-paperclip text-lg mr-2"></i>
                  Javob bilan biriktirilgan fayllar:
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    v-for="(answerFile, idx) in getCurrentSectionData(
                      currentSection
                    ).answerFiles"
                    :key="answerFile.id || idx"
                    class="bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
                    @click="
                      downloadProjectFile(answerFile.url, answerFile.name)
                    "
                  >
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0">
                        <div
                          class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"
                        >
                          <i class="bx bxs-file-pdf text-green-600 text-xl"></i>
                        </div>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">
                          {{ answerFile.name || `Fayl ${idx + 1}` }}
                        </p>
                        <p class="text-xs text-gray-500">
                          {{ answerFile.created_at?.slice(0, 10) || "" }}
                        </p>
                      </div>
                      <div class="flex-shrink-0">
                        <i class="bx bx-download text-green-600 text-lg"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <!-- HISTORY SECTION SEPARATOR -->
            <div
              v-if="getHistoryData(currentSection).length > 0"
              class="border-t-2 border-gray-300 my-6"
            >
              <p class="font-semibold px-[20px] text-gray-600 mt-2 mb-4">
                📋 Tarix
              </p>
            </div>

            <!-- HISTORY ITEMS -->
            <template
              v-for="(historyItem, historyIndex) in getHistoryData(
                currentSection
              )"
              :key="historyItem.id"
            >
              <!-- History item header -->
              <div class="flex items-center justify-between">
                <div
                  class="space-y-2 bg-gray-100 w-full p-4 border-l-4"
                  :class="{
                    'border-blue-400': historyItem.status === 'RESOLVED',
                    'border-red-400': historyItem.status === 'REJECTED',
                    'border-green-400': historyItem.status === 'ACCEPTED',
                    'border-purple-400': historyItem.status === 'TO_REVIEW',
                  }"
                >
                  <p
                    class="text-[14px] font-semibold flex items-center"
                    :class="{
                      'text-[#6DA1F8]': historyItem.status === 'RESOLVED',
                      'text-[#F60000]': historyItem.status === 'REJECTED',
                      'text-green-600': historyItem.status === 'ACCEPTED',
                      'text-[#4A51DD]': historyItem.status === 'TO_REVIEW',
                    }"
                  >
                    <i
                      class="bx text-[18px] mr-1"
                      :class="{
                        'bx-info-circle': historyItem.status === 'RESOLVED',
                        'bx-info-circle': historyItem.status === 'REJECTED',
                        'bx-check-circle': historyItem.status === 'ACCEPTED',
                        'bx-refresh': historyItem.status === 'TO_REVIEW',
                      }"
                    ></i>
                    {{ getStatusText(historyItem.status) }}
                  </p>
                  <p class="text-[12px] text-gray-500 font-semibold">
                    {{ historyItem.created_at.slice(0, 10) }}
                    {{ historyItem.created_at.slice(11, 16) }}
                  </p>
                </div>
              </div>

              <!-- History item answer -->
              <div
                v-if="historyItem.answers && historyItem.answers.length > 0"
                class="m-4 p-4 border-l-4 rounded"
                :class="{
                  'bg-blue-50 border-blue-400':
                    historyItem.status === 'RESOLVED',
                  'bg-red-50 border-red-400': historyItem.status === 'REJECTED',
                  'bg-green-50 border-green-400':
                    historyItem.status === 'ACCEPTED',
                  'bg-purple-50 border-purple-400':
                    historyItem.status === 'TO_REVIEW',
                }"
              >
                <p class="text-justify">
                  {{
                    historyItem.answers[historyItem.answers.length - 1]
                      ?.answer || "Izoh mavjud emas"
                  }}
                </p>
              </div>

              <div
                v-if="
                  historyItem.answers &&
                  historyItem.answers.length > 0 &&
                  historyItem.answers[historyItem.answers.length - 1]?.files
                    ?.length > 0
                "
                class="m-4 p-4 rounded-lg border"
                :class="{
                  'bg-blue-100 border-blue-200':
                    historyItem.status === 'RESOLVED',
                  'bg-red-100 border-red-200':
                    historyItem.status === 'REJECTED',
                  'bg-green-100 border-green-200':
                    historyItem.status === 'ACCEPTED',
                  'bg-purple-100 border-purple-200':
                    historyItem.status === 'TO_REVIEW',
                }"
              >
                <p
                  class="text-sm font-semibold mb-3 flex items-center"
                  :class="{
                    'text-blue-800': historyItem.status === 'RESOLVED',
                    'text-red-800': historyItem.status === 'REJECTED',
                    'text-green-800': historyItem.status === 'ACCEPTED',
                    'text-purple-800': historyItem.status === 'TO_REVIEW',
                  }"
                >
                  <i class="bx bx-paperclip text-lg mr-2"></i>
                  Javob bilan biriktirilgan fayllar:
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    v-for="(answerFile, idx) in historyItem.answers[
                      historyItem.answers.length - 1
                    ].files"
                    :key="answerFile.id || idx"
                    class="bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
                    @click="
                      downloadProjectFile(answerFile.url, answerFile.name)
                    "
                  >
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0">
                        <div
                          class="w-10 h-10 rounded-full flex items-center justify-center"
                          :class="{
                            'bg-blue-100': historyItem.status === 'RESOLVED',
                            'bg-red-100': historyItem.status === 'REJECTED',
                            'bg-green-100': historyItem.status === 'ACCEPTED',
                            'bg-purple-100': historyItem.status === 'TO_REVIEW',
                          }"
                        >
                          <i
                            class="bx bxs-file-pdf text-xl"
                            :class="{
                              'text-blue-600':
                                historyItem.status === 'RESOLVED',
                              'text-red-600': historyItem.status === 'REJECTED',
                              'text-green-600':
                                historyItem.status === 'ACCEPTED',
                              'text-purple-600':
                                historyItem.status === 'TO_REVIEW',
                            }"
                          ></i>
                        </div>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">
                          {{ answerFile.name || `Fayl ${idx + 1}` }}
                        </p>
                        <p class="text-xs text-gray-500">
                          {{ answerFile.created_at?.slice(0, 10) || "" }}
                        </p>
                      </div>
                      <div class="flex-shrink-0">
                        <i
                          class="bx bx-download text-lg"
                          :class="{
                            'text-blue-600': historyItem.status === 'RESOLVED',
                            'text-red-600': historyItem.status === 'REJECTED',
                            'text-green-600': historyItem.status === 'ACCEPTED',
                            'text-purple-600':
                              historyItem.status === 'TO_REVIEW',
                          }"
                        ></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- History item files -->
              <div
                v-if="historyItem.documents && historyItem.documents.length > 0"
                class="m-4 p-4 bg-gray-50 rounded"
              >
                <div class="space-y-2">
                  <div
                    v-for="(file, fileIndex) in historyItem.documents"
                    :key="file.id || fileIndex"
                    class="flex items-center justify-between bg-gray-200 rounded p-1"
                  >
                    <div class="flex items-center space-x-3">
                      <div
                        class="w-8 h-10 bg-blue-500 text-white border border-blue-500 rounded flex items-center justify-center font-bold text-sm"
                      >
                        {{ fileIndex + 1 }}
                      </div>
                      <div>
                        <p class="text-xs text-gray-500">
                          {{ file.created_at.slice(0, 10) }}
                          {{ file.created_at.slice(11, 16) }}
                        </p>
                        <p class="text-sm font-semibold text-gray-700">
                          {{ file.file?.name || "Nomsiz fayl" }}
                        </p>
                      </div>
                    </div>
                    <button
                      @click="
                        downloadProjectFile(file.file?.url, file.file?.name)
                      "
                      class="px-3 py-1 rounded text-[12px] transition-colors flex items-center space-x-1"
                    >
                      <span class="bg-white hover:bg-gray-100 p-2 rounded"
                        >Faylni yuklash</span
                      >
                      <i
                        class="bx bx-download text-[15px] bg-white hover:bg-blue-500 p-2 rounded-full text-green-500"
                      ></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Separator between history items -->
              <div
                v-if="historyIndex < getHistoryData(currentSection).length - 1"
                class="border-t border-gray-200 my-4"
              ></div>
            </template>

            <!-- Agar hech qanday ma'lumot bo'lmasa -->
            <div
              v-if="getHistoryData(currentSection).length === 0"
              class="p-8 text-center text-gray-500"
            >
              Bu bo'lim uchun tarix mavjud emas
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import axios from "axios";

// Loyihani saqlash uchun reactive ref
const projectData = ref(null);
const loading = ref(false);
const error = ref(null);
const docDateData = ref({
  docnumberconcep: '',
  selectedDate: ''
});
const docDateDataTech = ref({
  docnumberTech: '',
  selectedDateTech: ''
});
const docDateDataLBX = ref({
  docnumberLBX: '',
  selectedDateLBX: ''
})

// Computed property holatiga o'tkazamiz
const projectDatatwo = computed(() => {
  // Agar projectData hali yuklanmagan bo'lsa, bo'sh string qaytarish
  if (
    !projectData.value ||
    !projectData.value.project_documents?.PROJECT_CONCEPT
  ) {
    return "";
  }

  const projectConceptDoc = projectData.value.project_documents.PROJECT_CONCEPT;

  // Eng oxirgi answer ni olish (array oxiridan)
  const answers = projectConceptDoc.answers;
  if (answers && answers.length > 0) {
    const lastAnswer = answers[answers.length - 1];
    console.log("Oxirgi javob turi:", lastAnswer.type);
    return lastAnswer.type;
  }

  // Agar answers bo'lmasa, project_documents status ni qaytarish
  return projectConceptDoc.status || "";
});

const projectDatatthree = computed(() => {
  if (!projectData.value?.project_documents?.PROJECT_CONCEPT) {
    return "";
  }

  const projectConceptDoc = projectData.value.project_documents.PROJECT_CONCEPT;
  const answers = projectConceptDoc.answers;
  if (answers && answers.length > 0) {
    const lastAnswer = answers[answers.length - 1];
    return lastAnswer.created_at || "";
  }
  return projectConceptDoc.created_at || "";
});

const projectDatatwoansware = computed(() => {
  if (!projectData.value?.project_documents?.PROJECT_CONCEPT) {
    return "";
  }

  const projectConceptDoc = projectData.value.project_documents.PROJECT_CONCEPT;
  const answers = projectConceptDoc.answers;
  if (answers && answers.length > 0) {
    const lastAnswer = answers[answers.length - 1];
    return lastAnswer.answer || "";
  }
  return "";
});

const projectDatatwofiles = computed(() => {
  if (!projectData.value?.project_documents?.PROJECT_CONCEPT) {
    return [];
  }

  const projectConceptDoc = projectData.value.project_documents.PROJECT_CONCEPT;
  const documents = projectConceptDoc.documents;
  console.log("documents:", documents);

  if (!documents || !Array.isArray(documents)) {
    return [];
  }

  // Har bir document uchun file ma'lumotini qaytarish
  return documents.map((doc) => ({
    id: doc.id,
    fileName: doc.file?.name || "Nomsiz fayl",
    fileUrl: doc.file?.url,
    fileId: doc.file?.id,
    createdAt: doc.created_at,
  }));
});

// Ma'lumotni olish funksiyasi
const fetchProjectData = async () => {
  const selectedMinistry = JSON.parse(sessionStorage.getItem("selectMinistry"));
  if (!selectedMinistry?.id) {
    error.value = "Vazirlik ID topilmadi";
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const response = await axios.get(
      `https://back.miit.uz/api/bisap/test/project/${selectedMinistry.id}`,
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      }
    );

    if (response.data?.data) {
      projectData.value = response.data.data;
      console.log("🔄 ProjectData yangilandi:", projectData.value);

      // PROJECT_CONCEPT holatini yangilash
      if (projectData.value.project_documents?.PROJECT_CONCEPT) {
        const conceptDoc = projectData.value.project_documents.PROJECT_CONCEPT;
        console.log("💡 PROJECT_CONCEPT topildi:", conceptDoc);
        sectionStatuses.conception = conceptDoc.status;

        if (conceptDoc.id) {
          documentIds.conception = conceptDoc.id;
          sessionStorage.setItem("conceptionDocumentId", conceptDoc.id);
        }
      }

      // PROJECT_TS holatini yangilash
      if (projectData.value.project_documents?.PROJECT_TS) {
        const tsDoc = projectData.value.project_documents.PROJECT_TS;
        console.log("🔧 PROJECT_TS topildi:", tsDoc);
        sectionStatuses.technical = tsDoc.status;

        if (tsDoc.id) {
          documentIds.technical = tsDoc.id;
          sessionStorage.setItem("technicalDocumentId", tsDoc.id);
        }
      }

      // PROJECT_EVALUATION_DOCUMENT holatini yangilash
      if (projectData.value.project_documents?.PROJECT_EVALUATION_DOCUMENT) {
        const lbxDoc =
          projectData.value.project_documents.PROJECT_EVALUATION_DOCUMENT;
        console.log("📊 PROJECT_EVALUATION_DOCUMENT topildi:", lbxDoc);
        sectionStatuses.lbx = lbxDoc.status;

        if (lbxDoc.id) {
          documentIds.lbx = lbxDoc.id;
          sessionStorage.setItem("lbxDocumentId", lbxDoc.id);
        }
      }
    }
  } catch (err) {
    console.error("fetchProjectData error:", err);
    error.value = "Ma'lumotlarni olishda xatolik";
  } finally {
    loading.value = false;
  }
};

// API Base URL
const API_BASE_URL = "https://back.miit.uz/api/bisap/test";

// Get auth token from localStorage or sessionStorage
const getAuthToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token") || "";
};

// Axios instance with auth header
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
  },
});

// Section items configuration
const conceptionItems = ref([
  { key: "item1", title: "Xat", fileKey: "concept_project_file_id" },
  { key: "item2", title: "Konsepsiya loyihasi", fileKey: "letter_file_id" },
  {
    key: "item3",
    title: "Ilmiy-texnik kengash protokoli (ITK)",
    fileKey: "protocol_file_id",
  },
  {
    key: "item4",
    title: "Xorijiy delegatlar tahlili natijalari - Kengash qarori",
    fileKey: "solution_file_id",
  },
]);

const technicalItems = ref([
  { key: "item1", title: "Texnik vazifa", fileKey: "letter_file_id" },
  { key: "item2", title: "Texnik hujjatlar", fileKey: "solution_file_id" },
  {
    key: "item3",
    title: "Sxemalar va chizmalar",
    fileKey: "concept_project_file_id",
  },
  {
    key: "item4",
    title: "Qo'shimcha texnik materiallar",
    fileKey: "protocol_file_id",
  },
]);
const lbxItems = ref([
  { key: "item1", title: "LBX hujjat", fileKey: "letter_file_id" },
  { key: "item2", title: "LBX spesifikatsiya", fileKey: "solution_file_id" },
  {
    key: "item3",
    title: "LBX test protokoli",
    fileKey: "concept_project_file_id",
  },
  { key: "item4", title: "LBX hisobot", fileKey: "protocol_file_id" },
]);

// Document IDs storage
const documentIds = reactive({
  conception: null,
  technical: null,
  lbx: null,
});

// Accordion states
const openSections = reactive({
  conception: true,
  technical: false,
  lbx: false,
});

// File upload states
const fileStates = reactive({
  conception: {
    item1: {
      uploaded: false,
      fileName: "",
      file: null,
      saved: false,
      fileId: null,
    },
    item2: {
      uploaded: false,
      fileName: "",
      file: null,
      saved: false,
      fileId: null,
    },
    item3: {
      uploaded: false,
      fileName: "",
      file: null,
      saved: false,
      fileId: null,
    },
    item4: {
      uploaded: false,
      fileName: "",
      file: null,
      saved: false,
      fileId: null,
    },
  },
  technical: {
    item1: {
      uploaded: false,
      fileName: "",
      file: null,
      saved: false,
      fileId: null,
    },
    item2: {
      uploaded: false,
      fileName: "",
      file: null,
      saved: false,
      fileId: null,
    },
    item3: {
      uploaded: false,
      fileName: "",
      file: null,
      saved: false,
      fileId: null,
    },
    item4: {
      uploaded: false,
      fileName: "",
      file: null,
      saved: false,
      fileId: null,
    },
  },
  lbx: {
    item1: {
      uploaded: false,
      fileName: "",
      file: null,
      saved: false,
      fileId: null,
    },
    item2: {
      uploaded: false,
      fileName: "",
      file: null,
      saved: false,
      fileId: null,
    },
    item3: {
      uploaded: false,
      fileName: "",
      file: null,
      saved: false,
      fileId: null,
    },
    item4: {
      uploaded: false,
      fileName: "",
      file: null,
      saved: false,
      fileId: null,
    },
  },
});

// Loading states
const isLoading = reactive({
  conception: false,
  technical: false,
  lbx: false,
  files: {},
});

// Section statuses
const sectionStatuses = reactive({
  conception: "NEW",
  technical: "NEW",
  lbx: "NEW",
});

// Rejection comments
const rejectionComments = reactive({
  conception: "",
  technical: "",
  lbx: "",
});

// Modal states
const isHistoryModalOpen = ref(false);
const currentSection = ref("");

const fileIds = reactive({
  conception: {},
  technical: {},
  lbx: {},
});

// Computed properties
const allConceptionFilesUploaded = computed(() =>
  Object.values(fileStates.conception).every((state) => state.saved)
);

const allTechnicalFilesUploaded = computed(() =>
  Object.values(fileStates.technical).every((state) => state.saved)
);

const allLbxFilesUploaded = computed(() =>
  Object.values(fileStates.lbx).every((state) => state.saved)
);

const isTechnicalEnabled = computed(() => {
  // PROJECT_CONCEPT ACCEPTED bo'lganda technical ochiladi
  if (!projectData.value?.project_documents?.PROJECT_CONCEPT) {
    return false;
  }

  const conceptStatus =
    projectData.value.project_documents.PROJECT_CONCEPT.status;
  return conceptStatus === "ACCEPTED";
});

// Methods
const toggleSection = (section) => {
  openSections[section] = !openSections[section];
};

const formatDate = (date) => {
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const handleFileUpload = (event, section, item) => {
  const file = event.target.files[0];
  if (file) {
    fileStates[section][item] = {
      uploaded: true,
      fileName:
        file.name.length > 20 ? file.name.substring(0, 20) + "..." : file.name,
      file: file,
      saved: false,
      fileId: null,
    };
  }
  createProjectDocument;
};

const saveFile = async (section, item) => {
  const fileData = fileStates[section][item];
  if (!fileData.file) return;

  const loadingKey = `${section}_${item}`;
  isLoading.files[loadingKey] = true;

  try {
    const formData = new FormData();
    formData.append("file", fileData.file);

    const response = await api.post("/files/create", formData, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data?.data?.id) {
      fileStates[section][item].saved = true;
      fileStates[section][item].fileId = response.data.data.id;

      const sectionItems =
        section === "conception"
          ? conceptionItems.value
          : section === "technical"
          ? technicalItems.value
          : lbxItems.value;

      const itemConfig = sectionItems.find((i) => i.key === item);
      if (itemConfig) {
        fileIds[section][itemConfig.fileKey] = response.data.data.id;
      }

      toast.success(`Fayl "${fileData.fileName}" muvaffaqiyatli saqlandi!`, {
        autoClose: 2000,
      });
    }
  } catch (error) {
    console.error("File upload error:", error);
    toast.error("Faylni saqlashda xatolik yuz berdi!", {
      autoClose: 3000,
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
      fileName: "",
      file: null,
      saved: false,
      fileId: null,
    };

    // fileIds dan ham o'chirish
    const sectionItems =
      section === "conception"
        ? conceptionItems.value
        : section === "technical"
        ? technicalItems.value
        : lbxItems.value;

    const itemConfig = sectionItems.find((i) => i.key === item);
    if (itemConfig) {
      delete fileIds[section][itemConfig.fileKey];
    }

    // Input elementini tozalash - bu muhim!
    const inputId =
      section === "conception"
        ? `conception-file${
            conceptionItems.value.findIndex((i) => i.key === item) + 2
          }`
        : section === "technical"
        ? `technical-file${
            technicalItems.value.findIndex((i) => i.key === item) + 1
          }`
        : `lbx-file${lbxItems.value.findIndex((i) => i.key === item) + 1}`;

    const inputElement = document.getElementById(inputId);
    if (inputElement) {
      inputElement.value = "";
    }

    toast.success("Fayl muvaffaqiyatli o'chirildi!", {
      autoClose: 2000,
    });
  } catch (error) {
    console.error("File delete error:", error);
    toast.error("Faylni o'chirishda xatolik yuz berdi!", {
      autoClose: 3000,
    });
  } finally {
    isLoading.files[loadingKey] = false;
  }
};

const createProjectDocument = async (type, projectId, status = "NEW") => {
  try {
    const projectDoc = {
      status: status,
      type: type,
      project_id: projectId,
    };

    const response = await api.post("/project-documents/create", projectDoc, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        "Content-Type": "application/json",
      },
    });

    if (response.data?.data?.id) {
      return response.data.data.id;
    } else {
      throw new Error("Project document ID not found in response");
    }
  } catch (error) {
    console.error("Project document creation error:", error);
    throw error;
  }
};

const sendConceptionFiles = async () => {
  isLoading.conception = true;
  try {
    // Get ministry ID from sessionStorage
    const ministryId = JSON.parse(sessionStorage.getItem("selectMinistry"));
    console.log("Ministry ID:", ministryId.id);
    if (!ministryId.id) {
      throw new Error("Ministry ID not found in sessionStorage");
    }

    
    // Status ni aniqlash - agar REJECTED yoki RESOLVED bo'lsa, TO_REVIEW yuborish
    const documentStatus =
      projectDatatwo.value === "REJECTED" || projectDatatwo.value === "RESOLVED"
        ? "TO_REVIEW"
        : "NEW";

    // Create project document
    const projectDocumentResponse = await createProjectDocument(
      "PROJECT_CONCEPT",
      ministryId.id,
      documentStatus
    );
    console.log("Project document response:", projectDocumentResponse);

    // projectDocumentResponse ni to'g'ri olish
    const projectDocumentId = projectDocumentResponse; // yoki projectDocumentResponse.id agar response object bo'lsa

    sessionStorage.setItem("conceptionDocumentId", projectDocumentId);
    documentIds.conception = projectDocumentId;

     if (!projectDocumentId) {
      toast.error("Project document yaratib bo'lmadi!");
      return;
    }

    console.log("3. Project document ID:", projectDocumentId);

    // Prepare document data - to'g'ri project_document_id ishlatish
    const documentData = {
      project_document_id: projectDocumentId, // Bu projectDocumentId bo'lishi kerak
      letter_file_id: fileIds.conception.letter_file_id,
      solution_file_id: fileIds.conception.solution_file_id,
      concept_project_file_id: fileIds.conception.concept_project_file_id,
      protocol_file_id: fileIds.conception.protocol_file_id,
      date: docDateData.value.selectedDate,
      serial_number: `№${docDateData.value.docnumberconcep}`
    };

    console.log("Document data being sent:", documentData);

    // Send document data
    const response = await api.post("/documents/create", documentData, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Documents create response:", response.data);

    if (response.data) {
      sectionStatuses.conception = "TO_REVIEW";
      toast.success("Konsepsiya hujjatlari muvaffaqiyatli yuborildi!", {
        autoClose: 3000,
      });
    }
  } catch (error) {
    console.error("Send conception files error:", error);
    toast.error("Konsepsiya hujjatlarini yuborishda xatolik yuz berdi!", {
      autoClose: 3000,
    });
  } finally {
    isLoading.conception = false;
  }
};

const sendTechnicalFiles = async () => {
  isLoading.technical = true;
  try {
    const ministryId = JSON.parse(sessionStorage.getItem("selectMinistry"));
    if (!ministryId?.id) {
      throw new Error("Ministry ID not found in sessionStorage");
    }

    // Status ni aniqlash - agar REJECTED yoki RESOLVED bo'lsa, TO_REVIEW yuborish
    const documentStatus =
      technicalProjectStatus.value === "REJECTED" ||
      technicalProjectStatus.value === "RESOLVED"
        ? "TO_REVIEW"
        : "NEW";

    const projectDocumentResponse = await createProjectDocument(
      "PROJECT_TS",
      ministryId.id,
      documentStatus
    );

    // Project document yaratish yoki mavjudini ishlatish
    let projectDocumentId = projectDocumentResponse;

    sessionStorage.setItem("technicalDocumentId", projectDocumentId);
    documentIds.technical = projectDocumentId;

    // Hujjat ma'lumotlarini tayyorlash (konsepsiya kabi)
    const documentData = {
      project_document_id: projectDocumentId,
      letter_file_id: fileIds.technical.letter_file_id,
      solution_file_id: fileIds.technical.solution_file_id,
      concept_project_file_id: fileIds.technical.concept_project_file_id,
      protocol_file_id: fileIds.technical.protocol_file_id,
      date: docDateDataTech.value.selectedDateTech,
      serial_number: `№${docDateDataTech.value.docnumberTech}`
    };

    console.log("🔧 Yuborilayotgan technical documents:", documentData);

    // Hujjatlarni yuborish
    const response = await api.post("/documents/create", documentData, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        "Content-Type": "application/json",
      },
    });

    console.log("🔧 Technical documents response:", response.data);

    if (response.data) {
      sectionStatuses.technical = "TO_REVIEW";
      toast.success("Texnik vazifa hujjatlari muvaffaqiyatli yuborildi!", {
        autoClose: 3000,
      });

      // Ma'lumotlarni yangilash
      setTimeout(async () => {
        await fetchProjectData();
      }, 1000);
    }
  } catch (error) {
    console.error("Send technical files error:", error);
    toast.error("Texnik vazifa hujjatlarini yuborishda xatolik yuz berdi!", {
      autoClose: 3000,
    });
  } finally {
    isLoading.technical = false;
  }
};

const sendLbxFiles = async () => {
  isLoading.lbx = true;
  try {
    const ministryId = JSON.parse(sessionStorage.getItem("selectMinistry"));
    if (!ministryId?.id) {
      throw new Error("Ministry ID not found in sessionStorage");
    }

    // Status ni aniqlash - agar REJECTED yoki RESOLVED bo'lsa, TO_REVIEW yuborish
    const documentStatus =
      lbxProjectStatus.value === "REJECTED" ||
      lbxProjectStatus.value === "RESOLVED"
        ? "TO_REVIEW"
        : "NEW";

    const projectDocumentResponse = await createProjectDocument(
      "PROJECT_EVALUATION_DOCUMENT",
      ministryId.id,
      documentStatus
    );
    console.log("Project document response:", projectDocumentResponse);
    // Project document yaratish yoki mavjudini ishlatish
    let projectDocumentId = projectDocumentResponse;

    sessionStorage.setItem("lbxDocumentId", projectDocumentId);
    documentIds.lbx = projectDocumentId;

    // Hujjat ma'lumotlarini tayyorlash (konsepsiya kabi)
    const documentData = {
      project_document_id: projectDocumentId,
      letter_file_id: fileIds.lbx.letter_file_id,
      solution_file_id: fileIds.lbx.solution_file_id,
      concept_project_file_id: fileIds.lbx.concept_project_file_id,
      protocol_file_id: fileIds.lbx.protocol_file_id,
      date: docDateDataLBX.value.selectedDateLBX,
      serial_number: `№${docDateDataLBX.value.docnumberLBX}`
    };

    console.log("📊 Yuborilayotgan LBX documents:", documentData);

    // Hujjatlarni yuborish
    const response = await api.post("/documents/create", documentData, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        "Content-Type": "application/json",
      },
    });

    console.log("📊 LBX documents response:", response.data);

    if (response.data) {
      sectionStatuses.lbx = "TO_REVIEW";
      toast.success("LBX hujjatlari muvaffaqiyatli yuborildi!", {
        autoClose: 3000,
      });

      // Ma'lumotlarni yangilash
      setTimeout(async () => {
        await fetchProjectData();
      }, 1000);
    }
  } catch (error) {
    console.error("Send LBX files error:", error);
    toast.error("LBX hujjatlarini yuborishda xatolik yuz berdi!", {
      autoClose: 3000,
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
  currentSection.value = "";
};

const getSectionTitle = (section) => {
  const titles = {
    conception: "Konsepsiya",
    technical: "Texnik vazifa",
    lbx: "LBX",
  };
  return titles[section] || section;
};

const getSectionItems = (section) => {
  const items = {
    conception: conceptionItems.value,
    technical: technicalItems.value,
    lbx: lbxItems.value,
  };
  return items[section] || [];
};

const downloadFile = async (section, itemKey) => {
  const fileId = fileStates[section][itemKey].fileId;
  if (!fileId) {
    toast.error("Fayl topilmadi!", { autoClose: 2000 });
    return;
  }

  try {
    const response = await api.get(`/files/download/${fileId}`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileStates[section][itemKey].fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    toast.success("Fayl muvaffaqiyatli yuklandi!", { autoClose: 2000 });
  } catch (error) {
    console.error("Download error:", error);
    toast.error("Faylni yuklashda xatolik yuz berdi!", { autoClose: 3000 });
  }
};

// File download funktsiyasi
const downloadProjectFile = async (fileUrl, fileName) => {
  console.log("Download bosdi:", fileUrl, fileName);

  if (!fileUrl) {
    toast.error("Fayl URL manzili topilmadi!", { autoClose: 2000 });
    return;
  }

  try {
    toast.info("Fayl yuklanmoqda...", { autoClose: 1000 });

    // URL ni to'g'ri shakllantirish
    const fullUrl = fileUrl.startsWith("http")
      ? fileUrl
      : `https://back.miit.uz${fileUrl}`;

    // Yangi oynada ochish
    window.open(fullUrl, "_blank");

    setTimeout(() => {
      toast.success("Fayl muvaffaqiyatli yuklandi!", { autoClose: 1000 });
    }, 1000);
  } catch (error) {
    console.error("Fayl yuklashda xato:", error);
    toast.error("Fayl yuklashda xatolik yuz berdi!", { autoClose: 2000 });
  }
};

// Check document statuses on mount
const checkDocumentStatuses = async () => {
  try {
    const conceptionId = sessionStorage.getItem("conceptionDocumentId");
    const technicalId = sessionStorage.getItem("technicalDocumentId");
    const lbxId = sessionStorage.getItem("lbxDocumentId");

    // Har bir ID ni tekshirish va 404 ni handle qilish
    if (conceptionId && conceptionId !== "null") {
      try {
        const response = await api.get(`/project-documents/${conceptionId}`);
        if (response.data) {
          sectionStatuses.conception = response.data.status;
          if (response.data.comment) {
            rejectionComments.conception = response.data.comment;
          }
        }
      } catch (error) {
        if (error.response?.status === 404) {
          console.log("Conception document topilmadi, ID ni tozalash");
          sessionStorage.removeItem("conceptionDocumentId");
        }
      }
    }

    if (technicalId && technicalId !== "null") {
      try {
        const response = await api.get(`/project-documents/${technicalId}`);
        if (response.data) {
          sectionStatuses.technical = response.data.status;
          if (response.data.comment) {
            rejectionComments.technical = response.data.comment;
          }
        }
      } catch (error) {
        if (error.response?.status === 404) {
          console.log("Technical document topilmadi, ID ni tozalash");
          sessionStorage.removeItem("technicalDocumentId");
        }
      }
    }

    if (lbxId && lbxId !== "null") {
      try {
        const response = await api.get(`/project-documents/${lbxId}`);
        if (response.data) {
          sectionStatuses.lbx = response.data.status;
          if (response.data.comment) {
            rejectionComments.lbx = response.data.comment;
          }
        }
      } catch (error) {
        if (error.response?.status === 404) {
          console.log("LBX document topilmadi, ID ni tozalash");
          sessionStorage.removeItem("lbxDocumentId");
        }
      }
    }
  } catch (error) {
    console.error("Error checking document statuses:", error);
  }
};

// TEXNIK VAZIFA UCHUN - Hozircha mavjud emas
const technicalProjectStatus = computed(() => {
  if (!projectData.value?.project_documents?.PROJECT_TS) {
    return "";
  }

  const projectTsDoc = projectData.value.project_documents.PROJECT_TS;

  // Eng oxirgi answer ni olish
  const answers = projectTsDoc.answers;
  if (answers && answers.length > 0) {
    const lastAnswer = answers[answers.length - 1];
    return lastAnswer.type;
  }

  return projectTsDoc.status || "";
});
const technicalProjectCreatedAt = computed(() => {
  if (!projectData.value?.project_documents?.PROJECT_TS) {
    return "";
  }

  const projectTsDoc = projectData.value.project_documents.PROJECT_TS;
  const answers = projectTsDoc.answers;
  if (answers && answers.length > 0) {
    const lastAnswer = answers[answers.length - 1];
    return lastAnswer.created_at || "";
  }
  return projectTsDoc.created_at || "";
});

const technicalProjectAnswer = computed(() => {
  if (!projectData.value?.project_documents?.PROJECT_TS) {
    return "";
  }

  const projectTsDoc = projectData.value.project_documents.PROJECT_TS;
  const answers = projectTsDoc.answers;
  if (answers && answers.length > 0) {
    const lastAnswer = answers[answers.length - 1];
    return lastAnswer.answer || "";
  }
  return "";
});

const technicalProjectFiles = computed(() => {
  if (!projectData.value?.project_documents?.PROJECT_TS) {
    return [];
  }

  const projectTsDoc = projectData.value.project_documents.PROJECT_TS;
  const documents = projectTsDoc.documents;

  if (!documents || !Array.isArray(documents)) {
    return [];
  }

  return documents.map((doc) => ({
    id: doc.id,
    fileName: doc.file?.name || "Nomsiz fayl",
    fileUrl: doc.file?.url,
    fileId: doc.file?.id,
    type: doc.type, // Yangi qo'shilgan qism
    createdAt: doc.created_at,
  }));
});

// LBX UCHUN - Hozircha mavjud emas
const lbxProjectStatus = computed(() => {
  if (!projectData.value?.project_documents?.PROJECT_EVALUATION_DOCUMENT) {
    return "";
  }

  const lbxDoc =
    projectData.value.project_documents.PROJECT_EVALUATION_DOCUMENT;

  // Eng oxirgi answer ni olish
  const answers = lbxDoc.answers;
  if (answers && answers.length > 0) {
    const lastAnswer = answers[answers.length - 1];
    console.log("LBX oxirgi javob turi:", lastAnswer.type);
    return lastAnswer.type;
  }

  // Agar answers bo'lmasa, project status ni qaytarish
  return lbxDoc.status || "";
});

const lbxProjectCreatedAt = computed(() => {
  if (!projectData.value?.project_documents?.PROJECT_EVALUATION_DOCUMENT) {
    return "";
  }

  const lbxDoc =
    projectData.value.project_documents.PROJECT_EVALUATION_DOCUMENT;
  const answers = lbxDoc.answers;
  if (answers && answers.length > 0) {
    const lastAnswer = answers[answers.length - 1];
    return lastAnswer.created_at || "";
  }
  return lbxDoc.created_at || "";
});

const lbxProjectAnswer = computed(() => {
  if (!projectData.value?.project_documents?.PROJECT_EVALUATION_DOCUMENT) {
    return "";
  }

  const lbxDoc =
    projectData.value.project_documents.PROJECT_EVALUATION_DOCUMENT;
  const answers = lbxDoc.answers;
  if (answers && answers.length > 0) {
    const lastAnswer = answers[answers.length - 1];
    return lastAnswer.answer || "";
  }
  return "";
});

const lbxProjectFiles = computed(() => {
  if (!projectData.value?.project_documents?.PROJECT_EVALUATION_DOCUMENT) {
    return [];
  }

  const lbxDoc =
    projectData.value.project_documents.PROJECT_EVALUATION_DOCUMENT;
  const documents = lbxDoc.documents;

  if (!documents || !Array.isArray(documents)) {
    return [];
  }

  return documents.map((doc) => ({
    id: doc.id,
    fileName: doc.file?.name || "Nomsiz fayl",
    fileUrl: doc.file?.url,
    fileId: doc.file?.id,
    createdAt: doc.created_at,
  }));
});
// Enable/Disable mantigi
// const isTechnicalEnabled = computed(() =>
//   projectDatatwo.value === 'ACCEPTED'
// );

// const isLbxEnabled = computed(() =>
//   technicalProjectStatus.value === 'ACCEPTED'
// );

// Modal content uchun section bo'yicha ma'lumot olish
const getCurrentSectionData = (section) => {
  if (section === "conception") {
    const conceptDoc = projectData.value?.project_documents?.PROJECT_CONCEPT;
    const lastAnswer = conceptDoc?.answers?.[conceptDoc.answers.length - 1];

    return {
      status: lastAnswer?.type || conceptDoc?.status || "",
      createdAt: lastAnswer?.created_at || conceptDoc?.created_at || "",
      answer: lastAnswer?.answer || "",
      files: projectDatatwofiles.value,
      answerFiles: lastAnswer?.files || [], // Yangi qo'shildi
    };
  } else if (section === "technical") {
    const tsDoc = projectData.value?.project_documents?.PROJECT_TS;
    const lastAnswer = tsDoc?.answers?.[tsDoc.answers.length - 1];

    return {
      status: lastAnswer?.type || tsDoc?.status || "",
      createdAt: lastAnswer?.created_at || tsDoc?.created_at || "",
      answer: lastAnswer?.answer || "",
      files: technicalProjectFiles.value,
      answerFiles: lastAnswer?.files || [], // Yangi qo'shildi
    };
  } else if (section === "lbx") {
    const lbxDoc =
      projectData.value?.project_documents?.PROJECT_EVALUATION_DOCUMENT;
    const lastAnswer = lbxDoc?.answers?.[lbxDoc.answers.length - 1];

    return {
      status: lastAnswer?.type || lbxDoc?.status || "",
      createdAt: lastAnswer?.created_at || lbxDoc?.created_at || "",
      answer: lastAnswer?.answer || "",
      files: lbxProjectFiles.value,
      answerFiles: lastAnswer?.files || [], // Yangi qo'shildi
    };
  }
  return {
    status: "",
    createdAt: "",
    answer: "",
    files: [],
    answerFiles: [],
  };
};

// isLbxEnabled ni yangilash
const isLbxEnabled = computed(() => {
  // PROJECT_TS ACCEPTED bo'lganda LBX ochiladi
  if (!projectData.value?.project_documents?.PROJECT_TS) {
    return false;
  }

  const technicalStatus = projectData.value.project_documents.PROJECT_TS.status;
  return technicalStatus === "ACCEPTED";
});

// History ma'lumotlarini olish funksiyasi
const getHistoryData = (section) => {
  if (!projectData.value?.history) {
    return [];
  }

  let historyKey = "";
  switch (section) {
    case "conception":
      historyKey = "PROJECT_CONCEPT";
      break;
    case "technical":
      historyKey = "PROJECT_TS";
      break;
    case "lbx":
      historyKey = "PROJECT_EVALUATION_DOCUMENT";
      break;
    default:
      return [];
  }

  const historyArray = projectData.value.history[historyKey] || [];

  // History ma'lumotlarini reverse chronological tartibda qaytarish (eng yangisi birinchi)
  return historyArray.sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });
};

const getStatusText = (status) => {
  const statusTexts = {
    RESOLVED: "Qayta ko'rib chiqish uchun",
    REJECTED: "Izoh",
    ACCEPTED: "Tasdiqlangan",
    TO_REVIEW: "Ko'rib chiqilmoqda",
    NEW: "Yangi",
  };
  return statusTexts[status] || status;
};

// Modal content ni yangilash
const updateModalContent = () => {
  // Modal content templateni yangilash kerak bo'ladi
  // currentSection.value ga qarab tegishli ma'lumotlarni ko'rsatish
  const sectionData = getCurrentSectionData(currentSection.value);

  return {
    status: sectionData.status,
    createdAt: sectionData.createdAt,
    answer: sectionData.answer,
  };
};

// / technical section ==============================================

watch(
  () => sessionStorage.getItem("selectMinistry"),
  (newVal) => {
    if (newVal) {
      // Loyiha o'zgarganda file states ni tozalash
      Object.keys(fileStates).forEach((section) => {
        Object.keys(fileStates[section]).forEach((item) => {
          fileStates[section][item] = {
            uploaded: false,
            fileName: "",
            file: null,
            saved: false,
            fileId: null,
          };
        });
      });

      // Yangi loyiha ma'lumotlarini olish
      fetchProjectData();
    }
  }
);

// Lifecycle hooks
onMounted(() => {
  fetchProjectData();
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
