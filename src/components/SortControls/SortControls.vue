<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTankstellenStore } from '../../stores/tankstellen/tankstellen.store'

const store = useTankstellenStore()
const { sortDirection } = storeToRefs(store)
</script>

<template>
  <button
    class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
    :class="{
      'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-300':
        sortDirection !== null,
    }"
    @click="store.toggleSort"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="h-4 w-4"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
      />
    </svg>
    <span v-if="sortDirection === null">Sortieren</span>
    <span v-else-if="sortDirection === 'asc'">A → Z</span>
    <span v-else>Z → A</span>
  </button>
</template>
