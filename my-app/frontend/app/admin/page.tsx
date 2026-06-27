'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  getProducts, getCategories, createProduct, updateProduct, deleteProduct,
  createCategory, updateCategory, deleteCategory,
  Product, Category, User
} from '@/lib/api';

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  const router = useRouter();

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> & { id?: number }>({});
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> & { id?: number }>({});

  useEffect(() => {
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    if (!t || !u) { router.push('/login'); return; }
    const userData = JSON.parse(u);
    if (userData.role !== 'ADMIN') { router.push('/'); return; }
    setToken(t); setUser(userData);
    loadProducts(); loadCategories();
  }, []);

  const loadProducts = async () => {
    const res = await getProducts();
    if (res.success) setProducts(res.data);
  };

  const loadCategories = async () => {
    const res = await getCategories();
    if (res.success) setCategories(res.data);
  };

  const openProductModal = (product?: Product) => {
    setEditingProduct(product ? { ...product } : { nombre: '', precio: 0, descripcion: '', imageUrl: '', categoryId: undefined });
    setShowProductModal(true);
  };

  const saveProduct = async () => {
    const data = { nombre: editingProduct.nombre, precio: editingProduct.precio, descripcion: editingProduct.descripcion || '', imageUrl: editingProduct.imageUrl || '', categoryId: editingProduct.categoryId || undefined };
    const res = editingProduct.id ? await updateProduct(token, editingProduct.id, data) : await createProduct(token, data);
    if (res.success) { setShowProductModal(false); loadProducts(); }
    else alert(res.message || 'Error');
  };

  const openCategoryModal = (category?: Category) => {
    setEditingCategory(category ? { ...category } : { nombre: '', descripcion: '' });
    setShowCategoryModal(true);
  };

  const saveCategory = async () => {
    const data = { nombre: editingCategory.nombre, descripcion: editingCategory.descripcion || '' };
    const res = editingCategory.id
      ? await updateCategory(token, editingCategory.id, data)
      : await createCategory(token, data);
    if (res.success) { setShowCategoryModal(false); loadCategories(); }
    else alert(res.message || 'Error');
  };

  const removeProduct = async (id: number) => {
    if (!confirm('Eliminar producto?')) return;
    const res = await deleteProduct(token, id);
    if (res.success) loadProducts();
  };

  const removeCategory = async (id: number) => {
    if (!confirm('Eliminar categoria?')) return;
    const res = await deleteCategory(token, id);
    if (res.success) loadCategories();
  };

  if (!user) return <div className="loading">Verificando acceso...</div>;

  return (
    <>
      <h2>Panel de Administracion</h2>
      <div className="tabs">
        <button className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
          Productos ({products.length})
        </button>
        <button className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>
          Categorias ({categories.length})
        </button>
      </div>

      {activeTab === 'products' && (
        <>
          <button className="btn btn-success" onClick={() => openProductModal()} style={{ marginBottom: '1rem' }}>+ Nuevo Producto</button>
          <table>
            <thead><tr><th>ID</th><th>Nombre</th><th>Precio</th><th>Categoria</th><th>Acciones</th></tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td><td>{p.nombre}</td><td>${Number(p.precio).toFixed(2)}</td>
                  <td>{p.category?.nombre || '-'}</td>
                  <td>
                    <button className="btn btn-warning" onClick={() => openProductModal(p)} style={{ marginRight: '0.5rem' }}>Editar</button>
                    <button className="btn btn-danger" onClick={() => removeProduct(p.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {activeTab === 'categories' && (
        <>
          <button className="btn btn-success" onClick={() => openCategoryModal()} style={{ marginBottom: '1rem' }}>+ Nueva Categoria</button>
          <table>
            <thead><tr><th>ID</th><th>Nombre</th><th>Descripcion</th><th>Acciones</th></tr></thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td><td>{c.nombre}</td><td>{c.descripcion || '-'}</td>
                  <td>
                    <button className="btn btn-warning" onClick={() => openCategoryModal(c)} style={{ marginRight: '0.5rem' }}>Editar</button>
                    <button className="btn btn-danger" onClick={() => removeCategory(c.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {showProductModal && (
        <div className="modal-overlay" onClick={() => setShowProductModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingProduct.id ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            <div className="form-group">
              <label>Nombre</label>
              <input type="text" value={editingProduct.nombre || ''} onChange={(e) => setEditingProduct({ ...editingProduct, nombre: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Precio</label>
              <input type="number" step="0.01" value={editingProduct.precio || 0} onChange={(e) => setEditingProduct({ ...editingProduct, precio: parseFloat(e.target.value) })} required />
            </div>
            <div className="form-group">
              <label>Descripcion</label>
              <textarea rows={3} value={editingProduct.descripcion || ''} onChange={(e) => setEditingProduct({ ...editingProduct, descripcion: e.target.value })} />
            </div>
            <div className="form-group">
              <label>URL Imagen</label>
              <input type="url" value={editingProduct.imageUrl || ''} onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Categoria</label>
              <select value={editingProduct.categoryId || ''} onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value ? Number(e.target.value) : undefined })}>
                <option value="">Sin categoria</option>
                {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.nombre}</option>))}
              </select>
            </div>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={saveProduct}>Guardar</button>
              <button className="btn btn-danger" onClick={() => setShowProductModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {showCategoryModal && (
        <div className="modal-overlay" onClick={() => setShowCategoryModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingCategory.id ? 'Editar Categoria' : 'Nueva Categoria'}</h2>
            <div className="form-group">
              <label>Nombre</label>
              <input type="text" value={editingCategory.nombre || ''} onChange={(e) => setEditingCategory({ ...editingCategory, nombre: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Descripcion</label>
              <textarea rows={3} value={editingCategory.descripcion || ''} onChange={(e) => setEditingCategory({ ...editingCategory, descripcion: e.target.value })} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={saveCategory}>Guardar</button>
              <button className="btn btn-danger" onClick={() => setShowCategoryModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}


