import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ResponsiveImage from "@/components/ui/images/ResponsiveImage";
import ThreeColumnImageGrid from "@/components/ui/images/ThreeColumnImageGrid";
import TwoColumnImageGrid from "@/components/ui/images/TwoColumnImageGrid";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Imágenes | Sistema de Gestión Criminalística",
  description:
    "Página de imágenes del sistema de gestión criminalística",
};

export default function Images() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Imágenes" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Imagen Responsiva">
          <ResponsiveImage />
        </ComponentCard>
        <ComponentCard title="Imagen en Grid de 2 Columnas">
          <TwoColumnImageGrid />
        </ComponentCard>
        <ComponentCard title="Imagen en Grid de 3 Columnas">
          <ThreeColumnImageGrid />
        </ComponentCard>
      </div>
    </div>
  );
}
