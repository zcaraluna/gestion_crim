"use client";
import React from "react";
import ComponentCard from "../../common/ComponentCard";

import { Modal } from "../../ui/modal";
import Button from "../../ui/button/Button";
import { useModal } from "@/hooks/useModal";

export default function DefaultModal() {
  const { isOpen, openModal, closeModal } = useModal();
  const handleSave = () => {
    // Handle save logic here
    console.log("Saving changes...");
    closeModal();
  };
  return (
    <div>
      <ComponentCard title="Modal por Defecto">
        <Button size="sm" onClick={openModal}>
          Abrir Modal
        </Button>
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          className="max-w-[600px] p-5 lg:p-10"
        >
          <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
            Título del Modal
          </h4>
          <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
            Este es un ejemplo de modal por defecto. Puede contener cualquier tipo de contenido,
            texto, formularios, imágenes u otros elementos según sea necesario para su aplicación.
          </p>
          <p className="mt-5 text-sm leading-6 text-gray-500 dark:text-gray-400">
            Los modales son útiles para mostrar información importante o solicitar confirmación del usuario.
          </p>
          <div className="flex items-center justify-end w-full gap-3 mt-8">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Cerrar
            </Button>
            <Button size="sm" onClick={handleSave}>
              Guardar Cambios
            </Button>
          </div>
        </Modal>
      </ComponentCard>
    </div>
  );
}
