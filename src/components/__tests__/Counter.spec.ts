import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import Counter from '../Counter.vue'

describe('Counter', () => {
  it('renders properly', () => {
    const wrapper = mount(Counter)
    expect(wrapper.text()).toContain('Счетчик')
  })
})
