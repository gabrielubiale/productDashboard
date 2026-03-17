import { CaretDown, CaretUp } from 'phosphor-react'
import { useState } from 'react'
import type { BillingEntry, BillingEntryDetail } from '../../../services/billingEntriesService'
import { formatDocument } from '../../../shared/utils/formatDocument'

type BillingEntryDetailsProps = {
  entry: BillingEntry
  detail?: BillingEntryDetail | null
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

export function BillingEntryDetails({ entry, detail, isLoading, error }: BillingEntryDetailsProps) {
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

      {/* Bloco 2 - Valores */}
      <section className="flex flex-col rounded-lg border border-gray-200">
        <button
          type="button"
          onClick={() => toggle('valores')}
          className="flex w-full items-center justify-between px-3 py-2 text-left cursor-pointer bg-blue-100"
        >
          <span className="text-[11px] font-semibold tracking-wide text-gray-700 uppercase">
            Valores do lançamento
          </span>
          {openSections.valores ? (
            <CaretUp size={16} className="text-gray-500" />
          ) : (
            <CaretDown size={16} className="text-gray-500" />
          )}
        </button>
        {openSections.valores && (
          <div className="flex flex-row gap-4 border-t border-gray-200 px-3 py-3">
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

      {/* Bloco 3 - Histórico de lançamentos */}
      <section className="flex flex-col rounded-lg border border-gray-200">
        <button
          type="button"
          onClick={() => toggle('divida')}
          className="flex w-full items-center justify-between px-3 py-2 text-left cursor-pointer bg-blue-100"
        >
          <span className="text-[11px] font-semibold tracking-wide text-gray-700 uppercase">
            Histórico de lançamentos
          </span>
          {openSections.valores ? (
            <CaretUp size={16} className="text-gray-500" />
          ) : (
            <CaretDown size={16} className="text-gray-500" />
          )}
        </button>
        {openSections.divida && (
          <div className="border-t border-gray-200">
            {historicoParsed.left.length === 0 && historicoParsed.right.length === 0 ? (
              <div className="px-3 py-3">
                <span className="text-sm text-gray-500">
                  Histórico não disponível para este lançamento.
                </span>
              </div>
            ) : (
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
            )}
          </div>
        )}
      </section>

      {/* Bloco 4 - Eventos */}
      <section className="flex flex-col rounded-lg border border-gray-200">
        <button
          type="button"
          onClick={() => toggle('identificacaoCredito')}
          className="flex w-full items-center justify-between px-3 py-2 text-left cursor-pointer bg-gray-50"
        >
          <span className="text-[11px] font-semibold tracking-wide text-gray-700 uppercase">
            Eventos
          </span>
          {openSections.identificacaoCredito ? (
            <CaretUp size={16} className="text-gray-500" />
          ) : (
            <CaretDown size={16} className="text-gray-500" />
          )}
        </button>
        {openSections.identificacaoCredito && (
          <div className="border-t border-gray-200 px-3 py-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1 md:col-span-2">
                <span className="text-sm text-gray-500">Descrição crédito</span>
                <span className="font-semibold text-gray-900 text-base">
                  {effective.identificacaoCreditoDescricao}
                </span>
              </div>

              <div className="flex flex-col gap-1 md:col-span-2">
                <span className="text-sm text-gray-500">Descrição resumida</span>
                <span className="font-semibold text-gray-900 text-base">
                  {effective.identificacaoCreditoDescricaoResumida}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">Identificação</span>
                <span className="font-semibold text-gray-900 text-base">
                  {effective.identificacaoDescricao}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">Valor identificação</span>
                <span className="font-semibold text-gray-900 text-base">
                  {effective.identificacaoValor}
                </span>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

