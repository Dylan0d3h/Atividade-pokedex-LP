import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import './App.css'
import type { Aba, NomeTipo, Pokemon, PokemonSpecies } from './types'
import { buscarEspecie, buscarPokemon } from './services/pokeapi'

const coresTipos: Record<NomeTipo, string> = {
  fire: "#EE8130",
  water: "#6390F0",
  grass: "#7AC74C",
  electric: "#F7D02C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
  normal: "#A8A77A"
}

const boxStyle: CSSProperties = {
  border: "2px solid white",
  padding: "15px",
  margin: "10px auto",
  maxWidth: "500px",
  borderRadius: "10px",
  backgroundColor: "rgba(0,0,0,0.6)"
}

function extrairDescricao(especie: PokemonSpecies): { texto: string; idioma: string } | null {
  const entradaES = especie.flavor_text_entries.find(e => e.language.name === "es")
  const entradaEN = especie.flavor_text_entries.find(e => e.language.name === "en")
  const entradaFinal = entradaES ?? entradaEN

  if (!entradaFinal) return null

  const textoLimpo = entradaFinal.flavor_text
    .replace(/\f/g, ' ')
    .replace(/\n/g, ' ')

  return { texto: textoLimpo, idioma: entradaES ? "es-ES" : "en-US" }
}

function App() {
  const [pokemon, setPokemon] = useState<string>("")
  const [dados, setDados] = useState<Pokemon | null>(null)
  const [descricao, setDescricao] = useState<string>("")
  const [idiomaDescricao, setIdiomaDescricao] = useState<string>("en-US")
  const [abaAtiva, setAbaAtiva] = useState<Aba | null>(null)
  const [carregando, setCarregando] = useState<boolean>(false)
  const [erro, setErro] = useState<string>("")

  function alternarAba(aba: Aba): void {
    setAbaAtiva((prev) => (prev === aba ? null : aba))
  }

  useEffect(() => {
    const nome = pokemon.trim()

    if (nome === "") {
      setDados(null)
      setDescricao("")
      setErro("")
      setCarregando(false)
      return
    }

    const controller = new AbortController()

    const timer = setTimeout(async () => {
      setCarregando(true)
      setErro("")

      try {
        const [pokemonEncontrado, especie] = await Promise.all([
          buscarPokemon(nome, controller.signal),
          buscarEspecie(nome, controller.signal).catch(() => null)
        ])

        setDados(pokemonEncontrado)
        setAbaAtiva(null)

        const desc = especie ? extrairDescricao(especie) : null
        setDescricao(desc ? desc.texto : "")
        if (desc) setIdiomaDescricao(desc.idioma)
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return
        setDados(null)
        setDescricao("")
        setErro("Pokémon não encontrado")
      } finally {
        if (!controller.signal.aborted) setCarregando(false)
      }
    }, 500)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [pokemon])

  function falarDescricao(): void {
    if (!descricao) return

    const fala = new SpeechSynthesisUtterance(descricao)

    fala.lang = idiomaDescricao
    fala.rate = 1
    fala.pitch = 1

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(fala)
  }

  function estiloBotaoAba(aba: Aba): CSSProperties {
    return {
      backgroundColor: abaAtiva === aba ? "#500000" : "#c01010",
      color: "white",
      padding: "8px 12px",
      borderRadius: "5px",
      border: "none",
      cursor: "pointer"
    }
  }

  return (
    <div style={{ padding: "20px", textAlign: "center", color: "white" }}>
      <h1>Pokedex</h1>

      <input
        type="text"
        placeholder="Digite o nome do pokemon"
        value={pokemon}
        onChange={(e) => setPokemon(e.target.value)}
      />

      {carregando && <p>Carregando...</p>}
      {erro && !carregando && <p>{erro}</p>}

      {dados && (
        <div style={{ marginTop: "20px" }}>

          <div style={boxStyle}>
            <h2>{dados.name.toUpperCase()}</h2>
            <p>Nº: {dados.id}</p>
            <p>Altura: {dados.height / 10} m | Peso: {dados.weight / 10} kg</p>
          </div>

          <div style={boxStyle}>
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "40px"
            }}>
              {dados.sprites.front_default && (
                <img src={dados.sprites.front_default} alt={`${dados.name} de frente`} style={{ width: "150px" }} />
              )}
              {dados.sprites.back_default && (
                <img src={dados.sprites.back_default} alt={`${dados.name} de costas`} style={{ width: "150px" }} />
              )}
            </div>

            <button onClick={falarDescricao} disabled={!descricao} style={{ marginTop: "10px" }}>
              Ouvir descrição
            </button>
          </div>

          <div style={boxStyle}>
            <h3>Tipo:</h3>

            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              flexWrap: "wrap",
              marginTop: "10px"
            }}>
              {dados.types.map((t) => (
                <span
                  key={t.slot}
                  style={{
                    backgroundColor: coresTipos[t.type.name as NomeTipo] ?? "#777",
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    fontSize: "14px"
                  }}
                >
                  {t.type.name}
                </span>
              ))}
            </div>
          </div>

          {descricao && (
            <div style={boxStyle}>
              <p>{descricao}</p>
            </div>
          )}

          <div style={boxStyle}>
            <h3>Status:</h3>
            {dados.stats.map((stat) => (
              <p key={stat.stat.name}>
                {stat.stat.name}: {stat.base_stat}
              </p>
            ))}
          </div>

          <div style={boxStyle}>
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px"
            }}>
              <button onClick={() => alternarAba("habilidades")} style={estiloBotaoAba("habilidades")}>
                Habilidades
              </button>

              <button onClick={() => alternarAba("movimentos")} style={estiloBotaoAba("movimentos")}>
                Movimentos
              </button>

              <button onClick={() => alternarAba("jogos")} style={estiloBotaoAba("jogos")}>
                Jogos
              </button>
            </div>
          </div>

          {abaAtiva && (
            <div style={boxStyle}>

              {abaAtiva === "habilidades" && (
                <div>
                  <h3>Habilidades:</h3>
                  {dados.abilities.map((a) => (
                    <p key={a.ability.name}>
                      {a.ability.name}{a.is_hidden ? " (oculta)" : ""}
                    </p>
                  ))}
                </div>
              )}

              {abaAtiva === "movimentos" && (
                <div>
                  <h3>Movimentos:</h3>
                  {dados.moves.slice(0, 10).map((m) => (
                    <p key={m.move.name}>{m.move.name}</p>
                  ))}
                </div>
              )}

              {abaAtiva === "jogos" && (
                <div>
                  <h3>Jogos:</h3>
                  {dados.game_indices.length === 0 && <p>Nenhum jogo listado.</p>}
                  {dados.game_indices.map((g) => (
                    <p key={g.version.name}>{g.version.name}</p>
                  ))}
                </div>
              )}

            </div>
          )}

        </div>
      )}
    </div>
  )
}

export default App
