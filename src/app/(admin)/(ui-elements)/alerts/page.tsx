import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Alert from "@/components/ui/alert/Alert";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Alertas | Sistema de Gestión Criminalística",
  description:
    "Página de alertas del sistema de gestión criminalística",
};

export default function Alerts() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Alertas" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Alerta de Éxito">
          <Alert
            variant="success"
            title="Mensaje de Éxito"
            message="Tenga cuidado al realizar esta acción."
            showLink={true}
            linkHref="/"
            linkText="Más información"
          />
          <Alert
            variant="success"
            title="Mensaje de Éxito"
            message="Tenga cuidado al realizar esta acción."
            showLink={false}
          />
        </ComponentCard>
        <ComponentCard title="Alerta de Advertencia">
          <Alert
            variant="warning"
            title="Mensaje de Advertencia"
            message="Tenga cuidado al realizar esta acción."
            showLink={true}
            linkHref="/"
            linkText="Más información"
          />
          <Alert
            variant="warning"
            title="Mensaje de Advertencia"
            message="Tenga cuidado al realizar esta acción."
            showLink={false}
          />
        </ComponentCard>
        <ComponentCard title="Alerta de Error">
          <Alert
            variant="error"
            title="Mensaje de Error"
            message="Tenga cuidado al realizar esta acción."
            showLink={true}
            linkHref="/"
            linkText="Más información"
          />
          <Alert
            variant="error"
            title="Mensaje de Error"
            message="Tenga cuidado al realizar esta acción."
            showLink={false}
          />
        </ComponentCard>
        <ComponentCard title="Alerta Informativa">
          <Alert
            variant="info"
            title="Mensaje Informativo"
            message="Tenga cuidado al realizar esta acción."
            showLink={true}
            linkHref="/"
            linkText="Más información"
          />
          <Alert
            variant="info"
            title="Mensaje Informativo"
            message="Tenga cuidado al realizar esta acción."
            showLink={false}
          />
        </ComponentCard>
      </div>
    </div>
  );
}
