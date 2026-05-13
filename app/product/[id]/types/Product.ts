export interface ProductSupplier {
    productID: number;
    supplierID: number;
    supplierName: string;
}

export interface Store {
    storeID: number;
    storeName: string;
}

export interface Product {
    productID: number;
    productName: string;
    categoryID: number;
    categoryName: string;
    price: number;
    image?: string;
    quantity: number;
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