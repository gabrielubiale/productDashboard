import { useEffect, useState } from 'react'
import { PageTitle } from '../shared/components/PageTitle/PageTitle'
import { DynamicTable } from '../shared/components/DynamicTable/DynamicTable'
import { BillingEntriesForm } from '../features/BillingEntries/BillingEntriesForm'
import { billingEntriesService } from '../services/billingEntriesService'
import type {
  BillingEntry,
  BillingEntryDetail,
  BillingEntryEvent,
} from '../services/billingEntriesService'
import { CurrencyDollar, Eye } from 'phosphor-react'
import { Modal } from '../shared/components/Modal/Modal'
import { BillingEntryDetails } from '../features/BillingEntries/components/BillingEntryDetails'
import { formatDocument } from '../shared/utils/formatDocument'

export function BillingEntriesPage() {
  const [data, setData] = useState<BillingEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [selectedEntry, setSelectedEntry] = useState<BillingEntry | null>(null)
  const [selectedEntryDetail, setSelectedEntryDetail] = useState<BillingEntryDetail | null>(null)
  const [selectedEntryEvents, setSelectedEntryEvents] = useState<BillingEntryEvent[]>([])
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState<string | null>(null)

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

  async function handleOpenDetails(entry: BillingEntry) {
    setSelectedEntry(entry)
    setSelectedEntryDetail(null)
    setSelectedEntryEvents([])
    setDetailError(null)

    try {
      setIsDetailLoading(true)
      const [detail, events] = await Promise.all([
        billingEntriesService.fetchBillingEntryDetail(entry.lancamentoId),
        billingEntriesService.fetchBillingEntryEvents({
          origemId: entry.lancamentoId,
          numeroOrigem: entry.numeroLancamento,
          tipoOrigem: 1,
        }),
      ])

      setSelectedEntryDetail(detail)
      setSelectedEntryEvents(events)
    } catch (err) {
      console.error(err)
      setDetailError('Não foi possível carregar os detalhes do lançamento. Tente novamente.')
    } finally {
      setIsDetailLoading(false)
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
      render: (item: BillingEntry) => item.nome,
    },
    {
      id: 'documento',
      header: 'CPF/CNPJ',
      render: (item: BillingEntry) => formatDocument(item.documentoRFB),
    },
    {
      id: 'tipoCredito',
      header: 'Crédito',
      render: (item: BillingEntry) =>
        item.tipoCreditoDescricaoResumida || item.tipoCreditoDescricao,
    },
    {
      id: 'situacao',
      header: 'Situação',
      render: (item: BillingEntry) => {
        const raw =
          item.situacaoLancamentoVirtualDescricao || item.situacaoLancamentoDescricao || ''
        const value = raw.toLowerCase()

        const baseBadge =
          'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium'

        if (value.includes('liquidado')) {
          return (
            <span className={`${baseBadge} border-emerald-200 bg-emerald-50 text-emerald-800`}>
              {raw}
            </span>
          )
        }

        if (value.includes('aberto')) {
          return (
            <span className={`${baseBadge} border-amber-200 bg-amber-50 text-amber-800`}>
              {raw}
            </span>
          )
        }

        return (
          <span className={`${baseBadge} border-gray-200 bg-gray-50 text-gray-700`}>
            {raw}
          </span>
        )
      },
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
      align: 'right' as const,
    },
    {
      id: 'actions',
      header: 'Ver mais',
      align: 'center' as const,
      render: (item: BillingEntry) => (
        <button
          type="button"
          onClick={() => {
            void handleOpenDetails(item)
          }}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:border-blue-300 transition-colors cursor-pointer"
          title="Ver detalhes do lançamento"
        >
          <Eye size={16} weight="bold" />
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageTitle
        breadcrumbItems={['Cobrança', 'Consulta de lançamentos']}
        title="Consulta de lançamentos"
        icon={<CurrencyDollar size={24} weight="bold" />}
      />

      <BillingEntriesForm
        onSubmitEntry={async (values) => {
          try {
            setIsLoading(true)
            setError(null)

            const contribuinteId = values.contributor?.id
            const numeroLancamento = values.registroNumero ?? null

            const entries = await billingEntriesService.fetchBillingEntriesWithFilters({
              page: 1,
              contribuinteId,
              numeroLancamento,
            })

            setData(entries)
            setPage(1)
            setHasMore(entries.length === 10)
          } catch (err) {
            console.error(err)
            setError('Não foi possível carregar os lançamentos com os filtros informados. Tente novamente.')
          } finally {
            setIsLoading(false)
          }
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
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium cursor-pointer"
          >
            Carregar mais
          </button>
        </div>
      )}

      <Modal
        isOpen={selectedEntry !== null}
        contentClassName="w-[1000px] max-w-[1000px] min-h-[800px] max-h-[800px]"
        onClose={() => {
          setSelectedEntry(null)
          setSelectedEntryDetail(null)
          setSelectedEntryEvents([])
          setDetailError(null)
        }}
        title="Detalhes do lançamento"
      >
        {selectedEntry && (
          <BillingEntryDetails
            entry={selectedEntry}
            detail={selectedEntryDetail}
            events={selectedEntryEvents}
            isLoading={isDetailLoading}
            error={detailError}
          />
        )}
      </Modal>
    </div>
  )
}

