import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

const MOCK_DATA = [
  { objectid: 1, adresse: 'Bonner Str. 98 (50677 Neustadt/Süd)', lat: 50.916, lng: 6.96 },
  { objectid: 2, adresse: 'Aachener Str. 12 (50674 Lindenthal)', lat: 50.935, lng: 6.92 },
  { objectid: 3, adresse: 'Zülpicher Str. 45 (50674 Kwartier Latäng)', lat: 50.928, lng: 6.94 },
]

vi.mock('../../api/tankstellen/tankstellen.api', () => ({
  fetchTankstellen: vi.fn(() => Promise.resolve(MOCK_DATA)),
}))

import { fetchTankstellen } from '../../api/tankstellen/tankstellen.api'
import { useTankstellenStore } from './tankstellen.store'

describe('useTankstellenStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.mocked(fetchTankstellen).mockClear()
    vi.mocked(fetchTankstellen).mockResolvedValue(MOCK_DATA)
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('starts empty before loading', () => {
    const store = useTankstellenStore()
    expect(store.items).toEqual([])
    expect(store.isLoading).toBe(false)
    expect(store.hasError).toBe(false)
  })

  it('loads tankstellen from the API', async () => {
    const store = useTankstellenStore()
    await store.loadTankstellen()

    expect(store.items).toHaveLength(3)
    expect(store.isLoading).toBe(false)
    expect(store.hasError).toBe(false)
  })

  it('sets hasError when the API call fails', async () => {
    vi.mocked(fetchTankstellen).mockRejectedValueOnce(new Error('boom'))
    const store = useTankstellenStore()
    await store.loadTankstellen()

    expect(store.hasError).toBe(true)
    expect(store.items).toEqual([])
    expect(store.isLoading).toBe(false)
  })

  it('resets hasError on a successful retry', async () => {
    vi.mocked(fetchTankstellen).mockRejectedValueOnce(new Error('boom'))
    const store = useTankstellenStore()
    await store.loadTankstellen()
    expect(store.hasError).toBe(true)

    await store.loadTankstellen()
    expect(store.hasError).toBe(false)
    expect(store.items).toHaveLength(3)
  })

  it('filters by search query (Straße / Strasse / Str.)', async () => {
    const store = useTankstellenStore()
    await store.loadTankstellen()

    store.setSearchQuery('bonner')
    expect(store.filteredAndSorted).toHaveLength(1)
    expect(store.filteredAndSorted[0].adresse).toContain('Bonner')

    store.setSearchQuery('Bonner Straße')
    expect(store.filteredAndSorted).toHaveLength(1)
  })

  it('returns empty results when search has no match', async () => {
    const store = useTankstellenStore()
    await store.loadTankstellen()

    store.setSearchQuery('Hamburg')
    expect(store.filteredAndSorted).toHaveLength(0)
    expect(store.hasResults).toBe(false)
  })

  it('cycles sort direction null -> asc -> desc -> null', async () => {
    const store = useTankstellenStore()
    await store.loadTankstellen()

    expect(store.sortDirection).toBeNull()
    store.toggleSort()
    expect(store.sortDirection).toBe('asc')
    store.toggleSort()
    expect(store.sortDirection).toBe('desc')
    store.toggleSort()
    expect(store.sortDirection).toBeNull()
  })

  it('sorts ascending and descending by street name', async () => {
    const store = useTankstellenStore()
    await store.loadTankstellen()

    store.toggleSort()
    expect(store.filteredAndSorted[0].adresse).toContain('Aachener')
    expect(store.filteredAndSorted[2].adresse).toContain('Zülpicher')

    store.toggleSort()
    expect(store.filteredAndSorted[0].adresse).toContain('Zülpicher')
    expect(store.filteredAndSorted[2].adresse).toContain('Aachener')
  })

  it('tracks totalCount and filteredCount independently', async () => {
    const store = useTankstellenStore()
    await store.loadTankstellen()

    expect(store.totalCount).toBe(3)
    expect(store.filteredCount).toBe(3)

    store.setSearchQuery('bonner')
    expect(store.totalCount).toBe(3)
    expect(store.filteredCount).toBe(1)
  })

  it('selects and clears a station', async () => {
    const store = useTankstellenStore()
    await store.loadTankstellen()

    store.selectStation(store.items[0])
    expect(store.selectedStation?.objectid).toBe(1)

    store.selectStation(null)
    expect(store.selectedStation).toBeNull()
  })
})
