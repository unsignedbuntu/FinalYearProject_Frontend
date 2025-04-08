export interface ProductSupplier {
    productSupplierID: number;
    productID: number;
    supplierID: number;
    stock: number;
    supplierName?: string;
    rating?: number;
}

export interface Store {
    storeID: number;
    storeName: string;
    rating: number;
    userID: number;
}

export interface Category {
    categoryID: number;
    categoryName: string;
}

export interface Product {
    productID: number;
    productName: string;
    description: string;
    price: number;
    quantity: number;
    image?: string;
    categoryID?: number;
    categoryName?: string;
    additionalImages?: string[];
    reviews?: Review[];
    specs?: Record<string, string>;
    stock?: number;
    supplierName?: string;
    category?: any;
}

export interface Review {
    rating: number;
    comment: string;
    userName: string;
    date: string;
    avatar?: string;
}