'use client';

import React, { useEffect, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { getRolLabel, getRedirectPathByRole, requiresOfficeSelection, requiresDepartmentSelection } from "@/lib/roles";
import { Rol } from "@prisma/client";

function DashboardContent() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/signin');
      return;
    }

    // Si el usuario está cargado, verificar si necesita pasar por pre-portales
    if (user && !isLoading) {
      const rol = user.rol as Rol;

      // Verificar si ya hay una selección guardada en localStorage o en los parámetros de búsqueda
      const currentSession = localStorage.getItem('user_session');
      let sessionData = null;
      if (currentSession) {
        try {
          sessionData = JSON.parse(currentSession);
        } catch (e) {
          // Ignorar error de parseo
        }
      }

      const departamentoIdFromParams = searchParams.get('departamentoId');
      const oficinaIdFromParams = searchParams.get('oficinaId');
      const selectedDepartamentoId = sessionData?.selectedDepartamentoId || departamentoIdFromParams;
      const selectedOficinaId = sessionData?.selectedOficinaId || oficinaIdFromParams;

      // Supervisor Regional: necesita seleccionar oficina si no tiene una, luego departamento
      if (rol === Rol.SUPERVISOR_REGIONAL) {
        // Si no tiene oficina asignada en el usuario ni seleccionada, debe seleccionar oficina primero
        if (!user.oficinaId && !selectedOficinaId) {
          router.push('/select-office');
          return;
        }
        // Si tiene oficina pero no departamento, ir a select-department
        if ((user.oficinaId || selectedOficinaId) && !selectedDepartamentoId) {
          const oficinaIdToUse = selectedOficinaId || user.oficinaId;
          router.push(`/select-department?oficinaId=${oficinaIdToUse}`);
          return;
        }
        // Si ya tiene selección, actualizar localStorage con los parámetros de URL si existen
        if (departamentoIdFromParams && sessionData) {
          sessionData.selectedDepartamentoId = departamentoIdFromParams;
          // Si hay oficinaId en params, también actualizarlo
          if (oficinaIdFromParams) {
            sessionData.selectedOficinaId = oficinaIdFromParams;
          } else if (user.oficinaId) {
            // Si no hay en params pero sí en user, usar esa
            sessionData.selectedOficinaId = user.oficinaId;
          }
          localStorage.setItem('user_session', JSON.stringify(sessionData));
        }
        return;
      }

      // Supervisor General o Admin: deben ir a select-office primero solo si no tienen selección
      if (requiresOfficeSelection(rol)) {
        // Verificar si ya tienen oficina Y departamento seleccionados
        if (!selectedOficinaId || !selectedDepartamentoId) {
          // Si no tienen oficina, ir a select-office
          if (!selectedOficinaId) {
            router.push('/select-office');
            return;
          }
          // Si tienen oficina pero no departamento, ir a select-department
          if (selectedOficinaId && !selectedDepartamentoId) {
            router.push(`/select-department?oficinaId=${selectedOficinaId}`);
            return;
          }
        }
        // Si ya tiene selección, actualizar localStorage con los parámetros de URL si existen
        if ((oficinaIdFromParams || departamentoIdFromParams) && sessionData) {
          if (oficinaIdFromParams) {
            sessionData.selectedOficinaId = oficinaIdFromParams;
            const oficinaNombre = sessionData.selectedOficinaNombre || user.oficinaNombre;
            sessionData.selectedOficinaNombre = oficinaNombre;
          }
          if (departamentoIdFromParams) {
            sessionData.selectedDepartamentoId = departamentoIdFromParams;
            const departamentoNombre = sessionData.selectedDepartamentoNombre || user.departamentoNombre;
            sessionData.selectedDepartamentoNombre = departamentoNombre;
          }
          localStorage.setItem('user_session', JSON.stringify(sessionData));
        }
        return;
      }
    }
  }, [isLoading, isAuthenticated, user, router, searchParams]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-2">
            Bienvenido, {user.nombre} {user.apellido}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Sistema de gestión de informes y notas de la Dirección de Criminalística
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Departamento</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white/90 mt-1">
                {(() => {
                  const sessionData = (() => {
                    try {
                      const currentSession = localStorage.getItem('user_session');
                      return currentSession ? JSON.parse(currentSession) : null;
                    } catch {
                      return null;
                    }
                  })();
                  return sessionData?.selectedDepartamentoNombre || user.departamentoNombre || 'No asignado';
                })()}
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Oficina</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white/90 mt-1">
                {(() => {
                  const sessionData = (() => {
                    try {
                      const currentSession = localStorage.getItem('user_session');
                      return currentSession ? JSON.parse(currentSession) : null;
                    } catch {
                      return null;
                    }
                  })();
                  return sessionData?.selectedOficinaNombre || user.oficinaNombre || 'No asignada';
                })()}
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Rol</p>
              <p className="text-lg font-semibold text-gray-800 dark:text-white/90 mt-1">
                {getRolLabel(user.rol)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
