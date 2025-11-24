# WelcomeApp

Aplicativo Web para Gestão de Grupos de Casas (GC) de igrejas.

## Descrição

O WelcomeApp é uma aplicação UI-first desenvolvida para gerenciar grupos de casas de igrejas. O sistema permite cadastrar rapidamente visitantes na porta da igreja, registrar abordagens e encaixes em GC's, além de gerenciar categorias, grupos e pessoas.

## Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **Recharts** - Gráficos
- **Lucide React** - Ícones

## Funcionalidades

### Dashboard Welcome
- KPIs: Total de abordagens, encaixes, pendentes e categoria com mais pessoas
- Gráficos: Captação por mês (linha), Encaixes por mês (barra), Distribuição por categoria (pizza)
- Insights gerados automaticamente
- Filtros por período (7 dias, 30 dias, total) e categoria

### CRUD de GC's
- Listagem, criação, edição e exclusão de Grupos de Casas
- Campos: descrição, líder, grupo, categoria, local, endereço, dia e horário

### CRUD de Grupos de GC's
- Gerenciamento de grupos organizacionais
- Campos: nome do grupo, líder, observações

### CRUD de Categorias
- Gerenciamento de categorias de GC's
- Campos: descrição, tipo, faixa etária (mínima e máxima)

### CRUD de Pessoas
- Cadastro completo de pessoas
- Campos: nome, idade, sexo, estado civil, endereço, categoria, GC, status de encaixe, data de abordagem, observações
- Filtros por nome e status de encaixe

### Meu Perfil
- Visualização e edição de informações do usuário
- Campos: nome, e-mail, telefone, função, idioma

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

3. Acesse [http://localhost:3000](http://localhost:3000)

## Estrutura do Projeto

```
├── app/                    # Páginas Next.js
│   ├── page.tsx           # Dashboard
│   ├── gcs/               # Página de GC's
│   ├── grupos-gcs/        # Página de Grupos de GC's
│   ├── categorias/        # Página de Categorias
│   ├── pessoas/           # Página de Pessoas
│   └── perfil/            # Página de Perfil
├── components/            # Componentes React
│   ├── ui/               # Componentes shadcn/ui
│   ├── sidebar.tsx       # Menu lateral
│   ├── dashboard.tsx     # Componente do dashboard
│   └── ...               # Outros componentes
├── lib/                  # Utilitários e lógica
│   ├── mock-data.ts      # Dados mock iniciais
│   ├── store.ts          # Hook de estado local
│   └── utils.ts          # Funções utilitárias
└── public/               # Arquivos estáticos
```

## Características

- **UI-First**: Interface completa sem backend
- **Estado Local**: Dados armazenados em localStorage
- **Dark Mode**: Apenas tema escuro
- **Responsivo**: Layout adaptável
- **Microinterações**: Toasts, loading states, empty states
- **Navegação Fluida**: Menu lateral fixo

## Dados Mock

O aplicativo vem com dados mock pré-configurados:
- 5 Categorias
- 2 Grupos de GC's
- 2 GC's
- 2 Pessoas
- Dashboard com dados de exemplo

Todos os dados são persistidos no localStorage do navegador.

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter

## Observações

- Este é um projeto UI-first, sem backend ou APIs
- Todos os dados são armazenados localmente no navegador
- Não há autenticação real implementada
- O controle de permissões é apenas visual na UI




