export interface Category {
  id: number
  descricao: string
  faixaEtariaMin: number
  faixaEtariaMax: number
  tipo: "casais" | "solteiros_m" | "solteiros_f" | "jovens_m" | "jovens_f" | "adolescentes"
}

export interface GroupGc {
  id: number
  nomeGrupo: string
  nomeDoLider: string
  observacao: string
}

export interface Gc {
  id: number
  idGrupo: number
  descricao: string
  lider: string
  descricaoLocal: string
  enderecoRua: string
  enderecoNumero: string
  enderecoBairro: string
  enderecoCEP: string
  categoriaId: number
  diaSemana?: string
  horario?: string
}

export interface Person {
  id: number
  nome: string
  idade: number
  sexo: "M" | "F"
  estadoCivil: string
  enderecoRua: string
  enderecoNumero: string
  enderecoBairro: string
  enderecoCEP: string
  categoriaId: number
  gcId: number | null
  statusEncaixe: "pendente" | "encaixado" | "recusou"
  dataAbordagem: string
  observacao?: string
}

export interface DashboardData {
  kpis: {
    totalAbordagens: number
    totalEncaixes: number
    encaixesPendentes: number
    categoriaComMaisPessoas: string
  }
  captacaoPorMes: Array<{
    mes: string
    abordagens: number
    encaixes: number
  }>
  encaixesPorMes: Array<{
    mes: string
    valor: number
  }>
  categoriasDistribuicao: Array<{
    categoria: string
    quantidade: number
  }>
  insights: string[]
}

export const initialCategories: Category[] = [
  {
    id: 1,
    descricao: "GC Casais Jovens",
    faixaEtariaMin: 20,
    faixaEtariaMax: 35,
    tipo: "casais"
  },
  {
    id: 2,
    descricao: "GC Casais Adultos",
    faixaEtariaMin: 36,
    faixaEtariaMax: 60,
    tipo: "casais"
  },
  {
    id: 3,
    descricao: "GC Jovens Masculino",
    faixaEtariaMin: 16,
    faixaEtariaMax: 25,
    tipo: "jovens_m"
  },
  {
    id: 4,
    descricao: "GC Jovens Feminino",
    faixaEtariaMin: 16,
    faixaEtariaMax: 25,
    tipo: "jovens_f"
  },
  {
    id: 5,
    descricao: "GC Adolescentes Misto",
    faixaEtariaMin: 13,
    faixaEtariaMax: 18,
    tipo: "adolescentes"
  }
]

export const initialGroupGcs: GroupGc[] = [
  {
    id: 1,
    nomeGrupo: "Região Centro",
    nomeDoLider: "João Silva",
    observacao: "Responsável pelos GC's da região central"
  },
  {
    id: 2,
    nomeGrupo: "Região Norte",
    nomeDoLider: "Maria Santos",
    observacao: "Coordena os GC's da região norte"
  }
]

export const initialGcs: Gc[] = [
  {
    id: 1,
    idGrupo: 1,
    descricao: "GC Casais Jovens - Centro",
    lider: "Carlos e Ana",
    descricaoLocal: "Apartamento 402",
    enderecoRua: "Rua das Flores",
    enderecoNumero: "120",
    enderecoBairro: "Centro",
    enderecoCEP: "12345-000",
    categoriaId: 1,
    diaSemana: "Quinta",
    horario: "20:00"
  },
  {
    id: 2,
    idGrupo: 2,
    descricao: "GC Jovens Masculino - Norte",
    lider: "Paulo Souza",
    descricaoLocal: "Casa térrea",
    enderecoRua: "Av. das Palmeiras",
    enderecoNumero: "850",
    enderecoBairro: "Jardim Norte",
    enderecoCEP: "12345-100",
    categoriaId: 3,
    diaSemana: "Sábado",
    horario: "18:30"
  }
]

export const initialPeople: Person[] = [
  {
    id: 1,
    nome: "Lucas Almeida",
    idade: 27,
    sexo: "M",
    estadoCivil: "Casado",
    enderecoRua: "Rua das Acácias",
    enderecoNumero: "55",
    enderecoBairro: "Vila Nova",
    enderecoCEP: "12345-200",
    categoriaId: 1,
    gcId: 1,
    statusEncaixe: "encaixado",
    dataAbordagem: "2025-11-10",
    observacao: "Visitante do culto de domingo à noite"
  },
  {
    id: 2,
    nome: "Mariana Costa",
    idade: 19,
    sexo: "F",
    estadoCivil: "Solteira",
    enderecoRua: "Rua das Oliveiras",
    enderecoNumero: "300",
    enderecoBairro: "Jardim Norte",
    enderecoCEP: "12345-300",
    categoriaId: 4,
    gcId: null,
    statusEncaixe: "pendente",
    dataAbordagem: "2025-11-15",
    observacao: "Gostou da ideia de GC mas pediu retorno por WhatsApp"
  }
]

export const initialDashboardData: DashboardData = {
  kpis: {
    totalAbordagens: 120,
    totalEncaixes: 75,
    encaixesPendentes: 22,
    categoriaComMaisPessoas: "GC Jovens Feminino"
  },
  captacaoPorMes: [
    { mes: "Jan", abordagens: 30, encaixes: 18 },
    { mes: "Fev", abordagens: 45, encaixes: 28 },
    { mes: "Mar", abordagens: 55, encaixes: 29 }
  ],
  encaixesPorMes: [
    { mes: "Jan", valor: 18 },
    { mes: "Fev", valor: 28 },
    { mes: "Mar", valor: 29 }
  ],
  categoriasDistribuicao: [
    { categoria: "GC Casais Jovens", quantidade: 20 },
    { categoria: "GC Casais Adultos", quantidade: 15 },
    { categoria: "GC Jovens Masculino", quantidade: 18 },
    { categoria: "GC Jovens Feminino", quantidade: 22 },
    { categoria: "GC Adolescentes Misto", quantidade: 10 }
  ],
  insights: [
    "GC Jovens Feminino é a categoria com maior número de pessoas encaixadas.",
    "Mar foi o mês com maior número de abordagens.",
    "Há 22 pessoas com encaixe pendente, priorizar follow-up nesta semana."
  ]
}





