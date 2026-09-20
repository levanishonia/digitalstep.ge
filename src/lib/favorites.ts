import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'digital-step:favorites'
const EVENT = 'digital-step:favorites-changed'

function read(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(value) ? [...new Set(value.filter((item): item is string => typeof item === 'string'))] : []
  } catch { return [] }
}

let snapshot = JSON.stringify(read())
const subscribe = (notify: () => void) => {
  const update = () => { snapshot = JSON.stringify(read()); notify() }
  window.addEventListener(EVENT, update); window.addEventListener('storage', update)
  return () => { window.removeEventListener(EVENT, update); window.removeEventListener('storage', update) }
}

export function toggleFavorite(serviceId: string) {
  const favorites = new Set(read())
  if (favorites.has(serviceId)) favorites.delete(serviceId); else favorites.add(serviceId)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]))
  window.dispatchEvent(new Event(EVENT))
}

export function useFavorites() {
  return JSON.parse(useSyncExternalStore(subscribe, () => snapshot, () => '[]')) as string[]
}
