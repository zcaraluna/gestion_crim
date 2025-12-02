import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/api-helpers';

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

