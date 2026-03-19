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
  Filter, 
  MoreHorizontal, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  PlayCircle,
  FileText
} from "lucide-react";
import { NewOrderDialog } from "@/components/orders/new-order-dialog";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const statusFilter = typeof searchParams.status === 'string' ? searchParams.status : undefined;
  const searchFilter = typeof searchParams.search === 'string' ? searchParams.search : undefined;

  const vehicles = await prisma.vehicle.findMany({
    include: {
      client: true,
    },
    orderBy: {
      plate: 'asc',
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const whereClause: any = {};
  if (statusFilter) {
    whereClause.status = statusFilter;
  }
  if (searchFilter) {
    whereClause.OR = [
      { orderNumber: { contains: searchFilter } },
      { client: { name: { contains: searchFilter } } },
      { vehicle: { plate: { contains: searchFilter } } },
    ];
  }

  const orders = await prisma.workOrder.findMany({
    where: whereClause,
    include: {
      client: true,
      vehicle: true,
      mechanic: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const allOrders = await prisma.workOrder.findMany();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pendingCount = allOrders.filter((o: any) => o.status === 'PENDING').length;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inProcessCount = allOrders.filter((o: any) => o.status === 'IN_PROCESS').length;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const readyCount = allOrders.filter((o: any) => o.status === 'READY').length;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deliveredCount = allOrders.filter((o: any) => o.status === 'DELIVERED').length;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cancelledCount = allOrders.filter((o: any) => o.status === 'CANCELLED').length;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const totalAmount = allOrders.reduce((sum: number, o: any) => sum + o.total, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge variant="secondary" className="bg-amber-50 text-amber-600 hover:bg-amber-50">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mr-1.5"></span>
            Pendiente
          </Badge>
        );
      case 'IN_PROCESS':
        return (
          <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-50">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-1.5"></span>
            En proceso
          </Badge>
        );
      case 'READY':
        return (
          <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5"></span>
            Listo
          </Badge>
        );
      case 'DELIVERED':
        return (
          <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-100">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mr-1.5"></span>
            Entregado
          </Badge>
        );
      case 'CANCELLED':
        return (
          <Badge variant="secondary" className="bg-red-50 text-red-600 hover:bg-red-50">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 mr-1.5"></span>
            Cancelado
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Órdenes de Trabajo</h1>
          <p className="text-sm text-slate-500">Gestiona y da seguimiento a todas las órdenes activas del taller.</p>
        </div>
        <NewOrderDialog vehicles={vehicles} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-slate-100 rounded-lg">
              <FileText className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Total OT</p>
              <p className="text-2xl font-bold text-slate-900">{allOrders.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50/50 border-amber-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-amber-600 uppercase">Pendientes</p>
              <p className="text-2xl font-bold text-amber-700">{pendingCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50/50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <PlayCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-blue-600 uppercase">En Proceso</p>
              <p className="text-2xl font-bold text-blue-700">{inProcessCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50/50 border-emerald-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <span className="text-emerald-600 font-bold">$</span>
            </div>
            <div>
              <p className="text-xs font-medium text-emerald-600 uppercase">Monto Total</p>
              <p className="text-2xl font-bold text-emerald-700">${totalAmount.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <Card>
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-slate-800">Centro de Gestión de Órdenes</h2>
          <p className="text-sm text-slate-500">Filtra, ordena y actúa rápido sobre cada OT sin cambiar de contexto.</p>
        </div>
        
        {/* Filters */}
        <div className="p-4 border-b flex flex-wrap gap-2">
          <Link href="/dashboard/orders">
            <Button variant={!statusFilter ? "outline" : "ghost"} size="sm" className={!statusFilter ? "bg-slate-100" : "text-slate-500"}>
              <FileText className="w-4 h-4 mr-2" /> Todos <Badge variant="secondary" className="ml-2">{allOrders.length}</Badge>
            </Button>
          </Link>
          <Link href="/dashboard/orders?status=PENDING">
            <Button variant={statusFilter === 'PENDING' ? "outline" : "ghost"} size="sm" className={statusFilter === 'PENDING' ? "bg-slate-100" : "text-slate-500"}>
              <Clock className="w-4 h-4 mr-2" /> Pendiente <Badge variant="secondary" className="ml-2">{pendingCount}</Badge>
            </Button>
          </Link>
          <Link href="/dashboard/orders?status=IN_PROCESS">
            <Button variant={statusFilter === 'IN_PROCESS' ? "outline" : "ghost"} size="sm" className={statusFilter === 'IN_PROCESS' ? "bg-slate-100" : "text-slate-500"}>
              <PlayCircle className="w-4 h-4 mr-2" /> En Proceso <Badge variant="secondary" className="ml-2">{inProcessCount}</Badge>
            </Button>
          </Link>
          <Link href="/dashboard/orders?status=READY">
            <Button variant={statusFilter === 'READY' ? "outline" : "ghost"} size="sm" className={statusFilter === 'READY' ? "bg-slate-100" : "text-slate-500"}>
              <CheckCircle2 className="w-4 h-4 mr-2" /> Listo <Badge variant="secondary" className="ml-2">{readyCount}</Badge>
            </Button>
          </Link>
          <Link href="/dashboard/orders?status=DELIVERED">
            <Button variant={statusFilter === 'DELIVERED' ? "outline" : "ghost"} size="sm" className={statusFilter === 'DELIVERED' ? "bg-slate-100" : "text-slate-500"}>
              <CheckCircle2 className="w-4 h-4 mr-2" /> Entregado <Badge variant="secondary" className="ml-2">{deliveredCount}</Badge>
            </Button>
          </Link>
          <Link href="/dashboard/orders?status=CANCELLED">
            <Button variant={statusFilter === 'CANCELLED' ? "outline" : "ghost"} size="sm" className={statusFilter === 'CANCELLED' ? "bg-slate-100" : "text-slate-500"}>
              <XCircle className="w-4 h-4 mr-2" /> Cancelado <Badge variant="secondary" className="ml-2">{cancelledCount}</Badge>
            </Button>
          </Link>
        </div>

        {/* Search and Actions */}
        <div className="p-4 flex items-center justify-between gap-4">
          <form className="relative flex-1 max-w-md" action="/dashboard/orders" method="GET">
            {statusFilter && <input type="hidden" name="status" value={statusFilter} />}
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input name="search" defaultValue={searchFilter} placeholder="Buscar por OT, cliente o placa..." className="pl-9" />
          </form>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Todos los clientes
            </Button>
            <Button variant="outline" size="sm">
              Todo
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Más reciente
            </Button>
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° OT</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Vehículo</TableHead>
              <TableHead>Mecánico</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Última act.</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {orders.map((order: any) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="font-medium text-emerald-600">{order.orderNumber}</div>
                  <div className="text-xs text-slate-500">Creada {format(new Date(order.createdAt), "d MMM yyyy", { locale: es })}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{order.client.name}</div>
                  <div className="text-xs text-slate-500">{order.client.phone || order.client.email || "-"}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{order.vehicle.plate}</div>
                  <div className="text-xs text-slate-500">{order.vehicle.brand} {order.vehicle.model}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{order.mechanic?.name || "-"}</div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(order.status)}
                </TableCell>
                <TableCell className="text-right font-medium">${order.total.toFixed(2)}</TableCell>
                <TableCell className="text-sm text-slate-500">{format(new Date(order.updatedAt), "d MMM yyyy", { locale: es })}</TableCell>
                <TableCell>
                  <Link href={`/dashboard/orders/${order.id}`}>
                    <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 cursor-pointer">
                      <MoreHorizontal className="w-4 h-4" />
                    </div>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                  No se encontraron órdenes de trabajo.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
