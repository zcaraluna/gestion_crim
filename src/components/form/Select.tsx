"use client";
import React, { useState, useEffect } from "react";
import ReactSelect, { StylesConfig, GroupBase } from "react-select";
import { components, OptionProps } from "react-select";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  defaultValue?: string;
  value?: string;
  isSearchable?: boolean;
  isDisabled?: boolean;
  error?: boolean;
}

// Componente personalizado para las opciones
const CustomOption = (props: OptionProps<Option, false, GroupBase<Option>>) => {
  return (
    <components.Option {...props}>
      <div className="py-1">{props.children}</div>
    </components.Option>
  );
};

const CustomSelect: React.FC<SelectProps> = ({
  options,
  placeholder = "Seleccione una opción",
  onChange,
  className = "",
  defaultValue = "",
  value: controlledValue,
  isSearchable = true,
  isDisabled = false,
  error = false,
}) => {
  // Estado interno si no está controlado
  const [internalValue, setInternalValue] = useState<string>(defaultValue);
  
  // Usar valor controlado si existe, sino usar el interno
  const currentValue = controlledValue !== undefined ? controlledValue : internalValue;
  
  // Encontrar la opción seleccionada
  const selectedOption = currentValue
    ? options.find((opt) => opt.value === currentValue) || null
    : null;

  // Actualizar valor interno cuando cambie defaultValue
  useEffect(() => {
    if (defaultValue && controlledValue === undefined) {
      setInternalValue(defaultValue);
    }
  }, [defaultValue, controlledValue]);

  const handleChange = (selected: Option | null) => {
    const newValue = selected ? selected.value : "";
    if (controlledValue === undefined) {
      setInternalValue(newValue);
    }
    onChange(newValue);
  };

  // Estilos personalizados para react-select
  const customStyles: StylesConfig<Option, false> = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "44px",
      height: "44px",
      borderColor: error
        ? "#ef4444"
        : state.isFocused
        ? "#465fff"
        : state.theme.colors.neutral20,
      borderRadius: "0.5rem",
      backgroundColor: "transparent",
      boxShadow: state.isFocused
        ? "0px 0px 0px 4px rgba(70, 95, 255, 0.12)"
        : "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
      "&:hover": {
        borderColor: error ? "#ef4444" : "#465fff",
      },
      cursor: isDisabled ? "not-allowed" : "pointer",
      opacity: isDisabled ? 0.5 : 1,
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af",
      fontSize: "0.875rem",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#1f2937",
      fontSize: "0.875rem",
    }),
    input: (provided) => ({
      ...provided,
      color: "#1f2937",
      fontSize: "0.875rem",
      margin: 0,
      padding: 0,
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#6b7280",
      padding: "0 12px",
      "&:hover": {
        color: "#1f2937",
      },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.5rem",
      boxShadow: "0px 4px 6px -2px rgba(16, 24, 40, 0.05), 0px 12px 16px -4px rgba(16, 24, 40, 0.08)",
      border: "1px solid #e5e7eb",
      marginTop: "4px",
      zIndex: 9999,
    }),
    menuList: (provided) => ({
      ...provided,
      padding: "4px",
      maxHeight: "300px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#ecf3ff"
        : state.isFocused
        ? "#f5f7ff"
        : "transparent",
      color: state.isSelected ? "#465fff" : "#1f2937",
      cursor: "pointer",
      borderRadius: "0.375rem",
      fontSize: "0.875rem",
      padding: "8px 12px",
      "&:active": {
        backgroundColor: "#ecf3ff",
      },
    }),
  };

  // Estilos para modo oscuro
  const darkStyles: StylesConfig<Option, false> = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "44px",
      height: "44px",
      backgroundColor: "#111827",
      borderColor: error
        ? "#ef4444"
        : state.isFocused
        ? "#465fff"
        : "#374151",
      borderRadius: "0.5rem",
      boxShadow: state.isFocused
        ? "0px 0px 0px 4px rgba(70, 95, 255, 0.12)"
        : "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
      "&:hover": {
        borderColor: error ? "#ef4444" : "#465fff",
      },
      cursor: isDisabled ? "not-allowed" : "pointer",
      opacity: isDisabled ? 0.5 : 1,
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af",
      fontSize: "0.875rem",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "rgba(255, 255, 255, 0.9)",
      fontSize: "0.875rem",
    }),
    input: (provided) => ({
      ...provided,
      color: "rgba(255, 255, 255, 0.9)",
      fontSize: "0.875rem",
      margin: 0,
      padding: 0,
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#6b7280",
      padding: "0 12px",
      "&:hover": {
        color: "#d1d5db",
      },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.5rem",
      boxShadow: "0px 4px 6px -2px rgba(16, 24, 40, 0.05), 0px 12px 16px -4px rgba(16, 24, 40, 0.08)",
      backgroundColor: "#111827",
      border: "1px solid #374151",
      marginTop: "4px",
      zIndex: 9999,
    }),
    menuList: (provided) => ({
      ...provided,
      padding: "4px",
      maxHeight: "300px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "rgba(70, 95, 255, 0.12)"
        : state.isFocused
        ? "rgba(255, 255, 255, 0.05)"
        : "transparent",
      color: state.isSelected
        ? "#7592ff"
        : "rgba(255, 255, 255, 0.9)",
      cursor: "pointer",
      borderRadius: "0.375rem",
      fontSize: "0.875rem",
      padding: "8px 12px",
      "&:active": {
        backgroundColor: "rgba(70, 95, 255, 0.12)",
      },
    }),
  };

  // Detectar si está en modo oscuro
  const isDark = typeof window !== "undefined" && document.documentElement.classList.contains("dark");
  const styles = isDark ? darkStyles : customStyles;

  return (
    <div className={className}>
      <ReactSelect<Option, false>
        options={options}
        value={selectedOption}
        onChange={handleChange}
        placeholder={placeholder}
        isSearchable={isSearchable}
        isDisabled={isDisabled}
        styles={styles}
        components={{ Option: CustomOption }}
        classNamePrefix="react-select"
        classNames={{
          control: () => "!border-gray-300 dark:!border-gray-700",
        }}
        noOptionsMessage={() => "No hay opciones disponibles"}
        loadingMessage={() => "Cargando..."}
      />
    </div>
  );
};

export default CustomSelect;
