"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  Car, 
  Package, 
  Bell
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname !== "/dashboard") {
      return false;
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-md flex items-center justify-center text-white font-bold">
            R
          </div>
          <h2 className="text-xl font-bold text-slate-800">Revvio</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
              isActive("/dashboard") && pathname === "/dashboard"
                ? "text-emerald-600 bg-emerald-50"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/orders"
            className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
              isActive("/dashboard/orders")
                ? "text-emerald-600 bg-emerald-50"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <ClipboardList className="w-5 h-5" />
            Órdenes
          </Link>
          <Link
            href="/dashboard/clients"
            className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
              isActive("/dashboard/clients")
                ? "text-emerald-600 bg-emerald-50"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Users className="w-5 h-5" />
            Clientes
          </Link>
          <Link
            href="/dashboard/vehicles"
            className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
              isActive("/dashboard/vehicles")
                ? "text-emerald-600 bg-emerald-50"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Car className="w-5 h-5" />
            Vehículos
          </Link>
          <Link
            href="/dashboard/inventory"
            className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
              isActive("/dashboard/inventory")
                ? "text-emerald-600 bg-emerald-50"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Package className="w-5 h-5" />
            Inventario
          </Link>
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-md cursor-pointer transition-colors">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-emerald-100 text-emerald-700">AI</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">Anyelo Isaac...</p>
              <p className="text-xs text-slate-500 truncate">anyelobg.dev@...</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-8">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              AI
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
