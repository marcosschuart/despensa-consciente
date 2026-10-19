import { useEffect, useMemo, useState } from 'react'
import { diasParaVencer, statusDoItem, ROTULOS, textoPrazo, dicaPara } from './utils.js'

const CHAVE = 'despensa-consciente:itens'

function carregar() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE)) || []
  } catch {
    return []
  }
}

export default function App() {
  const [itens, setItens] = useState(carregar)
  const [nome, setNome] = useState('')
  const [quantidade, setQuantidade] = useState(1)
  const [validade, setValidade] = useState('')
  const [filtro, setFiltro] = useState('todos')

  useEffect(() => {
    localStorage.setItem(CHAVE, JSON.stringify(itens))
  }, [itens])

  const lista = useMemo(() => {
    return itens
      .map((i) => {
        const dias = diasParaVencer(i.validade)
        return { ...i, dias, status: statusDoItem(dias) }
      })
      .sort((a, b) => a.dias - b.dias)
  }, [itens])

  const emRisco = lista.filter((i) => i.status === 'urgente' || i.status === 'vencido')
  const visiveis = filtro === 'todos' ? lista : lista.filter((i) => i.status === filtro)

  function adicionar(e) {
    e.preventDefault()
    if (!nome.trim() || !validade) return
    setItens([
      ...itens,
      { id: Date.now(), nome: nome.trim(), quantidade: Number(quantidade) || 1, validade },
    ])
    setNome('')
    setQuantidade(1)
    setValidade('')
  }

  function remover(id) {
    setItens(itens.filter((i) => i.id !== id))
  }

  return (
    <div className="app">
      <header>
        <h1>🥕 Despensa Consciente</h1>
        <p>
          Controle a validade dos alimentos da sua casa e reduza o desperdício.
          <br />
          <small>ODS 12 – Consumo e Produção Responsáveis</small>
        </p>
      </header>

      <form className="card form" onSubmit={adicionar}>
        <label>
          Alimento
          <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Banana" required />
        </label>
        <label>
          Quantidade
          <input type="number" min="1" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
        </label>
        <label>
          Validade
          <input type="date" value={validade} onChange={(e) => setValidade(e.target.value)} required />
        </label>
        <button type="submit">Adicionar</button>
      </form>

      {emRisco.length > 0 && (
        <div className="alerta" role="alert">
          ⚠️ {emRisco.length} item(ns) em risco: {emRisco.map((i) => i.nome).join(', ')}.
        </div>
      )}

      <div className="filtros">
        {['todos', 'vencido', 'urgente', 'atencao', 'ok'].map((f) => (
          <button key={f} className={filtro === f ? 'ativo' : ''} onClick={() => setFiltro(f)}>
            {f === 'todos' ? 'Todos' : ROTULOS[f]}
          </button>
        ))}
      </div>

      {visiveis.length === 0 ? (
        <p className="vazio">Nenhum item para mostrar. Cadastre um alimento acima.</p>
      ) : (
        <ul className="lista">
          {visiveis.map((i) => (
            <li key={i.id} className={`card item ${i.status}`}>
              <div>
                <strong>{i.nome}</strong> <span className="qtd">x{i.quantidade}</span>
                <div className="prazo">
                  <span className={`selo ${i.status}`}>{ROTULOS[i.status]}</span> {textoPrazo(i.dias)}
                </div>
                {(i.status === 'urgente' || i.status === 'atencao') && (
                  <div className="dica">💡 {dicaPara(i.nome)}</div>
                )}
              </div>
              <button className="remover" onClick={() => remover(i.id)} aria-label={`Remover ${i.nome}`}>
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <footer>Trabalho A03 – Desenvolvimento Web</footer>
    </div>
  )
}
