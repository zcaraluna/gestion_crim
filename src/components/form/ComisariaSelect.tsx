'use client';

import React, { useState, useEffect } from 'react';
import Select from './Select';
import Input from './input/InputField';
import Label from './Label';
import { DEPARTAMENTOS, getCiudadesPorDepartamento } from '@/lib/paraguay-data';
import { numeroAOrdinal } from '@/lib/utils';

interface ComisariaSelectProps {
  value?: {
    categoria?: string;
    numero?: string;
    departamento?: string;
    ciudad?: string;
    textoCompleto?: string;
  };
  onChange: (value: {
    categoria: string;
    numero: string;
    departamento: string;
    ciudad: string;
    textoCompleto: string;
  }) => void;
  error?: boolean;
  required?: boolean;
}

const CATEGORIAS_COMISARIA = [
  { value: 'Comisaría', label: 'Comisaría' },
  { value: 'Subcomisaría', label: 'Subcomisaría' },
  { value: 'Puesto Policial', label: 'Puesto Policial' },
];

export default function ComisariaSelect({
  value,
  onChange,
  error = false,
  required = false,
}: ComisariaSelectProps) {
  const [categoria, setCategoria] = useState(value?.categoria || '');
  const [numero, setNumero] = useState(value?.numero || '');
  const [departamento, setDepartamento] = useState(value?.departamento || '');
  const [ciudad, setCiudad] = useState(value?.ciudad || '');
  const [ciudadesDisponibles, setCiudadesDisponibles] = useState<Array<{ value: string; label: string }>>([]);

  // Cargar ciudades cuando cambie el departamento
  useEffect(() => {
    if (departamento) {
      const ciudades = getCiudadesPorDepartamento(departamento);
      setCiudadesDisponibles(
        ciudades.map((c) => ({
          value: c.nombre,
          label: c.nombre,
        }))
      );
      
      // Si la ciudad actual no está en las nuevas ciudades disponibles, limpiarla
      if (ciudad && !ciudades.some((c) => c.nombre === ciudad)) {
        setCiudad('');
      }
    } else {
      setCiudadesDisponibles([]);
      setCiudad('');
    }
  }, [departamento, ciudad]);

  // Generar opciones de departamentos
  const opcionesDepartamentos = DEPARTAMENTOS.map((d) => ({
    value: d.nombre,
    label: d.nombre,
  }));

  // Actualizar texto completo cuando cambien los valores
  useEffect(() => {
    if (categoria && numero && departamento && ciudad) {
      // Determinar el artículo: "el" para "Puesto Policial", "la" para los demás
      const articulo = categoria === 'Puesto Policial' ? 'el' : 'la';
      // Formato: "la Comisaría 8° Central – Capiatá" o "el Puesto Policial 8° Central – Capiatá"
      const textoCompleto = `${articulo} ${categoria} ${numero}° ${departamento} – ${ciudad}`;
      
      onChange({
        categoria,
        numero,
        departamento,
        ciudad,
        textoCompleto,
      });
    }
  }, [categoria, numero, departamento, ciudad, onChange]);

  const handleCategoriaChange = (val: string) => {
    setCategoria(val);
  };

  const handleNumeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, ''); // Solo números
    setNumero(val);
  };

  const handleDepartamentoChange = (val: string) => {
    setDepartamento(val);
  };

  const handleCiudadChange = (val: string) => {
    setCiudad(val);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Categoría */}
        <div>
          <Label required={required}>
            Categoría
          </Label>
          <div className="relative">
            <Select
              options={CATEGORIAS_COMISARIA}
              placeholder="Seleccione la categoría"
              onChange={handleCategoriaChange}
              value={categoria}
              error={error}
            />
          </div>
        </div>

        {/* Número */}
        <div>
          <Label required={required}>
            Número
          </Label>
          <Input
            type="text"
            id="comisaria-numero"
            name="comisaria-numero"
            placeholder="Ej: 8"
            value={numero}
            onChange={handleNumeroChange}
            error={error}
            required={required}
            hint={numero ? `Se mostrará como: ${numeroAOrdinal(numero)}` : undefined}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Departamento */}
        <div>
          <Label required={required}>
            Departamento
          </Label>
          <div className="relative">
            <Select
              options={opcionesDepartamentos}
              placeholder="Seleccione el departamento"
              onChange={handleDepartamentoChange}
              value={departamento}
              error={error}
            />
          </div>
        </div>

        {/* Ciudad */}
        <div>
          <Label required={required}>
            Ciudad
          </Label>
          <div className="relative">
            <Select
              options={ciudadesDisponibles}
              placeholder={departamento ? 'Seleccione la ciudad' : 'Primero seleccione el departamento'}
              onChange={handleCiudadChange}
              value={ciudad}
              isDisabled={!departamento}
              error={error}
            />
          </div>
        </div>
      </div>

      {/* Vista previa del texto completo */}
      {categoria && numero && departamento && ciudad && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Texto completo:</p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
            {categoria === 'Puesto Policial' 
              ? `el ${categoria} ${numero}° ${departamento} – ${ciudad}`
              : `la ${categoria} ${numero}° ${departamento} – ${ciudad}`}
          </p>
        </div>
      )}
    </div>
  );
}

