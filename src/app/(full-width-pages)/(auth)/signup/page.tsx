import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registro | Sistema de Gestión Criminalística",
  description: "Página de registro del Sistema de Gestión Criminalística",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
