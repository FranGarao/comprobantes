export interface Sale {
    id?: number,
    productId: number,
    customerId: number,
    paymentId: number,
}

export interface SalesResponse {
    message: string,
    sales: Sale[]
}