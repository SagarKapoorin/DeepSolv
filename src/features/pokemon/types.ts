export type BasicPokemon = {
  name: string
  url: string
}
export type PokemonListResponse = {
  count: number
  results: BasicPokemon[]
}
export type PokemonTypeListResponse = {
  results: {
    name: string
    url: string
  }[]
}
export type PokemonByTypeResponse = {
  pokemon: {
    pokemon: BasicPokemon
    slot: number
  }[]
}
export type PokemonStat = {
  base_stat: number
  stat: {
    name: string
  }
}
export type PokemonType = {
  slot: number
  type: {
    name: string
  }
}
export type PokemonAbility = {
  ability: {
    name: string
  }
  is_hidden: boolean
}

export type PokemonDetail = {
  id: number
  name: string
  sprites: {
    other: {
      ['official-artwork']: {
        front_default: string | null
      }
    }
  }
  stats: PokemonStat[]
  types: PokemonType[]
  abilities: PokemonAbility[]
  height: number
  weight: number
}
