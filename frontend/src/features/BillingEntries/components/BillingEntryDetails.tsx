import { CaretDown, CaretUp } from 'phosphor-react'
import { useState } from 'react'
import type {
  BillingEntry,
  BillingEntryDetail,
  BillingEntryEvent,
} from '../../../services/billingEntriesService'
import { DynamicTable } from '../../../shared/components/DynamicTable/DynamicTable'
import { formatDocument } from '../../../shared/utils/formatDocument'
import { SectionHeader } from '../../../shared/components/SectionHeader.tsx'
import { formatDateTime } from '../../../shared/utils/formatDateTime'

type BillingEntryDetailsProps = {
  entry: BillingEntry
  detail?: BillingEntryDetail | null
  events?: BillingEntryEvent[]
  isLoading?: boolean
  error?: string | null
}

type SectionId =
  | 'identificacao'
  | 'contribuinte'
  | 'credito'
  | 'valores'
  | 'divida'
  | 'identificacaoCredito'

export function BillingEntryDetails({
  entry,
  detail,
  events = [],
  isLoading,
  error,
}: BillingEntryDetailsProps) {
  const [openSections, setOpenSections] = useState<Record<SectionId, boolean>>({
    identificacao: true,
    contribuinte: true,
    credito: true,
    valores: true,
    divida: false,
    identificacaoCredito: false,
  })

  function toggle(section: SectionId) {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const effective = (detail ?? entry) as BillingEntryDetail | BillingEntry

  function parseHistorico(raw?: string | null) {
    if (!raw) {
      return { left: [] as { label: string; value: string }[], right: [] as { label: string; value: string }[] }
    }

    const lines = raw
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    const items = lines.map((line) => {
      const [labelPart, ...rest] = line.split(':')
      if (rest.length === 0) {
        return {
          label: '',
          value: line,
        }
      }

      return {
        label: `${labelPart.trim()}:`,
        value: rest.join(':').trim(),
      }
    })

    const middle = Math.ceil(items.length / 2)

    return {
      left: items.slice(0, middle),
      right: items.slice(middle),
    }
  }

  const historicoParsed = parseHistorico((detail as BillingEntryDetail | undefined)?.historico ?? (effective as any).historico)

  function renderDescricaoEventoWithHighlight(descricao: string) {
    if (!descricao) return null

    const match = descricao.match(/\$([\d.,]+)/)
    if (!match) {
      return descricao.split('\n').map((line, index) => (
        <span key={index} className="block">
          {line}
        </span>
      ))
    }

    const rawAmount = match[1]
    const amountNumber = Number(
      rawAmount.replace(/\./g, '').replace(',', '.'),
    )

    const formattedAmount =
      Number.isFinite(amountNumber)
        ? amountNumber.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })
        : rawAmount

    const before = descricao.slice(0, match.index)
    const after = descricao.slice((match.index ?? 0) + match[0].length)

    return (
      <>
        {before && (
          <span className="block whitespace-pre-line">
            {before}
          </span>
        )}
        <span className="block text-green-700 font-semibold">
          {formattedAmount}
        </span>
        {after && (
          <span className="block whitespace-pre-line">
            {after}
          </span>
        )}
      </>
    )
  }

  function formatCurrency(value: number): string {
    const safe = Number.isFinite(value) ? value : 0
    return safe.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  const valorPrincipal = Number.isFinite(effective.valorTotal) ? effective.valorTotal : 0
  const encargos =
    (Number.isFinite(effective.valorJurosTotal) ? effective.valorJurosTotal : 0) +
    (Number.isFinite(effective.valorMultaTotal) ? effective.valorMultaTotal : 0) +
    (Number.isFinite(effective.valorCorrecaoMonetariaTotal) ? effective.valorCorrecaoMonetariaTotal : 0)
  const valorGuia = valorPrincipal + encargos

  return (
    <div className="flex flex-col gap-3 text-sm text-gray-700">
      {isLoading && (
        <p className="text-xs text-blue-600 px-3">
          Carregando detalhes do lançamento...
        </p>
      )}

      {error && (
        <p className="text-xs text-red-600 px-3">
          {error}
        </p>
      )}
      {/* Bloco 1 - Informações de origem do lançamento */}
      <div className="px-3 py-3 space-y-4">
          {/* Linha 1: Nome + CPF/CNPJ centralizados ocupando 100% */}
          <div className="flex flex-row flex-wrap items-center justify-center text-center gap-2">
            <span className="font-semibold text-gray-900 text-base">
              {effective.nome} - {formatDocument(effective.documentoRFB)}
            </span>
          </div>

          {/* Linha 2: duas metades */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Metade esquerda: situação em destaque + origem */}
            <div className="flex flex-col gap-3 border rounded justify-center items-center p-3">
              <div className="flex flex-col items-center gap-1">
                <span className="text-sm text-gray-500 align-middle">Situação</span>
                <span className="font-semibold text-gray-900 text-lg">
                  {('situacaoLancamentoVirtualDescricao' in effective &&
                    (effective as any).situacaoLancamentoVirtualDescricao) ||
                    (effective as any).situacaoLancamentoDescricao}
                </span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="text-sm text-gray-500">Origem</span>
                <span className="font-semibold text-gray-900 text-base">
                  {('tipoCreditoDescricaoResumida' in effective &&
                    (effective as any).tipoCreditoDescricaoResumida) ||
                    (effective as any).tipoCreditoDescricao}
                </span>
              </div>
            </div>

            {/* Metade direita: demais infos chave/valor com space-between */}
            <div className="flex flex-col justify-around gap-2">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-gray-500">Data do fato gerador</span>
                <span className="font-semibold text-gray-900 text-base">
                  {effective && (effective as any).dataFatoGerador
                    ? new Date((effective as any).dataFatoGerador).toLocaleDateString('pt-BR')
                    : '-'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-gray-500">Data de vencimento</span>
                <span className="font-semibold text-gray-900 text-base">
                  {new Date(effective.dataVencimento).toLocaleDateString('pt-BR')}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-gray-500">N° lançamento</span>
                <span className="font-semibold text-gray-900 text-base">
                  {effective.numeroLancamento}
                </span>
              </div>
            </div>
          </div>
      </div>
      {/* valores do lançamentos */}
      <section className="flex flex-col rounded-lg border border-gray-200">
        <SectionHeader title="Valores do lançamento" />
        {openSections.valores && (
          <div className="flex flex-row gap-4 border-t border-gray-200  px-3 py-3">
            {/* esquerda */}
            <div className='w-full flex flex-col gap-2'>
              <div className='flex flex-row items-center justify-between gap-1'>
                <span className="text-sm text-gray-600">Valor original</span>
                <span className=" text-green-900 text-base">
                  R$ {effective.valorOriginal}
                </span>
              </div>
              <div className='flex flex-row items-center justify-between gap-1'>
                <span className="text-[14px] text-gray-600">Juros</span>
                <span className="text-[14px]">
                  R$ {effective.valorJurosTotal}
                </span>
              </div>
              <div className='flex flex-row items-center justify-between gap-1'>
                <span className="text-[14px] text-gray-600">Multa</span>
                <span className="text-[14px]">
                  R$ {effective.valorMultaTotal}
                </span>
              </div>
              <div className='flex flex-row items-center justify-between gap-1'>
                <span className="text-[14px] text-gray-600">Correção monetária</span>
                <span className="text-[14px]">
                  R$ {effective.valorCorrecaoMonetariaTotal}
                </span>
              </div>
              <div className='flex flex-row items-center justify-between gap-1'>
                <span className="text-sm font-bold text-gray-600">Valor Total</span>
                <span className="font-bold text-green-900 text-base">
                  R$ {effective.valorTotal}
                </span>
              </div>
            </div>
            {/* direita */}
            <div className='w-full flex flex-col gap-2'>
              <div className='flex flex-row items-center justify-between gap-1'>
                <span className="text-sm text-gray-600">Valor Principal Liquidado</span>
                <span className=" text-green-900 text-base">
                  R$ {(effective.valorJurosRecebido + effective.valorMultaRecebida + effective.valorCorrecaoMonetariaRecebida).toFixed(2)}
                </span>
              </div>

              <div className='flex flex-row items-center justify-between gap-1'>
                <span className="text-[14px] text-gray-600">Juros</span>
                <span className="text-[14px]">
                  R$ {effective.valorJurosRecebido}
                </span>
              </div>

              <div className='flex flex-row items-center justify-between gap-1'>
                <span className="text-[14px] text-gray-600">Multa</span>
                <span className="text-[14px]">
                  R$ {effective.valorMultaRecebida}
                </span>
              </div>

              <div className='flex flex-row items-center justify-between gap-1'>
                <span className="text-[14px] text-gray-600">Correção monetária</span>
                <span className="text-[14px]">
                  R$ {effective.valorCorrecaoMonetariaRecebida}
                </span>
              </div>

              <div className='flex flex-row items-center justify-between gap-1'>
                <span className="text-sm font-bold text-gray-600">Valor Liquidado</span>
                <span className="font-bold text-green-900 text-base">
                  R$ {(effective.valorJurosRecebido + effective.valorMultaRecebida + effective.valorCorrecaoMonetariaRecebida).toFixed(2)}
                </span>
              </div>

            </div>
          </div>
        )}
      </section>

      {/* histórico de lançamentos */}
      <section className="flex flex-col rounded-lg border border-gray-200">
        <SectionHeader title="Histórico de lançamentos" />
          <div className="flex flex-row gap-4 border-t border-gray-200 px-3 py-3">
            {/* esquerda */}
            <div className="w-full flex flex-col gap-2">
              {historicoParsed.left.map((item, index) => (
                <div key={`hist-left-${index}`} className="flex flex-col gap-0.5">
                  {item.label && (
                    <span className="text-sm text-gray-500">
                      {item.label}
                    </span>
                  )}
                  <span className="text-gray-900 text-base whitespace-pre-line">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
            {/* direita */}
            <div className="w-full flex flex-col gap-2">
              {historicoParsed.right.map((item, index) => (
                <div key={`hist-right-${index}`} className="flex flex-col gap-0.5">
                  {item.label && (
                    <span className="text-sm text-gray-500">
                      {item.label}
                    </span>
                  )}
                  <span className="text-gray-900 text-base whitespace-pre-line">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

      </section>

      {/* Eventos */}
      <section className="flex flex-col rounded-lg border border-gray-200">
        <SectionHeader title="Eventos" />
        <div className="border-t border-gray-200 px-3 py-3">
            <DynamicTable<BillingEntryEvent>
              data={events}
              keyExtractor={(_item: BillingEntryEvent, index: number) => String(index)}
              minWidth="600px"
              emptyMessage="Nenhum evento encontrado para este lançamento."
              columns={[
                {
                  id: 'data',
                  header: 'Data e hora',
                  render: (item) => formatDateTime(item.data),
                },
                {
                  id: 'tipoEvento',
                  header: 'Tipo do evento',
                  render: (item) => item.tipoEvento,
                },
                {
                  id: 'descricaoEvento',
                  header: 'Descrição',
                  render: (item) => (
                    <div className="text-sm text-gray-700">
                      {renderDescricaoEventoWithHighlight(item.descricaoEvento)}
                    </div>
                  ),
                },
                {
                  id: 'usuario',
                  header: 'Usuário',
                  render: (item) => item.usuario,
                },
              ]}
            />
          </div>
      </section>

      {/* guia de recolhimento */}
      <section className="flex flex-col rounded-lg border border-gray-200">
        <SectionHeader title="Guia de recolhimento" />

        <div className="flex flex-col md:flex-row gap-6 px-3 py-3">
          {/* Coluna esquerda - dados do contribuinte e situação */}
          <div className="w-full md:w-1/2 flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500 uppercase">CPF/CNPJ</span>
              <span className="font-semibold text-gray-900">
                {formatDocument(effective.documentoRFB)}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500 uppercase">Nome</span>
              <span className="font-semibold text-gray-900">
                {effective.nome}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500 uppercase">Situação</span>
              <span className="text-sm text-gray-900">
                Nova guia de recolhimento
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500 uppercase">Vencimento</span>
              <span className="text-sm text-gray-900">
                {new Date(effective.dataVencimento).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>

          {/* Coluna direita - resumo de valores */}
          <div className="w-full md:w-1/2 flex flex-col gap-3">
            <div className="flex flex-col gap-3 border rounded-lg px-3 py-3 bg-gray-50">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-gray-600">Valor Principal</span>
                  <span className="font-semibold text-green-900 text-base">
                    {formatCurrency(valorPrincipal)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-gray-600">Encargos</span>
                  <span className="font-semibold text-gray-900 text-base">
                    {formatCurrency(encargos)}
                  </span>
                </div>

                <div className="h-px w-full bg-gray-200 my-1" />

                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-gray-700">Valor Guia</span>
                  <span className="font-bold text-green-900 text-lg">
                    {formatCurrency(valorGuia)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-gray-500">Valor no vencimento</span>
                  <span className="font-semibold text-green-900 text-base">
                    {formatCurrency(valorGuia)}
                  </span>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    // Ação fake de emissão da guia
                    // Futuro: integrar com endpoint real de emissão
                    // eslint-disable-next-line no-console
                    console.log('Emitir guia de recolhimento para lançamento', effective.numeroLancamento)
                  }}
                  className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer"
                >
                  Emitir
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

