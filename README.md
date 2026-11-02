# Pokédex — React + TypeScript

Aplicação feita com **React + TypeScript** (Vite) que consome a API externa
[PokéAPI](https://pokeapi.co/) e exibe na página os dados do Pokémon pesquisado.

## O que a aplicação mostra

- Nome, número, altura e peso
- Imagens de frente e de costas
- Tipos (com a cor de cada tipo)
- Descrição da Pokédex (com botão para **ouvir a descrição**)
- Status base (hp, attack, defense, ...)
- Abas com **Habilidades**, **Movimentos** e **Jogos**

## Endpoints da API utilizados

| Endpoint | Para quê |
|---|---|
| `GET https://pokeapi.co/api/v2/pokemon/{nome}` | Dados principais do Pokémon |
| `GET https://pokeapi.co/api/v2/pokemon-species/{nome}` | Descrição da Pokédex |

## Tipagem (types.ts)

O arquivo [`src/types.ts`](src/types.ts) contém as **interfaces** que representam a
estrutura da resposta da API (o que se espera receber):

- `NamedAPIResource` — estrutura `{ name, url }` usada em toda a PokéAPI
- `Pokemon` — resposta de `/pokemon/{nome}`, com `PokemonSprites`, `PokemonType`,
  `PokemonStat`, `PokemonAbility`, `PokemonMove` e `PokemonGameIndex`
- `PokemonSpecies` e `FlavorTextEntry` — resposta de `/pokemon-species/{nome}`

As funções em [`src/services/pokeapi.ts`](src/services/pokeapi.ts) retornam
`Promise<Pokemon>` e `Promise<PokemonSpecies>`, e os estados do React usam esses
tipos (`useState<Pokemon | null>`), então todos os dados consumidos ficam tipados.

## Estrutura

```
src/
├── types.ts            # interfaces da resposta da API
├── services/
│   └── pokeapi.ts      # funções que chamam a PokéAPI
├── App.tsx             # tela da Pokédex
├── main.tsx            # ponto de entrada
├── App.css
└── index.css
```

## Como executar

```bash
npm install
npm run dev
```

Depois acesse o endereço exibido no terminal (normalmente http://localhost:5173)
e digite o nome ou o número de um Pokémon (ex.: `pikachu`, `charizard`, `25`).

Outros comandos:

```bash
npm run build      # verifica os tipos (tsc) e gera a versão de produção
npm run typecheck  # só verifica os tipos
npm run lint       # ESLint
```
