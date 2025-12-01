'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';

interface Departamento {
  id: string;
  nombre: string;
  codigo: string | null;
}

interface Oficina {
  id: string;
  nombre: string;
}

function SelectDepartmentContent() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const oficinaId = searchParams.get('oficinaId');
  
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [oficina, setOficina] = useState<Oficina | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/signin');
      return;
    }

    if (user) {
      // Supervisor Regional: necesita seleccionar oficina si no tiene una asignada
      if (user.rol === 'SUPERVISOR_REGIONAL') {
        // Si tiene oficina asignada, usar esa
        if (user.oficinaId) {
          fetchDepartamentos(user.oficinaId);
          setOficina({ id: user.oficinaId, nombre: user.oficinaNombre || '' });
        } else if (oficinaId) {
          // Si no tiene oficina pero viene en params, usar esa
          fetchOficinaAndDepartamentos(oficinaId);
        } else {
          // Si no tiene oficina, necesita seleccionar una primero
          // Pero según la lógica actual, SUPERVISOR_REGIONAL debería tener una oficina
          // Por ahora redirigimos a select-office para seleccionar
          router.push('/select-office');
        }
      }
      // Supervisor General o Admin: usar oficinaId del query param
      else if (user.rol === 'SUPERVISOR_GENERAL' || user.rol === 'ADMIN') {
        if (oficinaId) {
          fetchOficinaAndDepartamentos(oficinaId);
        } else {
          // Si no hay oficinaId en los params, redirigir a select-office
          router.push('/select-office');
        }
      }
      // Otros roles: redirigir al dashboard
      else {
        router.push('/');
      }
    }
  }, [authLoading, isAuthenticated, user, router, oficinaId]);

  const fetchOficinaAndDepartamentos = async (ofId: string) => {
    try {
      // Obtener oficina
      const oficinaResponse = await fetch('/api/oficinas');
      if (!oficinaResponse.ok) throw new Error('Error al cargar oficina');
      const oficinaData = await oficinaResponse.json();
      const foundOficina = oficinaData.oficinas.find((o: Oficina) => o.id === ofId);
      
      if (!foundOficina) {
        setError('Oficina no encontrada');
        setLoading(false);
        return;
      }
      
      setOficina(foundOficina);
      
      // Obtener departamentos
      await fetchDepartamentos(ofId);
    } catch (err) {
      setError('Error al cargar la información. Por favor, intente nuevamente.');
      console.error('Error:', err);
      setLoading(false);
    }
  };

  const fetchDepartamentos = async (ofId: string) => {
    try {
      const response = await fetch(`/api/oficinas/${ofId}/departamentos`);
      if (!response.ok) throw new Error('Error al cargar departamentos');
      const data = await response.json();
      setDepartamentos(data.departamentos || []);
    } catch (err) {
      setError('Error al cargar los departamentos. Por favor, intente nuevamente.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDepartment = (departamentoId: string, departamentoNombre: string) => {
    // Guardar selección en localStorage para el contexto
    const currentSession = localStorage.getItem('user_session');
    if (currentSession && user) {
      const sessionData = JSON.parse(currentSession);
      sessionData.selectedOficinaId = oficinaId || user.oficinaId || null;
      sessionData.selectedOficinaNombre = oficina?.nombre || user.oficinaNombre || null;
      sessionData.selectedDepartamentoId = departamentoId;
      sessionData.selectedDepartamentoNombre = departamentoNombre;
      localStorage.setItem('user_session', JSON.stringify(sessionData));
    }
    
    // Redirigir al dashboard con los parámetros
    const finalOficinaId = oficinaId || user?.oficinaId;
    if (finalOficinaId) {
      router.push(`/?oficinaId=${finalOficinaId}&departamentoId=${departamentoId}`);
    } else {
      router.push(`/?departamentoId=${departamentoId}`);
    }
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
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-2">
              Seleccionar Departamento
            </h1>
            {oficina && (
              <p className="text-gray-600 dark:text-gray-400">
                Oficina: <span className="font-semibold">{oficina.nombre}</span>
              </p>
            )}
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Seleccione el departamento al que desea acceder
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departamentos.map((departamento) => (
              <button
                key={departamento.id}
                onClick={() => handleSelectDepartment(departamento.id, departamento.nombre)}
                className="p-6 text-left rounded-lg border-2 border-gray-200 hover:border-brand-500 hover:bg-brand-50 dark:border-gray-700 dark:hover:border-brand-500 dark:hover:bg-brand-900/20 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-1">
                  {departamento.nombre}
                </h3>
                {departamento.codigo && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {departamento.codigo}
                  </p>
                )}
              </button>
            ))}
          </div>

          {departamentos.length === 0 && !loading && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No hay departamentos disponibles
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SelectDepartment() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    }>
      <SelectDepartmentContent />
    </Suspense>
  );
}
