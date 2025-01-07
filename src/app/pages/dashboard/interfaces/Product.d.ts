export interface Product {
    id?: number;
    name: string;
    price: number;
}

export interface ProductsResponse {
    message: string;
    products: Product[];
}