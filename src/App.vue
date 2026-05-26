<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTankstellenStore } from './stores/tankstellen/tankstellen.store'
import SearchBar from './components/SearchBar/SearchBar.vue'
import SortControls from './components/SortControls/SortControls.vue'
import TankstellenTable from './components/TankstellenTable/TankstellenTable.vue'
import TankstellenMap from './components/TankstellenMap/TankstellenMap.vue'

const store = useTankstellenStore()
const { isLoading, hasError, searchQuery, totalCount, filteredCount, hasResults } =
  storeToRefs(store)

onMounted(store.loadTankstellen)
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <header
      class="border-b border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex flex-col gap-1">
          <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Tankstellen Köln
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Übersicht aller Tankstellen im Kölner Stadtgebiet
          </p>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
        <div
          class="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"
        />
        <p class="mt-4 text-sm text-gray-500 dark:text-gray-400">Tankstellen werden geladen…</p>
      </div>

      <div
        v-else-if="hasError"
        role="alert"
        class="mx-auto max-w-xl rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20"
      >
        <svg
          class="mx-auto h-10 w-10 text-red-500 dark:text-red-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
        <p class="mt-3 text-sm text-red-800 dark:text-red-300">
          Es ist ein Fehler aufgetreten. Bitte versuche es erneut.
        </p>
        <button
          type="button"
          class="mt-5 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
          @click="store.loadTankstellen"
        >
          Erneut versuchen
        </button>
      </div>

      <template v-else>
        <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div class="flex-1">
            <SearchBar />
          </div>
          <div class="flex items-center gap-4">
            <SortControls />
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ filteredCount }} von {{ totalCount }} Ergebnissen
            </span>
          </div>
        </div>

        <div class="mb-6">
          <TankstellenMap />
        </div>

        <TankstellenTable v-if="hasResults" />

        <div
          v-else
          class="rounded-lg border border-gray-200 bg-white py-12 text-center dark:border-gray-700 dark:bg-gray-900"
        >
          <p class="text-gray-500 dark:text-gray-400">
            Keine Tankstellen gefunden für „{{ searchQuery }}"
          </p>
        </div>
      </template>
    </main>
  </div>
</template>
