import { useQuery } from '@tanstack/react-query'
import { PAGE_SIZE } from '../../lib/contants'
import {
  fetchAllPokemon,
  fetchPokemonByType,
  fetchPokemonDetail,
  fetchPokemonPage,
  fetchTypes,
} from './api'

export const usePokemonPageQuery = (page: number, pageSize = PAGE_SIZE) =>
  //console.log("fetching page:", page, "with pageSize:", pageSize),
  useQuery({
    queryKey: ['pokemon', 'page', page, pageSize],
    queryFn: () => fetchPokemonPage(page * pageSize, pageSize),
  })

export const usePokemonTypesQuery = () =>
  useQuery({
    queryKey: ['pokemon', 'types'],
    queryFn: fetchTypes,
  })

export const usePokemonByTypeQuery = (type: string | null) =>
  //console.log("fetching pokemon by type:", type),
  useQuery({
    queryKey: ['pokemon', 'by-type', type],
    queryFn: () => fetchPokemonByType(type ?? ''),
    enabled: Boolean(type),
  })

export const usePokemonDetailQuery = (id: number | null | string) =>
  useQuery({
    queryKey: ['pokemon', 'detail', id],
    queryFn: () => fetchPokemonDetail(id ?? 0),
    enabled: Boolean(id),
  })

export const useAllPokemonQuery = () =>
  //console.log("fetching all pokemon"),
  useQuery({
    queryKey: ['pokemon', 'all'],
    queryFn: fetchAllPokemon,
  })
