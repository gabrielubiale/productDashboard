const BASE_URL = 'https://laboratorio.wetrib.com.br/creditotributario/api'

const FIXED_TOKEN =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IkQ5QjMzQjhGQ0U3RDY2MkM3OUVGMDYzRTQzRUE4QzI0IiwidHlwIjoiYXQrand0In0.eyJuYmYiOjE3NzM2Njc1MDYsImV4cCI6MTc3NjI1OTUwNiwiaXNzIjoiaHR0cHM6Ly9hdXRoLWxhYm9yYXRvcmlvLndldHJpYi5jb20uYnIiLCJhdWQiOlsiY2FkYXN0cm9zIiwiY29icmFuY2EiLCJjb25maWd1cmFjb2VzIiwiY3JlZGl0b3RyaWJ1dGFyaW8iLCJnZXJlbmNpYWwiLCJnZXN0YW9lbnZpb2VtYWlsIiwiaXB0dSIsIml0YmkiLCJ0YXhhcyJdLCJjbGllbnRfaWQiOiJqc19vYXV0aCIsInN1YiI6ImdhYnJpZWwiLCJhdXRoX3RpbWUiOjE3NzM2Njc1MDYsImlkcCI6ImxvY2FsIiwibmFtZSI6IkdhYnJpZWwiLCJyb2xlIjpbIkxpc3RhciIsIk9idGVyIiwiQXR1YWxpemFyIiwiQXByb3ZhciIsIkNhbGN1bGFyIiwiSW5mb3JtYXIiLCJFbWl0aXIiLCJTdXNwZW5kZXIiLCJSZWF0aXZhciIsIkFuaXN0aWFyIl0sInByZWZlcnJlZF91c2VybmFtZSI6ImdhYnJpZWwiLCJjb2R0b20iOiIzMzkzIiwic2lkIjoiMTI3NEFFMDZFN0UwNThBM0IzMDUxODQ3OTJENjdDM0IiLCJpYXQiOjE3NzM2Njc1MDYsInNjb3BlIjpbImNhZGFzdHJvcyIsImNvYnJhbmNhIiwiY29uZmlndXJhY29lcyIsImNyZWRpdG90cmlidXRhcmlvIiwiZ2VyZW5jaWFsIiwiZ2VzdGFvZW52aW9lbWFpbCIsImlwdHUiLCJpdGJpIiwidGF4YXMiXSwiYW1yIjpbInB3ZCJdfQ.N_YE8_xLFYdmW6IzkonNjXF2c6Uh50ERtiTuNiws3XiMFFJcuNYMiqqDZqeMAdct8qEHhGpiKbeN-cOGsTLago1e9pLiZ-ftQR55btcFQBawh4c36OQw1S_eXW2muiBjNhAYrT3lwxwN1FxHstMqtYCAmIXTLSvOgOUbodrf2NFvzxNPq1iDtIdgB4TWacRdjD2R0GAHv6dZITGHbIQJ-YMiLGTIDokyJS6VM6cZ72XlZxdVWG9CIwL6kFQBC6dNhtjO89DAxadyJsK5dFcSs_xMp14NpATEuXcM4mz1S1e7T8CUZyR4vfFXEbj3jcwn2QxHYkArVFc4j-cR15XeTQ'

type HttpMethod = 'GET'

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${path}`

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${FIXED_TOKEN}`,
      ...(options.headers ?? {}),
    },
    ...options,
  })

  if (!response.ok) {
    const message = `HTTP error ${response.status}`
    throw new Error(message)
  }

  return (await response.json()) as T
}

export const tributosHttpClient = {
  get<T>(path: string) {
    return request<T>(path, { method: 'GET' satisfies HttpMethod })
  },
}
