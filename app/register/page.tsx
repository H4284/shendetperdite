import { RegisterForm } from "@/components/auth/register-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Krijo një llogari",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
