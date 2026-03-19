import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, Clock, DollarSign, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-slate-900">Buenas noches, Anyelo</h1>
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Propietario</Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Martes, 17 De Marzo De 2026
          </span>
          <span>AutoServicio Express</span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="resumen" className="w-full flex flex-col">
        <TabsList variant="line" className="w-full justify-start border-b rounded-none h-auto p-0 space-x-6">
          <TabsTrigger 
            value="resumen" 
            className="rounded-none px-0 py-3 data-active:text-emerald-600 after:bg-emerald-600"
          >
            <Activity className="w-4 h-4 mr-2" />
            Resumen
          </TabsTrigger>
          <TabsTrigger 
            value="ots" 
            className="rounded-none px-0 py-3 data-active:text-emerald-600 after:bg-emerald-600"
          >
            <ClipboardList className="w-4 h-4 mr-2" />
            OTs recientes
          </TabsTrigger>
          <TabsTrigger 
            value="alertas" 
            className="rounded-none px-0 py-3 data-active:text-emerald-600 after:bg-emerald-600"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Alertas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="mt-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* OTs Hoy */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 uppercase">OTs Hoy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold text-slate-900">12</div>
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-600">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +3
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-2">3 más que ayer</p>
                <p className="text-xs text-slate-400 mt-1">Total acumulado del mes: 187</p>
              </CardContent>
            </Card>

            {/* En Proceso */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 uppercase">En Proceso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold text-slate-900">8</div>
                  <Badge variant="secondary" className="bg-amber-50 text-amber-600">
                    activas
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-2">5 diagnóstico, 3 reparación</p>
                <p className="text-xs text-slate-400 mt-1">Promedio de entrega: 2.4 días</p>
              </CardContent>
            </Card>

            {/* Ingresos del Día */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 uppercase">Ingresos del Día</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold text-slate-900">$2,847.50</div>
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-600">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +18.2%
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  Tendencia al alza esta semana
                </p>
                <p className="text-xs text-slate-400 mt-1">Meta mensual: $45,000 (63% avance)</p>
              </CardContent>
            </Card>

            {/* Alertas de Stock */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 uppercase">Alertas de Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold text-slate-900">5</div>
                  <Badge variant="secondary" className="bg-red-50 text-red-600">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    bajo
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Filtros, pastillas, aceite 5W-30
                </p>
                <p className="text-xs text-slate-400 mt-1">3 productos en nivel crítico</p>
              </CardContent>
            </Card>
          </div>

          {/* Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">Ingresos</CardTitle>
              <p className="text-sm text-slate-500">Ingresos de los últimos 7 días</p>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full bg-slate-50 rounded-md border border-dashed border-slate-200 flex items-center justify-center text-slate-400">
                [Gráfico de Área - Ingresos]
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Mock icon for ClipboardList since it's not imported at the top
function ClipboardList(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 11h4" />
      <path d="M12 16h4" />
      <path d="M8 11h.01" />
      <path d="M8 16h.01" />
    </svg>
  )
}
