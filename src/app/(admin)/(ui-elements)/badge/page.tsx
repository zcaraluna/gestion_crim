import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Badge from "@/components/ui/badge/Badge";
import { PlusIcon } from "@/icons";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Insignias | Sistema de Gestión Criminalística",
  description:
    "Página de insignias del sistema de gestión criminalística",
};

export default function BadgePage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Insignias" />
      <div className="space-y-5 sm:space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-6 py-5">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              Con Fondo Claro
            </h3>
          </div>
          <div className="p-6 border-t border-gray-100 dark:border-gray-800 xl:p-10">
            <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
              <Badge variant="light" color="primary">
                Primario
              </Badge>
              <Badge variant="light" color="success">
                Éxito
              </Badge>
              <Badge variant="light" color="error">
                Error
              </Badge>
              <Badge variant="light" color="warning">
                Advertencia
              </Badge>
              <Badge variant="light" color="info">
                Información
              </Badge>
              <Badge variant="light" color="light">
                Claro
              </Badge>
              <Badge variant="light" color="dark">
                Oscuro
              </Badge>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-6 py-5">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              Con Fondo Sólido
            </h3>
          </div>
          <div className="p-6 border-t border-gray-100 dark:border-gray-800 xl:p-10">
            <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
              <Badge variant="solid" color="primary">
                Primario
              </Badge>
              <Badge variant="solid" color="success">
                Éxito
              </Badge>
              <Badge variant="solid" color="error">
                Error
              </Badge>
              <Badge variant="solid" color="warning">
                Advertencia
              </Badge>
              <Badge variant="solid" color="info">
                Información
              </Badge>
              <Badge variant="solid" color="light">
                Claro
              </Badge>
              <Badge variant="solid" color="dark">
                Oscuro
              </Badge>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-6 py-5">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              Fondo Claro con Icono Izquierdo
            </h3>
          </div>
          <div className="p-6 border-t border-gray-100 dark:border-gray-800 xl:p-10">
            <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
              <Badge variant="light" color="primary" startIcon={<PlusIcon />}>
                Primario
              </Badge>
              <Badge variant="light" color="success" startIcon={<PlusIcon />}>
                Éxito
              </Badge>
              <Badge variant="light" color="error" startIcon={<PlusIcon />}>
                Error
              </Badge>
              <Badge variant="light" color="warning" startIcon={<PlusIcon />}>
                Advertencia
              </Badge>
              <Badge variant="light" color="info" startIcon={<PlusIcon />}>
                Información
              </Badge>
              <Badge variant="light" color="light" startIcon={<PlusIcon />}>
                Claro
              </Badge>
              <Badge variant="light" color="dark" startIcon={<PlusIcon />}>
                Oscuro
              </Badge>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-6 py-5">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              Fondo Sólido con Icono Izquierdo
            </h3>
          </div>
          <div className="p-6 border-t border-gray-100 dark:border-gray-800 xl:p-10">
            <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
              <Badge variant="solid" color="primary" startIcon={<PlusIcon />}>
                Primario
              </Badge>
              <Badge variant="solid" color="success" startIcon={<PlusIcon />}>
                Éxito
              </Badge>
              <Badge variant="solid" color="error" startIcon={<PlusIcon />}>
                Error
              </Badge>
              <Badge variant="solid" color="warning" startIcon={<PlusIcon />}>
                Advertencia
              </Badge>
              <Badge variant="solid" color="info" startIcon={<PlusIcon />}>
                Información
              </Badge>
              <Badge variant="solid" color="light" startIcon={<PlusIcon />}>
                Claro
              </Badge>
              <Badge variant="solid" color="dark" startIcon={<PlusIcon />}>
                Oscuro
              </Badge>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-6 py-5">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              Fondo Claro con Icono Derecho
            </h3>
          </div>
          <div className="p-6 border-t border-gray-100 dark:border-gray-800 xl:p-10">
            <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
              <Badge variant="light" color="primary" endIcon={<PlusIcon />}>
                Primario
              </Badge>
              <Badge variant="light" color="success" endIcon={<PlusIcon />}>
                Éxito
              </Badge>
              <Badge variant="light" color="error" endIcon={<PlusIcon />}>
                Error
              </Badge>
              <Badge variant="light" color="warning" endIcon={<PlusIcon />}>
                Advertencia
              </Badge>
              <Badge variant="light" color="info" endIcon={<PlusIcon />}>
                Información
              </Badge>
              <Badge variant="light" color="light" endIcon={<PlusIcon />}>
                Claro
              </Badge>
              <Badge variant="light" color="dark" endIcon={<PlusIcon />}>
                Oscuro
              </Badge>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-6 py-5">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              Fondo Sólido con Icono Derecho
            </h3>
          </div>
          <div className="p-6 border-t border-gray-100 dark:border-gray-800 xl:p-10">
            <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
              <Badge variant="solid" color="primary" endIcon={<PlusIcon />}>
                Primario
              </Badge>
              <Badge variant="solid" color="success" endIcon={<PlusIcon />}>
                Éxito
              </Badge>
              <Badge variant="solid" color="error" endIcon={<PlusIcon />}>
                Error
              </Badge>
              <Badge variant="solid" color="warning" endIcon={<PlusIcon />}>
                Advertencia
              </Badge>
              <Badge variant="solid" color="info" endIcon={<PlusIcon />}>
                Información
              </Badge>
              <Badge variant="solid" color="light" endIcon={<PlusIcon />}>
                Claro
              </Badge>
              <Badge variant="solid" color="dark" endIcon={<PlusIcon />}>
                Oscuro
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
