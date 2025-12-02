import { NextRequest, NextResponse } from 'next/server';
import { getUserById, UserSession } from './auth';

/**
 * Obtiene el usuario autenticado desde el userId proporcionado
 */
export async function getAuthenticatedUser(userId: string | undefined): Promise<{ user: UserSession | null; error: NextResponse | null }> {
  try {
    if (!userId) {
      return {
        user: null,
        error: NextResponse.json(
          { success: false, error: 'Usuario no autenticado' },
          { status: 401 }
        ),
      };
    }

    // Verificar que el usuario existe y está activo
    const user = await getUserById(userId);
    if (!user) {
      return {
        user: null,
        error: NextResponse.json(
          { success: false, error: 'Usuario no válido o inactivo' },
          { status: 401 }
        ),
      };
    }

    return { user, error: null };
  } catch (error) {
    console.error('Error obteniendo usuario autenticado:', error);
    return {
      user: null,
      error: NextResponse.json(
        { success: false, error: 'Error de autenticación' },
        { status: 500 }
      ),
    };
  }
}

