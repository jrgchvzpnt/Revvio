"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { updateVehicle, deleteVehicle } from "@/actions/vehicles";

export function VehicleActions({ 
  vehicle, 
  clients 
}: { 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  vehicle: any;
  clients: { id: string; name: string }[];
}) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onEditSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const result = await updateVehicle(vehicle.id, formData);
    setLoading(false);
    
    if (result.success) {
      setShowEditDialog(false);
    } else {
      setError(result.error || "Error al actualizar el vehículo");
    }
  }

  async function onDelete() {
    setLoading(true);
    setError("");
    const result = await deleteVehicle(vehicle.id);
    setLoading(false);
    
    if (result.success) {
      setShowDeleteDialog(false);
    } else {
      setError(result.error || "Error al eliminar el vehículo");
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 cursor-pointer">
          <span className="sr-only">Abrir menú</span>
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => window.location.href = `/dashboard/vehicles/${vehicle.id}`} className="cursor-pointer">
            <Eye className="mr-2 h-4 w-4" />
            <span>Ver detalles</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowEditDialog(true)} className="cursor-pointer">
            <Edit className="mr-2 h-4 w-4" />
            <span>Editar vehículo</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Eliminar</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <form action={onEditSubmit}>
            <DialogHeader>
              <DialogTitle>Editar Vehículo</DialogTitle>
              <DialogDescription>
                Modifica los datos del vehículo.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="grid gap-2">
                <label htmlFor="clientId" className="text-sm font-medium">Cliente *</label>
                <select 
                  id="clientId" 
                  name="clientId" 
                  required 
                  defaultValue={vehicle.clientId}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Selecciona un cliente</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="plate" className="text-sm font-medium">Placa *</label>
                <Input id="plate" name="plate" required defaultValue={vehicle.plate} />
              </div>
              <div className="grid gap-2">
                <label htmlFor="brand" className="text-sm font-medium">Marca *</label>
                <Input id="brand" name="brand" required defaultValue={vehicle.brand} />
              </div>
              <div className="grid gap-2">
                <label htmlFor="model" className="text-sm font-medium">Modelo *</label>
                <Input id="model" name="model" required defaultValue={vehicle.model} />
              </div>
              <div className="grid gap-2">
                <label htmlFor="year" className="text-sm font-medium">Año</label>
                <Input id="year" name="year" type="number" defaultValue={vehicle.year || ""} />
              </div>
              <div className="grid gap-2">
                <label htmlFor="color" className="text-sm font-medium">Color</label>
                <Input id="color" name="color" defaultValue={vehicle.color || ""} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>Cancelar</Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Guardar cambios"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Eliminar Vehículo</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar el vehículo con placa {vehicle.plate}? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancelar</Button>
            <Button type="button" variant="destructive" onClick={onDelete} disabled={loading}>
              {loading ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
