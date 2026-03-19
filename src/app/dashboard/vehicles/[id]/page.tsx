import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Car, User, Wrench, History, Bell } from "lucide-react";
import Link from "next/link";
import { NewReminderDialog } from "@/components/vehicles/new-reminder-dialog";

export const dynamic = 'force-dynamic';

export default async function VehicleDetailsPage({ params }: { params: { id: string } }) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: params.id },
    include: {
      client: true,
      reminders: {
        orderBy: { date: 'asc' }
      },
      workOrders: {
        orderBy: { createdAt: 'desc' },
        include: {
          items: true
        }
      }
    }
  });

  if (!vehicle) {
    notFound();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalSpent = vehicle.workOrders.reduce((sum: number, order: any) => sum + Number(order.total), 0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const completedOrders = vehicle.workOrders.filter((o: any) => o.status === 'READY' || o.status === 'DELIVERED').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/vehicles">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {vehicle.brand} {vehicle.model} {vehicle.year ? `(${vehicle.year})` : ''}
          </h1>
          <p className="text-sm text-slate-500">Placa: {vehicle.plate}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-slate-100 rounded-lg">
              <Wrench className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Órdenes Totales</p>
              <p className="text-2xl font-bold text-slate-900">{vehicle.workOrders.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50/50 border-emerald-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <History className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-emerald-600 uppercase">Órdenes Completadas</p>
              <p className="text-2xl font-bold text-emerald-700">{completedOrders}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50/50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-lg font-bold text-blue-600">$</span>
            </div>
            <div>
              <p className="text-xs font-medium text-blue-600 uppercase">Total Invertido</p>
              <p className="text-2xl font-bold text-blue-700">${totalSpent.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <History className="w-5 h-5" />
                Historial de Órdenes de Trabajo
              </CardTitle>
            </CardHeader>
            <CardContent>
              {vehicle.workOrders.length > 0 ? (
                <div className="space-y-4">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {vehicle.workOrders.map((order: any) => (
                    <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Link href={`/dashboard/orders/${order.id}`} className="font-medium text-blue-600 hover:underline">
                            Orden #{order.id.slice(0, 8)}
                          </Link>
                          <Badge variant={
                            order.status === 'PENDING' ? 'secondary' :
                            order.status === 'IN_PROCESS' ? 'default' :
                            order.status === 'READY' ? 'default' :
                            order.status === 'DELIVERED' ? 'outline' : 'destructive'
                          }>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        {order.diagnosis && (
                          <p className="text-sm mt-2 text-slate-700 line-clamp-2">{order.diagnosis}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">${order.total.toString()}</p>
                        <p className="text-xs text-slate-500">{order.items.length} ítems</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Wrench className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <p>Este vehículo aún no tiene órdenes de trabajo registradas.</p>
                  <Link href="/dashboard/orders">
                    <Button variant="outline" className="mt-4">Crear Nueva Orden</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Car className="w-5 h-5" />
                Detalles del Vehículo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">Placa</p>
                <p className="font-medium">{vehicle.plate}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Marca</p>
                <p className="font-medium">{vehicle.brand}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Modelo</p>
                <p className="font-medium">{vehicle.model}</p>
              </div>
              {vehicle.year && (
                <div>
                  <p className="text-sm text-slate-500">Año</p>
                  <p className="font-medium">{vehicle.year}</p>
                </div>
              )}
              {vehicle.color && (
                <div>
                  <p className="text-sm text-slate-500">Color</p>
                  <p className="font-medium">{vehicle.color}</p>
                </div>
              )}
              {vehicle.mileage && (
                <div>
                  <p className="text-sm text-slate-500">Kilometraje Actual</p>
                  <p className="font-medium">{vehicle.mileage} km</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5" />
                Propietario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">Nombre</p>
                <p className="font-medium">{vehicle.client.name}</p>
              </div>
              {vehicle.client.phone && (
                <div>
                  <p className="text-sm text-slate-500">Teléfono</p>
                  <p className="font-medium">{vehicle.client.phone}</p>
                </div>
              )}
              {vehicle.client.email && (
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="font-medium">{vehicle.client.email}</p>
                </div>
              )}
              <Link href={`/dashboard/clients`}>
                <Button variant="outline" className="w-full mt-2">Ver Todos los Clientes</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-600" />
                Sistema de recordatorios
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-500">Resumen de recordatorios más relevantes para este vehículo.</p>
              <NewReminderDialog vehicleId={vehicle.id} />
              
              <div className="space-y-3 mt-4">
                {vehicle.reminders.length > 0 ? (
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  vehicle.reminders.map((reminder: any) => (
                    <div key={reminder.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-emerald-600" />
                          <span className="font-medium">{reminder.type}</span>
                        </div>
                      </div>
                      {reminder.description && (
                        <p className="text-sm text-slate-500">{reminder.description}</p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar className="w-3 h-3" />
                        <span>Programado: {new Date(reminder.date).toLocaleDateString()}</span>
                        <Badge variant="outline" className="ml-auto text-[10px]">
                          {reminder.sendType === 'AUTOMATIC' ? 'Automático' : 'Manual'}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 text-center py-4">No hay recordatorios programados.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
