import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useState } from 'react'
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
      className="relative flex flex-col overflow-hidden rounded-2xl bg-white/80 p-4 text-left shadow-md ring-1 ring-slate-100 backdrop-blur transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
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
              //console.log("hit2")
              e.preventDefault()
              onToggleFavorite()
            }
          }}
          className="rounded-full bg-white/90 p-2 text-slate-500 shadow hover:bg-white hover:text-red-500"
        >
          <Heart
            className="h-5 w-5"
            fill={isFavorite ? '#ef4444' : 'none'}
            strokeWidth={1.6}
          />
        </button>
      </div>
      <div className="flex flex-1 flex-col items-center gap-3">
        <div className="flex h-28 w-full items-center justify-center rounded-xl bg-gradient-to-b from-slate-50 to-white">
          <img
            src={imageSrc}
            alt={name}
            loading="lazy"
            className="h-24 w-full object-contain drop-shadow-md"
            onError={() => setImageSrc(FALLBACK_POKEMON_IMAGE)}
          />
        </div>
        <div className="flex w-full items-center justify-between text-sm text-slate-500">
          <span>#{id.toString().padStart(4, '0')}</span>
        </div>

        <div className="w-full text-lg font-semibold text-slate-800">
          {formatName(name)}
        </div>
      </div>
    </motion.article>
  )
}
