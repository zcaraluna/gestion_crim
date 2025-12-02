/**
 * Convierte un número a su forma ordinal en español
 * Ejemplo: 8 -> "8va.", 1 -> "1ra.", 2 -> "2da.", 3 -> "3ra."
 */
export function numeroAOrdinal(numero: number | string): string {
  const num = typeof numero === 'string' ? parseInt(numero, 10) : numero;
  
  if (isNaN(num) || num <= 0) {
    return numero.toString();
  }

  const ultimoDigito = num % 10;
  const ultimosDosDigitos = num % 100;

  // Casos especiales para 11, 12, 13
  if (ultimosDosDigitos >= 11 && ultimosDosDigitos <= 13) {
    return `${num}va.`;
  }

  // Casos regulares
  switch (ultimoDigito) {
    case 1:
      return `${num}ra.`;
    case 2:
      return `${num}da.`;
    case 3:
      return `${num}ra.`;
    default:
      return `${num}va.`;
  }
}

/**
 * Formatea una fecha a formato español: "16 de junio de 2025"
 */
export function formatearFechaEspañol(fecha: Date): string {
  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  const dia = fecha.getDate();
  const mes = meses[fecha.getMonth()];
  const año = fecha.getFullYear();

  return `${dia} de ${mes} de ${año}`;
}

/**
 * Formatea la hora a formato: "09:15 horas"
 */
export function formatearHora(hora: string): string {
  // Asegura que tenga el formato HH:MM
  const partes = hora.split(':');
  if (partes.length === 2) {
    const horas = partes[0].padStart(2, '0');
    const minutos = partes[1].padStart(2, '0');
    return `${horas}:${minutos} horas`;
  }
  return hora;
}

/**
 * Formatea una fecha a formato dd/mm/aaaa
 * Ejemplo: 16/06/2025
 */
export function formatearFechaDDMMAAAA(fecha: Date | null | undefined): string {
  if (!fecha) return '-';
  const fechaObj = new Date(fecha);
  const dia = fechaObj.getDate().toString().padStart(2, '0');
  const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
  const año = fechaObj.getFullYear();
  return `${dia}/${mes}/${año}`;
}

/**
 * Formatea un número telefónico para el párrafo: "el número 0973 505 505, corporativo de..."
 * Formato: 0973505505 -> "el número 0973 505 505, corporativo de"
 */
export function formatearNumeroTelefono(numero: string | null | undefined): string {
  if (!numero) return 'el número corporativo';
  
  // Eliminar todos los espacios y caracteres no numéricos
  const numeroLimpio = numero.replace(/\D/g, '');
  
  if (numeroLimpio.length === 0) return 'el número corporativo';
  
  // Formatear como 0973 505 505 (primeros 4 dígitos, luego grupos de 3)
  let numeroFormateado = numeroLimpio;
  if (numeroLimpio.length > 4) {
    const inicio = numeroLimpio.slice(0, 4);
    const resto = numeroLimpio.slice(4);
    const restoFormateado = resto.match(/.{1,3}/g)?.join(' ') || resto;
    numeroFormateado = `${inicio} ${restoFormateado}`;
  }
  
  return `el número ${numeroFormateado}, corporativo de`;
}

