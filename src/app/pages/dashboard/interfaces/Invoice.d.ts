export interface Invoice {
  Id: number;
  Name: string;
  Phone: string;
  Job?: string;
  JobId: number;
  DeliveryDate: string;
  Total: number;
  Deposit: number;
  Balance: number;
}
