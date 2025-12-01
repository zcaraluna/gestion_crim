import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const oficinas = await prisma.oficina.findMany({
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
        oficinas,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error obteniendo oficinas:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener las oficinas',
      },
      { status: 500 }
    );
  }
}

