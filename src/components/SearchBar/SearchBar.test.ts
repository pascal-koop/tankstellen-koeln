import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import SearchBar from './SearchBar.vue'
import { useTankstellenStore } from '../../stores/tankstellen/tankstellen.store'

describe('SearchBar', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders an input with the placeholder text', () => {
    const wrapper = mount(SearchBar)
    expect(wrapper.find('input').attributes('placeholder')).toContain('Straßenname')
  })

  it('writes the input value into the store', async () => {
    const store = useTankstellenStore()
    const wrapper = mount(SearchBar)

    await wrapper.find('input').setValue('Bonner')

    expect(store.searchQuery).toBe('Bonner')
  })

  it('reflects store changes back into the input', async () => {
    const store = useTankstellenStore()
    const wrapper = mount(SearchBar)

    store.setSearchQuery('Aachener')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('input').element.value).toBe('Aachener')
  })
})
