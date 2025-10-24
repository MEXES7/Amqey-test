export interface Product {
  _id: string;
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  inStock: boolean;
}

export interface ProductFormData {
  _id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image?: string;
  inStock: boolean;
}
