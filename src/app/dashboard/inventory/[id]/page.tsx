import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function InventoryItemPage({
  params,
}: {
  params: { id: string };
}) {
  const item = await prisma.inventoryItem.findUnique({
    where: { id: params.id },
  });

  if (!item) {
    notFound();
  }

  const margin = item.costPrice > 0 
    ? ((item.salePrice - item.costPrice) / item.costPrice) * 100 
    : 0;
  
  const inventoryValue = item.stock * item.salePrice;
  
  const isLowStock = item.stock <= item.minStock && item.stock > 0;
  const isOutOfStock = item.stock === 0;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/inventory">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{item.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-muted-foreground text-sm">
                {item.sku ? `# ${item.sku}` : "Sin SKU"}
              </span>
              {isOutOfStock ? (
                <Badge variant="destructive">Sin stock</Badge>
              ) : isLowStock ? (
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20">Stock bajo</Badge>
              ) : (
                <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">En stock</Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Minus className="mr-2 h-4 w-4" />
            Reducir
          </Button>
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Aumentar
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button variant="destructive" size="sm" className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200">
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.stock}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Mínimo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.minStock}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Margen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{margin.toFixed(0)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Valor inv.</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${inventoryValue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <Tabs defaultValue="resumen" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger 
                value="resumen" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
              >
                Resumen
              </TabsTrigger>
              <TabsTrigger 
                value="movimientos" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
              >
                Movimientos
              </TabsTrigger>
              <TabsTrigger 
                value="configuracion" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
              >
                Configuración
              </TabsTrigger>
            </TabsList>
            <TabsContent value="resumen" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Nivel de stock</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-sm text-muted-foreground">Disponible</div>
                      <div className="text-4xl font-bold text-yellow-500 flex items-baseline gap-2">
                        {item.stock}
                        {isLowStock && <span className="text-sm font-normal">Bajo</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Stock mínimo</div>
                      <div className="text-xl font-semibold">{item.minStock}</div>
                    </div>
                  </div>
                  
                  <div className="relative h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={`absolute top-0 left-0 h-full ${isOutOfStock ? 'bg-red-500' : isLowStock ? 'bg-yellow-500' : 'bg-green-500'}`} 
                      style={{ width: `${Math.min((item.stock / (item.minStock * 3)) * 100, 100)}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0</span>
                    <span>Min: {item.minStock}</span>
                    <span>{item.minStock * 3}</span>
                  </div>

                  {isLowStock && (
                    <div className="bg-yellow-500/10 text-yellow-600 p-3 rounded-md text-sm flex items-center gap-2">
                      <span className="font-medium">Stock bajo.</span> Está por debajo del mínimo de {item.minStock} unidades.
                    </div>
                  )}
                  {isOutOfStock && (
                    <div className="bg-red-500/10 text-red-600 p-3 rounded-md text-sm flex items-center gap-2">
                      <span className="font-medium">Sin stock.</span> El inventario está agotado.
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Precios y rentabilidad</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">COSTO</div>
                      <div className="text-xl font-bold">${item.costPrice.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">VENTA</div>
                      <div className="text-xl font-bold text-green-600">${item.salePrice.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">MARGEN</div>
                      <div className="text-xl font-bold">{margin.toFixed(0)}%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="movimientos">
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  Historial de movimientos próximamente
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="configuracion">
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  Configuración próximamente
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Resumen rápido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">ESTADO ACTUAL</div>
                {isOutOfStock ? (
                  <Badge variant="destructive">Sin stock</Badge>
                ) : isLowStock ? (
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20">Stock bajo</Badge>
                ) : (
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">En stock</Badge>
                )}
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">UNIDADES DISPONIBLES</div>
                <div className="text-xl font-semibold text-yellow-500">{item.stock}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">PRECIO DE VENTA</div>
                <div className="text-xl font-semibold text-green-600">${item.salePrice.toFixed(2)}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
