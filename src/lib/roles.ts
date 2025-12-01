import { Rol } from '@prisma/client';

/**
 * Determina la ruta de redirección según el rol del usuario después del login
 */
export function getRedirectPathByRole(rol: Rol): string {
  switch (rol) {
    case Rol.OPERADOR:
    case Rol.SUPERVISOR_DEPARTAMENTAL:
      // Redirigir directamente al panel de control de su departamento/oficina
      return '/';
    
    case Rol.SUPERVISOR_REGIONAL:
      // Redirigir al dashboard que manejará la lógica (oficina si no tiene, luego departamento)
      return '/';
    
    case Rol.SUPERVISOR_GENERAL:
    case Rol.ADMIN:
      // Redirigir al pre-portal para seleccionar oficina y luego departamento
      return '/select-office';
    
    default:
      return '/';
  }
}

/**
 * Verifica si un rol requiere selección de oficina antes de acceder
 */
export function requiresOfficeSelection(rol: Rol): boolean {
  return rol === Rol.SUPERVISOR_GENERAL || rol === Rol.ADMIN;
}

/**
 * Verifica si un rol requiere selección de departamento antes de acceder
 */
export function requiresDepartmentSelection(rol: Rol): boolean {
  return rol === Rol.SUPERVISOR_REGIONAL || rol === Rol.SUPERVISOR_GENERAL || rol === Rol.ADMIN;
}

/**
 * Obtiene el label en español para un rol
 */
export function getRolLabel(rol: Rol): string {
  switch (rol) {
    case Rol.OPERADOR:
      return 'Operador';
    case Rol.SUPERVISOR_DEPARTAMENTAL:
      return 'Supervisor Departamental';
    case Rol.SUPERVISOR_REGIONAL:
      return 'Supervisor Regional';
    case Rol.SUPERVISOR_GENERAL:
      return 'Supervisor General';
    case Rol.ADMIN:
      return 'Administrador';
    default:
      return rol;
  }
}

