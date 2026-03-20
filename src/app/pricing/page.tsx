import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Wrench } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-md">
            <Wrench className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl">Revvio</span>
        </div>
        <nav>
          <Link href="/login">
            <Button variant="outline">Iniciar Sesión</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Planes y Precios
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-slate-500">
              Elige el plan que mejor se adapte a las necesidades de tu taller mecánico.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Plan Básico */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl">Básico</CardTitle>
                <CardDescription>Para talleres pequeños que recién empiezan.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">$0</span>
                  <span className="text-slate-500 font-medium">/mes</span>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 shrink-0" />
                    <span className="text-slate-600">Hasta 50 órdenes de trabajo al mes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 shrink-0" />
                    <span className="text-slate-600">Gestión básica de clientes y vehículos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 shrink-0" />
                    <span className="text-slate-600">Inventario limitado (100 productos)</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/login" className="w-full">
                  <Button className="w-full" variant="outline">Comenzar Gratis</Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Plan Pro */}
            <Card className="flex flex-col border-primary shadow-lg relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Más Popular
                </span>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Pro</CardTitle>
                <CardDescription>Para talleres en crecimiento que necesitan más control.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">$5</span>
                  <span className="text-slate-500 font-medium">/mes</span>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 shrink-0" />
                    <span className="text-slate-600">Órdenes de trabajo ilimitadas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 shrink-0" />
                    <span className="text-slate-600">Inventario ilimitado</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 shrink-0" />
                    <span className="text-slate-600">Recordatorios automáticos por email</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 shrink-0" />
                    <span className="text-slate-600">Reportes y estadísticas avanzadas</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/login" className="w-full">
                  <Button className="w-full">Suscribirse al Pro</Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Plan IA */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  Premium IA
                  <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded">Nuevo</span>
                </CardTitle>
                <CardDescription>Automatización total con Inteligencia Artificial.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">$15</span>
                  <span className="text-slate-500 font-medium">/mes</span>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 shrink-0" />
                    <span className="text-slate-600 font-medium">Todo lo del plan Pro</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 shrink-0" />
                    <span className="text-slate-600">Asistente RevvioBot (IA) integrado</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 shrink-0" />
                    <span className="text-slate-600">Notificaciones automáticas por WhatsApp</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 shrink-0" />
                    <span className="text-slate-600">Diagnósticos sugeridos por IA</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/login" className="w-full">
                  <Button className="w-full" variant="outline">Suscribirse al Premium</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
