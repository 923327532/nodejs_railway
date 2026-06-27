'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getProductById, Product } from '@/lib/api';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (id) loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    const res = await getProductById(id);
    if (res.success) {
      setProduct(res.data);
    } else {
      setNotFound(true);
    }
    setLoading(false);
  };

  if (loading) return <div className="loading">Cargando producto...</div>;
  if (notFound) return <div className="loading">Producto no encontrado</div>;
  if (!product) return null;

  const imageUrl = product.imageUrl || 'https://via.placeholder.com/800x400?text=Sin+Imagen';

  return (
    <>
      <Link href="/" className="back-link">&larr; Volver a la tienda</Link>
      <div className="product-detail">
        <img
          src={imageUrl}
          alt={product.nombre}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Sin+Imagen';
          }}
        />
        <div className="info">
          <h2>{product.nombre}</h2>
          <div className="price-lg">${Number(product.precio).toFixed(2)}</div>
          <div className="category-lg">
            Categoria: {product.category?.nombre || 'Sin categoria'}
          </div>
          <div className="desc-lg">
            {product.descripcion || 'Sin descripcion'}
          </div>
        </div>
      </div>
    </>
  );
}
