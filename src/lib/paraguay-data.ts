// Estructura de datos de departamentos y ciudades de Paraguay
// Generado automáticamente desde paraguay.csv

export interface Ciudad {
  nombre: string;
}

export interface Departamento {
  nombre: string;
  ciudades: Ciudad[];
}

// Lista de departamentos de Paraguay (17 departamentos + Capital)
export const DEPARTAMENTOS: Departamento[] = [
  {
    nombre: 'Alto Paraguay',
    ciudades: [
      { nombre: 'Bahía Negra' },
      { nombre: 'Capitán Carmelo Peralta' },
      { nombre: 'Fuerte Olimpo' },
      { nombre: 'Puerto Casado' },
    ],
  },
  {
    nombre: 'Alto Paraná',
    ciudades: [
      { nombre: 'Ciudad del Este' },
      { nombre: 'Doctor Juan León Mallorquín' },
      { nombre: 'Doctor Raúl Peña' },
      { nombre: 'Domingo Martínez de Irala' },
      { nombre: 'Hernandarias' },
      { nombre: 'Iruña' },
      { nombre: 'Itakyry' },
      { nombre: 'Juan Emiliano O\'Leary' },
      { nombre: 'Los Cedrales' },
      { nombre: 'Mbaracayú' },
      { nombre: 'Minga Guazú' },
      { nombre: 'Minga Porá' },
      { nombre: 'Naranjal' },
      { nombre: 'Ñacunday' },
      { nombre: 'Presidente Franco' },
      { nombre: 'San Alberto' },
      { nombre: 'San Cristóbal' },
      { nombre: 'Santa Fe del Paraná' },
      { nombre: 'Santa Rita' },
      { nombre: 'Santa Rosa del Monday' },
      { nombre: 'Tavapy' },
      { nombre: 'Yguazú' },
    ],
  },
  {
    nombre: 'Amambay',
    ciudades: [
      { nombre: 'Bella Vista Norte' },
      { nombre: 'Capitán Bado' },
      { nombre: 'Cerro Corá' },
      { nombre: 'Karapaí' },
      { nombre: 'Pedro Juan Caballero' },
      { nombre: 'Zanja Pytá' },
    ],
  },
  {
    nombre: 'Asunción',
    ciudades: [
      { nombre: 'Asunción' },
    ],
  },
  {
    nombre: 'Boquerón',
    ciudades: [
      { nombre: 'Boquerón' },
      { nombre: 'Filadelfia' },
      { nombre: 'Loma Plata' },
      { nombre: 'Mariscal José Félix Estigarribia' },
    ],
  },
  {
    nombre: 'Caaguazú',
    ciudades: [
      { nombre: 'Caaguazú' },
      { nombre: 'Carayaó' },
      { nombre: 'Coronel Oviedo' },
      { nombre: 'Doctor Cecilio Báez' },
      { nombre: 'Doctor Juan Eulogio Estigarribia' },
      { nombre: 'Doctor Juan Manuel Frutos' },
      { nombre: 'José Domingo Ocampos' },
      { nombre: 'La Pastora' },
      { nombre: 'Mariscal Francisco Solano López' },
      { nombre: 'Nueva Londres' },
      { nombre: 'Nueva Toledo' },
      { nombre: 'Raúl Arsenio Oviedo' },
      { nombre: 'Regimiento de Infantería Tres Corrales' },
      { nombre: 'Repatriación' },
      { nombre: 'San Joaquín' },
      { nombre: 'San José de los Arroyos' },
      { nombre: 'Santa Rosa del Mbutuy' },
      { nombre: 'Simón Bolívar' },
      { nombre: 'Tembiaporá' },
      { nombre: 'Tres de Febrero' },
      { nombre: 'Vaquería' },
      { nombre: 'Yhú' },
    ],
  },
  {
    nombre: 'Caazapá',
    ciudades: [
      { nombre: 'Abaí' },
      { nombre: 'Buena Vista' },
      { nombre: 'Caazapá' },
      { nombre: 'Doctor Moisés Santiago Bertoni' },
      { nombre: 'Fulgencio Yegros' },
      { nombre: 'General Higinio Morínigo' },
      { nombre: 'Maciel' },
      { nombre: 'San Juan Nepomuceno' },
      { nombre: 'Tavaí' },
      { nombre: 'Tres de Mayo' },
      { nombre: 'Yuty' },
    ],
  },
  {
    nombre: 'Canindeyú',
    ciudades: [
      { nombre: 'Corpus Christi' },
      { nombre: 'Curuguaty' },
      { nombre: 'General Francisco Caballero Álvarez' },
      { nombre: 'Itanará' },
      { nombre: 'Katueté' },
      { nombre: 'La Paloma del Espíritu Santo' },
      { nombre: 'Laurel' },
      { nombre: 'Maracaná' },
      { nombre: 'Nueva Esperanza' },
      { nombre: 'Puerto Adela' },
      { nombre: 'Salto del Guairá' },
      { nombre: 'Villa Ygatimí' },
      { nombre: 'Yasy Cañy' },
      { nombre: 'Yby Pytá' },
      { nombre: 'Ybyrarobaná' },
      { nombre: 'Ypejhú' },
    ],
  },
  {
    nombre: 'Central',
    ciudades: [
      { nombre: 'Areguá' },
      { nombre: 'Capiatá' },
      { nombre: 'Fernando de la Mora' },
      { nombre: 'Guarambaré' },
      { nombre: 'Itá' },
      { nombre: 'Itauguá' },
      { nombre: 'Julián Augusto Saldívar' },
      { nombre: 'Lambaré' },
      { nombre: 'Limpio' },
      { nombre: 'Luque' },
      { nombre: 'Mariano Roque Alonso' },
      { nombre: 'Nueva Italia' },
      { nombre: 'Ñemby' },
      { nombre: 'San Antonio' },
      { nombre: 'San Lorenzo' },
      { nombre: 'Villa Elisa' },
      { nombre: 'Villeta' },
      { nombre: 'Ypacaraí' },
      { nombre: 'Ypané' },
    ],
  },
  {
    nombre: 'Concepción',
    ciudades: [
      { nombre: 'Arroyito' },
      { nombre: 'Azotey' },
      { nombre: 'Belén' },
      { nombre: 'Concepción' },
      { nombre: 'Horqueta' },
      { nombre: 'Itacuá' },
      { nombre: 'Loreto' },
      { nombre: 'Paso Barreto' },
      { nombre: 'Paso Horqueta' },
      { nombre: 'San Alfredo' },
      { nombre: 'San Carlos del Apa' },
      { nombre: 'San Lázaro' },
      { nombre: 'Sargento José Félix López' },
      { nombre: 'Yby Yaú' },
    ],
  },
  {
    nombre: 'Cordillera',
    ciudades: [
      { nombre: 'Altos' },
      { nombre: 'Arroyos y Esteros' },
      { nombre: 'Atyrá' },
      { nombre: 'Caacupé' },
      { nombre: 'Caraguatay' },
      { nombre: 'Emboscada' },
      { nombre: 'Eusebio Ayala' },
      { nombre: 'Isla Pucú' },
      { nombre: 'Itacurubí de la Cordillera' },
      { nombre: 'Juan de Mena' },
      { nombre: 'Loma Grande' },
      { nombre: 'Mbocayaty del Yhaguy' },
      { nombre: 'Nueva Colombia' },
      { nombre: 'Piribebuy' },
      { nombre: 'Primero de Marzo' },
      { nombre: 'San Bernardino' },
      { nombre: 'San José Obrero' },
      { nombre: 'Santa Elena' },
      { nombre: 'Tobatí' },
      { nombre: 'Valenzuela' },
    ],
  },
  {
    nombre: 'Guairá',
    ciudades: [
      { nombre: 'Borja' },
      { nombre: 'Capitán Mauricio José Troche' },
      { nombre: 'Coronel Martínez' },
      { nombre: 'Doctor Botrell' },
      { nombre: 'Félix Pérez Cardozo' },
      { nombre: 'General Eugenio Alejandrino Garay' },
      { nombre: 'Independencia' },
      { nombre: 'Itapé' },
      { nombre: 'Iturbe' },
      { nombre: 'José A. Fassardi' },
      { nombre: 'Mbocayaty del Guairá' },
      { nombre: 'Natalicio Talavera' },
      { nombre: 'Ñumí' },
      { nombre: 'Paso Yobái' },
      { nombre: 'San Salvador' },
      { nombre: 'Tebicuary' },
      { nombre: 'Villarrica' },
      { nombre: 'Yataity del Guairá' },
    ],
  },
  {
    nombre: 'Itapúa',
    ciudades: [
      { nombre: 'Alto Verá' },
      { nombre: 'Bella Vista' },
      { nombre: 'Cambyretá' },
      { nombre: 'Capitán Meza' },
      { nombre: 'Capitán Miranda' },
      { nombre: 'Carlos Antonio López' },
      { nombre: 'Carmen del Paraná' },
      { nombre: 'Coronel José Félix Bogado' },
      { nombre: 'Edelira' },
      { nombre: 'Encarnación' },
      { nombre: 'Fram' },
      { nombre: 'General Artigas' },
      { nombre: 'General Delgado' },
      { nombre: 'Hohenau' },
      { nombre: 'Itapúa Poty' },
      { nombre: 'Jesús de Tavarangüé' },
      { nombre: 'José Leandro Oviedo' },
      { nombre: 'La Paz' },
      { nombre: 'Mayor Julio Dionisio Otaño' },
      { nombre: 'Natalio' },
      { nombre: 'Nueva Alborada' },
      { nombre: 'Obligado' },
    ],
  },
  {
    nombre: 'Misiones',
    ciudades: [
      { nombre: 'Ayolas' },
      { nombre: 'San Ignacio Guazú' },
      { nombre: 'San Juan Bautista' },
      { nombre: 'San Miguel' },
      { nombre: 'San Patricio' },
      { nombre: 'Santa María de Fe' },
      { nombre: 'Santa Rosa de Lima' },
      { nombre: 'Santiago' },
      { nombre: 'Villa Florida' },
      { nombre: 'Yabebyry' },
    ],
  },
  {
    nombre: 'Ñeembucú',
    ciudades: [
      { nombre: 'Alberdi' },
      { nombre: 'Cerrito' },
      { nombre: 'Desmochados' },
      { nombre: 'General José Eduvigis Díaz' },
      { nombre: 'Guazú Cuá' },
      { nombre: 'Humaitá' },
      { nombre: 'Isla Umbú' },
      { nombre: 'Laureles' },
      { nombre: 'Mayor José Martínez' },
      { nombre: 'Paso de Patria' },
      { nombre: 'Pilar' },
      { nombre: 'San Juan Bautista de Ñeembucú' },
      { nombre: 'Tacuaras' },
      { nombre: 'Villa Franca' },
      { nombre: 'Villa Oliva' },
      { nombre: 'Villalbín' },
    ],
  },
  {
    nombre: 'Paraguarí',
    ciudades: [
      { nombre: 'Acahay' },
      { nombre: 'Caapucú' },
      { nombre: 'Carapeguá' },
      { nombre: 'Escobar' },
      { nombre: 'General Bernardino Caballero' },
      { nombre: 'La Colmena' },
      { nombre: 'María Antonia' },
      { nombre: 'Mbuyapey' },
      { nombre: 'Paraguarí' },
      { nombre: 'Pirayú' },
      { nombre: 'Quiindy' },
      { nombre: 'Quyquyhó' },
      { nombre: 'San Roque González de Santa Cruz' },
      { nombre: 'Sapucai' },
      { nombre: 'Tebicuarymí' },
      { nombre: 'Yaguarón' },
      { nombre: 'Ybycuí' },
      { nombre: 'Ybytymí' },
    ],
  },
  {
    nombre: 'Presidente Hayes',
    ciudades: [
      { nombre: 'Benjamín Aceval' },
      { nombre: 'Campo Aceval' },
      { nombre: 'General José María Bruguez' },
      { nombre: 'José Falcón' },
      { nombre: 'Nanawa' },
      { nombre: 'Nueva Asunción' },
      { nombre: 'Puerto Pinasco' },
      { nombre: 'Teniente Esteban Martínez' },
      { nombre: 'Teniente Primero Manuel Irala Fernández' },
      { nombre: 'Villa Hayes' },
    ],
  },
  {
    nombre: 'San Pedro',
    ciudades: [
      { nombre: 'Antequera' },
      { nombre: 'Capiibary' },
      { nombre: 'Choré' },
      { nombre: 'General Elizardo Aquino' },
      { nombre: 'General Isidoro Resquín' },
      { nombre: 'Guayaibí' },
      { nombre: 'Itacurubí del Rosario' },
      { nombre: 'Liberación' },
      { nombre: 'Lima' },
      { nombre: 'Nueva Germania' },
      { nombre: 'San Estanislao' },
      { nombre: 'San José del Rosario' },
      { nombre: 'San Pablo' },
      { nombre: 'San Pedro de Ycuamandiyú' },
      { nombre: 'San Vicente Pancholo' },
      { nombre: 'Santa Rosa del Aguaray' },
      { nombre: 'Tacuatí' },
      { nombre: 'Unión' },
      { nombre: 'Veinticinco de Diciembre' },
      { nombre: 'Villa del Rosario' },
      { nombre: 'Yataity del Norte' },
      { nombre: 'Yrybucuá' },
    ],
  },
];

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
