import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Users, 
  Car, 
  Phone, 
  Mail,
  FileText,
  LayoutGrid,
  List,
  Clock
} from "lucide-react";
import { NewClientDialog } from "@/components/clients/new-client-dialog";
import { ClientActions } from "@/components/clients/client-actions";
import { getClients } from "@/actions/clients";

export const dynamic = 'force-dynamic';

export default async function ClientsPage() {
  const result = await getClients();
  const clients = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clientes</h1>
          <p className="text-sm text-slate-500">Gestiona tu cartera de clientes y su historial de servicios.</p>
        </div>
        <NewClientDialog />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-slate-100 rounded-lg">
              <Users className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Total Clientes</p>
              <p className="text-2xl font-bold text-slate-900">{clients?.length || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50/50 border-emerald-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Car className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-emerald-600 uppercase">Con Vehículos</p>
              <p className="text-2xl font-bold text-emerald-700">1</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50/50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Phone className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-blue-600 uppercase">Con Teléfono</p>
              <p className="text-2xl font-bold text-blue-700">1</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-indigo-50/50 border-indigo-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Mail className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-indigo-600 uppercase">Con Email</p>
              <p className="text-2xl font-bold text-indigo-700">1</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <Card>
        <div className="p-4 border-b flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Centro de Gestión de Clientes</h2>
            <p className="text-sm text-slate-500">Encuentra, segmenta y administra tu cartera con acciones rápidas en una sola vista.</p>
          </div>
          <Badge variant="secondary" className="bg-emerald-50 text-emerald-600">1 con vehículos</Badge>
        </div>
        
        {/* Search and Filters */}
        <div className="p-4 border-b flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Buscar por nombre, teléfono o email..." className="pl-9" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-slate-100">
              Todos <Badge variant="secondary" className="ml-2">1</Badge>
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-500">
              Con vehículos <Badge variant="secondary" className="ml-2">1</Badge>
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-500">
              Sin vehículos <Badge variant="secondary" className="ml-2">0</Badge>
            </Button>
            <Button variant="outline" size="sm">
              ↑↓ Nombre A-Z
            </Button>
            <div className="flex items-center border rounded-md ml-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none bg-slate-100">
                <List className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none">
                <LayoutGrid className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Client Cards Grid */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {clients?.map((client: any) => (
            <Card key={client.id} className="border shadow-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      {client.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{client.name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> DESDE {new Date(client.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <ClientActions client={client} />
                </div>
                
                <div className="space-y-2 mb-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Teléfono</p>
                    <p className="text-sm font-medium flex items-center gap-2">
                      <Phone className="w-3 h-3 text-slate-400" /> {client.phone || "No registrado"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Correo</p>
                    <p className="text-sm font-medium flex items-center gap-2">
                      <Mail className="w-3 h-3 text-slate-400" /> {client.email || "No registrado"}
                    </p>
                  </div>
                </div>

                {client.notes && (
                  <div className="pt-3 border-t flex items-center gap-2 text-sm text-slate-600">
                    <FileText className="w-4 h-4 text-slate-400" />
                    {client.notes}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          {(!clients || clients.length === 0) && (
            <div className="col-span-full text-center py-8 text-slate-500">
              No hay clientes registrados aún.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
