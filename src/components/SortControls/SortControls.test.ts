import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import SortControls from './SortControls.vue'
import { useTankstellenStore } from '../../stores/tankstellen/tankstellen.store'

describe('SortControls', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('shows the default label when nothing is sorted', () => {
    const wrapper = mount(SortControls)
    expect(wrapper.text()).toContain('Sortieren')
  })

  it('cycles through asc, desc, null on click', async () => {
    const store = useTankstellenStore()
    const wrapper = mount(SortControls)

    await wrapper.find('button').trigger('click')
    expect(store.sortDirection).toBe('asc')
    expect(wrapper.text()).toContain('A → Z')

    await wrapper.find('button').trigger('click')
    expect(store.sortDirection).toBe('desc')
    expect(wrapper.text()).toContain('Z → A')

    await wrapper.find('button').trigger('click')
    expect(store.sortDirection).toBeNull()
  })
})
