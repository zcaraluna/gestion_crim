'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import Select from '@/components/form/Select';
import ComisariaSelect from '@/components/form/ComisariaSelect';
import GeneroSelect from '@/components/form/GeneroSelect';
import Button from '@/components/ui/button/Button';
import DatePicker from '@/components/form/date-picker';
import { GRADOS_POLICIALES } from '@/lib/grados';
import { TIPOS_HECHO, TIPO_HECHO_OTRO } from '@/lib/tipos-hecho';
import { formatearFechaEspañol, formatearNumeroTelefono } from '@/lib/utils';

interface OficinaData {
  id: string;
  nombre: string;
  numeroTelefono?: string | null;
}

export default function FormularioRecepcionPedido() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Obtener oficina y departamento seleccionados
  const oficinaIdSeleccionada = searchParams.get('oficinaId') || (() => {
    try {
      const session = localStorage.getItem('user_session');
      if (session) {
        const data = JSON.parse(session);
        return data.selectedOficinaId || data.oficinaId;
      }
    } catch {}
    return null;
  })();
  
  const departamentoIdSeleccionado = searchParams.get('departamentoId') || (() => {
    try {
      const session = localStorage.getItem('user_session');
      if (session) {
        const data = JSON.parse(session);
        return data.selectedDepartamentoId || data.departamentoId;
      }
    } catch {}
    return null;
  })();

  // Estados del formulario
  const [oficinaData, setOficinaData] = useState<OficinaData | null>(null);
  const [departamentoNombre, setDepartamentoNombre] = useState<string>('');
  const [loadingOficina, setLoadingOficina] = useState(true);
  
  const [fechaRecepcion, setFechaRecepcion] = useState<Date>(new Date());
  const [horaRecepcion, setHoraRecepcion] = useState<string>('');
  const [numeroTelefono, setNumeroTelefono] = useState<string>('');
  const [gradoSolicitante, setGradoSolicitante] = useState<string>('');
  const [nombreSolicitante, setNombreSolicitante] = useState<string>('');
  const [generoSolicitante, setGeneroSolicitante] = useState<string>('masculino'); // Por defecto masculino
  const [comisaria, setComisaria] = useState<{
    categoria: string;
    numero: string;
    departamento: string;
    ciudad: string;
    textoCompleto: string;
  }>({
    categoria: '',
    numero: '',
    departamento: '',
    ciudad: '',
    textoCompleto: '',
  });
  const [tipoHechoSeleccionado, setTipoHechoSeleccionado] = useState<string>('');
  const [tipoHechoPersonalizado, setTipoHechoPersonalizado] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Determinar el valor final del tipo de hecho
  const tipoHecho = tipoHechoSeleccionado === TIPO_HECHO_OTRO 
    ? tipoHechoPersonalizado 
    : tipoHechoSeleccionado;

  // Cargar datos de oficina
  useEffect(() => {
    const cargarDatos = async () => {
      if (!oficinaIdSeleccionada) {
        setLoadingOficina(false);
        return;
      }

      try {
        const response = await fetch('/api/oficinas');
        if (!response.ok) throw new Error('Error al cargar oficinas');
        const data = await response.json();
        const oficina = data.oficinas.find((o: OficinaData) => o.id === oficinaIdSeleccionada);
        
        if (oficina) {
          setOficinaData(oficina);
          if (oficina.numeroTelefono) {
            setNumeroTelefono(oficina.numeroTelefono);
          }
        }
      } catch (err) {
        console.error('Error cargando oficina:', err);
      } finally {
        setLoadingOficina(false);
      }
    };

    cargarDatos();
  }, [oficinaIdSeleccionada]);

  // Obtener nombre del departamento
  useEffect(() => {
    if (departamentoIdSeleccionado) {
      // Aquí podrías hacer una llamada a la API o usar localStorage
      try {
        const session = localStorage.getItem('user_session');
        if (session) {
          const data = JSON.parse(session);
          const nombre = data.selectedDepartamentoNombre || data.departamentoNombre;
          if (nombre) {
            setDepartamentoNombre(nombre);
          }
        }
      } catch {}
    }
  }, [departamentoIdSeleccionado]);

  // Establecer hora actual si está vacía
  useEffect(() => {
    if (!horaRecepcion) {
      const now = new Date();
      const horas = String(now.getHours()).padStart(2, '0');
      const minutos = String(now.getMinutes()).padStart(2, '0');
      setHoraRecepcion(`${horas}:${minutos}`);
    }
  }, []);

  const handleFechaChange = (selectedDates: Date[], dateStr: string) => {
    if (selectedDates && selectedDates.length > 0) {
      setFechaRecepcion(selectedDates[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validaciones
    if (!fechaRecepcion) {
      setError('La fecha de recepción es requerida');
      setLoading(false);
      return;
    }

    if (!horaRecepcion) {
      setError('La hora de recepción es requerida');
      setLoading(false);
      return;
    }

    if (!gradoSolicitante) {
      setError('El grado del solicitante es requerido');
      setLoading(false);
      return;
    }

    if (!nombreSolicitante.trim()) {
      setError('El nombre del solicitante es requerido');
      setLoading(false);
      return;
    }

    if (!comisaria.textoCompleto) {
      setError('Debe completar todos los datos de la comisaría');
      setLoading(false);
      return;
    }

    if (!tipoHechoSeleccionado) {
      setError('El tipo de hecho es requerido');
      setLoading(false);
      return;
    }

    if (tipoHechoSeleccionado === TIPO_HECHO_OTRO && !tipoHechoPersonalizado.trim()) {
      setError('Debe especificar el tipo de hecho cuando selecciona "Otro"');
      setLoading(false);
      return;
    }

    if (!oficinaIdSeleccionada || !departamentoIdSeleccionado) {
      setError('Debe seleccionar una oficina y departamento');
      setLoading(false);
      return;
    }

    if (!user || !user.id) {
      setError('Debe estar autenticado para crear un informe');
      setLoading(false);
      return;
    }

    try {
      // Preparar datos para enviar
      // Formatear el tipo de hecho: agregar "SUPUESTO " solo para opciones predefinidas
      const tipoHechoFormateado = tipoHechoSeleccionado === TIPO_HECHO_OTRO
        ? tipoHechoPersonalizado.trim()
        : `SUPUESTO ${tipoHecho.toUpperCase()}`;

      const datosInforme = {
        userId: user.id,
        fechaRecepcion: fechaRecepcion.toISOString(),
        horaRecepcion: horaRecepcion,
        numeroTelefonoRecepcion: numeroTelefono || null,
        gradoSolicitante,
        nombreSolicitante: nombreSolicitante.trim(),
        generoSolicitante,
        categoriaComisaria: comisaria.categoria,
        numeroComisaria: comisaria.numero,
        departamentoComisaria: comisaria.departamento,
        ciudadComisaria: comisaria.ciudad,
        comisariaTextoCompleto: comisaria.textoCompleto,
        tipoHecho: tipoHechoFormateado,
        jurisdiccion: comisaria.ciudad, // La jurisdicción es la ciudad de la comisaría
        departamentoId: departamentoIdSeleccionado,
        oficinaId: oficinaIdSeleccionada,
      };

      // Llamar a la API para crear el informe
      const response = await fetch('/api/informes', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosInforme),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Error al crear el informe');
      }

      // Redirigir al detalle del informe o al listado
      router.push(`/informes/${data.informe.id}`);
      
    } catch (err) {
      console.error('Error al guardar informe:', err);
      setError(err instanceof Error ? err.message : 'Error al guardar el informe. Por favor, intente nuevamente.');
      setLoading(false);
    }
  };

  if (isLoading || loadingOficina) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando formulario...</p>
        </div>
      </div>
    );
  }

  // Generar texto del párrafo automáticamente
  const generarParrafo = () => {
    if (!fechaRecepcion || !horaRecepcion || !gradoSolicitante || !nombreSolicitante || !comisaria.textoCompleto || !tipoHecho || !oficinaData) {
      return '';
    }

    const fechaTexto = formatearFechaEspañol(fechaRecepcion);
    const horaTexto = horaRecepcion.includes('horas') ? horaRecepcion : `${horaRecepcion} horas`;
    const numeroTel = formatearNumeroTelefono(numeroTelefono);
    const nombreOficina = oficinaData.nombre;

    // Si es "otro", usar el texto personalizado directamente sin "SUPUESTO"
    // Si es una opción predefinida, agregar "SUPUESTO" y convertir a mayúsculas
    const tipoHechoTexto = tipoHechoSeleccionado === TIPO_HECHO_OTRO
      ? tipoHechoPersonalizado
      : `SUPUESTO ${tipoHecho.toUpperCase()}`;

    // Determinar el artículo según el género: "del" para masculino, "de la" para femenino
    const articuloGenero = generoSolicitante === 'femenino' ? 'de la' : 'del';

    return `En fecha ${fechaTexto}, siendo las ${horaTexto}, se recepcionó una llamada telefónica en ${numeroTel} la Guardia de ${nombreOficina}, por parte ${articuloGenero} ${gradoSolicitante} ${nombreSolicitante}, personal de ${comisaria.textoCompleto}, por la que solicita la constitución de personal de este Departamento para realizar procedimiento en relación a un ${tipoHechoTexto}, en la jurisdicción de dicha dependencia policial, por lo que se da inmediato cumplimiento al pedido constituyéndose personal de este Departamento, conforme a lo dispuesto en el Título I, Art. 6°, numerales 4, 5, 6, 18, 28, 29 y 30 de la Ley 7280/2024 – De Reforma y Modernización de la Policía Nacional, concordante con el Art. 297, numeral 8 de la Ley 1286/1998 – Código Procesal Penal.`;
  };

  const textoParrafo = generarParrafo();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-2">
          Recepción del Pedido
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Complete los siguientes datos para generar el informe de recepción del pedido
        </p>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Fecha y Hora */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fecha-recepcion" required>
              Fecha de Recepción
            </Label>
            <DatePicker
              id="fecha-recepcion"
              mode="single"
              defaultDate={fechaRecepcion}
              onChange={handleFechaChange}
            />
          </div>

          <div>
            <Label htmlFor="hora-recepcion" required>
              Hora de Recepción
            </Label>
            <Input
              type="time"
              id="hora-recepcion"
              name="hora-recepcion"
              value={horaRecepcion}
              onChange={(e) => setHoraRecepcion(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Número de Teléfono y Departamento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="numero-telefono">
              Número Corporativo de la Guardia
            </Label>
            <Input
              type="tel"
              id="numero-telefono"
              name="numero-telefono"
              placeholder="Número de teléfono"
              value={numeroTelefono}
              onChange={(e) => setNumeroTelefono(e.target.value)}
            />
            {oficinaData?.numeroTelefono && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Pre-llenado desde: {oficinaData.nombre}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="departamento-receptor">
              Departamento Receptor
            </Label>
            <Input
              type="text"
              id="departamento-receptor"
              name="departamento-receptor"
              value={oficinaData ? `Departamento de ${oficinaData.nombre}` : ''}
              disabled
              className="bg-gray-50 dark:bg-gray-800"
            />
          </div>
        </div>

        {/* Grado, Nombre y Género del Solicitante */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="grado-solicitante" required>
              Grado/Rango del Solicitante
            </Label>
            <div className="relative">
              <Select
                options={GRADOS_POLICIALES}
                placeholder="Seleccione el grado"
                onChange={setGradoSolicitante}
                value={gradoSolicitante}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="nombre-solicitante" required>
              Nombre del Solicitante
            </Label>
            <Input
              type="text"
              id="nombre-solicitante"
              name="nombre-solicitante"
              placeholder="Ej: HECTOR GAYOSO"
              value={nombreSolicitante}
              onChange={(e) => setNombreSolicitante(e.target.value.toUpperCase())}
              required
            />
          </div>

          <div>
            <Label required>
              Género del Solicitante
            </Label>
            <div className="mt-2">
              <GeneroSelect
                value={generoSolicitante as 'masculino' | 'femenino' | ''}
                onChange={(val) => setGeneroSolicitante(val)}
                required
              />
            </div>
          </div>
        </div>

        {/* Unidad Solicitante */}
        <div>
          <Label required>Unidad Solicitante</Label>
          <ComisariaSelect
            value={comisaria}
            onChange={setComisaria}
          />
        </div>

        {/* Tipo de Hecho */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="tipo-hecho" required>
              Tipo de Hecho
            </Label>
            <Select
              options={TIPOS_HECHO}
              placeholder="Seleccione el tipo de hecho"
              onChange={setTipoHechoSeleccionado}
              value={tipoHechoSeleccionado}
            />
          </div>

          {/* Campo condicional para "Otro" */}
          {tipoHechoSeleccionado === TIPO_HECHO_OTRO && (
            <div>
              <Label htmlFor="tipo-hecho-personalizado" required>
                Especificar Tipo de Hecho
              </Label>
              <Input
                type="text"
                id="tipo-hecho-personalizado"
                name="tipo-hecho-personalizado"
                placeholder="Ingrese el tipo de hecho"
                value={tipoHechoPersonalizado}
                onChange={(e) => setTipoHechoPersonalizado(e.target.value)}
                required
                hint="Este texto aparecerá tal como lo escriba en el informe"
              />
            </div>
          )}
        </div>

        {/* Vista Previa del Párrafo */}
        {textoParrafo && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <Label>Vista Previa del Párrafo Generado</Label>
            <div className="mt-2 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                {textoParrafo}
              </p>
            </div>
          </div>
        )}

        {/* Botones */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar Recepción del Pedido'}
          </Button>
        </div>
      </form>
    </div>
  );
}

