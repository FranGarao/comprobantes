export interface Customer {
  Id: number;
  Name: string;
  LastName: string;
  Email: string;
  Phone: string;
}

export interface CustomerResponse {
  message: string;
  customer: Customer;
};

export interface CustomersResponse {
  message: string;
  customers: Customer[];
};