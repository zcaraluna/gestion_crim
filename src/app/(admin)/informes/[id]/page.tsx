'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Button from '@/components/ui/button/Button';
import Badge from '@/components/ui/badge/Badge';
import { EstadoInforme } from '@prisma/client';
import { formatearFechaEspañol, formatearHora, formatearFechaDDMMAAAA, formatearNumeroTelefono } from '@/lib/utils';

interface Informe {
  id: string;
  numeroInforme: string | null;
  estado: EstadoInforme;
  fechaRecepcion: Date | null;
  horaRecepcion: string | null;
  numeroTelefonoRecepcion: string | null;
  gradoSolicitante: string | null;
  nombreSolicitante: string | null;
  generoSolicitante: string | null;
  categoriaComisaria: string | null;
  numeroComisaria: string | null;
  departamentoComisaria: string | null;
  ciudadComisaria: string | null;
  comisariaTextoCompleto: string | null;
  tipoHecho: string | null;
  jurisdiccion: string | null;
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
  usuarioAsignado: {
    id: string;
    nombre: string;
    apellido: string;
    grado: string | null;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

function InformeDetalleContent() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const informeId = params.id as string;
  
  const [informe, setInforme] = useState<Informe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
      return;
    }

    if (user && informeId) {
      cargarInforme();
    }
  }, [user, authLoading, informeId]);

  const cargarInforme = async () => {
    if (!user?.id || !informeId) return;

    try {
      setLoading(true);
      setError('');

      const response = await fetch(`/api/informes/${informeId}?userId=${user.id}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Error al cargar el informe');
      }

      setInforme(data.informe);
    } catch (err) {
      console.error('Error cargando informe:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar el informe');
    } finally {
      setLoading(false);
    }
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
      <Badge color={estadoData.color} size="md">
        {estadoData.label}
      </Badge>
    );
  };

  const generarParrafoRecepcion = () => {
    if (!informe) return '';

    const fechaTexto = informe.fechaRecepcion 
      ? formatearFechaEspañol(new Date(informe.fechaRecepcion))
      : '';
    const horaTexto = informe.horaRecepcion 
      ? formatearHora(informe.horaRecepcion)
      : '';
    const numeroTel = formatearNumeroTelefono(informe.numeroTelefonoRecepcion);
    const nombreOficina = informe.oficina.nombre;
    const gradoSolicitante = informe.gradoSolicitante || '';
    const nombreSolicitante = informe.nombreSolicitante || '';
    const generoSolicitante = informe.generoSolicitante || 'masculino';
    const comisaria = informe.comisariaTextoCompleto || '';
    const tipoHecho = informe.tipoHecho || '';

    if (!fechaTexto || !horaTexto || !gradoSolicitante || !nombreSolicitante || !comisaria || !tipoHecho) {
      return 'Información incompleta para generar el párrafo.';
    }

    // Determinar el artículo según el género: "del" para masculino, "de la" para femenino
    const articuloGenero = generoSolicitante === 'femenino' ? 'de la' : 'del';

    // El tipoHecho ya viene formateado desde la base de datos (con "SUPUESTO" para predefinidos, sin "SUPUESTO" para "otro")
    return `En fecha ${fechaTexto}, siendo las ${horaTexto}, se recepcionó una llamada telefónica en ${numeroTel} la Guardia de ${nombreOficina}, por parte ${articuloGenero} ${gradoSolicitante} ${nombreSolicitante}, personal de ${comisaria}, por la que solicita la constitución de personal de este Departamento para realizar procedimiento en relación a un ${tipoHecho}, en la jurisdicción de dicha dependencia policial, por lo que se da inmediato cumplimiento al pedido constituyéndose personal de este Departamento, conforme a lo dispuesto en el Título I, Art. 6°, numerales 4, 5, 6, 18, 28, 29 y 30 de la Ley 7280/2024 – De Reforma y Modernización de la Policía Nacional, concordante con el Art. 297, numeral 8 de la Ley 1286/1998 – Código Procesal Penal.`;
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando informe...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Error" />
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <Button
            onClick={() => router.push('/informes')}
            className="mt-4"
          >
            Volver al listado
          </Button>
        </div>
      </div>
    );
  }

  if (!informe) {
    return null;
  }

  const parrafoRecepcion = generarParrafoRecepcion();

  return (
    <div>
      <PageBreadcrumb pageTitle={`Informe ${informe.numeroInforme || informe.id}`} />
      
      <div className="space-y-6">
        {/* Header del informe */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
                Informe {informe.numeroInforme || 'Sin número'}
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Creado el {formatearFechaDDMMAAAA(new Date(informe.createdAt))}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {getEstadoBadge(informe.estado)}
              <Button
                variant="outline"
                onClick={() => router.push('/informes')}
              >
                Volver al listado
              </Button>
            </div>
          </div>
        </div>

        {/* Información general */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
            Información General
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Departamento</p>
              <p className="mt-1 text-gray-800 dark:text-white/90">{informe.departamento.nombre}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Oficina</p>
              <p className="mt-1 text-gray-800 dark:text-white/90">{informe.oficina.nombre}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Creado por</p>
              <p className="mt-1 text-gray-800 dark:text-white/90">
                {informe.usuarioCreador.grado && `${informe.usuarioCreador.grado} `}
                {informe.usuarioCreador.nombre} {informe.usuarioCreador.apellido}
              </p>
            </div>
            {informe.usuarioAsignado && (
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Asignado a</p>
                <p className="mt-1 text-gray-800 dark:text-white/90">
                  {informe.usuarioAsignado.grado && `${informe.usuarioAsignado.grado} `}
                  {informe.usuarioAsignado.nombre} {informe.usuarioAsignado.apellido}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recepción del Pedido */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
            Recepción del Pedido
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha de Recepción</p>
                <p className="mt-1 text-gray-800 dark:text-white/90">
                  {informe.fechaRecepcion 
                    ? formatearFechaEspañol(new Date(informe.fechaRecepcion))
                    : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Hora de Recepción</p>
                <p className="mt-1 text-gray-800 dark:text-white/90">
                  {informe.horaRecepcion ? formatearHora(informe.horaRecepcion) : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Número Telefónico</p>
                <p className="mt-1 text-gray-800 dark:text-white/90">
                  {informe.numeroTelefonoRecepcion || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tipo de Hecho</p>
                <p className="mt-1 text-gray-800 dark:text-white/90">
                  {informe.tipoHecho || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Solicitante</p>
                <p className="mt-1 text-gray-800 dark:text-white/90">
                  {informe.gradoSolicitante && `${informe.gradoSolicitante} `}
                  {informe.nombreSolicitante || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Comisaría</p>
                <p className="mt-1 text-gray-800 dark:text-white/90">
                  {informe.comisariaTextoCompleto || '-'}
                </p>
              </div>
            </div>

            {/* Párrafo completo */}
            {parrafoRecepcion && (
              <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Párrafo de Recepción
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {parrafoRecepcion}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InformeDetallePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    }>
      <InformeDetalleContent />
    </Suspense>
  );
}

