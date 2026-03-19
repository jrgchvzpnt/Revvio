"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createVehicle } from "@/actions/vehicles";
import { Plus } from "lucide-react";

export function NewVehicleDialog({ clients }: { clients: { id: string; name: string }[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const result = await createVehicle(formData);
    setLoading(false);
    
    if (result.success) {
      setOpen(false);
    } else {
      setError(result.error || "Error al crear el vehículo");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button><Plus className="mr-2 h-4 w-4" /> Nuevo vehículo</Button>} />
      <DialogContent className="sm:max-w-[425px]">
        <form action={onSubmit}>
          <DialogHeader>
            <DialogTitle>Nuevo Vehículo</DialogTitle>
            <DialogDescription>
              Registra un nuevo vehículo en el sistema.
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
              <Input id="plate" name="plate" required placeholder="Ej. ABC-123" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="brand" className="text-sm font-medium">Marca *</label>
              <Input id="brand" name="brand" required placeholder="Ej. Toyota" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="model" className="text-sm font-medium">Modelo *</label>
              <Input id="model" name="model" required placeholder="Ej. Corolla" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="year" className="text-sm font-medium">Año</label>
              <Input id="year" name="year" type="number" placeholder="Ej. 2020" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar vehículo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
