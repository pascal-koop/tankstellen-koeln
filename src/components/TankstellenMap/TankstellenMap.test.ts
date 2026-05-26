import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('@vue-leaflet/vue-leaflet', () => ({
  LMap: { name: 'LMap', template: '<div><slot /></div>' },
  LTileLayer: { name: 'LTileLayer', template: '<div />' },
  LMarker: {
    name: 'LMarker',
    props: ['latLng'],
    template: '<div class="marker" @click="$emit(\'click\')"><slot /></div>',
  },
  LPopup: { name: 'LPopup', template: '<div><slot /></div>' },
}))

import TankstellenMap from './TankstellenMap.vue'
import { useTankstellenStore } from '../../stores/tankstellen/tankstellen.store'

const MOCK_STATIONS = [
  { objectid: 1, adresse: 'Bonner Str. 98 (50677 Neustadt/Süd)', lat: 50.916, lng: 6.96 },
  { objectid: 2, adresse: 'Aachener Str. 12 (50674 Lindenthal)', lat: 50.935, lng: 6.92 },
]

describe('TankstellenMap', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders one marker per station from the store', async () => {
    const store = useTankstellenStore()
    store.items = MOCK_STATIONS

    const wrapper = mount(TankstellenMap)
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.marker')).toHaveLength(2)
  })

  it('selects the station in the store on marker click', async () => {
    const store = useTankstellenStore()
    store.items = MOCK_STATIONS

    const wrapper = mount(TankstellenMap)
    await wrapper.vm.$nextTick()

    await wrapper.findAll('.marker')[1].trigger('click')

    expect(store.selectedStation?.objectid).toBe(2)
  })
})
