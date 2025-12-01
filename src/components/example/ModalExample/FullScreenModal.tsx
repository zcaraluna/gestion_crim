"use client";
import { useModal } from "@/hooks/useModal";
import ComponentCard from "../../common/ComponentCard";

import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";

export default function FullScreenModal() {
  const {
    isOpen: isFullscreenModalOpen,
    openModal: openFullscreenModal,
    closeModal: closeFullscreenModal,
  } = useModal();
  const handleSave = () => {
    // Handle save logic here
    console.log("Saving changes...");
    closeFullscreenModal();
  };
  return (
    <ComponentCard title="Modal de Pantalla Completa">
      <Button size="sm" onClick={openFullscreenModal}>
        Abrir Modal
      </Button>
      <Modal
        isOpen={isFullscreenModalOpen}
        onClose={closeFullscreenModal}
        isFullscreen={true}
        showCloseButton={true}
      >
        <div className="fixed top-0 left-0 flex flex-col justify-between w-full h-screen p-6 overflow-x-hidden overflow-y-auto bg-white dark:bg-gray-900 lg:p-10">
          <div>
            <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
              Título del Modal
            </h4>
            <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
              Este es un ejemplo de modal de pantalla completa. Útil para mostrar contenido extenso
              o formularios complejos que requieren más espacio. El modal ocupa toda la pantalla
              para una mejor experiencia de usuario.
            </p>
            <p className="mt-5 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Los modales de pantalla completa son ideales para tareas que requieren atención completa
              del usuario, como la creación de informes detallados, edición de documentos extensos
              o visualización de información compleja que necesita más espacio para ser presentada adecuadamente.
            </p>
            <p className="mt-5 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Puede incluir cualquier tipo de contenido según las necesidades de su aplicación.
            </p>
          </div>
          <div className="flex items-center justify-end w-full gap-3 mt-8">
            <Button size="sm" variant="outline" onClick={closeFullscreenModal}>
              Cerrar
            </Button>
            <Button size="sm" onClick={handleSave}>
              Guardar Cambios
            </Button>
          </div>
        </div>
      </Modal>
    </ComponentCard>
  );
}
