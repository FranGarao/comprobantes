export interface Sale {
    id?: number,
    product_id: number,
    customer_id?: number,
    payment_id: number,
}

export interface SalesResponse {
    message: string,
    sales: Sale[]
}