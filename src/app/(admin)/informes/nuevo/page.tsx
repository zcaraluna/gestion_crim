'use client';

import React, { Suspense } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import FormularioRecepcionPedido from '@/components/informes/FormularioRecepcionPedido';

export default function NuevoInformePage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Nuevo Informe Criminalístico" />
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <Suspense fallback={
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando formulario...</p>
            </div>
          </div>
        }>
          <FormularioRecepcionPedido />
        </Suspense>
      </div>
    </div>
  );
}

