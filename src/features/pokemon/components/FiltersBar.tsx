import { Heart, Search } from 'lucide-react'
import { formatName } from '../../../lib/utils'
type FiltersBarProps = {
  searchTerm: string
  onSearchChange: (value: string) => void
  types: string[]
  selectedType: string | null
  onSelectType: (value: string | null) => void
  showFavorites: boolean
  onToggleFavorites: () => void
}

export const FiltersBar = ({
  searchTerm,
  onSearchChange,
  types,
  selectedType,
  onSelectType,
  showFavorites,
  onToggleFavorites,
}: FiltersBarProps) => {
  //console.log('FiltersBar', { searchTerm, selectedType, showFavorites });
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-slate-100 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Pokémon..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600">Type</label>
          <select
            value={selectedType ?? ''}
            onChange={(e) => onSelectType(e.target.value ? e.target.value : null)}
            className="min-w-[150px] rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="">All types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {formatName(type)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        onClick={onToggleFavorites}
        className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
          showFavorites
            ? 'bg-red-100 text-red-600 ring-1 ring-red-200'
            : 'bg-slate-900 text-white shadow'
        }`}
      >
        <Heart
          className="h-5 w-5"
          fill={showFavorites ? '#ef4444' : 'none'}
          strokeWidth={1.6}
        />
        {showFavorites ? 'Viewing Favorites' : 'My Favorites'}
      </button>
    </div>
  )
}
