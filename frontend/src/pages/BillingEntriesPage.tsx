import { useEffect, useState } from 'react'
import { PageTitle } from '../shared/components/PageTitle/PageTitle'
import { DynamicTable } from '../shared/components/DynamicTable/DynamicTable'
import { BillingEntriesForm } from '../features/BillingEntries/BillingEntriesForm'
import { billingEntriesService } from '../services/billingEntriesService'
import type { BillingEntry } from '../services/billingEntriesService'

export function BillingEntriesPage() {
  const [data, setData] = useState<BillingEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function load() {
      try {
        setIsLoading(true)
        setError(null)
        const entries = await billingEntriesService.fetchBillingEntries(1)
        if (isMounted) {
          setData(entries)
          setPage(1)
          setHasMore(entries.length === 10)
        }
      } catch (err) {
        if (isMounted) {
          setError('Não foi possível carregar os lançamentos. Tente novamente mais tarde.')
          console.error(err)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void load()

    return () => {
      isMounted = false
    }
  }, [])

  async function handleLoadMore() {
    try {
      setIsLoading(true)
      setError(null)
      const nextPage = page + 1
      const entries = await billingEntriesService.fetchBillingEntries(nextPage)
      setData((prev) => [...prev, ...entries])
      setPage(nextPage)
      setHasMore(entries.length === 10)
    } catch (err) {
      setError('Não foi possível carregar mais lançamentos. Tente novamente.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const columns = [
    {
      id: 'numeroLancamento',
      header: 'N° lançamento',
      render: (item: BillingEntry) => item.numeroLancamento,
    },
    {
      id: 'contribuinte',
      header: 'Contribuinte',
      render: (item: BillingEntry) => item.contribuinte,
    },
    {
      id: 'documento',
      header: 'CPF/CNPJ',
      render: (item: BillingEntry) => item.documento,
    },
    {
      id: 'tipoCredito',
      header: 'Crédito',
      render: (item: BillingEntry) => item.tipoCredito,
    },
    {
      id: 'situacao',
      header: 'Situação',
      render: (item: BillingEntry) => item.situacao,
    },
    {
      id: 'dataVencimento',
      header: 'Vencimento',
      render: (item: BillingEntry) =>
        new Date(item.dataVencimento).toLocaleDateString('pt-BR'),
    },
    {
      id: 'valorTotal',
      header: 'Valor total',
      render: (item: BillingEntry) =>
        item.valorTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
    },
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageTitle
        title="Consulta de lançamentos"
        description="Tela de consulta de lançamentos financeiros/tributários."
      />

      <BillingEntriesForm
        onSubmitEntry={async (values) => {
          // Futuro: usar values para montar filtros da API real
          console.log('Billing entries filters submitted', values)
        }}
      />

      {error && (
        <p className="text-sm text-red-600 px-1">
          {error}
        </p>
      )}

      <DynamicTable
        data={data}
        columns={columns}
        keyExtractor={(item) => item.id}
        emptyMessage={
          isLoading
            ? 'Carregando lançamentos...'
            : 'Nenhum lançamento encontrado. Ajuste os filtros ou importe lançamentos.'
        }
        minWidth="600px"
      />

      {hasMore && !isLoading && (
        <div className="flex justify-center mt-2">
          <button
            type="button"
            onClick={handleLoadMore}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-colors text-sm cursor-pointer"
          >
            Carregar mais
          </button>
        </div>
      )}
    </div>
  )
}

