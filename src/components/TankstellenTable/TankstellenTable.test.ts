import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import TankstellenTable from './TankstellenTable.vue'
import { useTankstellenStore } from '../../stores/tankstellen/tankstellen.store'

const MOCK_STATIONS = [
  { objectid: 1, adresse: 'Bonner Str. 98 (50677 Neustadt/Süd)', lat: 50.916, lng: 6.96 },
  { objectid: 2, adresse: 'Aachener Str. 12 (50674 Lindenthal)', lat: 50.935, lng: 6.92 },
]

describe('TankstellenTable', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders all stations from the store as rows', () => {
    const store = useTankstellenStore()
    store.items = MOCK_STATIONS

    const wrapper = mount(TankstellenTable)
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
  })

  it('renders parsed street and district per row', () => {
    const store = useTankstellenStore()
    store.items = MOCK_STATIONS

    const wrapper = mount(TankstellenTable)
    const cells = wrapper.find('tbody tr').findAll('td')

    expect(cells[0].text()).toBe('Bonner Str. 98')
    expect(cells[1].text()).toBe('50677 Neustadt/Süd')
  })

  it('selects the station in the store on row click', async () => {
    const store = useTankstellenStore()
    store.items = MOCK_STATIONS

    const wrapper = mount(TankstellenTable)
    await wrapper.find('tbody tr').trigger('click')

    expect(store.selectedStation?.objectid).toBe(1)
  })

  it('highlights the row that matches the selected station', async () => {
    const store = useTankstellenStore()
    store.items = MOCK_STATIONS

    const wrapper = mount(TankstellenTable)
    store.selectStation(MOCK_STATIONS[1])
    await wrapper.vm.$nextTick()

    const rows = wrapper.findAll('tbody tr')
    expect(rows[1].classes().join(' ')).toContain('bg-blue-50')
  })
})
