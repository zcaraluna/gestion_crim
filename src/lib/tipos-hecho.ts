// Lista de tipos de hechos para informes criminalísticos
// Nota: Las opciones predefinidas solo incluyen el texto después de "SUPUESTO"
// El sistema agregará automáticamente "SUPUESTO" al inicio

export const TIPOS_HECHO = [
  { value: 'hecho de hurto agravado', label: 'Supuesto hecho de hurto agravado' },
  { value: 'hecho de abigeato', label: 'Supuesto hecho de abigeato' },
  { value: 'hecho de hurto especialmente grave', label: 'Supuesto hecho de hurto especialmente grave' },
  { value: 'hecho de robo', label: 'Supuesto hecho de robo' },
  { value: 'hecho de robo agravado', label: 'Supuesto hecho de robo agravado' },
  { value: 'hecho de robo con resultado de muerte o lesión grave', label: 'Supuesto hecho de robo con resultado de muerte o lesión grave' },
  { value: 'hecho de estafa', label: 'Supuesto hecho de estafa' },
  { value: 'hecho de producción de riesgos comunes', label: 'Supuesto hecho de producción de riesgos comunes' },
  { value: 'hecho de homicidio doloso', label: 'Supuesto hecho de homicidio doloso' },
  { value: 'hecho de homicidio culposo', label: 'Supuesto hecho de homicidio culposo' },
  { value: 'otro', label: 'Otro (especificar)' },
];

// Valor constante para identificar cuando se selecciona "otro"
export const TIPO_HECHO_OTRO = 'otro';

