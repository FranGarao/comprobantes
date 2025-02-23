export interface Invoice {
  id: number;
  name: string;
  phone: string;
  job?: string;
  jobId?: number;
  jobs: any[];
  deliveryDate: Date;
  total: number;
  deposit: number;
  balance: number;
  status: string;
  customer_id?: number
  customerId?: number
  customer?: string
}

export interface InvoicesResponse {
  message: string;
  invoices: Invoice[]
}