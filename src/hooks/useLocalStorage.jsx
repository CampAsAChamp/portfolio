import { useCallback, useEffect, useState } from 'react'

/**
 * Custom hook for managing localStorage with React state synchronization
 * @param {string} key - The localStorage key
 * @param {*} defaultValue - The default value if key doesn't exist
 * @returns {[any, Function]} - Tuple of [value, setValue]
 */
export function useLocalStorage(key, defaultValue) {
  // Initialize state with value from localStorage or default
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : defaultValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return defaultValue
    }
  })

  // Update localStorage whenever value changes
  const setStoredValue = useCallback(
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
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setValue(JSON.parse(e.newValue))
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
