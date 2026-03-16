import {
  CheckCircle,
  ChartBar,
  Database,
  PuzzlePiece,
  Rocket,
} from 'phosphor-react'
import { LandingPageNavigation } from '../features/landingPage/components/LandingPageNavigation'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-12 lg:py-16 animate-in fade-in duration-500">
        {/* Título e introdução */}
        <header className="mb-16 text-center">
          <h1 className="mb-4 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-4xl font-bold text-transparent lg:text-5xl">
            Dashboard de Produtos
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Desafio técnico de dashboard administrativo de produtos em React + TypeScript.
            CRUD completo, gráficos de vendas e faturamento, com API mock em Node + Express.
          </p>
        </header>

        <LandingPageNavigation />

        {/* Requisitos atendidos */}
        <section className="my-16">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-gray-900">
            <CheckCircle size={24} weight="fill" className="text-green-500" />
            Requisitos atendidos
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              'CRUD completo de produtos (Create, Read, Update, Delete)',
              'Dashboard com gráficos de vendas e faturamento',
              'Filtros por nome e status (busca sincronizada na URL)',
              'API mock REST em Node + Express',
              'Gerenciamento de estado global (Zustand)',
              'TypeScript em todo o projeto',
              'Listagem com tabela responsiva',
              'Tratamento de erros, loading e empty states',
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3"
              >
                <CheckCircle size={20} weight="fill" className="mt-0.5 shrink-0 text-green-500" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Decisões técnicas */}
        <section className="mb-16">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-gray-900">
            <PuzzlePiece size={24} className="text-blue-400" />
            Decisões técnicas
          </h2>
          <div className="space-y-4">
            {[
              {
                title: 'Zustand',
                desc: 'Escolhido pela simplicidade, sem boilerplate. Ideal para estado global leve comparado a Redux ou Context API.',
              },
              {
                title: 'Tailwind CSS',
                desc: 'Desenvolvimento ágil, tema escuro consistente e utilitários para layout responsivo.',
              },
              {
                title: 'Chart.js',
                desc: 'Biblioteca madura e adequada para gráficos de dados tabulares (barras, pizza, linhas).',
              },
              {
                title: 'Estrutura feature-based',
                desc: 'Organização por features (products, sidebar) facilita manutenção e escalabilidade.',
              },
              {
                title: 'Filtros na URL',
                desc: 'Parâmetros search e status em searchParams permitem links compartilháveis e uso do botão Voltar.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-gray-200 bg-white p-4"
              >
                <h3 className="mb-1 font-medium text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Diferenciais */}
        <section className="mb-16">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-gray-900">
            <Rocket size={24} className="text-amber-400" />
            Diferenciais e proatividade
          </h2>
          <ul className="space-y-3">
            {[
              '8 gráficos: produtos mais vendidos, faturamento por produto, faturamento por mês, vendas por mês, participação no faturamento, ticket médio, distribuição por produto e vendas por categoria.',
              'Navegação por âncoras no dashboard: sidebar com links diretos para cada gráfico.',
              'Duas experiências de CRUD: formulário inline no dashboard e modais na lista de produtos.',
              'Componentes reutilizáveis: DynamicTable, ConfirmModal, ProductFormFields.',
              'Cards de estatísticas: total de produtos, disponíveis, vendas e faturamento.',
            ].map((item) => (
              <li key={item} className="flex gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
                <ChartBar size={20} className="mt-0.5 shrink-0 text-purple-400" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Como executar */}
        <section className="mb-16">
          <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-gray-900">
            <Database size={24} className="text-cyan-400" />
            Como executar
          </h2>
          <div className="rounded-xl border border-gray-200 bg-white p-6 font-mono text-sm">
            <p className="mb-2 text-gray-600">Na raiz do projeto:</p>
            <pre className="text-gray-800">
              {`npm install
npm run dev`}
            </pre>
            <p className="mt-4 text-gray-400">
              A API sobe na porta 3001 e o frontend na 5173. O frontend consome automaticamente a API.
            </p>
          </div>
        </section>

        <LandingPageNavigation />
      </div>
    </div>
  )
}
