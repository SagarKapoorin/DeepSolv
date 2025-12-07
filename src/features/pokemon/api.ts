import { API_BASE } from '../../lib/contants'
import type {
  PokemonByTypeResponse,
  PokemonDetail,
  PokemonListResponse,
  PokemonTypeListResponse,
} from './types'

const fetchJson = async <T>(
  path: string,
  params?: Record<string, string | number | boolean>,
): Promise<T> => {
  const url = new URL(`${API_BASE}${path}`)
  //console.log(url.toString());
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value))
    })
    //console.log(url.toString());
  }

  const res = await fetch(url.toString())
  //console.log(res);
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`)
  }
  return res.json()
}

export const fetchPokemonPage = (offset: number, limit: number) =>
  fetchJson<PokemonListResponse>('/pokemon', { offset, limit })

export const fetchAllPokemon = () =>
  fetchJson<PokemonListResponse>('/pokemon', { limit: 10000, offset: 0 })

export const fetchTypes = () => fetchJson<PokemonTypeListResponse>('/type')

export const fetchPokemonByType = (type: string) =>
  fetchJson<PokemonByTypeResponse>(`/type/${type}`)

export const fetchPokemonDetail = (idOrName: number | string) =>
  fetchJson<PokemonDetail>(`/pokemon/${idOrName}`)
