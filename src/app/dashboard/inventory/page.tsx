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

export const dynamic = 'force-dynamic';

export default function InventoryPage() {
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
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-amber-800">Stock bajo detectado</h3>
          <p className="text-sm text-amber-700 mt-1">2 repuestos están por debajo del mínimo configurado</p>
        </div>
        <Button variant="ghost" size="icon" className="text-amber-600 hover:bg-amber-100 -mt-1 -mr-1">
          <XCircle className="w-4 h-4" />
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-slate-100 rounded-lg">
              <Package className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Total Repuestos</p>
              <p className="text-2xl font-bold text-slate-900">2</p>
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
              <p className="text-2xl font-bold text-amber-700">2</p>
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
              <p className="text-2xl font-bold text-red-700">1</p>
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
              <p className="text-2xl font-bold text-emerald-700">$30.00</p>
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
          <Badge variant="secondary" className="bg-amber-50 text-amber-600">2 en alerta</Badge>
        </div>
        
        {/* Search and Filters */}
        <div className="p-4 border-b flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Buscar repuesto o SKU..." className="pl-9" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-slate-100">
              Todos <Badge variant="secondary" className="ml-2">2</Badge>
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-500">
              En stock <Badge variant="secondary" className="ml-2">0</Badge>
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-500">
              Stock bajo <Badge variant="secondary" className="ml-2">1</Badge>
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-500">
              Sin stock <Badge variant="secondary" className="ml-2">1</Badge>
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
            {/* Row 1 */}
            <TableRow>
              <TableCell>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Filtro de aceite sintético</div>
                    <div className="text-xs text-slate-500">FE-23434</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm">$24.57</TableCell>
              <TableCell className="font-medium">$30.00</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-6 w-6">-</Button>
                  <span className="w-4 text-center text-sm">1</span>
                  <Button variant="outline" size="icon" className="h-6 w-6">+</Button>
                </div>
              </TableCell>
              <TableCell className="text-sm text-slate-500">1</TableCell>
              <TableCell>
                <Badge variant="secondary" className="bg-amber-50 text-amber-600 hover:bg-amber-50">
                  Bajo
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>

            {/* Row 2 */}
            <TableRow>
              <TableCell>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                  <div>
                    <div className="font-medium">Prueba prueba</div>
                    <div className="text-xs text-slate-500">BA-234</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm">$1,234.43</TableCell>
              <TableCell className="font-medium">$1,234.43</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-6 w-6">-</Button>
                  <span className="w-4 text-center text-sm">0</span>
                  <Button variant="outline" size="icon" className="h-6 w-6">+</Button>
                </div>
              </TableCell>
              <TableCell className="text-sm text-slate-500">1</TableCell>
              <TableCell>
                <Badge variant="secondary" className="bg-red-50 text-red-600 hover:bg-red-50">
                  Sin stock
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
