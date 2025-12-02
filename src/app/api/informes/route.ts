import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/api-helpers';
import { generarNumeroInforme, obtenerCodigoDepartamento, puedeCrearInforme } from '@/lib/informes';
import { z } from 'zod';
import { EstadoInforme } from '@prisma/client';

// Esquema de validación para crear un informe
const crearInformeSchema = z.object({
  userId: z.string().uuid('ID de usuario inválido'),
  
  // Datos de recepción del pedido
  fechaRecepcion: z.string().datetime(),
  horaRecepcion: z.string().regex(/^\d{2}:\d{2}$/, 'Formato de hora inválido (HH:MM)'),
  numeroTelefonoRecepcion: z.string().optional().nullable(),
  gradoSolicitante: z.string().min(1, 'El grado del solicitante es requerido'),
  nombreSolicitante: z.string().min(1, 'El nombre del solicitante es requerido'),
  generoSolicitante: z.enum(['masculino', 'femenino']).optional(),
  categoriaComisaria: z.string().min(1, 'La categoría de comisaría es requerida'),
  numeroComisaria: z.string().min(1, 'El número de comisaría es requerido'),
  departamentoComisaria: z.string().min(1, 'El departamento de la comisaría es requerido'),
  ciudadComisaria: z.string().min(1, 'La ciudad de la comisaría es requerida'),
  comisariaTextoCompleto: z.string().min(1, 'El texto completo de la comisaría es requerido'),
  tipoHecho: z.string().min(1, 'El tipo de hecho es requerido'),
  jurisdiccion: z.string().optional().nullable(),
  
  // Relaciones
  departamentoId: z.string().uuid('ID de departamento inválido'),
  oficinaId: z.string().uuid('ID de oficina inválido'),
  
  // Opcional
  usuarioAsignadoId: z.string().uuid().optional().nullable(),
  estado: z.nativeEnum(EstadoInforme).optional(),
});

/**
 * POST /api/informes
 * Crea un nuevo informe criminalístico
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar datos
    const validationResult = crearInformeSchema.safeParse(body);
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

    // Verificar permisos
    if (!puedeCrearInforme(user.rol, user.departamentoId || null, data.departamentoId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'No tiene permisos para crear informes en este departamento',
        },
        { status: 403 }
      );
    }

    // Crear el informe (sin número de informe hasta que se finalice)
    const informe = await prisma.informeCriminalistico.create({
      data: {
        numeroInforme: null, // El número se asignará cuando se finalice/apruebe
        departamentoId: data.departamentoId,
        oficinaId: data.oficinaId,
        usuarioCreadorId: user.id,
        usuarioAsignadoId: data.usuarioAsignadoId || null,
        estado: data.estado || EstadoInforme.BORRADOR,
        
        // Datos de recepción del pedido
        fechaRecepcion: new Date(data.fechaRecepcion),
        horaRecepcion: data.horaRecepcion,
        numeroTelefonoRecepcion: data.numeroTelefonoRecepcion || null,
        gradoSolicitante: data.gradoSolicitante,
        nombreSolicitante: data.nombreSolicitante,
        generoSolicitante: data.generoSolicitante || null,
        categoriaComisaria: data.categoriaComisaria,
        numeroComisaria: data.numeroComisaria,
        departamentoComisaria: data.departamentoComisaria,
        ciudadComisaria: data.ciudadComisaria,
        comisariaTextoCompleto: data.comisariaTextoCompleto,
        tipoHecho: data.tipoHecho,
        jurisdiccion: data.jurisdiccion || null,
      },
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
      },
    });

    return NextResponse.json(
      {
        success: true,
        informe,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creando informe:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno al crear el informe',
        details: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/informes
 * Obtiene la lista de informes con filtros opcionales
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const departamentoId = searchParams.get('departamentoId');
    const oficinaId = searchParams.get('oficinaId');
    const estado = searchParams.get('estado');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

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

    // Construir filtros según permisos del usuario
    const where: any = {};

    // OPERADOR solo ve sus propios informes o los asignados a él
    if (user.rol === 'OPERADOR') {
      where.OR = [
        { usuarioCreadorId: user.id },
        { usuarioAsignadoId: user.id },
      ];
      if (user.departamentoId) {
        where.departamentoId = user.departamentoId;
      }
    }
    // SUPERVISOR_DEPARTAMENTAL ve todos los informes de su departamento
    else if (user.rol === 'SUPERVISOR_DEPARTAMENTAL') {
      if (user.departamentoId) {
        where.departamentoId = user.departamentoId;
      }
    }
    // SUPERVISOR_REGIONAL ve todos los informes de su oficina
    else if (user.rol === 'SUPERVISOR_REGIONAL') {
      if (user.oficinaId) {
        where.oficinaId = user.oficinaId;
      }
    }
    // SUPERVISOR_GENERAL y ADMIN pueden ver todos los informes
    // (no agregamos filtros adicionales)

    // Aplicar filtros adicionales si se proporcionan
    if (departamentoId) {
      where.departamentoId = departamentoId;
    }
    if (oficinaId) {
      where.oficinaId = oficinaId;
    }
    if (estado) {
      where.estado = estado;
    }

    // Obtener informes
    const [informes, total] = await Promise.all([
      prisma.informeCriminalistico.findMany({
        where,
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
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
      }),
      prisma.informeCriminalistico.count({ where }),
    ]);

    return NextResponse.json(
      {
        success: true,
        informes,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error obteniendo informes:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno al obtener los informes',
      },
      { status: 500 }
    );
  }
}

