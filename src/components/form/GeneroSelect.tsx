'use client';

import React from 'react';

interface GeneroSelectProps {
  value: 'masculino' | 'femenino' | '';
  onChange: (value: 'masculino' | 'femenino') => void;
  required?: boolean;
  error?: boolean;
}

export default function GeneroSelect({
  value,
  onChange,
  required = false,
  error = false,
}: GeneroSelectProps) {
  const handleMasculinoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onChange('masculino');
    }
  };

  const handleFemeninoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onChange('femenino');
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Checkbox Masculino */}
      <label
        className={`flex items-center cursor-pointer group ${
          error ? 'text-red-600' : ''
        }`}
      >
        <input
          type="checkbox"
          checked={value === 'masculino'}
          onChange={handleMasculinoChange}
          className="sr-only"
          aria-label="Masculino"
        />
        <div
          className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all ${
            value === 'masculino'
              ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20 shadow-md'
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
          } ${error ? 'border-red-500' : ''} group-hover:border-sky-400`}
        >
          <span
            className={`text-xl font-bold ${
              value === 'masculino'
                ? 'text-sky-600 dark:text-sky-400'
                : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            ♂
          </span>
        </div>
      </label>

      {/* Checkbox Femenino */}
      <label
        className={`flex items-center cursor-pointer group ${
          error ? 'text-red-600' : ''
        }`}
      >
        <input
          type="checkbox"
          checked={value === 'femenino'}
          onChange={handleFemeninoChange}
          className="sr-only"
          aria-label="Femenino"
        />
        <div
          className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all ${
            value === 'femenino'
              ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 shadow-md'
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
          } ${error ? 'border-red-500' : ''} group-hover:border-pink-400`}
        >
          <span
            className={`text-xl font-bold ${
              value === 'femenino'
                ? 'text-pink-600 dark:text-pink-400'
                : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            ♀
          </span>
        </div>
      </label>
    </div>
  );
}

