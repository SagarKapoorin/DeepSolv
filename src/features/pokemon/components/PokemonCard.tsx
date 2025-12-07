import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useMemo, useState } from 'react'
import { FALLBACK_POKEMON_IMAGE } from '../../../lib/contants'
import { buildPokemonImageUrl, formatName } from '../../../lib/utils'

type PokemonCardProps = {
  id: number
  name: string
  onSelect: () => void
  isFavorite: boolean
  onToggleFavorite: () => void
}
const hoverAnimation = { scale: 1.02 }
export const PokemonCard = ({
  id,
  name,
  onSelect,
  isFavorite,
  onToggleFavorite,
}: PokemonCardProps) => {
  const [imageSrc, setImageSrc] = useState(buildPokemonImageUrl(id))
//console.log(imageSrc);
  const accentStyle = useMemo(() => {
    const hue = (id * 37) % 360
    return {
      background: `linear-gradient(135deg, hsla(${hue},75%,60%,0.3), hsla(${
        (hue + 35) % 360
      },80%,55%,0.45))`,
    }
  }, [id])

  return (
    <motion.article
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect()
        }
      }}
      whileHover={hoverAnimation}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 text-left shadow-xl backdrop-blur transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
    >
      <div className="absolute inset-0 opacity-60 blur-2xl" style={accentStyle} aria-hidden />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/10 to-transparent" />

      <div className="absolute right-3 top-3 z-10">
    {/* console.log("hit1") */}
    <button
          type="button"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite()
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            e.stopPropagation()
            if (e.key === 'Enter' || e.key === ' ') {
//console.log("hit2");
              e.preventDefault()
              onToggleFavorite()
            }
          }}
          className="rounded-full border border-white/20 bg-slate-950/60 p-2 text-slate-200 shadow-lg transition hover:-translate-y-[1px] hover:border-indigo-300/40 hover:text-red-300"
        >
          <Heart
            className="h-5 w-5"
            fill={isFavorite ? '#ef4444' : 'none'}
            strokeWidth={1.6}
          />
        </button>
      </div>

      <div className="relative flex flex-col gap-4">
        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          <span>#{id.toString().padStart(4, '0')}</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-indigo-100">
            View stats
          </span>
        </div>

        <div className="relative flex h-36 w-full items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-slate-900/50">
          <div className="absolute -left-6 -top-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-white/5 blur-xl" />
          <img
            src={imageSrc}
            alt={name}
            loading="lazy"
            className="relative h-28 w-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.35)] transition duration-200 group-hover:scale-[1.03]"
            onError={() => setImageSrc(FALLBACK_POKEMON_IMAGE)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="text-lg font-semibold text-white">{formatName(name)}</div>
          <div className="text-sm text-slate-300">Tap to open detail modal</div>
        </div>
      </div>
    </motion.article>
  )
}
