const BASE_URL = 'https://laboratorio.wetrib.com.br/creditotributario/api'

const FIXED_TOKEN =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IkY0RTQyNjUxMjgzQUUzQjNFRTA4MDYzNTNFRUZBOTU5IiwidHlwIjoiYXQrand0In0.eyJuYmYiOjE3NzM3NTE1NjEsImV4cCI6MTc3NjM0MzU2MSwiaXNzIjoiaHR0cHM6Ly9hdXRoLWxhYm9yYXRvcmlvLndldHJpYi5jb20uYnIiLCJhdWQiOlsiY2FkYXN0cm9zIiwiY29icmFuY2EiLCJjb25maWd1cmFjb2VzIiwiY3JlZGl0b3RyaWJ1dGFyaW8iLCJnZXJlbmNpYWwiLCJnZXN0YW9lbnZpb2VtYWlsIiwiaXB0dSIsIml0YmkiLCJ0YXhhcyJdLCJjbGllbnRfaWQiOiJqc19vYXV0aCIsInN1YiI6ImdhYnJpZWwiLCJhdXRoX3RpbWUiOjE3NzM3NTE1NjEsImlkcCI6ImxvY2FsIiwibmFtZSI6IkdhYnJpZWwiLCJyb2xlIjpbIkxpc3RhciIsIk9idGVyIiwiQXR1YWxpemFyIiwiQXByb3ZhciIsIkNhbGN1bGFyIiwiSW5mb3JtYXIiLCJFbWl0aXIiLCJTdXNwZW5kZXIiLCJSZWF0aXZhciIsIkFuaXN0aWFyIl0sInByZWZlcnJlZF91c2VybmFtZSI6ImdhYnJpZWwiLCJjb2R0b20iOiIzMzkzIiwic2lkIjoiQjEwQjU1QkEyNjU4QUMyMjI5OUJFOUZEQzdBRjg5NDMiLCJpYXQiOjE3NzM3NTE1NjEsInNjb3BlIjpbImNhZGFzdHJvcyIsImNvYnJhbmNhIiwiY29uZmlndXJhY29lcyIsImNyZWRpdG90cmlidXRhcmlvIiwiZ2VyZW5jaWFsIiwiZ2VzdGFvZW52aW9lbWFpbCIsImlwdHUiLCJpdGJpIiwidGF4YXMiXSwiYW1yIjpbInB3ZCJdfQ.Mx3a4wi43ip3PMud2QBAMsx7TV7CFWP1Ws9-LBqRiuljZoPElQ_UwPVVRJyVMtGeZBn1sfxP5-8ut3zcpLqd9QD4BM9jBwH31dnqoB067lEmhFojoInOMQVIWFa3SCP1fI-AzormKTxMcXaKAMnZG6CtcEyZjUQsjHa5oPWFkHQt6FApY-TwZeV3H3xDQ6w0euSpt_iczW2c3EHEMkGzBxLBSMmCb2i23XWG_0IAyVvCr1irm8tuWt_gLgmzGvyG1PQ8cIIXogeos_Z95kCaIPENkxjCBa59_ry5j7ooXjAEi-c4LsMd0C04DBDmPej4V9i-dAB1tPxsp6D9rGdIrA'

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
