import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Car, User, Wrench } from "lucide-react";
import Link from "next/link";
import { CarDamageSelector } from "@/components/orders/car-damage-selector";

export const dynamic = 'force-dynamic';

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const order = await prisma.workOrder.findUnique({
    where: { id: params.id },
    include: {
      vehicle: {
        include: {
          client: true
        }
      },
      items: true
    }
  });

  if (!order) {
    notFound();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const damages = order.damages ? order.damages : "[]";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/orders">
          <Button variant="outline" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Orden #{order.id.slice(0, 8)}</h1>
          <p className="text-sm text-slate-500">Detalles de la orden de trabajo</p>
        </div>
        <Badge className="ml-auto" variant={
          order.status === 'PENDING' ? 'secondary' :
          order.status === 'IN_PROGRESS' ? 'default' :
          order.status === 'COMPLETED' ? 'default' :
          order.status === 'DELIVERED' ? 'outline' : 'destructive'
        }>
          {order.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                Detalles del Servicio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-slate-500">Diagnóstico / Problemas Reportados</h3>
                <p className="mt-1 text-slate-900">{order.diagnosis || "No especificado"}</p>
              </div>
              
              {order.notes && (
                <div>
                  <h3 className="font-medium text-sm text-slate-500">Notas Adicionales</h3>
                  <p className="mt-1 text-slate-900">{order.notes}</p>
                </div>
              )}

              <div>
                <h3 className="font-medium text-sm text-slate-500 mb-2">Daños Registrados</h3>
                <div className="border rounded-lg p-4 bg-slate-50">
                  <CarDamageSelector 
                    value={damages} 
                    readonly={true}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ítems y Repuestos</CardTitle>
            </CardHeader>
            <CardContent>
              {order.items.length > 0 ? (
                <div className="space-y-4">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">{item.description}</p>
                        <p className="text-sm text-slate-500">
                          {item.quantity} x ${item.unitPrice.toString()}
                        </p>
                      </div>
                      <p className="font-medium">${item.subtotal.toString()}</p>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <p className="font-bold">Total</p>
                    <p className="font-bold text-lg">${order.total.toString()}</p>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 text-center py-4">No hay ítems registrados en esta orden.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Car className="w-5 h-5" />
                Vehículo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">Placa</p>
                <p className="font-medium">{order.vehicle.plate}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Marca / Modelo</p>
                <p className="font-medium">{order.vehicle.brand} {order.vehicle.model}</p>
              </div>
              {order.vehicle.year && (
                <div>
                  <p className="text-sm text-slate-500">Año</p>
                  <p className="font-medium">{order.vehicle.year}</p>
                </div>
              )}
              {order.mileage && (
                <div>
                  <p className="text-sm text-slate-500">Kilometraje de Ingreso</p>
                  <p className="font-medium">{order.mileage} km</p>
                </div>
              )}
              <Link href={`/dashboard/vehicles/${order.vehicle.id}`}>
                <Button variant="outline" className="w-full mt-2">Ver Historial del Vehículo</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5" />
                Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">Nombre</p>
                <p className="font-medium">{order.vehicle.client.name}</p>
              </div>
              {order.vehicle.client.phone && (
                <div>
                  <p className="text-sm text-slate-500">Teléfono</p>
                  <p className="font-medium">{order.vehicle.client.phone}</p>
                </div>
              )}
              {order.vehicle.client.email && (
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="font-medium">{order.vehicle.client.email}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Fechas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">Creada</p>
                <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Última Actualización</p>
                <p className="font-medium">{new Date(order.updatedAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
