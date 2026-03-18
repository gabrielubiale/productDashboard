import { Fragment, useEffect, useState } from 'react'
import { PageTitle } from '../shared/components/PageTitle/PageTitle'
import { DynamicTable } from '../shared/components/DynamicTable/DynamicTable'
import type { Column } from '../shared/components/DynamicTable/DynamicTable'
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

function BillingEntriesAccordionTable({
  data,
  columns,
  expandedId,
  detailsById,
  eventsById,
  loadingById,
  errorById,
}: {
  data: BillingEntry[]
  columns: Column<BillingEntry>[]
  expandedId: string | null
  detailsById: Record<string, BillingEntryDetail | null | undefined>
  eventsById: Record<string, BillingEntryEvent[] | undefined>
  loadingById: Record<string, boolean | undefined>
  errorById: Record<string, string | null | undefined>
}) {
  if (data.length === 0) return null

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full" style={{ minWidth: '600px' }}>
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {columns.map((col) => (
                <th
                  key={col.id}
                  className={`px-4 py-3 font-semibold text-gray-700 ${
                    col.align === 'right'
                      ? 'text-right'
                      : col.align === 'center'
                        ? 'text-center'
                        : 'text-left'
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => {
              const isExpanded = expandedId === item.id
              const detail = detailsById[item.id]
              const events = eventsById[item.id] ?? []
              const isLoading = Boolean(loadingById[item.id])
              const error = errorById[item.id] ?? null

              return (
                <Fragment key={item.id}>
                  <tr
                    className={`
                      border-b border-gray-100 transition-all duration-200
                      hover:bg-blue-50 hover:shadow-[inset_4px_0_0_rgba(59,130,246,0.5)]
                      ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    `}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.id}
                        className={`px-4 py-3 ${
                          col.align === 'right'
                            ? 'text-right'
                            : col.align === 'center'
                              ? 'text-center'
                              : 'text-left'
                        }`}
                      >
                        {col.render(item)}
                      </td>
                    ))}
                  </tr>

                  {isExpanded && (
                    <tr className="bg-white">
                      <td colSpan={columns.length} className="px-4 py-4 border-b border-gray-100">
                        <BillingEntryDetails
                          entry={item}
                          detail={detail}
                          events={events}
                          isLoading={isLoading}
                          error={error}
                        />
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

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

  // v2: accordion inline (sem modal)
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null)
  const [detailsById, setDetailsById] = useState<Record<string, BillingEntryDetail | null | undefined>>(
    {},
  )
  const [eventsById, setEventsById] = useState<Record<string, BillingEntryEvent[] | undefined>>({})
  const [loadingById, setLoadingById] = useState<Record<string, boolean | undefined>>({})
  const [errorById, setErrorById] = useState<Record<string, string | null | undefined>>({})

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
          setHasMore(entries.length === 20)
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
      setHasMore(entries.length === 20)
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

  async function handleToggleAccordion(entry: BillingEntry) {
    const id = entry.id

    if (expandedEntryId === id) {
      setExpandedEntryId(null)
      return
    }

    setExpandedEntryId(id)

    const alreadyFetched = detailsById[id] !== undefined || eventsById[id] !== undefined
    if (alreadyFetched) return

    setLoadingById((prev) => ({ ...prev, [id]: true }))
    setErrorById((prev) => ({ ...prev, [id]: null }))

    try {
      const [detail, events] = await Promise.all([
        billingEntriesService.fetchBillingEntryDetail(entry.lancamentoId),
        billingEntriesService.fetchBillingEntryEvents({
          origemId: entry.lancamentoId,
          numeroOrigem: entry.numeroLancamento,
          tipoOrigem: 1,
        }),
      ])

      setDetailsById((prev) => ({ ...prev, [id]: detail }))
      setEventsById((prev) => ({ ...prev, [id]: events }))
    } catch (err) {
      console.error(err)
      setErrorById((prev) => ({
        ...prev,
        [id]: 'Não foi possível carregar os detalhes deste lançamento. Tente novamente.',
      }))
    } finally {
      setLoadingById((prev) => ({ ...prev, [id]: false }))
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

  const accordionColumns: Column<BillingEntry>[] = [
    ...columns.slice(0, -1),
    {
      id: 'expand',
      header: 'Detalhes',
      align: 'center',
      render: (item) => {
        const isExpanded = expandedEntryId === item.id
        return (
          <button
            type="button"
            onClick={() => {
              void handleToggleAccordion(item)
            }}
            className={`inline-flex items-center justify-center rounded-lg border px-3 py-1.5 text-sm transition-colors cursor-pointer ${
              isExpanded
                ? 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
            aria-expanded={isExpanded}
          >
            {isExpanded ? 'Recolher' : 'Expandir'}
          </button>
        )
      },
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
              onlyInstallments: values.onlyInstallments,
              onlyActiveDebt: values.onlyActiveDebt,
              taxCreditType: values.taxCreditType,
              launchStatus: values.launchStatus,
              dueDateStart: values.dueDateStart,
              dueDateEnd: values.dueDateEnd,
              settlementDateStart: values.settlementDateStart,
              settlementDateEnd: values.settlementDateEnd,
            })

            setData(entries)
            setPage(1)
            setHasMore(entries.length === 20)
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

      {/* v2 - tabela com accordion inline (sem modal) */}
      {data.length > 0 && (
        <div className="space-y-3">
          <div className="px-1">
            <p className="text-sm font-semibold text-gray-900">
              Versão 2 (detalhes inline, sem modal)
            </p>
            <p className="text-xs text-gray-500">
              Clique em “Expandir” para ver os detalhes do lançamento logo abaixo da linha.
            </p>
          </div>

          <BillingEntriesAccordionTable
            data={data}
            columns={accordionColumns}
            expandedId={expandedEntryId}
            detailsById={detailsById}
            eventsById={eventsById}
            loadingById={loadingById}
            errorById={errorById}
          />
        </div>
      )}

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

