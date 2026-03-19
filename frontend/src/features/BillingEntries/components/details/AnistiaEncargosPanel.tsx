import type React from 'react'
import { X } from 'phosphor-react'
import { SelectInput } from '../../../../shared/forms/inputs/SelectInput'
import { TextAreaInput } from '../../../../shared/forms/inputs/TextAreaInput'
import { formatCurrencyBRL } from '../../utils/money'

export type AnistiaSelecao = 'total' | 'seletiva' | 'informada'

export function AnistiaEncargosPanel({
  anistiaRef,
  encargos,
  anistiaSelecao,
  onAnistiaSelecaoChange,
  anistiaConta,
  onAnistiaContaChange,
  anistiaMotivo,
  onAnistiaMotivoChange,
  anistiaSuccess,
  onClose,
  onConfirm,
}: {
  anistiaRef: React.RefObject<HTMLDivElement | null>
  encargos: number
  anistiaSelecao: AnistiaSelecao
  onAnistiaSelecaoChange: (value: AnistiaSelecao) => void
  anistiaConta: string
  onAnistiaContaChange: (value: string) => void
  anistiaMotivo: string
  onAnistiaMotivoChange: (value: string) => void
  anistiaSuccess: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <div
      ref={anistiaRef}
      className="w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Anistia de Encargos</h3>
          <p className="text-sm text-gray-500 mt-1">
            Selecione se a anistia de encargos será: total, seletiva ou informada
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 hover:bg-gray-100 text-gray-600 cursor-pointer"
          aria-label="Fechar"
        >
          <X size={20} weight="bold" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => onAnistiaSelecaoChange('total')}
          className={`rounded-lg border p-3 text-left transition-colors ${
            anistiaSelecao === 'total' ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200 bg-white'
          }`}
          aria-pressed={anistiaSelecao === 'total'}
        >
          <div className="flex items-center justify-between gap-2">
            <div
              className={`text-sm font-semibold uppercase tracking-wide ${
                anistiaSelecao === 'total' ? 'text-emerald-800' : 'text-gray-600'
              }`}
            >
              Total
            </div>
            {anistiaSelecao === 'total' && (
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-700 text-white text-sm font-bold">
                ✓
              </span>
            )}
          </div>
          <div className="mt-3 text-sm text-gray-800">Encargos: {formatCurrencyBRL(encargos)}</div>
        </button>

        <button
          type="button"
          onClick={() => onAnistiaSelecaoChange('seletiva')}
          className={`rounded-lg border p-3 text-left transition-colors ${
            anistiaSelecao === 'seletiva' ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200 bg-white'
          }`}
          aria-pressed={anistiaSelecao === 'seletiva'}
        >
          <div className="flex items-center justify-between gap-2">
            <div
              className={`text-sm font-semibold uppercase tracking-wide ${
                anistiaSelecao === 'seletiva' ? 'text-emerald-800' : 'text-gray-600'
              }`}
            >
              Seletiva
            </div>
            {anistiaSelecao === 'seletiva' && (
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-700 text-white text-sm font-bold">
                ✓
              </span>
            )}
          </div>
          <div
            className={`mt-3 text-sm ${
              anistiaSelecao === 'seletiva' ? 'text-emerald-900' : 'text-gray-800'
            }`}
          >
            Encargos: {formatCurrencyBRL(encargos)}
          </div>
        </button>

        <button
          type="button"
          onClick={() => onAnistiaSelecaoChange('informada')}
          className={`rounded-lg border p-3 text-left transition-colors ${
            anistiaSelecao === 'informada' ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200 bg-white'
          }`}
          aria-pressed={anistiaSelecao === 'informada'}
        >
          <div className="flex items-center justify-between gap-2">
            <div
              className={`text-sm font-semibold uppercase tracking-wide ${
                anistiaSelecao === 'informada' ? 'text-emerald-800' : 'text-gray-600'
              }`}
            >
              Informada
            </div>
            {anistiaSelecao === 'informada' && (
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-700 text-white text-sm font-bold">
                ✓
              </span>
            )}
          </div>
          <div className="mt-3 text-sm text-gray-800">Encargos: {formatCurrencyBRL(encargos)}</div>
        </button>
      </div>

      <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-600/5 px-3 py-2 text-sm text-emerald-900">
        {anistiaSelecao === 'total' &&
          'O valor de todos os encargos será anistiado na totalidade.'}
        {anistiaSelecao === 'seletiva' &&
          'O valor total de cada encargo selecionado será anistiado.'}
        {anistiaSelecao === 'informada' &&
          'O valor anistiado será calculado de acordo com o percentual informado em cada encargo.'}
      </div>

      <div className="mt-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <SelectInput
              name="anistiaConta"
              label="Convênio / Conta bancária"
              value={anistiaConta}
              onChange={onAnistiaContaChange}
              options={[
                {
                  value: 'bb_padrao',
                  label:
                    'Convênio | Banco do Brasil | Ag: 1673 | Cc: 89877-7 | Cv: 97920 / 0 (padrão)',
                },
              ]}
            />
          </div>
          <div className="md:col-span-2">
            <TextAreaInput
              name="anistiaMotivo"
              label="Motivo da Anistia de Encargos"
              value={anistiaMotivo}
              onChange={onAnistiaMotivoChange}
              rows={4}
              placeholder="Informe o motivo (exemplo ilustrativo)."
            />
          </div>
        </div>
      </div>

      {anistiaSuccess && (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
          Solicitação de anistia enviado com sucesso
        </div>
      )}

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="border border-gray-300 px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
        >
          Fechar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          Confirmar
        </button>
      </div>
    </div>
  )
}

