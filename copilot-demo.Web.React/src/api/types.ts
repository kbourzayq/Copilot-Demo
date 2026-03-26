export interface ProductDto {
  id: string
  name: string
  price: number
  createdAt: string
}

export interface CreateProductRequest {
  name: string
  price: number
}

export interface UpdateProductRequest {
  name: string
  price: number
}
