import { Product } from "../types/Product";

const API_BASE_URL = "http://172.20.10.2:5000/api"; // Replace with your actual API URL

export const api = {
  getProducts: async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error("Failed to fetch product");
    return response.json();
  },

  createProduct: async (form: FormData): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      body: form,
      headers: {
        "Content-Type": "multipart/form-data", // important for file uploads
      },
    });

    if (!response.ok) throw new Error("Failed to create product");
    return response.json();
  },

  updateProduct: async (id: string, form: FormData): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PUT",
      body: form,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Update failed:", response.status, errorText);
      throw new Error("Failed to update product");
    }
    return response.json();
  },

  deleteProduct: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete product");
  },
};
