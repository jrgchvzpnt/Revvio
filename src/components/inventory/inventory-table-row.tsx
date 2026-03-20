"use client";

import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { updateStock, deleteInventoryItem } from "@/actions/inventory";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditInventoryDialog } from "./edit-inventory-dialog";
import { useRouter } from "next/navigation";

interface InventoryItem {
  id: string;
  name: string;
  sku: string | null;
  costPrice: number;
  salePrice: number;
  stock: number;
  minStock: number;
}

export function InventoryTableRow({ item }: { item: InventoryItem }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const router = useRouter();

  const handleStockChange = async (newStock: number) => {
    if (newStock < 0) return;
    setIsUpdating(true);
    try {
      await updateStock(item.id, newStock);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("¿Estás seguro de que deseas eliminar este repuesto?")) {
      await deleteInventoryItem(item.id);
    }
  };

  const isLowStock = item.stock <= item.minStock && item.stock > 0;
  const isOutOfStock = item.stock === 0;

  return (
    <>
      <TableRow>
        <TableCell>
          <div className="flex items-start gap-2">
            {isLowStock && <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />}
            {isOutOfStock && <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />}
            <div>
              <div className="font-medium">{item.name}</div>
              {item.sku && <div className="text-xs text-slate-500">{item.sku}</div>}
            </div>
          </div>
        </TableCell>
        <TableCell className="text-sm">${item.costPrice.toFixed(2)}</TableCell>
        <TableCell className="font-medium">${item.salePrice.toFixed(2)}</TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-6 w-6"
              onClick={() => handleStockChange(item.stock - 1)}
              disabled={isUpdating || item.stock <= 0}
            >
              -
            </Button>
            <span className="w-4 text-center text-sm">{item.stock}</span>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-6 w-6"
              onClick={() => handleStockChange(item.stock + 1)}
              disabled={isUpdating}
            >
              +
            </Button>
          </div>
        </TableCell>
        <TableCell className="text-sm text-slate-500">{item.minStock}</TableCell>
        <TableCell>
          {isOutOfStock ? (
            <Badge variant="secondary" className="bg-red-50 text-red-600 hover:bg-red-50">
              Sin stock
            </Badge>
          ) : isLowStock ? (
            <Badge variant="secondary" className="bg-amber-50 text-amber-600 hover:bg-amber-50">
              Bajo
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50">
              Normal
            </Badge>
          )}
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 cursor-pointer">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/dashboard/inventory/${item.id}`)}>
                Ver detalles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                <Pencil className="w-4 h-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                <Trash className="w-4 h-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      <EditInventoryDialog 
        item={item} 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
      />
    </>
  );
}
