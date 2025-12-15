import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import useCustomHook from '../hooks/useCustomHook'

describe('useCustomHook', () => {
  it('returns initial state', () => {
    const { result } = renderHook(() => useCustomHook())
    
    expect(result.current.value).toBe(null)
    expect(typeof result.current.setValue).toBe('function')
  })

  it('updates state correctly', () => {
    const { result } = renderHook(() => useCustomHook())
    
    act(() => {
      result.current.setValue('new value')
    })
    
    expect(result.current.value).toBe('new value')
  })

  it('handles side effects', () => {
    const mockEffect = vi.fn()
    renderHook(() => useCustomHook({ onEffect: mockEffect }))
    
    expect(mockEffect).toHaveBeenCalled()
  })
})