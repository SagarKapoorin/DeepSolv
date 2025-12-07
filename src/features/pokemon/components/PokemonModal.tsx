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
      data.sprites.other['official-artwork'].front_default ?? buildPokemonImageUrl(data.id)
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur"
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
            className="modal-scroll relative flex w-full max-w-4xl flex-col gap-6 overflow-y-auto rounded-3xl border border-white/10 bg-slate-900/90 p-6 shadow-2xl backdrop-blur"
            style={{ maxHeight: 'calc(100vh - 3rem)' }}
          >
            <button
              className="absolute right-4 top-4 rounded-full border border-white/10 bg-slate-800/70 p-2 text-slate-200 transition hover:border-indigo-300/40 hover:text-white"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-[1.1fr,1fr]">
                <div className="h-60 rounded-2xl bg-slate-800/70" />
                <div className="space-y-4">
                  <div className="h-7 w-40 rounded bg-slate-800/70" />
                  <div className="h-4 w-24 rounded bg-slate-800/70" />
                  <div className="h-4 w-32 rounded bg-slate-800/70" />
                  <div className="space-y-2">
                    <div className="h-4 w-24 rounded bg-slate-800/70" />
                    <div className="h-3 w-full rounded bg-slate-800/70" />
                    <div className="h-3 w-full rounded bg-slate-800/70" />
                  </div>
                </div>
              </div>
            ) : isError || !data ? (
              <div className="text-center text-slate-100">Unable to load Pokemon details.</div>
            ) : (
              <div className="grid gap-6 md:grid-cols-[1.1fr,1fr]">
                <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-indigo-500/20 via-slate-900 to-slate-950">
                    <div className="absolute inset-0 opacity-70 blur-2xl bg-gradient-to-br from-indigo-500/30 via-fuchsia-500/20 to-emerald-400/25" />
                    <img
                      src={imageSrc ?? FALLBACK_POKEMON_IMAGE}
                      alt={data.name}
                      className="relative h-64 w-full max-w-xl object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.5)]"
                      onError={() => setImageSrc(FALLBACK_POKEMON_IMAGE)}
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {data.types.map((t) => (
                      <span
                        key={t.type.name}
                        className="rounded-full border border-indigo-300/30 bg-indigo-500/15 px-3 py-1 text-sm font-medium text-indigo-100"
                      >
                        {formatName(t.type.name)}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm text-slate-200">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      Height: {(data.height / 10).toFixed(1)} m
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      Weight: {(data.weight / 10).toFixed(1)} kg
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-5">
                  <div>
                    <div className="text-3xl font-semibold text-white">{formatName(data.name)}</div>
                    <div className="text-sm text-slate-400">#{data.id.toString().padStart(4, '0')}</div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-slate-200">Stats</div>
                    <div className="space-y-3">
                      {data.stats.map((stat) => {
                        const value = Math.min(stat.base_stat, 200)
                        const width = `${(value / 200) * 100}%`
                                                //console.log( stat, value, width);

                        return (
                          <div key={stat.stat.name} className="space-y-1">
                            <div className="flex items-center justify-between text-xs text-slate-300">
                              <span>{formatName(stat.stat.name)}</span>
                              <span className="font-semibold text-white">{stat.base_stat}</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                              <div
                                className="h-full bg-gradient-to-r from-indigo-400 to-fuchsia-500"
                                style={{ width }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-slate-200">Abilities</div>
                    <div className="flex flex-wrap gap-2">
                      {data.abilities.map((ability) => (
                        <span
                          key={ability.ability.name}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-100"
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
