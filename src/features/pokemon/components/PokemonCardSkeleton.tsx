export const PokemonCardSkeleton = () => (
  <div className="flex animate-pulse flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur">
    <div className="h-32 w-full rounded-xl bg-slate-800/60" />
    <div className="mt-4 h-4 w-20 rounded bg-slate-800/70" />
    <div className="mt-3 h-6 w-32 rounded bg-slate-800/70" />
  </div>
)
