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
import { createInventoryItem } from "@/actions/inventory";
import { Plus } from "lucide-react";

export function NewInventoryDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const result = await createInventoryItem(formData);
    setLoading(false);
    
    if (result.success) {
      setOpen(false);
    } else {
      setError(result.error || "Error al crear el repuesto");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="bg-emerald-600 hover:bg-emerald-700"><Plus className="mr-2 h-4 w-4" /> Nuevo repuesto</Button>} />
      <DialogContent className="sm:max-w-[425px]">
        <form action={onSubmit}>
          <DialogHeader>
            <DialogTitle>Nuevo Repuesto</DialogTitle>
            <DialogDescription>
              Agrega productos al inventario para su uso en órdenes de trabajo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">Nombre del Repuesto *</label>
              <Input id="name" name="name" required placeholder="Ej. Filtro de aceite sintético" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="sku" className="text-sm font-medium">SKU / Código</label>
              <Input id="sku" name="sku" placeholder="Ej. F-12345" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="costPrice" className="text-sm font-medium">Precio de Costo *</label>
                <Input id="costPrice" name="costPrice" type="number" step="0.01" required placeholder="$ 0.00" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="salePrice" className="text-sm font-medium">Precio de Venta *</label>
                <Input id="salePrice" name="salePrice" type="number" step="0.01" required placeholder="$ 0.00" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="stock" className="text-sm font-medium">Stock Inicial *</label>
                <Input id="stock" name="stock" type="number" required defaultValue="0" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="minStock" className="text-sm font-medium">Stock Mínimo (Alerta) *</label>
                <Input id="minStock" name="minStock" type="number" required defaultValue="1" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
              {loading ? "Guardando..." : "Agregar Repuesto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
