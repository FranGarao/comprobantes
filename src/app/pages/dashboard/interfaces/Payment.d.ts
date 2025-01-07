export interface Payment {
    id?: number;
    invoiceId: number;
    paymentMethodId: number;
    mount: number;
    paymentDate: Date;
    saleId: number;
}

export interface PaymentsResponse {
    message: string;
    payments: Payment[];
}