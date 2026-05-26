<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTankstellenStore } from '../../stores/tankstellen/tankstellen.store'

const store = useTankstellenStore()
const { searchQuery } = storeToRefs(store)
</script>

<template>
  <div class="relative">
    <svg
      class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Nach Straßenname suchen…"
      class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-4 pl-10 text-sm shadow-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
    />
  </div>
</template>
