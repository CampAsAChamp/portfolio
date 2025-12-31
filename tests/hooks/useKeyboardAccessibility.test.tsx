import React from 'react'

import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useKeyboardAccessibility } from 'hooks/useKeyboardAccessibility'

describe('useKeyboardAccessibility', () => {
  it('should call callback when Enter key is pressed', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useKeyboardAccessibility(callback))

    const preventDefault = vi.fn()
    const event = {
      key: 'Enter',
      preventDefault,
    } as unknown as React.KeyboardEvent<Element>

    result.current.onKeyDown(event)

    expect(callback).toHaveBeenCalledWith(event)
    expect(preventDefault).toHaveBeenCalled()
  })

  it('should call callback when Space key is pressed', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useKeyboardAccessibility(callback))

    const preventDefault = vi.fn()
    const event = {
      key: ' ',
      preventDefault,
    } as unknown as React.KeyboardEvent<Element>

    result.current.onKeyDown(event)

    expect(callback).toHaveBeenCalledWith(event)
    expect(preventDefault).toHaveBeenCalled()
  })

  it('should not call callback for other keys', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useKeyboardAccessibility(callback))

    const preventDefault = vi.fn()
    const event = {
      key: 'Escape',
      preventDefault,
    } as unknown as React.KeyboardEvent<Element>

    result.current.onKeyDown(event)

    expect(callback).not.toHaveBeenCalled()
    expect(preventDefault).not.toHaveBeenCalled()
  })

  it('should not call callback for Tab key', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useKeyboardAccessibility(callback))

    const preventDefault = vi.fn()
    const event = {
      key: 'Tab',
      preventDefault,
    } as unknown as React.KeyboardEvent<Element>

    result.current.onKeyDown(event)

    expect(callback).not.toHaveBeenCalled()
    expect(preventDefault).not.toHaveBeenCalled()
  })

  it('should not call callback for arrow keys', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useKeyboardAccessibility(callback))

    const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']

    arrowKeys.forEach((key) => {
      const preventDefault = vi.fn()
      const event = {
        key,
        preventDefault,
      } as unknown as React.KeyboardEvent<Element>

      result.current.onKeyDown(event)

      expect(callback).not.toHaveBeenCalled()
      expect(preventDefault).not.toHaveBeenCalled()
    })
  })

  it('should handle multiple different callbacks', () => {
    const callback1 = vi.fn()
    const callback2 = vi.fn()

    const { result: result1 } = renderHook(() => useKeyboardAccessibility(callback1))
    const { result: result2 } = renderHook(() => useKeyboardAccessibility(callback2))

    const event = {
      key: 'Enter',
      preventDefault: vi.fn(),
    } as unknown as React.KeyboardEvent<Element>

    result1.current.onKeyDown(event)
    expect(callback1).toHaveBeenCalled()
    expect(callback2).not.toHaveBeenCalled()

    result2.current.onKeyDown(event)
    expect(callback2).toHaveBeenCalled()
  })

  it('should pass event object to callback', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useKeyboardAccessibility(callback))

    const event = {
      key: 'Enter',
      preventDefault: vi.fn(),
      target: { id: 'test-element' },
      currentTarget: { className: 'test-class' },
    } as unknown as React.KeyboardEvent<Element>

    result.current.onKeyDown(event)

    expect(callback).toHaveBeenCalledWith(event)
    expect(callback.mock.calls[0]).toBeTruthy()
    expect(callback.mock.calls[0]![0]).toBeTruthy()
    expect(callback.mock.calls[0]![0]).toHaveProperty('target')
    expect(callback.mock.calls[0]![0]).toHaveProperty('currentTarget')
  })

  it('should return consistent handler reference when callback changes', () => {
    const callback1 = vi.fn()
    const { result, rerender } = renderHook(({ cb }) => useKeyboardAccessibility(cb), {
      initialProps: { cb: callback1 },
    })

    const handler1 = result.current.onKeyDown

    const callback2 = vi.fn()
    rerender({ cb: callback2 })

    const handler2 = result.current.onKeyDown

    // Handlers should be different when callback changes
    expect(handler1).not.toBe(handler2)
  })
})
