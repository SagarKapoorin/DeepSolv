import { ChevronDown, Heart, Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
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
  const [open, setOpen] = useState(false)
  const typePickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (typePickerRef.current && !typePickerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
        <div className="relative flex items-center gap-2" ref={typePickerRef}>
          <label className="text-sm font-medium text-slate-200">Type</label>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="flex min-w-[180px] items-center justify-between gap-2 rounded-xl border border-white/15 bg-gradient-to-r from-slate-900/80 to-slate-900/60 px-4 py-3 text-sm font-semibold text-slate-100 shadow-sm transition hover:-translate-y-[1px] hover:border-indigo-300/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200/40"
            aria-expanded={open}
          >
            <span>{selectedType ? formatName(selectedType) : 'All types'}</span>
            <ChevronDown
              className={`h-4 w-4 text-slate-200 transition ${open ? 'rotate-180' : ''}`}
            />
          </button>
          {open ? (
            <div
              className="absolute z-50 w-[240px] rounded-2xl border border-white/10 bg-slate-950/95 p-2 shadow-[0_16px_60px_rgba(0,0,0,0.45)] shadow-indigo-500/25 backdrop-blur"
              style={{ bottom: 'calc(100% + 8px)', left: 0 }}
            >
              <div className="text-[11px] uppercase tracking-[0.2em] text-indigo-100/70 px-2 py-1">
                Select type
              </div>
              <button
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-100 transition hover:bg-white/5"
                onClick={() => {
                  onSelectType(null)
                  setOpen(false)
                }}
              >
                <span>All types</span>
                {!selectedType ? <span className="text-[10px] text-emerald-200">Active</span> : null}
              </button>
              <div className="type-scroll mt-1 grid max-h-56 grid-cols-1 gap-1 overflow-y-auto pr-1">
                {types.map((type) => {
                  const active = selectedType === type
                  return (
                    <button
                      key={type}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition hover:bg-white/5 ${
                        active ? 'bg-indigo-500/15 text-white ring-1 ring-indigo-400/40' : 'text-slate-100'
                      }`}
                      onClick={() => {
                        onSelectType(type)
                        setOpen(false)
                      }}
                    >
                      <span>{formatName(type)}</span>
                      {active ? (
                        <span className="rounded-full bg-indigo-500/30 px-2 py-0.5 text-[10px] font-semibold text-indigo-100">
                          Selected
                        </span>
                      ) : null}
                    </button>
                  )
                })}
              </div>
            </div>
          ) : null}
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
