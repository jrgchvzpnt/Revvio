import { LoginForm } from "@/components/auth/login-form";
import { Wrench } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md mb-8 flex flex-col items-center">
        <div className="bg-primary p-3 rounded-full mb-4">
          <Wrench className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Revvio</h1>
        <p className="text-slate-500 mt-2">Gestión inteligente para tu taller</p>
      </div>
      <LoginForm />
    </div>
  );
}
