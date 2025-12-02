import { prisma } from './prisma';
import { EstadoInforme } from '@prisma/client';

/**
 * Genera el siguiente número de informe para un departamento en un año
 * Formato: COD-YYYY-#### (ej: CAM-2025-0001)
 */
export async function generarNumeroInforme(departamentoCodigo: string, año: number): Promise<string> {
  const prefijo = `${departamentoCodigo}-${año}-`;
  
  // Buscar el último informe del departamento en el año
  const ultimoInforme = await prisma.informeCriminalistico.findFirst({
    where: {
      numeroInforme: {
        startsWith: prefijo,
      },
    },
    orderBy: {
      numeroInforme: 'desc',
    },
  });

  let siguienteNumero = 1;

  if (ultimoInforme && ultimoInforme.numeroInforme) {
    // Extraer el número del último informe
    // Formato esperado: COD-YYYY-####
    const partes = ultimoInforme.numeroInforme.split('-');
    // La última parte debería ser el número
    if (partes.length >= 3) {
      const ultimoNumero = parseInt(partes[partes.length - 1], 10);
      if (!isNaN(ultimoNumero)) {
        siguienteNumero = ultimoNumero + 1;
      }
    }
  }

  // Formatear con ceros a la izquierda (4 dígitos)
  const numeroFormateado = siguienteNumero.toString().padStart(4, '0');
  
  return `${prefijo}${numeroFormateado}`;
}

/**
 * Obtiene el código del departamento para usar en numeración
 */
export async function obtenerCodigoDepartamento(departamentoId: string): Promise<string> {
  const departamento = await prisma.departamento.findUnique({
    where: { id: departamentoId },
    select: { codigo: true, nombre: true },
  });

  if (departamento?.codigo) {
    return departamento.codigo;
  }

  // Si no tiene código, generar uno basado en el nombre
  const codigo = departamento?.nombre
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .substring(0, 3) || 'DEP';

  return codigo;
}

/**
 * Valida que un usuario tenga permisos para crear informes
 */
export function puedeCrearInforme(rol: string, departamentoIdUsuario: string | null, departamentoIdInforme: string): boolean {
  // ADMIN y SUPERVISOR_GENERAL pueden crear en cualquier departamento
  if (rol === 'ADMIN' || rol === 'SUPERVISOR_GENERAL') {
    return true;
  }

  // SUPERVISOR_REGIONAL puede crear en cualquier departamento de su oficina
  // (esto se validará a nivel de oficina)
  if (rol === 'SUPERVISOR_REGIONAL') {
    return true;
  }

  // OPERADOR y SUPERVISOR_DEPARTAMENTAL solo pueden crear en su departamento
  if (rol === 'OPERADOR' || rol === 'SUPERVISOR_DEPARTAMENTAL') {
    return departamentoIdUsuario === departamentoIdInforme;
  }

  return false;
}

