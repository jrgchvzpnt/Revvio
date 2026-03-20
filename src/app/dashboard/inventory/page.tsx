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
  Package, 
  AlertTriangle, 
  XCircle,
  DollarSign,
  MoreHorizontal
} from "lucide-react";
import { NewInventoryDialog } from "@/components/inventory/new-inventory-dialog";
import { getInventoryItems } from "@/actions/inventory";
import { InventoryTableRow } from "@/components/inventory/inventory-table-row";

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
  const { data: items = [] } = await getInventoryItems();
  
  const totalItems = items?.length || 0;
  const lowStockItems = items?.filter(item => item.stock <= item.minStock && item.stock > 0) || [];
  const outOfStockItems = items?.filter(item => item.stock === 0) || [];
  const totalValue = items?.reduce((acc, item) => acc + (item.costPrice * item.stock), 0) || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventario</h1>
          <p className="text-sm text-slate-500">Controla el stock de repuestos y recibe alertas antes de quedarte sin nada.</p>
        </div>
        <NewInventoryDialog />
      </div>

      {/* Alert Banner */}
      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-amber-800">Stock bajo detectado</h3>
            <p className="text-sm text-amber-700 mt-1">
              {lowStockItems.length + outOfStockItems.length} repuestos están por debajo del mínimo configurado
            </p>
          </div>
          <Button variant="ghost" size="icon" className="text-amber-600 hover:bg-amber-100 -mt-1 -mr-1">
            <XCircle className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-slate-100 rounded-lg">
              <Package className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Total Repuestos</p>
              <p className="text-2xl font-bold text-slate-900">{totalItems}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50/50 border-amber-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-amber-600 uppercase">Stock Bajo</p>
              <p className="text-2xl font-bold text-amber-700">{lowStockItems.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50/50 border-red-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-red-600 uppercase">Sin Stock</p>
              <p className="text-2xl font-bold text-red-700">{outOfStockItems.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50/50 border-emerald-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-emerald-600 uppercase">Valor Inventario</p>
              <p className="text-2xl font-bold text-emerald-700">${totalValue.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <Card>
        <div className="p-4 border-b flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Centro de Gestión de Inventario</h2>
            <p className="text-sm text-slate-500">Filtra, ajusta y actúa sobre repuestos con una vista operativa enfocada en rapidez.</p>
          </div>
          <Badge variant="secondary" className="bg-amber-50 text-amber-600">
            {lowStockItems.length + outOfStockItems.length} en alerta
          </Badge>
        </div>
        
        {/* Search and Filters */}
        <div className="p-4 border-b flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Buscar repuesto o SKU..." className="pl-9" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-slate-100">
              Todos <Badge variant="secondary" className="ml-2">{totalItems}</Badge>
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-500">
              En stock <Badge variant="secondary" className="ml-2">{totalItems - lowStockItems.length - outOfStockItems.length}</Badge>
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-500">
              Stock bajo <Badge variant="secondary" className="ml-2">{lowStockItems.length}</Badge>
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-500">
              Sin stock <Badge variant="secondary" className="ml-2">{outOfStockItems.length}</Badge>
            </Button>
            <Button variant="outline" size="sm">
              ↑↓ Nombre A-Z
            </Button>
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Repuesto</TableHead>
              <TableHead>Costo</TableHead>
              <TableHead>Venta</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Mín.</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items?.map((item) => (
              <InventoryTableRow key={item.id} item={item} />
            ))}
            {(!items || items.length === 0) && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                  No hay repuestos en el inventario
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
