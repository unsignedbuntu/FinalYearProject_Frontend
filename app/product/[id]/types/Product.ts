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
    storeID?: number;
}

export interface Product {
    productID: number;
    productName: string;
    description?: string;
    price: number;
    stockQuantity: number;
    image?: string;
    categoryID?: number;
    categoryName: string;
    storeID: number;
    storeName?: string;
    supplierName?: string;
    barcode?: string;
    additionalImages?: string[];
    reviews?: Review[];
    specs?: Record<string, string>;
    category?: any;
}

export interface Review {
    rating: number;
    comment: string;
    userName: string;
    date: string;
    avatar?: string;
}