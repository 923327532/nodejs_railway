'use client';

import './globals.css';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '@/lib/api';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Mi Tienda</title>
      </head>
      <body>
        <header className="header">
          <Link href="/" className="logo">Mi Tienda</Link>
          <nav className="nav">
            {loading ? null : user ? (
              <>
                <span className="user-name">Hola, {user.nombre}</span>
                {user.role === 'ADMIN' && (
                  <Link href="/admin" className="btn btn-admin">Admin</Link>
                )}
                <button onClick={handleLogout} className="btn btn-logout">Cerrar Sesion</button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-login">Iniciar Sesion</Link>
                <Link href="/register" className="btn btn-register">Registrarse</Link>
              </>
            )}
          </nav>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
