export interface Customer {
  id?: number;
  name: string;
  LastName?: string;
  email: string;
  phone: string;
  fullName?: string;
}

export interface CustomerResponse {
  message: string;
  customer: Customer;
};

export interface CustomersResponse {
  message: string;
  customers: Customer[];
};