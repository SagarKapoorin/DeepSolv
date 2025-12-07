import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

export type FavoritePokemon = {
  id: number
  name: string
}

type FavoritesContextValue = {
  favoritesMap: Record<number, FavoritePokemon>
  favoritesList: FavoritePokemon[]
  toggleFavorite: (pokemon: FavoritePokemon) => void
  isFavorite: (id: number) => boolean
}

const STORAGE_KEY = 'favorites-storage'

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

const readStorage = (): Record<number, FavoritePokemon> => {
  if (typeof window === 'undefined') return {}
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favoritesMap, setFavoritesMap] = useState<Record<number, FavoritePokemon>>(() =>
    readStorage(),
  )

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoritesMap))
    } catch {
      console.warn('Failed to save favorites to localStorage')
    }
  }, [favoritesMap])

  const toggleFavorite = useCallback((pokemon: FavoritePokemon) => {
    setFavoritesMap((current) => {
      if (current[pokemon.id]) {
        const updated = { ...current }
        delete updated[pokemon.id]
        return updated
      }
      return { ...current, [pokemon.id]: pokemon }
    })
  }, [])

  const isFavorite = useCallback(
    (id: number) => Boolean(favoritesMap[id]),
    [favoritesMap],
  )

  const favoritesList = useMemo(
    () => Object.values(favoritesMap).sort((a, b) => a.id - b.id),
    [favoritesMap],
  )

  const value = useMemo(
    () => ({ favoritesMap, favoritesList, toggleFavorite, isFavorite }),
    [favoritesMap, favoritesList, toggleFavorite, isFavorite],
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useFavorites = () => {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}
