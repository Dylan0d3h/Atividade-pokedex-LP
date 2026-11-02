import type { Pokemon, PokemonSpecies } from "../types"

const BASE_URL = "https://pokeapi.co/api/v2"

export async function buscarPokemon(nome: string, signal?: AbortSignal): Promise<Pokemon> {
  const resposta = await fetch(`${BASE_URL}/pokemon/${nome.toLowerCase()}`, { signal })

  if (!resposta.ok) {
    throw new Error("Pokémon não encontrado")
  }

  const dados: Pokemon = await resposta.json()
  return dados
}

export async function buscarEspecie(nome: string, signal?: AbortSignal): Promise<PokemonSpecies> {
  const resposta = await fetch(`${BASE_URL}/pokemon-species/${nome.toLowerCase()}`, { signal })

  if (!resposta.ok) {
    throw new Error("Espécie não encontrada")
  }

  const dados: PokemonSpecies = await resposta.json()
  return dados
}
