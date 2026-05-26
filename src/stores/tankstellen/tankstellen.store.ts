import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchTankstellen } from '../../api/tankstellen/tankstellen.api'
import type { Tankstelle } from '../../api/tankstellen/tankstellen.types'
import { extractStreet, normalizeStreet } from '../../utils/address/address'

export type SortDirection = 'asc' | 'desc' | null

export const useTankstellenStore = defineStore('tankstellen', () => {
  const items = ref<Tankstelle[]>([])
  const isLoading = ref(false)
  const hasError = ref(false)

  const searchQuery = ref('')
  const sortDirection = ref<SortDirection>(null)
  const selectedStation = ref<Tankstelle | null>(null)

  const filtered = computed(() => {
    const query = normalizeStreet(searchQuery.value)
    if (!query) return items.value

    return items.value.filter((station) =>
      normalizeStreet(extractStreet(station.adresse)).includes(query),
    )
  })

  const filteredAndSorted = computed(() => {
    if (!sortDirection.value) return filtered.value

    const direction = sortDirection.value === 'asc' ? 1 : -1
    return [...filtered.value].sort((a, b) => {
      const streetA = extractStreet(a.adresse)
      const streetB = extractStreet(b.adresse)
      return streetA.localeCompare(streetB, 'de') * direction
    })
  })

  const totalCount = computed(() => items.value.length)
  const filteredCount = computed(() => filteredAndSorted.value.length)
  const hasResults = computed(() => filteredCount.value > 0)

  async function loadTankstellen() {
    isLoading.value = true
    hasError.value = false
    try {
      items.value = await fetchTankstellen()
    } catch {
      hasError.value = true
    } finally {
      isLoading.value = false
    }
  }

  function setSearchQuery(value: string) {
    searchQuery.value = value
  }

  function toggleSort() {
    if (sortDirection.value === null) {
      sortDirection.value = 'asc'
    } else if (sortDirection.value === 'asc') {
      sortDirection.value = 'desc'
    } else {
      sortDirection.value = null
    }
  }

  function selectStation(station: Tankstelle | null) {
    selectedStation.value = station
  }

  return {
    items,
    isLoading,
    hasError,

    searchQuery,
    sortDirection,
    selectedStation,

    filteredAndSorted,
    totalCount,
    filteredCount,
    hasResults,

    loadTankstellen,
    setSearchQuery,
    toggleSort,
    selectStation,
  }
})
