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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { updateInventoryItem } from "@/actions/inventory";

interface InventoryItem {
  id: string;
  name: string;
  sku: string | null;
  costPrice: number;
  salePrice: number;
  stock: number;
  minStock: number;
}

interface EditInventoryDialogProps {
  item: InventoryItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditInventoryDialog({ item, open, onOpenChange }: EditInventoryDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const result = await updateInventoryItem(item.id, formData);
    setLoading(false);
    
    if (result.success) {
      onOpenChange(false);
    } else {
      setError(result.error || "Error al actualizar el repuesto");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form action={onSubmit}>
          <DialogHeader>
            <DialogTitle>Editar Repuesto</DialogTitle>
            <DialogDescription>
              Modifica los datos del repuesto.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">Nombre del Repuesto *</label>
              <Input id="name" name="name" required defaultValue={item.name} />
            </div>
            <div className="grid gap-2">
              <label htmlFor="sku" className="text-sm font-medium">SKU / Código</label>
              <Input id="sku" name="sku" defaultValue={item.sku || ""} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="costPrice" className="text-sm font-medium">Precio de Costo *</label>
                <Input id="costPrice" name="costPrice" type="number" step="0.01" required defaultValue={item.costPrice} />
              </div>
              <div className="grid gap-2">
                <label htmlFor="salePrice" className="text-sm font-medium">Precio de Venta *</label>
                <Input id="salePrice" name="salePrice" type="number" step="0.01" required defaultValue={item.salePrice} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="stock" className="text-sm font-medium">Stock Actual *</label>
                <Input id="stock" name="stock" type="number" required defaultValue={item.stock} />
              </div>
              <div className="grid gap-2">
                <label htmlFor="minStock" className="text-sm font-medium">Stock Mínimo (Alerta) *</label>
                <Input id="minStock" name="minStock" type="number" required defaultValue={item.minStock} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
              {loading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
