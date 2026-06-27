'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const res = await login(email, password);
    if (res.success && res.data) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setSuccess('Inicio de sesion exitoso! Redirigiendo...');
      setTimeout(() => router.push('/'), 1000);
    } else {
      setError(res.message || 'Error al iniciar sesion');
    }
  };

  return (
    <div className="form-container">
      <h1>Iniciar Sesion</h1>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="tu@email.com" />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contrasena</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Tu contrasena" />
        </div>
        <button type="submit" className="btn btn-login">Iniciar Sesion</button>
      </form>
      <div className="form-footer">
        <Link href="/register">No tienes cuenta? Registrate</Link>
      </div>
    </div>
  );
}
