import { FIXED_TOKEN } from './tributosHttpClient'

export type RemoteContributor = {
  id: string
  documentoRFB: string
  nome: string
}

export type ContributorsByDocumentResponse = Record<string, RemoteContributor>

export const contributorsService = {
  async fetchByDocument(document: string): Promise<RemoteContributor[]> {
    const onlyDigits = document.replace(/\D/g, '')

    if (!onlyDigits) {
      return []
    }

    const response = await fetch(
      `https://laboratorio.wetrib.com.br/cadastros/api/contribuintes/listar?documento=${onlyDigits}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${FIXED_TOKEN}`,
        },
      },
    )

    if (!response.ok) {
      const message = `HTTP error ${response.status}`
      throw new Error(message)
    }

    const data = (await response.json()) as ContributorsByDocumentResponse
    return Object.values(data)
  },
}

