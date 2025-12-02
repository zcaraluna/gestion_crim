import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🔄 Actualizando nombres de oficinas...');

  // Mapeo de códigos a nuevos nombres
  const nombresOficinas: Record<string, string> = {
    'DIR-CRIM': 'Departamento de Criminalística Dirección',
    'REG-ASU': 'Departamento de Criminalística Asunción',
    'REG-CEN': 'Departamento de Criminalística Central',
    'REG-CAA': 'Departamento de Criminalística Caaguazú',
    'REG-ITA': 'Departamento de Criminalística Itapúa',
    'REG-CDE': 'Departamento de Criminalística Ciudad del Este',
  };

  for (const [codigo, nuevoNombre] of Object.entries(nombresOficinas)) {
    const oficina = await prisma.oficina.findUnique({
      where: { codigo },
    });

    if (oficina) {
      await prisma.oficina.update({
        where: { codigo },
        data: { nombre: nuevoNombre },
      });
      console.log(`✅ Actualizado: ${codigo} -> ${nuevoNombre}`);
    } else {
      console.log(`⚠️  No se encontró oficina con código: ${codigo}`);
    }
  }

  console.log('✅ Actualización de nombres completada');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

