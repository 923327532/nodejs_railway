const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

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
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthData {
  user: User;
  token: string;
}

// Auth
export async function register(nombre: string, email: string, password: string): Promise<ApiResponse<AuthData>> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, email, password }),
  });
  return res.json();
}

export async function login(email: string, password: string): Promise<ApiResponse<AuthData>> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function getProfile(token: string): Promise<ApiResponse<User>> {
  const res = await fetch(`${API_URL}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

// Products
export async function getProducts(categoryId?: string): Promise<ApiResponse<Product[]>> {
  let url = `${API_URL}/products`;
  if (categoryId) url += `?categoryId=${categoryId}`;
  const res = await fetch(url);
  return res.json();
}

export async function getProductById(id: string): Promise<ApiResponse<Product>> {
  const res = await fetch(`${API_URL}/products/${id}`);
  return res.json();
}

export async function createProduct(token: string, data: Partial<Product>): Promise<ApiResponse<Product>> {
  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateProduct(token: string, id: number, data: Partial<Product>): Promise<ApiResponse<Product>> {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteProduct(token: string, id: number): Promise<ApiResponse<null>> {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

// Categories
export async function getCategories(): Promise<ApiResponse<Category[]>> {
  const res = await fetch(`${API_URL}/categories`);
  return res.json();
}

export async function getCategoryById(id: string): Promise<ApiResponse<Category>> {
  const res = await fetch(`${API_URL}/categories/${id}`);
  return res.json();
}

export async function createCategory(token: string, data: Partial<Category>): Promise<ApiResponse<Category>> {
  const res = await fetch(`${API_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateCategory(token: string, id: number, data: Partial<Category>): Promise<ApiResponse<Category>> {
  const res = await fetch(`${API_URL}/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteCategory(token: string, id: number): Promise<ApiResponse<null>> {
  const res = await fetch(`${API_URL}/categories/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
