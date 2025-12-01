import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar Sesión | Sistema de Gestión Criminalística",
  description: "Página de inicio de sesión del sistema de gestión criminalística",
};

export default function SignIn() {
  return <SignInForm />;
}
