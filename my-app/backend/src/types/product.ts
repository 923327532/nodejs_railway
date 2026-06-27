export interface Product {
  id: number;
  nombre: string;
  precio: number;
  descripcion?: string;
  imageUrl?: string;
  categoryId?: number;
  category?: Category;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: number;
  nombre: string;
  descripcion?: string;
  products?: Product[];
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: number;
  nombre: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  } | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
