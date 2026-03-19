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
import { Textarea } from "@/components/ui/textarea";
import { createOrder } from "@/actions/orders";
import { Plus } from "lucide-react";
import { CarDamageSelector } from "./car-damage-selector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Vehicle = {
  id: string;
  plate: string;
  brand: string;
  model: string;
  client: {
    id: string;
    name: string;
  };
};

export function NewOrderDialog({ vehicles }: { vehicles: Vehicle[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    
    const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);
    if (selectedVehicle) {
      formData.append("clientId", selectedVehicle.client.id);
    }

    const result = await createOrder(formData);
    setLoading(false);
    
    if (result.success) {
      setOpen(false);
    } else {
      setError(result.error || "Error al crear la orden");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="bg-emerald-600 hover:bg-emerald-700"><Plus className="mr-2 h-4 w-4" /> Nueva OT</Button>} />
      <DialogContent className="sm:max-w-[500px]">
        <form action={onSubmit}>
          <DialogHeader>
            <DialogTitle>Nueva Orden de Trabajo</DialogTitle>
            <DialogDescription>
              Registra el ingreso de un vehículo al taller.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="grid gap-2">
              <label htmlFor="vehicleId" className="text-sm font-medium">Vehículo *</label>
              <Select name="vehicleId" required value={selectedVehicleId || ""} onValueChange={setSelectedVehicleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un vehículo" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.plate} - {vehicle.brand} {vehicle.model} ({vehicle.client.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="mileageIn" className="text-sm font-medium">Kilometraje de Ingreso (opcional)</label>
              <Input id="mileageIn" name="mileageIn" type="number" placeholder="Ej: 50000" />
              <p className="text-xs text-slate-500">Lectura del odómetro al momento de la recepción.</p>
            </div>
            <div className="grid gap-2">
              <label htmlFor="diagnosis" className="text-sm font-medium">Diagnóstico / Problemas Reportados (opcional)</label>
              <Textarea 
                id="diagnosis" 
                name="diagnosis" 
                placeholder="Describe los síntomas o problemas reportados por el cliente, o tu diagnóstico inicial..." 
                className="min-h-[100px]"
              />
            </div>
            <div className="grid gap-2">
              <CarDamageSelector />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
              {loading ? "Creando..." : "Crear Orden"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
