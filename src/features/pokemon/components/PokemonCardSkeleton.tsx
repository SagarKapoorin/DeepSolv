export const PokemonCardSkeleton = () => (
  <div className="flex animate-pulse flex-col overflow-hidden rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-slate-100">
    <div className="h-28 w-full rounded-xl bg-slate-200" />
    <div className="mt-4 h-4 w-16 rounded bg-slate-200" />
    <div className="mt-3 h-6 w-32 rounded bg-slate-200" />
  </div>
)
