"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { addOrderItem } from "@/actions/orders";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InventoryItem {
  id: string;
  name: string;
  sku: string | null;
  salePrice: number;
  stock: number;
}

interface AddOrderItemDialogProps {
  orderId: string;
  inventoryItems: InventoryItem[];
}

export function AddOrderItemDialog({ orderId, inventoryItems }: AddOrderItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<"PART" | "SERVICE">("SERVICE");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const handleItemSelect = (itemId: string | null) => {
    if (!itemId) return;
    const item = inventoryItems.find(i => i.id === itemId);
    if (item) {
      setSelectedItem(item);
    }
  };

  async function onSubmit(formData: FormData) {
    setLoading(true);
    formData.append("workOrderId", orderId);
    formData.append("type", type);
    
    if (type === "PART" && selectedItem) {
      formData.append("inventoryItemId", selectedItem.id);
      formData.append("description", selectedItem.name);
      if (!formData.get("unitPrice")) {
        formData.append("unitPrice", selectedItem.salePrice.toString());
      }
    }

    const result = await addOrderItem(formData);

    if (result.success) {
      alert("El ítem se ha agregado a la orden exitosamente.");
      setOpen(false);
      setSelectedItem(null);
      setType("SERVICE");
    } else {
      alert(result.error || "Ocurrió un error al agregar el ítem.");
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" className="flex items-center gap-2" />}>
        <Plus className="w-4 h-4" />
        Agregar Ítem
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Ítem a la Orden</DialogTitle>
        </DialogHeader>
        <form action={onSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Tipo de Ítem</label>
            <Select value={type} onValueChange={(v) => setType(v as "PART" | "SERVICE")}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SERVICE">Servicio (Mano de obra)</SelectItem>
                <SelectItem value="PART">Repuesto (Del inventario)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === "PART" ? (
            <div className="space-y-2">
              <label htmlFor="inventoryItemId" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Seleccionar Repuesto</label>
              <Select onValueChange={handleItemSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Buscar repuesto..." />
                </SelectTrigger>
                <SelectContent>
                  {inventoryItems.map((item) => (
                    <SelectItem key={item.id} value={item.id} disabled={item.stock <= 0}>
                      {item.name} {item.sku ? `(${item.sku})` : ''} - ${item.salePrice} (Stock: {item.stock})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Descripción del Servicio</label>
              <Input
                id="description"
                name="description"
                placeholder="Ej: Cambio de aceite"
                required
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="quantity" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Cantidad</label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                defaultValue="1"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="unitPrice" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Precio Unitario ($)</label>
              <Input
                id="unitPrice"
                name="unitPrice"
                type="number"
                step="0.01"
                min="0"
                defaultValue={type === "PART" && selectedItem ? selectedItem.salePrice : ""}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || (type === "PART" && !selectedItem)}>
              {loading ? "Agregando..." : "Agregar Ítem"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
