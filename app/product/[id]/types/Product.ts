export interface ProductSupplier {
<<<<<<< HEAD
    productSupplierID: number;
    productID: number;
    supplierID: number;
    stock: number;
    supplierName?: string;
    rating?: number;
=======
    productID: number;
    supplierID: number;
    supplierName: string;
>>>>>>> main
}

export interface Store {
    storeID: number;
    storeName: string;
<<<<<<< HEAD
    rating: number;
    userID: number;
}

export interface Category {
    categoryID: number;
    categoryName: string;
    storeID?: number;
=======
>>>>>>> main
}

export interface Product {
    productID: number;
    productName: string;
<<<<<<< HEAD
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
=======
    categoryID: number;
    categoryName: string;
    price: number;
    image?: string;
    quantity: number;
    description?: string;
    specs?: Record<string, string>;
    reviews?: Review[];
    additionalImages?: string[];
>>>>>>> main
}

export interface Review {
    rating: number;
    comment: string;
    userName: string;
    date: string;
<<<<<<< HEAD
    avatar?: string;
=======
    avatar: string;
>>>>>>> main
}