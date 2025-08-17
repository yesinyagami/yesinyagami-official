import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TarotCard from '@/components/TarotCard.vue'

describe('TarotCard', () => {
  const mockCard = {
    id: 1,
    name: 'The Fool',
    arcana: 'major',
    suit: null,
    rank: null,
    number: 0,
    keywords: ['new beginnings', 'innocence'],
    meaning: 'New beginnings and unlimited potential',
    reversedMeaning: 'Recklessness and poor judgment',
    imageUrl: '/assets/01_The_Fool.png',
    element: 'air',
    planet: 'Uranus',
    zodiac: 'Aquarius'
  }

  it('renders card name correctly', () => {
    const wrapper = mount(TarotCard, {
      props: { card: mockCard }
    })
    
    expect(wrapper.text()).toContain('The Fool')
  })

  it('shows selected state when selected prop is true', () => {
    const wrapper = mount(TarotCard, {
      props: { card: mockCard, selected: true }
    })
    
    expect(wrapper.classes()).toContain('animate-glow')
  })

  it('emits select event when clicked', async () => {
    const wrapper = mount(TarotCard, {
      props: { card: mockCard }
    })
    
    await wrapper.trigger('click')
    
    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')?.[0]).toEqual([mockCard])
  })

  it('displays card arcana', () => {
    const wrapper = mount(TarotCard, {
      props: { card: mockCard }
    })
    
    expect(wrapper.text()).toContain('major')
  })
})