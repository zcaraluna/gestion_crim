import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🔄 Corrigiendo nombre de Dirección de Criminalística...');

  const oficina = await prisma.oficina.findUnique({
    where: { codigo: 'DIR-CRIM' },
  });

  if (oficina) {
    await prisma.oficina.update({
      where: { codigo: 'DIR-CRIM' },
      data: { nombre: 'Dirección de Criminalística' },
    });
    console.log(`✅ Actualizado: DIR-CRIM -> Dirección de Criminalística`);
  } else {
    console.log(`⚠️  No se encontró oficina con código: DIR-CRIM`);
  }

  console.log('✅ Corrección completada');
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

