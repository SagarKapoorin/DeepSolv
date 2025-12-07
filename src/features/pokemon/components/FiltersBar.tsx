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
    <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur md:flex-row md:items-center md:justify-between md:p-5">
      <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center md:gap-5">
        <div className="relative w-full md:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Pokemon..."
            className="w-full rounded-xl border border-white/10 bg-slate-900/60 py-3 pl-10 pr-3 text-sm text-slate-100 shadow-sm outline-none transition placeholder:text-slate-500 focus:border-indigo-300/70 focus:ring-2 focus:ring-indigo-200/30"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-200">Type</label>
          <select
            value={selectedType ?? ''}
            onChange={(e) => onSelectType(e.target.value ? e.target.value : null)}
            className="min-w-[150px] rounded-xl border border-white/15 bg-slate-900/60 px-3 py-3 text-sm text-slate-100 shadow-sm outline-none focus:border-indigo-300/70 focus:ring-2 focus:ring-indigo-200/30"
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
        className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 ${
          showFavorites
            ? 'border border-red-300/30 bg-red-500/10 text-red-100 shadow-lg'
            : 'border border-indigo-300/30 bg-gradient-to-r from-indigo-500/80 to-indigo-400/90 text-white shadow-lg shadow-indigo-500/25'
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
