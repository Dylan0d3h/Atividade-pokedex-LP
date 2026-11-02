export interface NamedAPIResource {
  name: string
  url: string
}


export interface PokemonSprites {
  front_default: string | null
  back_default: string | null
  front_shiny: string | null
  back_shiny: string | null
}

export interface PokemonType {
  slot: number
  type: NamedAPIResource
}

export interface PokemonStat {
  base_stat: number
  effort: number
  stat: NamedAPIResource
}

export interface PokemonAbility {
  ability: NamedAPIResource
  is_hidden: boolean
  slot: number
}
export interface PokemonMove {
  move: NamedAPIResource
}
export interface PokemonGameIndex {
  game_index: number
  version: NamedAPIResource
}
export interface Pokemon {
  id: number
  name: string
  height: number
  weight: number 
  base_experience: number | null
  sprites: PokemonSprites
  types: PokemonType[]
  stats: PokemonStat[]
  abilities: PokemonAbility[]
  moves: PokemonMove[]
  game_indices: PokemonGameIndex[]
}

export interface FlavorTextEntry {
  flavor_text: string
  language: NamedAPIResource
  version: NamedAPIResource
}

export interface PokemonSpecies {
  id: number
  name: string
  flavor_text_entries: FlavorTextEntry[]
}

export type Aba = "habilidades" | "movimentos" | "jogos"

export type NomeTipo =
  | "normal" | "fire" | "water" | "grass" | "electric" | "ice"
  | "fighting" | "poison" | "ground" | "flying" | "psychic" | "bug"
  | "rock" | "ghost" | "dragon" | "dark" | "steel" | "fairy"
