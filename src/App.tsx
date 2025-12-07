import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Github,
  Loader2,
  LogIn,
  Radar,
  ShieldCheck,
  Sparkles,
  Zap,
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
import { extractPokemonId, formatName } from './lib/utils'
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

const AuroraBackground = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute -left-10 top-6 h-72 w-72 rounded-full bg-indigo-500/30 blur-[120px]" />
    <div className="absolute right-[-40px] top-32 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-[140px]" />
    <div className="absolute left-1/2 bottom-6 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-400/15 blur-[120px]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(255,255,255,0.06),transparent_25%),radial-gradient(circle_at_85%_10%,rgba(255,255,255,0.06),transparent_22%),linear-gradient(120deg,rgba(255,255,255,0.02),rgba(255,255,255,0))]" />
  </div>
)

function App() {
  const { user, login, logout, loading, error } = useAuth()

  if (loading) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-[#050915] via-[#0b1024] to-[#050915] text-slate-100">
        <AuroraBackground />
        <div className="relative flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold shadow-2xl backdrop-blur">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-200" />
          Checking session...
        </div>
      </div>
    )
  }

  if (!user){
    //console.log('No user authenticated, showing login screen');
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#050915] via-[#0b1024] to-[#050915] text-slate-100">
        <AuroraBackground />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-100">
              <Sparkles className="h-4 w-4" />
              Pokedex
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
                A sleeker way to explore Pokemon
              </h1>
              <p className="text-base text-slate-300">
                Browse, search, filter, and curate your own favorites with a refreshed
                neon-inspired interface.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">Live collection</p>
                <p className="text-sm text-slate-300">
                  Powered by the PokeAPI with real-time pagination.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">Favorites that stick</p>
                <p className="text-sm text-slate-300">
                  Persisted locally so your top picks stay with you.
                </p>
              </div>
            </div>
          </div>
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-indigo-100">
                <Sparkles className="h-4 w-4" />
                Pokedex Lite
              </div>
              <h2 className="text-2xl font-semibold text-white">Sign in</h2>
              <p className="text-sm text-slate-300">Choose a provider to continue.</p>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => login('google')}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-400 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-[1px] hover:shadow-indigo-500/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
              >
                <LogIn className="h-5 w-5" />
                Continue with Google
              </button>
              <button
                onClick={() => login('github')}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-[1px] hover:border-indigo-300/40 hover:shadow-indigo-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
              >
                <Github className="h-5 w-5" />
                Continue with GitHub
              </button>
            </div>
            {error ? (
              <div className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
                {error.message}
              </div>
            ) : null}
            <p className="mt-4 text-xs text-slate-400">
              Sign-in uses Supabase Auth (OAuth) and stores the session securely in browser
              storage.
            </p>
          </div>
        </div>
        <div className="relative mx-auto mt-2 w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur">
          <div className="pointer-events-none absolute left-10 top-0 h-32 w-32 rounded-full bg-indigo-500/15 blur-[90px]" />
          <div className="pointer-events-none absolute right-0 bottom-0 h-28 w-28 rounded-full bg-fuchsia-500/15 blur-[90px]" />
          <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-[0.22em] text-indigo-100/80">
                What awaits inside
              </p>
              <h3 className="text-xl font-semibold text-white md:text-2xl">
                Rich data, curated favorites, and playful motion already set up for you.
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-slate-100">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                Always-on sync
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-slate-100">
                <Sparkles className="h-3 w-3 text-indigo-100" />
                Holo cards
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-semibold text-slate-100">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-200" />
                Private favorites
              </div>
            </div>
          </div>
          <div className="relative mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent p-4 shadow-lg shadow-indigo-500/10">
              <div className="flex items-center justify-between text-sm font-semibold text-white">
                <div className="flex items-center gap-2">
                  <Radar className="h-4 w-4 text-indigo-100" />
                  Live spotlight
                </div>
                <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-indigo-100">
                  Syncing
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-300">
                Fresh pulls from PokeAPI whenever you hop in, so the list is always current.
              </p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
                <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-emerald-400" />
              </div>
              <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-indigo-100/80">
                Synced species: 712 / 905
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-indigo-500/10">
              <div className="flex items-center justify-between text-sm font-semibold text-white">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-200" />
                  Favorites vault
                </div>
                <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-emerald-100">
                  Private
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-300">
                Curate teams and comfort picks; they persist locally so your taste stays yours.
              </p>
              <div className="mt-4 space-y-2 rounded-xl border border-white/5 bg-slate-900/40 p-3">
                <div className="flex items-center justify-between text-xs text-slate-200">
                  <span>Saved squads</span>
                  <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] font-semibold text-indigo-100">
                    12
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-200">
                  <span>Offline ready</span>
                  <span className="text-emerald-200">Yes</span>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-indigo-500/10">
              <div className="flex items-center justify-between text-sm font-semibold text-white">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-200" />
                  Type atlas
                </div>
                <span className="rounded-full bg-amber-500/15 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-amber-100">
                  Strategy
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-300">
                Jump between type filters, see strengths instantly, and pin mixed rosters.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg border border-white/5 bg-slate-900/50 px-3 py-2 text-slate-200">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-indigo-100/80">Most used</div>
                  <div className="text-sm font-semibold text-white">Water • Fairy</div>
                </div>
                <div className="rounded-lg border border-white/5 bg-slate-900/50 px-3 py-2 text-slate-200">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-indigo-100/80">Speed trio</div>
                  <div className="text-sm font-semibold text-white">Jolteon / Talonflame / Greninja</div>
                </div>
              </div>
            </div>
          </div>
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#050915] via-[#0b1024] to-[#050915] text-slate-100">
      <AuroraBackground />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-7 px-4 py-10 md:py-14">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.25em] text-indigo-100/80">
                <Sparkles className="h-4 w-4" />
                <span>Pokemon Atlas</span>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold leading-tight text-white md:text-4xl">
                  Discover Pokemon with a modern lens
                </h1>
                <p className="max-w-2xl text-sm text-slate-300">
                  Fast filtering, shimmering cards, and an elevated modal for stats. Keep your
                  favorites close and jump between types effortlessly.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-indigo-100">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-400" />
                  Live data sync
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-100">
                  Total species: {pageQuery.data ? pageQuery.data.count : '...'}
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-100">
                  Favorites: {favoritesList.length}
                </div>
                {selectedType ? (
                  <div className="rounded-full border border-indigo-300/30 bg-indigo-500/15 px-3 py-2 text-xs font-semibold text-indigo-100">
                    Type: {formatName(selectedType)}
                  </div>
                ) : null}
                {showFavorites ? (
                  <div className="rounded-full border border-red-300/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-100">
                    Viewing favorites
                  </div>
                ) : null}
              </div>
            </div>
            <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-center">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left shadow-lg">
                <div className="text-[11px] uppercase tracking-[0.12em] text-slate-400">
                  Signed in
                </div>
                <div className="text-sm font-semibold text-white">{userName}</div>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-[1px] hover:shadow-indigo-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
              >
                Sign out
              </button>
            </div>
          </div>
        </header>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-slate-400">
            <span>Browse the collection</span>
            <span className="text-indigo-100/80">Search, filter, and pin favorites</span>
          </div>
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
        </div>

        {isLoadingList ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <PokemonCardSkeleton key={idx} />
            ))}
          </div>
        ) : listError ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 p-6 text-center text-slate-100 shadow-lg">
            <AlertCircle className="h-8 w-8 text-red-200" />
            <div className="text-lg font-semibold">Something went wrong</div>
            <p className="text-sm text-red-100/80">Please refresh the page or try again later.</p>
          </div>
        ) : displayedList.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-slate-100 shadow-lg">
            <div className="text-lg font-semibold">No Pokemon found</div>
            <p className="text-sm text-slate-300">Try adjusting your search or filters.</p>
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
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 shadow-lg transition enabled:hover:-translate-y-[1px] enabled:hover:border-indigo-300/40 enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </button>
                <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-sm text-slate-200">
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
                    className="w-16 rounded-lg border border-white/10 bg-slate-900/70 px-2 py-1 text-center text-sm text-slate-100 shadow-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200/30"
                    disabled={!totalPages}
                  />
                  <span>of {totalPages || '...'}</span>
                </div>
                <button
                  disabled={totalPages ? page + 1 >= totalPages : false}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 shadow-lg transition enabled:hover:-translate-y-[1px] enabled:hover:border-indigo-300/40 enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
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
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 shadow-lg transition enabled:hover:-translate-y-[1px] enabled:hover:border-indigo-300/40 enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </button>
                <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-sm text-slate-200">
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
                    className="w-16 rounded-lg border border-white/10 bg-slate-900/70 px-2 py-1 text-center text-sm text-slate-100 shadow-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-200/30"
                  />
                  <span>of {totalTypePages}</span>
                </div>
                <button
                  disabled={typePage + 1 >= totalTypePages}
                  onClick={() => setTypePage((prev) => prev + 1)}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 shadow-lg transition enabled:hover:-translate-y-[1px] enabled:hover:border-indigo-300/40 enabled:hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
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
          <div className="pointer-events-none fixed left-4 bottom-4 flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/90 px-3 py-2 text-xs font-medium text-white shadow-lg shadow-indigo-500/20 backdrop-blur">
            <Loader2 className="h-4 w-4 animate-spin text-indigo-200" />
            Syncing latest data...
          </div>
        )}
    </div>
  )
}

export default App
