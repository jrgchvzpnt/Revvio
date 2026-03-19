import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Search, 
  Car, 
  Wrench, 
  LayoutGrid
} from "lucide-react";
import { NewVehicleDialog } from "@/components/vehicles/new-vehicle-dialog";
import { VehicleActions } from "@/components/vehicles/vehicle-actions";
import prisma from "@/lib/prisma";
import { getVehicles } from "@/actions/vehicles";

export const dynamic = 'force-dynamic';

export default async function VehiclesPage() {
  const clients = await prisma.client.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  });

  const result = await getVehicles();
  const vehicles = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Vehículos</h1>
          <p className="text-sm text-slate-500">Historial y seguimiento de los vehículos registrados.</p>
        </div>
        <NewVehicleDialog clients={clients} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-slate-100 rounded-lg">
              <Car className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Total Vehículos</p>
              <p className="text-2xl font-bold text-slate-900">{vehicles?.length || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50/50 border-emerald-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Wrench className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-emerald-600 uppercase">Con Historial</p>
              <p className="text-2xl font-bold text-emerald-700">1</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50/50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <LayoutGrid className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-blue-600 uppercase">Marcas Únicas</p>
              <p className="text-2xl font-bold text-blue-700">1</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <Card>
        <div className="p-4 border-b flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Centro de Gestión de Vehículos</h2>
            <p className="text-sm text-slate-500">Localiza por placa, ordena por historial y ejecuta acciones por registro desde una sola vista.</p>
          </div>
          <Badge variant="secondary" className="bg-emerald-50 text-emerald-600">1 con historial</Badge>
        </div>
        
        {/* Search and Filters */}
        <div className="p-4 border-b flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Buscar por placa, marca o propietario..." className="pl-9" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-slate-100">
              Todos <Badge variant="secondary" className="ml-2">1</Badge>
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-500">
              Con historial <Badge variant="secondary" className="ml-2">1</Badge>
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-500">
              Sin historial <Badge variant="secondary" className="ml-2">0</Badge>
            </Button>
            <Button variant="outline" size="sm">
              ↑↓ Placa A-Z
            </Button>
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Placa</TableHead>
              <TableHead>Propietario</TableHead>
              <TableHead>Vehículo</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>OT</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {vehicles?.map((vehicle: any) => (
              <TableRow key={vehicle.id}>
                <TableCell>
                  <div className="font-medium text-emerald-600">{vehicle.plate}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{vehicle.client?.name || "Desconocido"}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{vehicle.brand} {vehicle.model} {vehicle.year ? `(${vehicle.year})` : ''}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-slate-500">{vehicle.color || "-"}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <Wrench className="w-3 h-3" /> {vehicle.workOrders?.length || 0}
                  </div>
                </TableCell>
                <TableCell>
                  <VehicleActions vehicle={vehicle} clients={clients} />
                </TableCell>
              </TableRow>
            ))}
            {(!vehicles || vehicles.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                  No hay vehículos registrados aún.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
