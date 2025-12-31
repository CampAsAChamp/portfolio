import { useCallback, useEffect, useState } from 'react'

/**
 * Setter function type that accepts either a direct value or an updater function.
 * Mimics the same API as React's useState setter for consistency.
 */
type SetValue<T> = (value: T | ((prevValue: T) => T)) => void

/**
 * Custom hook for managing localStorage with React state synchronization
 * @param key - The localStorage key
 * @param defaultValue - The default value if key doesn't exist
 * @returns Tuple of [value, setValue]
 */
export function useLocalStorage<T>(key: string, defaultValue: T): [T, SetValue<T>] {
  // Initialize state with value from localStorage or default
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? (JSON.parse(stored) as T) : defaultValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return defaultValue
    }
  })

  // Update localStorage whenever value changes
  const setStoredValue = useCallback<SetValue<T>>(
    (newValue) => {
      try {
        // Allow value to be a function for same API as useState
        const valueToStore = newValue instanceof Function ? newValue(value) : newValue

        setValue(valueToStore)
        localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, value],
  )

  // Listen for storage events from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent): void => {
      if (e.key === key && e.newValue !== null) {
        try {
          setValue(JSON.parse(e.newValue) as T)
        } catch (error) {
          console.warn(`Error parsing localStorage change for key "${key}":`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [value, setStoredValue]
}
