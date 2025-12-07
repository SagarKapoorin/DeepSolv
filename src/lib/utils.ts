export const extractPokemonId = (url: string) => {
  const segments = url.split('/').filter(Boolean)
  const id = Number(segments[segments.length - 1])
  return Number.isNaN(id) ? null : id
}
export const buildPokemonImageUrl = (id: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`

export const formatName = (name: string) =>
  name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
