const BASE_URL = 'https://laboratorio.wetrib.com.br/creditotributario/api'

export const FIXED_TOKEN =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IkMxNUMzRjgzQjFENEI5Nzc0MzMwRThCMTJCRkRBNEU3IiwidHlwIjoiYXQrand0In0.eyJuYmYiOjE3NzM4MzM3MTUsImV4cCI6MTc3NjQyNTcxNSwiaXNzIjoiaHR0cHM6Ly9hdXRoLWxhYm9yYXRvcmlvLndldHJpYi5jb20uYnIiLCJhdWQiOlsiY2FkYXN0cm9zIiwiY29icmFuY2EiLCJjb25maWd1cmFjb2VzIiwiY3JlZGl0b3RyaWJ1dGFyaW8iLCJnZXJlbmNpYWwiLCJnZXN0YW9lbnZpb2VtYWlsIiwiaXB0dSIsIml0YmkiLCJ0YXhhcyJdLCJjbGllbnRfaWQiOiJqc19vYXV0aCIsInN1YiI6ImdhYnJpZWwiLCJhdXRoX3RpbWUiOjE3NzM4MzM3MTQsImlkcCI6ImxvY2FsIiwibmFtZSI6IkdhYnJpZWwiLCJyb2xlIjpbIkxpc3RhciIsIk9idGVyIiwiQXR1YWxpemFyIiwiQXByb3ZhciIsIkNhbGN1bGFyIiwiSW5mb3JtYXIiLCJFbWl0aXIiLCJTdXNwZW5kZXIiLCJSZWF0aXZhciIsIkFuaXN0aWFyIl0sInByZWZlcnJlZF91c2VybmFtZSI6ImdhYnJpZWwiLCJjb2R0b20iOiIzMzkzIiwic2lkIjoiMENBRjRCREY5RTRCQ0ZDQUQwQUQyQTMzQUQ1NjM3NzQiLCJpYXQiOjE3NzM4MzM3MTUsInNjb3BlIjpbImNhZGFzdHJvcyIsImNvYnJhbmNhIiwiY29uZmlndXJhY29lcyIsImNyZWRpdG90cmlidXRhcmlvIiwiZ2VyZW5jaWFsIiwiZ2VzdGFvZW52aW9lbWFpbCIsImlwdHUiLCJpdGJpIiwidGF4YXMiXSwiYW1yIjpbInB3ZCJdfQ.c6FVj-8BPp2JEDdfHrln2WvFLHjtR6Ov5gPdrOgv8NesP1l-1D_4o2OxP85VHfx-X8XDWKIIMxgqGuvsVXRZawpC5ypbZkQJWQdqwEtQzwH3Co5wlM-PpUXlM6O5oyoGEqrt8ZpD7wGgBtC9FP5kXfgKd5g9gw42yABvNhXq4jyJKAlDxyHVvE0QvnxZLFegNjY5jvPw-kGgqavkXVgK5z8MRuD8UxHPIuo9nL0lpglKnSWS3dg_jpkjUCOGcr3NlRg6I-z7n6ZadwV3OX6FikEcZ3I1z4bQaXygVGm-akDjhKugOUKvufq6fCEc9PZ7GocN383291t8F4opbHfxmA'

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
