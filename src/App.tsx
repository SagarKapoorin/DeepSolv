import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Github,
  Loader2,
  LogIn,
  Sparkles,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { FiltersBar } from './features/pokemon/components/FiltersBar'
import { PokemonCard } from './features/pokemon/components/PokemonCard'
import { PokemonCardSkeleton } from './features/pokemon/components/PokemonCardSkeleton'
import { PokemonModal } from './features/pokemon/components/PokemonModal'
import {
  useAllPokemonQuery,
  usePokemonByTypeQuery,
  usePokemonPageQuery,
  usePokemonTypesQuery,
} from './features/pokemon/queries'
import { PAGE_SIZE } from './lib/contants'
import { extractPokemonId } from './lib/utils'
import { useAuth } from './stores/auth'
import { useFavorites } from './stores/favorites'

type DisplayPokemon = {
  id: number
  name: string
}

const mapToDisplayList = (items: { name: string; url: string }[]) =>
  items
    .map((item) => {
      const id = extractPokemonId(item.url)
      if (!id) return null
      return { id, name: item.name }
    })
    .filter(Boolean) as DisplayPokemon[]

function App() {
  const { user, login, logout, loading, error } = useAuth()
  //console.log({ user, loading, error });
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 via-white to-slate-100">
        <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow">
          <Loader2 className="h-4 w-4 animate-spin" />
          Checking session...
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4">
        <div className="flex w-full max-w-md flex-col gap-6 rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-100">
          <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
            <Sparkles className="h-4 w-4" />
            Pokedex Lite
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Sign in</h1>
            <p className="text-sm text-slate-600">Choose a provider to continue.</p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => login('google')}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <LogIn className="h-5 w-5" />
              Continue with Google
            </button>
            <button
              onClick={() => login('github')}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <Github className="h-5 w-5" />
              Continue with GitHub
            </button>
          </div>
          {error ? (
            <div className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600 ring-1 ring-red-100">
              {error.message}
            </div>
          ) : null}
          <p className="text-xs text-slate-500">
            Sign-in uses Supabase Auth (OAuth) and stores the session securely in browser
            storage.
          </p>
        </div>
      </div>
    )
  }

  return (
    <PokedexContent
      onLogout={logout}
      userName={user.user_metadata?.full_name || user.email || 'User'}
    />
  )
}

const PokedexContent = ({
  onLogout,
  userName,
}: {
  onLogout: () => void
  userName: string
}) => {
  const [page, setPage] = useState(0)
  const [typePage, setTypePage] = useState(0)
  const [pageInput, setPageInput] = useState('1')
  const [typePageInput, setTypePageInput] = useState('1')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [showFavorites, setShowFavorites] = useState(false)
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null)

  const { favoritesList, toggleFavorite, isFavorite } = useFavorites()

  const pageQuery = usePokemonPageQuery(page, PAGE_SIZE)
  const allQuery = useAllPokemonQuery()
  const typesQuery = usePokemonTypesQuery()
  const typeQuery = usePokemonByTypeQuery(selectedType)

  const isSearching = searchTerm.trim().length > 0

  const searchResults = useMemo(() => {
    if (!isSearching || !allQuery.data) return []
    const matches = allQuery.data.results.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase().trim()),
    )
    return mapToDisplayList(matches)
  }, [allQuery.data, isSearching, searchTerm])

  const typeResults = useMemo(() => {
    if (!selectedType || !typeQuery.data) return []
    const list = typeQuery.data.pokemon.map((item) => item.pokemon)
    return mapToDisplayList(list)
  }, [selectedType, typeQuery.data])

  const favoritesResults = favoritesList

  const paginatedTypeResults = useMemo(() => {
    const start = typePage * PAGE_SIZE
    return typeResults.slice(start, start + PAGE_SIZE)
  }, [typePage, typeResults])

  const totalPages = pageQuery.data ? Math.ceil(pageQuery.data.count / PAGE_SIZE) : 0
  const totalTypePages = Math.ceil(typeResults.length / PAGE_SIZE)

  useEffect(() => {
    setPageInput(String(page + 1))
  }, [page])

  useEffect(() => {
    setTypePageInput(String(typePage + 1))
  }, [typePage])

  const showPagination = !isSearching && !showFavorites && !selectedType
  const showTypePagination = !isSearching && !showFavorites && !!selectedType

  const displayedList: DisplayPokemon[] = (() => {
    if (showFavorites) {
      if (isSearching) {
        return favoritesResults.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase().trim()),
        )
      }
      return favoritesResults
    }
    if (isSearching) return searchResults
    if (selectedType) return paginatedTypeResults
    return pageQuery.data ? mapToDisplayList(pageQuery.data.results) : []
  })()

  const isLoadingList = (() => {
    if (showFavorites) return false
    if (isSearching) return allQuery.isLoading
    if (selectedType) return typeQuery.isLoading
    return pageQuery.isLoading
  })()

  const listError = (() => {
    if (showFavorites) return null
    if (isSearching) return allQuery.error
    if (selectedType) return typeQuery.error
    return pageQuery.error
  })()

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
  }

  const handleTypeChange = (value: string | null) => {
    setSelectedType(value)
    setTypePage(0)
    setSearchTerm('')
    setShowFavorites(false)
  }

  const handleToggleFavorites = () => {
    setShowFavorites((prev) => !prev)
    setSelectedType(null)
    setTypePage(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:py-12">
        <header className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
            <Sparkles className="h-4 w-4" />
            Pokedex Lite
          </div>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                Discover Pokémon
              </h1>
              <p className="text-sm text-slate-600">
                Browse, search, filter by type, and manage your favorites.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
                {userName}
              </div>
              <button
                onClick={onLogout}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                Sign out
              </button>
            </div>
          </div>
        </header>

        <FiltersBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          types={(typesQuery.data?.results ?? [])
            .map((item) => item.name)
            .filter((name) => name !== 'unknown' && name !== 'shadow')}
          selectedType={selectedType}
          onSelectType={handleTypeChange}
          showFavorites={showFavorites}
          onToggleFavorites={handleToggleFavorites}
        />

        {isLoadingList ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <PokemonCardSkeleton key={idx} />
            ))}
          </div>
        ) : listError ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white p-6 text-center text-slate-700 ring-1 ring-slate-100">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <div className="text-lg font-semibold">Something went wrong</div>
            <p className="text-sm text-slate-500">
              Please refresh the page or try again later.
            </p>
          </div>
        ) : displayedList.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white p-6 text-center text-slate-700 ring-1 ring-slate-100">
            <div className="text-lg font-semibold">No Pokémon found</div>
            <p className="text-sm text-slate-500">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <>
            <motion.div
              layout
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              <AnimatePresence>
                {displayedList.map((pokemon) => (
                  <motion.div
                    key={pokemon.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                  >
                    <PokemonCard
                      id={pokemon.id}
                      name={pokemon.name}
                      onSelect={() => setSelectedPokemonId(pokemon.id)}
                      isFavorite={isFavorite(pokemon.id)}
                      onToggleFavorite={() =>
                        toggleFavorite({
                          id: pokemon.id,
                          name: pokemon.name,
                        })
                      }
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {showPagination && (
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                  className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow ring-1 ring-slate-200 transition enabled:hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </button>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span>Page</span>
                  <input
                    type="number"
                    min={1}
                    max={totalPages || 1}
                    value={pageInput}
                    onChange={(e) => setPageInput(e.target.value)}
                    onBlur={() => {
                      const next = Math.max(
                        1,
                        Math.min(Number(pageInput) || 1, totalPages || 1),
                      )
                      setPage(next - 1)
                    }}
                    className="w-16 rounded-lg border border-slate-200 px-2 py-1 text-center text-sm shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    disabled={!totalPages}
                  />
                  <span>of {totalPages || '...'}</span>
                </div>
                <button
                  disabled={totalPages ? page + 1 >= totalPages : false}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow ring-1 ring-slate-200 transition enabled:hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {showTypePagination && totalTypePages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  disabled={typePage === 0}
                  onClick={() => setTypePage((prev) => Math.max(0, prev - 1))}
                  className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow ring-1 ring-slate-200 transition enabled:hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </button>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span>Page</span>
                  <input
                    type="number"
                    min={1}
                    max={totalTypePages}
                    value={typePageInput}
                    onChange={(e) => setTypePageInput(e.target.value)}
                    onBlur={() => {
                      const next = Math.max(
                        1,
                        Math.min(Number(typePageInput) || 1, totalTypePages),
                      )
                      setTypePage(next - 1)
                    }}
                    className="w-16 rounded-lg border border-slate-200 px-2 py-1 text-center text-sm shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                  <span>of {totalTypePages}</span>
                </div>
                <button
                  disabled={typePage + 1 >= totalTypePages}
                  onClick={() => setTypePage((prev) => prev + 1)}
                  className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow ring-1 ring-slate-200 transition enabled:hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <PokemonModal
        pokemonId={selectedPokemonId}
        onClose={() => setSelectedPokemonId(null)}
      />
      {(pageQuery.isFetching || allQuery.isFetching || typeQuery.isFetching) &&
        !isLoadingList && (
          <div className="pointer-events-none fixed left-4 bottom-4 flex items-center gap-2 rounded-full bg-slate-900/90 px-3 py-2 text-xs font-medium text-white shadow-lg">
            <Loader2 className="h-4 w-4 animate-spin" />
            Syncing latest data...
          </div>
        )}
    </div>
  )
}

export default App
