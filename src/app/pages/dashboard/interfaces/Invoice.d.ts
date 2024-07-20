export interface Invoice {
  id: number;
  name: string;
  phone: string;
  job: string;
  jobId?: number;
  deliveryDate: Date;
  total: number;
  deposit: number;
  balance: number;
  status: boolean;
}
