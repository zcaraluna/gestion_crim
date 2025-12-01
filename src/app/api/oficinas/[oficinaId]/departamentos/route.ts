import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ oficinaId: string }> }
) {
  try {
    const { oficinaId } = await params;

    // Obtener todos los departamentos activos
    // Por ahora, todos los departamentos están disponibles en todas las oficinas
    // En el futuro se puede filtrar por relación específica
    const departamentos = await prisma.departamento.findMany({
      where: {
        activo: true,
      },
      orderBy: {
        nombre: 'asc',
      },
    });

    return NextResponse.json(
      {
        success: true,
        departamentos,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error obteniendo departamentos:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener los departamentos',
      },
      { status: 500 }
    );
  }
}

