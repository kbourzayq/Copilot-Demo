import type { CreateProductRequest, ProductDto, UpdateProductRequest } from './types'

const BASE = '/products'

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(text || `HTTP ${res.status}`)
  }
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export async function listProducts(): Promise<ProductDto[]> {
  const res = await fetch(BASE)
  return handleResponse<ProductDto[]>(res)
}

export async function getProduct(id: string): Promise<ProductDto> {
  const res = await fetch(`${BASE}/${id}`)
  return handleResponse<ProductDto>(res)
}

export async function createProduct(data: CreateProductRequest): Promise<ProductDto> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return handleResponse<ProductDto>(res)
}

export async function updateProduct(id: string, data: UpdateProductRequest): Promise<ProductDto> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return handleResponse<ProductDto>(res)
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' })
  return handleResponse<void>(res)
}
