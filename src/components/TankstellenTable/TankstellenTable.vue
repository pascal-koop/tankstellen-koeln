<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useTankstellenStore } from '../../stores/tankstellen/tankstellen.store'
import { extractStreet, extractDistrict } from '../../utils/address/address'

const ITEMS_PER_PAGE = 15

const store = useTankstellenStore()
const { filteredAndSorted } = storeToRefs(store)

const currentPage = ref(1)

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredAndSorted.value.length / ITEMS_PER_PAGE)),
)

const paginated = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  return filteredAndSorted.value.slice(start, start + ITEMS_PER_PAGE)
})

watch(
  () => filteredAndSorted.value.length,
  () => {
    currentPage.value = 1
  },
)

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}
</script>

<template>
  <div class="overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-gray-700">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400"
            >
              Straße
            </th>
            <th
              scope="col"
              class="px-4 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400"
            >
              PLZ / Stadtteil
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
          <tr
            v-for="station in paginated"
            :key="station.objectid"
            class="cursor-pointer transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20"
            :class="{
              'bg-blue-50 dark:bg-blue-900/30':
                store.selectedStation?.objectid === station.objectid,
            }"
            @click="store.selectStation(station)"
          >
            <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ extractStreet(station.adresse) }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              {{ extractDistrict(station.adresse) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="totalPages > 1"
      class="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800"
    >
      <button
        type="button"
        :disabled="currentPage === 1"
        class="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-700"
        @click="goToPage(currentPage - 1)"
      >
        Vorherige
      </button>

      <span class="text-sm text-gray-500 dark:text-gray-400">
        Seite
        <span class="font-semibold text-gray-700 dark:text-gray-200">{{ currentPage }}</span>
        von
        <span class="font-semibold text-gray-700 dark:text-gray-200">{{ totalPages }}</span>
      </span>

      <button
        type="button"
        :disabled="currentPage === totalPages"
        class="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-700"
        @click="goToPage(currentPage + 1)"
      >
        Nächste
      </button>
    </div>
  </div>
</template>
