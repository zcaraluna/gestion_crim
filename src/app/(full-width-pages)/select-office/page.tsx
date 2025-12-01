'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface Oficina {
  id: string;
  nombre: string;
  codigo: string | null;
  tipo: string;
}

export default function SelectOffice() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [oficinas, setOficinas] = useState<Oficina[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/signin');
      return;
    }

    if (user) {
      // Permitir acceso a SUPERVISOR_REGIONAL, SUPERVISOR_GENERAL y ADMIN
      if (user.rol === 'SUPERVISOR_REGIONAL' || user.rol === 'SUPERVISOR_GENERAL' || user.rol === 'ADMIN') {
        fetchOficinas();
      } else {
        router.push('/');
      }
    }
  }, [authLoading, isAuthenticated, user, router]);

  const fetchOficinas = async () => {
    try {
      const response = await fetch('/api/oficinas');
      if (!response.ok) throw new Error('Error al cargar oficinas');
      const data = await response.json();
      setOficinas(data.oficinas || []);
    } catch (err) {
      setError('Error al cargar las oficinas. Por favor, intente nuevamente.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOffice = (oficinaId: string) => {
    router.push(`/select-department?oficinaId=${oficinaId}`);
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-4xl">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-2">
            Seleccionar Oficina
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Seleccione la oficina a la que desea acceder
          </p>

          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {oficinas.map((oficina) => (
              <button
                key={oficina.id}
                onClick={() => handleSelectOffice(oficina.id)}
                className="p-6 text-left rounded-lg border-2 border-gray-200 hover:border-brand-500 hover:bg-brand-50 dark:border-gray-700 dark:hover:border-brand-500 dark:hover:bg-brand-900/20 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-1">
                  {oficina.nombre}
                </h3>
                {oficina.codigo && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {oficina.codigo}
                  </p>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {oficina.tipo}
                </p>
              </button>
            ))}
          </div>

          {oficinas.length === 0 && !loading && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No hay oficinas disponibles
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

