'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register } from '@/lib/api';

export default function RegisterPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password.length < 6) {
      setError('La contrasena debe tener al menos 6 caracteres');
      return;
    }

    const res = await register(nombre, email, password);
    if (res.success && res.data) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setSuccess('Registro exitoso! Redirigiendo...');
      setTimeout(() => router.push('/'), 1000);
    } else {
      setError(res.message || 'Error al registrarse');
    }
  };

  return (
    <div className="form-container">
      <h1>Crear Cuenta</h1>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input id="nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required placeholder="Tu nombre" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="tu@email.com" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contrasena</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="Minimo 6 caracteres" />
        </div>
        <button type="submit" className="btn btn-success">Registrarse</button>
      </form>
      <div className="form-footer">
        <Link href="/login">Ya tienes cuenta? Inicia sesion</Link>
      </div>
    </div>
  );
}
