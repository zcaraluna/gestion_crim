import * as fs from 'fs';
import * as path from 'path';

interface Row {
  departamento: string;
  distrito: string;
}

function readCSV(filePath: string): Row[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  
  // Saltar el encabezado
  const rows: Row[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const parts = line.split(';');
    if (parts.length >= 2) {
      rows.push({
        departamento: parts[0].trim(),
        distrito: parts[1].trim(),
      });
    }
  }
  
  return rows;
}

function normalizeDepartamento(nombre: string): string {
  // Corregir nombres comunes
  const correcciones: Record<string, string> = {
    'Alto Parana': 'Alto Paraná',
    'Coordillera': 'Cordillera',
  };
  
  return correcciones[nombre] || nombre;
}

function generateTypeScript(data: Map<string, string[]>): string {
  let output = `// Estructura de datos de departamentos y ciudades de Paraguay
// Generado automáticamente desde paraguay.csv

export interface Ciudad {
  nombre: string;
}

export interface Departamento {
  nombre: string;
  ciudades: Ciudad[];
}

// Lista de departamentos de Paraguay (17 departamentos + Capital)
export const DEPARTAMENTOS: Departamento[] = [\n`;

  const departamentosOrdenados = Array.from(data.entries()).sort((a, b) => 
    a[0].localeCompare(b[0], 'es')
  );

  for (const [departamento, ciudades] of departamentosOrdenados) {
    output += `  {\n`;
    output += `    nombre: '${departamento.replace(/'/g, "\\'")}',\n`;
    output += `    ciudades: [\n`;
    
    for (const ciudad of ciudades.sort((a, b) => a.localeCompare(b, 'es'))) {
      output += `      { nombre: '${ciudad.replace(/'/g, "\\'")}' },\n`;
    }
    
    output += `    ],\n`;
    output += `  },\n`;
  }

  output += `];

/**
 * Obtiene las ciudades de un departamento específico
 */
export function getCiudadesPorDepartamento(departamentoNombre: string): Ciudad[] {
  const departamento = DEPARTAMENTOS.find(
    (d) => d.nombre.toLowerCase() === departamentoNombre.toLowerCase()
  );
  return departamento?.ciudades || [];
}

/**
 * Obtiene todos los nombres de departamentos
 */
export function getNombresDepartamentos(): string[] {
  return DEPARTAMENTOS.map((d) => d.nombre);
}

/**
 * Verifica si un departamento existe
 */
export function existeDepartamento(departamentoNombre: string): boolean {
  return DEPARTAMENTOS.some(
    (d) => d.nombre.toLowerCase() === departamentoNombre.toLowerCase()
  );
}
`;

  return output;
}

function main() {
  const csvPath = path.join(process.cwd(), 'paraguay.csv');
  const outputPath = path.join(process.cwd(), 'src', 'lib', 'paraguay-data.ts');

  console.log('📖 Leyendo CSV...');
  const rows = readCSV(csvPath);
  console.log(`✅ Se leyeron ${rows.length} filas`);

  // Agrupar por departamento
  const data = new Map<string, string[]>();

  for (const row of rows) {
    const dept = normalizeDepartamento(row.departamento);
    if (!data.has(dept)) {
      data.set(dept, []);
    }
    
    const ciudades = data.get(dept)!;
    if (!ciudades.includes(row.distrito)) {
      ciudades.push(row.distrito);
    }
  }

  console.log(`✅ Se encontraron ${data.size} departamentos`);

  // Generar archivo TypeScript
  const tsContent = generateTypeScript(data);
  
  fs.writeFileSync(outputPath, tsContent, 'utf-8');
  console.log(`✅ Archivo generado: ${outputPath}`);
  
  // Mostrar resumen
  console.log('\n📊 Resumen:');
  for (const [dept, ciudades] of Array.from(data.entries()).sort()) {
    console.log(`  - ${dept}: ${ciudades.length} ciudades`);
  }
}

main();

