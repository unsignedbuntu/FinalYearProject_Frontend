export interface ProductSupplier {
    productID: number;
    supplierID: number;
    supplierName: string;
}

export interface Store {
    storeID: number;
    storeName: string;
}

export interface Category {
    categoryID: number;
    categoryName: string;
    storeID?: number;
}

export interface Product {
    productID: number;
    productName: string;
    categoryID: number;
    price: number;
    image?: string;
    quantity: number;
    stock?: number;
    description?: string;
    specs?: Record<string, string>;
    reviews?: Review[];
    additionalImages?: string[];
}

export interface Review {
    rating: number;
    comment: string;
    userName: string;
    date: string;
    avatar: string;
}