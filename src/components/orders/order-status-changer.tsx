"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateOrderStatus } from "@/actions/orders";
import { ChevronDown } from "lucide-react";

const STATUS_MAP = {
  PENDING: { label: "Pendiente", className: "bg-amber-50 text-amber-600 hover:bg-amber-50 border-amber-200", dotClass: "bg-amber-600" },
  IN_PROCESS: { label: "En Proceso", className: "bg-blue-50 text-blue-600 hover:bg-blue-50 border-blue-200", dotClass: "bg-blue-600" },
  READY: { label: "Listo", className: "bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-emerald-200", dotClass: "bg-emerald-600" },
  DELIVERED: { label: "Entregado", className: "bg-slate-100 text-slate-600 hover:bg-slate-100 border-slate-200", dotClass: "bg-slate-600" },
  CANCELLED: { label: "Cancelado", className: "bg-red-50 text-red-600 hover:bg-red-50 border-red-200", dotClass: "bg-red-600" },
};

export function OrderStatusChanger({ 
  orderId, 
  currentStatus 
}: { 
  orderId: string; 
  currentStatus: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleStatusChange(newStatus: keyof typeof STATUS_MAP) {
    if (newStatus === currentStatus) return;
    
    setLoading(true);
    await updateOrderStatus(orderId, newStatus);
    setLoading(false);
  }

  const current = STATUS_MAP[currentStatus as keyof typeof STATUS_MAP] || STATUS_MAP.PENDING;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={loading} className="focus:outline-none">
        <Badge 
          variant="secondary" 
          className={`ml-auto cursor-pointer flex items-center gap-1.5 ${current.className}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${current.dotClass}`}></span>
          {current.label}
          <ChevronDown className="w-3 h-3 ml-1" />
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(STATUS_MAP).map(([status, { label }]) => (
          <DropdownMenuItem 
            key={status}
            onClick={() => handleStatusChange(status as keyof typeof STATUS_MAP)}
            className={status === currentStatus ? "bg-slate-100 font-medium" : ""}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
