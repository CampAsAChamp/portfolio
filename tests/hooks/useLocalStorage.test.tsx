import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useLocalStorage } from 'hooks/useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should return default value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))

    expect(result.current[0]).toBe('default')
  })

  it('should return stored value from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify('stored-value'))

    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))

    expect(result.current[0]).toBe('stored-value')
  })

  it('should update localStorage when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))

    act(() => {
      result.current[1]('new-value')
    })

    expect(result.current[0]).toBe('new-value')
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('new-value'))
  })

  it('should handle objects correctly', () => {
    const testObject = { name: 'test', value: 123 }
    const { result } = renderHook(() => useLocalStorage('test-key', {}))

    act(() => {
      result.current[1](testObject)
    })

    expect(result.current[0]).toEqual(testObject)
    const storedValue = localStorage.getItem('test-key')
    expect(storedValue).toBeTruthy()
    expect(JSON.parse(storedValue!)).toEqual(testObject)
  })

  it('should handle arrays correctly', () => {
    const testArray = [1, 2, 3, 4, 5]
    const { result } = renderHook(() => useLocalStorage<number[]>('test-key', []))

    act(() => {
      result.current[1](testArray)
    })

    expect(result.current[0]).toEqual(testArray)
    const storedValue = localStorage.getItem('test-key')
    expect(storedValue).toBeTruthy()
    expect(JSON.parse(storedValue!)).toEqual(testArray)
  })

  it('should handle boolean values', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', false))

    act(() => {
      result.current[1](true)
    })

    expect(result.current[0]).toBe(true)
    const storedValue = localStorage.getItem('test-key')
    expect(storedValue).toBeTruthy()
    expect(JSON.parse(storedValue!)).toBe(true)
  })

  it('should handle function updates like useState', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 5))

    act(() => {
      result.current[1]((prev) => prev + 10)
    })

    expect(result.current[0]).toBe(15)
    const storedValue = localStorage.getItem('test-key')
    expect(storedValue).toBeTruthy()
    expect(JSON.parse(storedValue!)).toBe(15)
  })

  it('should handle invalid JSON gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    localStorage.setItem('test-key', 'invalid-json{')

    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))

    expect(result.current[0]).toBe('default')
    expect(consoleSpy).toHaveBeenCalled()
  })

  it('should listen for storage events from other tabs', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))

    // Simulate storage event from another tab
    act(() => {
      const event = new StorageEvent('storage', {
        key: 'test-key',
        newValue: JSON.stringify('updated-from-other-tab'),
      })
      window.dispatchEvent(event)
    })

    expect(result.current[0]).toBe('updated-from-other-tab')
  })

  it('should ignore storage events for different keys', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))

    act(() => {
      const event = new StorageEvent('storage', {
        key: 'other-key',
        newValue: JSON.stringify('other-value'),
      })
      window.dispatchEvent(event)
    })

    expect(result.current[0]).toBe('initial')
  })
})
