'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProducts, getCategories, Product, Category } from '@/lib/api';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const loadCategories = async () => {
    const res = await getCategories();
    if (res.success) setCategories(res.data);
  };

  const loadProducts = async () => {
    setLoading(true);
    const res = await getProducts(selectedCategory || undefined);
    if (res.success) setProducts(res.data);
    setLoading(false);
  };

  return (
    <>
      <h2>Productos</h2>
      <div className="filters">
        <label htmlFor="category">Filtrar por categoria:</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Todas las categorias</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading">Cargando productos...</div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <p>No hay productos disponibles</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <Link href={`/products/${product.id}`}>
                <img
                  src={product.imageUrl || 'https://via.placeholder.com/300x200?text=Sin+Imagen'}
                  alt={product.nombre}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Sin+Imagen';
                  }}
                />
                <div className="info">
                  <h3>{product.nombre}</h3>
                  <div className="price">${Number(product.precio).toFixed(2)}</div>
                  <div className="category">
                    {product.category?.nombre || 'Sin categoria'}
                  </div>
                  {product.descripcion && (
                    <div className="description">
                      {product.descripcion.substring(0, 100)}...
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
