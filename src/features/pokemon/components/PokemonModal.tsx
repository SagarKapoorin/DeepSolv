import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { FALLBACK_POKEMON_IMAGE } from '../../../lib/contants'
import { buildPokemonImageUrl, formatName } from '../../../lib/utils'
import { usePokemonDetailQuery } from '../queries'

type PokemonModalProps = {
  pokemonId: number | null
  onClose: () => void
}

export const PokemonModal = ({ pokemonId, onClose }: PokemonModalProps) => {
  const { data, isLoading, isError } = usePokemonDetailQuery(pokemonId)
  //console.log('PokemonModal', { pokemonId, data, isLoading, isError });
  const initialSrc = useMemo(() => {
    if (!data) return null
    //console.log('data.sprites.other["official-artwork"].front_default',data.sprites.other['official-artwork'].front_default);
    return (
      data.sprites.other['official-artwork'].front_default ??
      buildPokemonImageUrl(data.id)
    )
  }, [data])
  const [imageSrc, setImageSrc] = useState<string | null>(null)

  useEffect(() => {
    setImageSrc(initialSrc)
  }, [initialSrc])

  return (
    <AnimatePresence>
      {pokemonId ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex w-full max-w-3xl flex-col gap-6 rounded-3xl bg-white p-6 shadow-2xl"
          >
            <button
              className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="h-56 rounded-2xl bg-slate-100" />
                <div className="space-y-4">
                  <div className="h-7 w-40 rounded bg-slate-100" />
                  <div className="h-4 w-24 rounded bg-slate-100" />
                  <div className="h-4 w-32 rounded bg-slate-100" />
                  <div className="space-y-2">
                    <div className="h-4 w-24 rounded bg-slate-100" />
                    <div className="h-3 w-full rounded bg-slate-100" />
                    <div className="h-3 w-full rounded bg-slate-100" />
                  </div>
                </div>
              </div>
            ) : isError || !data ? (
              <div className="text-center text-slate-700">
                Unable to load Pokémon details.
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex flex-col items-center gap-4 rounded-2xl bg-slate-50 p-4">
                  <img
                    src={imageSrc ?? FALLBACK_POKEMON_IMAGE}
                    alt={data.name}
                    className="h-48 w-full max-w-xs object-contain"
                    onError={() => setImageSrc(FALLBACK_POKEMON_IMAGE)}
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    {data.types.map((t) => (
                      <span
                        key={t.type.name}
                        className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700"
                      >
                        {formatName(t.type.name)}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-slate-600">
                    Height: {(data.height / 10).toFixed(1)} m · Weight:{' '}
                    {(data.weight / 10).toFixed(1)} kg
                  </div>
                </div>
                <div className="flex flex-col gap-5">
                  <div>
                    <div className="text-2xl font-bold text-slate-900">
                      {formatName(data.name)}
                    </div>
                    <div className="text-slate-500">#{data.id}</div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-slate-700">Stats</div>
                    <div className="space-y-3">
                      {data.stats.map((stat) => {
                        const value = Math.min(stat.base_stat, 200)
                        const width = `${(value / 200) * 100}%`
                        //console.log( stat, value, width);
                        return (
                          <div key={stat.stat.name} className="space-y-1">
                            <div className="flex items-center justify-between text-sm text-slate-600">
                              <span>{formatName(stat.stat.name)}</span>
                              <span className="font-semibold text-slate-900">
                                {stat.base_stat}
                              </span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600"
                                style={{ width }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-slate-700">Abilities</div>
                    <div className="flex flex-wrap gap-2">
                      {data.abilities.map((ability) => (
                        <span
                          key={ability.ability.name}
                          className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                        >
                          {formatName(ability.ability.name)}
                          {ability.is_hidden ? ' (Hidden)' : ''}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
