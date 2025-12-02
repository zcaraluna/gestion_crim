import 'dotenv/config';
import { PrismaClient, Rol } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando seed de base de datos...');

  // Crear Oficinas/Regionales
  const oficinas = [
    { nombre: 'Dirección de Criminalística', codigo: 'DIR-CRIM', tipo: 'Dirección' },
    { nombre: 'Departamento de Criminalística Asunción', codigo: 'REG-ASU', tipo: 'Regional' },
    { nombre: 'Departamento de Criminalística Central', codigo: 'REG-CEN', tipo: 'Regional' },
    { nombre: 'Departamento de Criminalística Caaguazú', codigo: 'REG-CAA', tipo: 'Regional' },
    { nombre: 'Departamento de Criminalística Itapúa', codigo: 'REG-ITA', tipo: 'Regional' },
    { nombre: 'Departamento de Criminalística Ciudad del Este', codigo: 'REG-CDE', tipo: 'Regional' },
  ];

  console.log('📁 Creando oficinas...');
  for (const oficina of oficinas) {
    await prisma.oficina.upsert({
      where: { codigo: oficina.codigo || undefined },
      update: {},
      create: oficina,
    });
  }
  console.log('✅ Oficinas creadas');

  // Crear Departamentos
  const departamentos = [
    { nombre: 'Balística Forense', codigo: 'DEP-BAL' },
    { nombre: 'Criminalística de Campo', codigo: 'DEP-CAM' },
    { nombre: 'Identidad Humana', codigo: 'DEP-IDE' },
    { nombre: 'Siniestros e Incendios', codigo: 'DEP-SIN' },
    { nombre: 'Laboratorio Forense', codigo: 'DEP-LAB' },
    { nombre: 'Informática Forense', codigo: 'DEP-INF' },
  ];

  console.log('🏢 Creando departamentos...');
  for (const dept of departamentos) {
    await prisma.departamento.upsert({
      where: { codigo: dept.codigo || undefined },
      update: {},
      create: dept,
    });
  }
  console.log('✅ Departamentos creados');

  // Obtener oficinas y departamentos para usuarios que los necesitan
  const regCen = await prisma.oficina.findUnique({
    where: { codigo: 'REG-CEN' },
  });
  const regCde = await prisma.oficina.findUnique({
    where: { codigo: 'REG-CDE' },
  });
  const deptCampo = await prisma.departamento.findUnique({
    where: { codigo: 'DEP-CAM' },
  });
  const deptIdentidad = await prisma.departamento.findUnique({
    where: { codigo: 'DEP-IDE' },
  });

  // Crear usuario user1 (OPERADOR)
  const user1Password = await bcrypt.hash('user123', 10);
  if (regCen && deptCampo) {
    await prisma.usuario.upsert({
      where: { username: 'user1' },
      update: {},
      create: {
        username: 'user1',
        password: user1Password,
        nombre: 'Usuario',
        apellido: 'Uno',
        grado: 'Oficial',
        numeroCedula: '1000001',
        numeroCredencial: 'USER-001',
        email: 'user1@crimigestor.gov.py',
        telefono: '+595 981 000001',
        departamentoId: deptCampo.id,
        oficinaId: regCen.id,
        rol: Rol.OPERADOR,
      },
    });
    console.log('✅ Usuario OPERADOR creado (username: user1, password: user123)');
  }

  // Crear usuario user2 (SUPERVISOR_DEPARTAMENTAL)
  const user2Password = await bcrypt.hash('user123', 10);
  if (regCde && deptIdentidad) {
    await prisma.usuario.upsert({
      where: { username: 'user2' },
      update: {},
      create: {
        username: 'user2',
        password: user2Password,
        nombre: 'Usuario',
        apellido: 'Dos',
        grado: 'Subcomisario',
        numeroCedula: '1000002',
        numeroCredencial: 'USER-002',
        email: 'user2@crimigestor.gov.py',
        telefono: '+595 981 000002',
        departamentoId: deptIdentidad.id,
        oficinaId: regCde.id,
        rol: Rol.SUPERVISOR_DEPARTAMENTAL,
      },
    });
    console.log('✅ Usuario SUPERVISOR_DEPARTAMENTAL creado (username: user2, password: user123)');
  }

  // Crear usuario user3 (SUPERVISOR_REGIONAL - sin departamento/oficina asignada)
  const user3Password = await bcrypt.hash('user123', 10);
    await prisma.usuario.upsert({
    where: { username: 'user3' },
      update: {},
      create: {
      username: 'user3',
      password: user3Password,
      nombre: 'Usuario',
      apellido: 'Tres',
        grado: 'Comisario',
      numeroCedula: '1000003',
      numeroCredencial: 'USER-003',
      email: 'user3@crimigestor.gov.py',
      telefono: '+595 981 000003',
      departamentoId: null,
      oficinaId: null,
        rol: Rol.SUPERVISOR_REGIONAL,
      },
    });
  console.log('✅ Usuario SUPERVISOR_REGIONAL creado (username: user3, password: user123)');

  // Crear usuario user4 (SUPERVISOR_GENERAL - sin departamento/oficina asignada)
  const user4Password = await bcrypt.hash('user123', 10);
    await prisma.usuario.upsert({
    where: { username: 'user4' },
      update: {},
      create: {
      username: 'user4',
      password: user4Password,
      nombre: 'Usuario',
      apellido: 'Cuatro',
        grado: 'Comisario Principal',
      numeroCedula: '1000004',
      numeroCredencial: 'USER-004',
      email: 'user4@crimigestor.gov.py',
      telefono: '+595 981 000004',
      departamentoId: null,
      oficinaId: null,
        rol: Rol.SUPERVISOR_GENERAL,
      },
    });
  console.log('✅ Usuario SUPERVISOR_GENERAL creado (username: user4, password: user123)');

  // Crear usuario admin (ADMIN - sin departamento/oficina asignada)
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.usuario.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      nombre: 'Administrador',
      apellido: 'Sistema',
      grado: 'Administrador',
      numeroCedula: '0000000',
      numeroCredencial: 'ADMIN-001',
      email: 'admin@crimigestor.gov.py',
      telefono: '+595 981 000000',
      departamentoId: null,
      oficinaId: null,
      rol: Rol.ADMIN,
    },
  });
  console.log('✅ Usuario ADMIN creado (username: admin, password: admin123)');

  console.log('\n🎉 Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

