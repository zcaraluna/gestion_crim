import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/api-helpers';
import { generarNumeroInforme, obtenerCodigoDepartamento } from '@/lib/informes';
import { EstadoInforme } from '@prisma/client';
import { z } from 'zod';

/**
 * GET /api/informes/[id]
 * Obtiene un informe específico por ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Verificar autenticación
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Usuario no autenticado' },
        { status: 401 }
      );
    }

    const { user, error: authError } = await getAuthenticatedUser(userId);
    if (authError || !user) {
      return authError || NextResponse.json(
        { success: false, error: 'Usuario no autenticado' },
        { status: 401 }
      );
    }

    // Obtener el informe
    const informe = await prisma.informeCriminalistico.findUnique({
      where: { id },
      include: {
        departamento: {
          select: {
            id: true,
            nombre: true,
            codigo: true,
          },
        },
        oficina: {
          select: {
            id: true,
            nombre: true,
          },
        },
        usuarioCreador: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            grado: true,
          },
        },
        usuarioAsignado: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            grado: true,
          },
        },
      },
    });

    if (!informe) {
      return NextResponse.json(
        { success: false, error: 'Informe no encontrado' },
        { status: 404 }
      );
    }

    // Verificar permisos según rol
    // OPERADOR solo puede ver sus propios informes o los asignados a él
    if (user.rol === 'OPERADOR') {
      if (informe.usuarioCreadorId !== user.id && informe.usuarioAsignadoId !== user.id) {
        return NextResponse.json(
          { success: false, error: 'No tiene permisos para ver este informe' },
          { status: 403 }
        );
      }
    }
    // SUPERVISOR_DEPARTAMENTAL solo puede ver informes de su departamento
    else if (user.rol === 'SUPERVISOR_DEPARTAMENTAL') {
      if (user.departamentoId && informe.departamentoId !== user.departamentoId) {
        return NextResponse.json(
          { success: false, error: 'No tiene permisos para ver este informe' },
          { status: 403 }
        );
      }
    }
    // SUPERVISOR_REGIONAL solo puede ver informes de su oficina
    else if (user.rol === 'SUPERVISOR_REGIONAL') {
      if (user.oficinaId && informe.oficinaId !== user.oficinaId) {
        return NextResponse.json(
          { success: false, error: 'No tiene permisos para ver este informe' },
          { status: 403 }
        );
      }
    }
    // SUPERVISOR_GENERAL y ADMIN pueden ver todos los informes

    return NextResponse.json(
      {
        success: true,
        informe,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error obteniendo informe:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno al obtener el informe',
      },
      { status: 500 }
    );
  }
}

// Esquema de validación para actualizar el estado del informe
const actualizarEstadoSchema = z.object({
  userId: z.string().uuid('ID de usuario inválido'),
  estado: z.nativeEnum(EstadoInforme),
});

/**
 * PATCH /api/informes/[id]
 * Actualiza el estado de un informe. Si se aprueba, genera automáticamente el número de informe.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validar datos
    const validationResult = actualizarEstadoSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: validationResult.error.issues[0]?.message || 'Datos inválidos',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Verificar autenticación
    const { user, error: authError } = await getAuthenticatedUser(data.userId);
    if (authError || !user) {
      return authError || NextResponse.json(
        { success: false, error: 'Usuario no autenticado' },
        { status: 401 }
      );
    }

    // Obtener el informe actual
    const informeActual = await prisma.informeCriminalistico.findUnique({
      where: { id },
      include: {
        departamento: {
          select: {
            codigo: true,
          },
        },
      },
    });

    if (!informeActual) {
      return NextResponse.json(
        { success: false, error: 'Informe no encontrado' },
        { status: 404 }
      );
    }

    // Verificar permisos (solo supervisores y admin pueden cambiar el estado)
    const puedeCambiarEstado = ['SUPERVISOR_DEPARTAMENTAL', 'SUPERVISOR_REGIONAL', 'SUPERVISOR_GENERAL', 'ADMIN'].includes(user.rol);
    if (!puedeCambiarEstado) {
      return NextResponse.json(
        { success: false, error: 'No tiene permisos para cambiar el estado del informe' },
        { status: 403 }
      );
    }

    // Preparar datos de actualización
    const updateData: any = {
      estado: data.estado,
    };

    // Si se aprueba y no tiene número de informe, generarlo
    if (data.estado === EstadoInforme.APROBADO && !informeActual.numeroInforme) {
      if (!informeActual.fechaRecepcion) {
        return NextResponse.json(
          { success: false, error: 'No se puede aprobar un informe sin fecha de recepción' },
          { status: 400 }
        );
      }

      const año = new Date(informeActual.fechaRecepcion).getFullYear();
      const codigoDepartamento = informeActual.departamento?.codigo 
        ? informeActual.departamento.codigo
        : await obtenerCodigoDepartamento(informeActual.departamentoId);
      const numeroInforme = await generarNumeroInforme(codigoDepartamento, año);
      
      updateData.numeroInforme = numeroInforme;
      updateData.fechaAprobacion = new Date();
      updateData.aprobadoPorId = user.id;
    }

    // Actualizar el informe
    const informeActualizado = await prisma.informeCriminalistico.update({
      where: { id },
      data: updateData,
      include: {
        departamento: {
          select: {
            id: true,
            nombre: true,
            codigo: true,
          },
        },
        oficina: {
          select: {
            id: true,
            nombre: true,
          },
        },
        usuarioCreador: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            grado: true,
          },
        },
        usuarioAsignado: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            grado: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        informe: informeActualizado,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error actualizando informe:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno al actualizar el informe',
        details: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}

