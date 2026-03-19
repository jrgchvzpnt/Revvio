import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Car, User, Wrench } from "lucide-react";
import Link from "next/link";
import { CarDamageSelector } from "@/components/orders/car-damage-selector";
import { OrderStatusChanger } from "@/components/orders/order-status-changer";

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
        <div className="ml-auto">
          <OrderStatusChanger 
            orderId={order.id} 
            currentStatus={order.status as any} 
          />
        </div>
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
              {order.mileageIn && (
                <div>
                  <p className="text-xs text-slate-500 uppercase">Kilometraje</p>
                  <p className="font-medium">{order.mileageIn} km</p>
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
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Timeline de la orden</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {order.items.length > 0 && (
                <div className="relative pl-6 border-l-2 border-slate-200 last:border-0 pb-6">
                  <div className="absolute w-3 h-3 bg-emerald-500 rounded-full -left-[7px] top-1 ring-4 ring-white" />
                  <p className="font-medium text-sm">Ítems agregados</p>
                  <p className="text-xs text-slate-500 mt-1">{order.items.length} item(s) vinculados a la orden.</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {new Date(Math.max(...order.items.map((i: any) => new Date(i.createdAt).getTime()))).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              )}
              
              {order.updatedAt > order.createdAt && (
                <div className="relative pl-6 border-l-2 border-slate-200 last:border-0 pb-6">
                  <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1 ring-4 ring-white" />
                  <p className="font-medium text-sm">Estado actualizado</p>
                  <p className="text-xs text-slate-500 mt-1">La orden se encuentra en {order.status === 'PENDING' ? 'pendiente' : order.status === 'IN_PROGRESS' ? 'proceso' : order.status === 'COMPLETED' ? 'finalizado' : 'entregado'}.</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(order.updatedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              )}

              <div className="relative pl-6 border-l-2 border-transparent last:border-0">
                <div className="absolute w-3 h-3 bg-slate-300 rounded-full -left-[7px] top-1 ring-4 ring-white" />
                <p className="font-medium text-sm">Orden creada</p>
                <p className="text-xs text-slate-500 mt-1">La orden #{order.orderNumber} fue registrada en el sistema.</p>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(order.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
