// Funções auxiliares do app Despensa Consciente

const MS_DIA = 24 * 60 * 60 * 1000

// Dias restantes até a validade (negativo = vencido). Compara apenas datas.
export function diasParaVencer(validade, hoje = new Date()) {
  const [a, m, d] = validade.split('-').map(Number)
  const dataValidade = new Date(a, m - 1, d)
  const base = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
  return Math.round((dataValidade - base) / MS_DIA)
}

// Classifica o item: vencido, urgente (até 3 dias), atenção (até 7) ou ok
export function statusDoItem(dias) {
  if (dias < 0) return 'vencido'
  if (dias <= 3) return 'urgente'
  if (dias <= 7) return 'atencao'
  return 'ok'
}

export const ROTULOS = {
  vencido: 'Vencido',
  urgente: 'Use já',
  atencao: 'Atenção',
  ok: 'Tranquilo',
}

export function textoPrazo(dias) {
  if (dias < 0) return `Venceu há ${Math.abs(dias)} dia(s)`
  if (dias === 0) return 'Vence hoje'
  if (dias === 1) return 'Vence amanhã'
  return `Vence em ${dias} dias`
}

// Dicas simples de aproveitamento, por palavra-chave no nome do alimento
const DICAS = [
  { chaves: ['banana'], dica: 'Banana madura vira bolo, vitamina ou panqueca. Pode ser congelada em rodelas.' },
  { chaves: ['pão', 'pao'], dica: 'Pão amanhecido vira torrada, farofa, rabanada ou farinha de rosca.' },
  { chaves: ['leite'], dica: 'Leite perto de vencer pode virar bolo, pão caseiro, molho branco ou panqueca.' },
  { chaves: ['tomate'], dica: 'Tomate muito maduro rende molho caseiro, que pode ser congelado em porções.' },
  { chaves: ['arroz'], dica: 'Arroz cozido sobrando vira bolinho, arroz de forno ou pode ser congelado.' },
  { chaves: ['iogurte'], dica: 'Iogurte vira base para bolos, molhos e vitaminas.' },
  { chaves: ['cenoura', 'beterraba'], dica: 'Raízes macias ainda servem para sopas, bolos e refogados.' },
  { chaves: ['frango', 'carne'], dica: 'Carnes devem ser congeladas antes da validade. Cozidas, duram mais no freezer.' },
  { chaves: ['ovo'], dica: 'Ovos servem para bolos, omeletes e farofas. Teste: ovo fresco afunda na água.' },
  { chaves: ['queijo'], dica: 'Queijo pode ser ralado e congelado, ou usado em gratinados e recheios.' },
]

export function dicaPara(nome) {
  const n = nome.toLowerCase()
  const achada = DICAS.find((d) => d.chaves.some((c) => n.includes(c)))
  return achada
    ? achada.dica
    : 'Considere congelar, cozinhar em maior quantidade ou doar antes de perder o alimento.'
}
