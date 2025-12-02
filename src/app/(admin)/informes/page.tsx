'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Button from '@/components/ui/button/Button';
import { formatearFechaDDMMAAAA } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Badge from '@/components/ui/badge/Badge';
import { EstadoInforme } from '@prisma/client';

interface Informe {
  id: string;
  numeroInforme: string | null;
  estado: EstadoInforme;
  fechaRecepcion: Date | null;
  horaRecepcion: string | null;
  tipoHecho: string | null;
  comisariaTextoCompleto: string | null;
  departamento: {
    id: string;
    nombre: string;
    codigo: string | null;
  };
  oficina: {
    id: string;
    nombre: string;
  };
  usuarioCreador: {
    id: string;
    nombre: string;
    apellido: string;
    grado: string | null;
  };
  createdAt: Date;
}

interface InformesResponse {
  success: boolean;
  informes?: Informe[];
  error?: string;
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

function InformesContent() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [informes, setInformes] = useState<Informe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 50,
    offset: 0,
    hasMore: false,
  });

  const estadoFiltro = searchParams.get('estado') || '';

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
      return;
    }

    if (user) {
      cargarInformes();
    }
  }, [user, authLoading, estadoFiltro]);

  const cargarInformes = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError('');

      const params = new URLSearchParams({
        userId: user.id,
        limit: pagination.limit.toString(),
        offset: pagination.offset.toString(),
      });

      if (estadoFiltro) {
        params.append('estado', estadoFiltro);
      }

      const response = await fetch(`/api/informes?${params.toString()}`);
      const data: InformesResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Error al cargar los informes');
      }

      setInformes(data.informes || []);
      setPagination(data.pagination || {
        total: 0,
        limit: pagination.limit,
        offset: pagination.offset,
        hasMore: false,
      });
    } catch (err) {
      console.error('Error cargando informes:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar los informes');
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha: Date | null) => {
    return formatearFechaDDMMAAAA(fecha);
  };

  const getEstadoBadge = (estado: EstadoInforme) => {
    const estados = {
      BORRADOR: { label: 'Borrador', color: 'warning' as const },
      EN_REVISION: { label: 'En Revisión', color: 'info' as const },
      APROBADO: { label: 'Aprobado', color: 'success' as const },
      RECHAZADO: { label: 'Rechazado', color: 'error' as const },
    };

    const estadoData = estados[estado] || estados.BORRADOR;
    return (
      <Badge color={estadoData.color} size="sm">
        {estadoData.label}
      </Badge>
    );
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando informes...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Informes Criminalísticos" />
      
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Header con botón de crear */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              Listado de Informes
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {pagination.total} informe{pagination.total !== 1 ? 's' : ''} encontrado{pagination.total !== 1 ? 's' : ''}
            </p>
          </div>
          <Button
            type="button"
            onClick={() => {
              const session = localStorage.getItem('user_session');
              if (session) {
                const data = JSON.parse(session);
                const oficinaId = data.selectedOficinaId || data.oficinaId;
                const departamentoId = data.selectedDepartamentoId || data.departamentoId;
                
                if (oficinaId && departamentoId) {
                  router.push(`/informes/nuevo?oficinaId=${oficinaId}&departamentoId=${departamentoId}`);
                } else {
                  router.push('/informes/nuevo');
                }
              } else {
                router.push('/informes/nuevo');
              }
            }}
          >
            + Nuevo Informe
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
            {error}
          </div>
        )}

        {/* Filtros */}
        <div className="mb-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/informes')}
            className={!estadoFiltro ? 'bg-brand-50 dark:bg-brand-900/20' : ''}
          >
            Todos
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/informes?estado=BORRADOR')}
            className={estadoFiltro === 'BORRADOR' ? 'bg-brand-50 dark:bg-brand-900/20' : ''}
          >
            Borradores
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/informes?estado=EN_REVISION')}
            className={estadoFiltro === 'EN_REVISION' ? 'bg-brand-50 dark:bg-brand-900/20' : ''}
          >
            En Revisión
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/informes?estado=APROBADO')}
            className={estadoFiltro === 'APROBADO' ? 'bg-brand-50 dark:bg-brand-900/20' : ''}
          >
            Aprobados
          </Button>
        </div>

        {/* Tabla de informes */}
        {informes.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No se encontraron informes.
            </p>
            <Button
              type="button"
              className="mt-4"
              onClick={() => {
                const session = localStorage.getItem('user_session');
                if (session) {
                  const data = JSON.parse(session);
                  const oficinaId = data.selectedOficinaId || data.oficinaId;
                  const departamentoId = data.selectedDepartamentoId || data.departamentoId;
                  
                  if (oficinaId && departamentoId) {
                    router.push(`/informes/nuevo?oficinaId=${oficinaId}&departamentoId=${departamentoId}`);
                  } else {
                    router.push('/informes/nuevo');
                  }
                } else {
                  router.push('/informes/nuevo');
                }
              }}
            >
              Crear primer informe
            </Button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Número
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Fecha Recepción
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Tipo de Hecho
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Dependencia
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Departamento
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Creado por
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Estado
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {informes.map((informe) => (
                    <TableRow key={informe.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                      <TableCell className="px-5 py-4 text-start">
                        <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {informe.numeroInforme || 'Sin número'}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {formatearFecha(informe.fechaRecepcion)}
                        {informe.horaRecepcion && (
                          <span className="block text-xs text-gray-400">
                            {informe.horaRecepcion}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {informe.tipoHecho || '-'}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {informe.comisariaTextoCompleto 
                          ? informe.comisariaTextoCompleto.replace(/^(el |la )/, '')
                          : '-'}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {informe.departamento.nombre}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {informe.usuarioCreador.grado && `${informe.usuarioCreador.grado} `}
                        {informe.usuarioCreador.nombre} {informe.usuarioCreador.apellido}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        {getEstadoBadge(informe.estado)}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/informes/${informe.id}`)}
                        >
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InformesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    }>
      <InformesContent />
    </Suspense>
  );
}

