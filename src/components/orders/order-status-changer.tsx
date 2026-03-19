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
  PENDING: { label: "Pendiente", variant: "secondary" as const },
  IN_PROGRESS: { label: "En Proceso", variant: "default" as const },
  FINISHED: { label: "Finalizado", variant: "default" as const },
  DELIVERED: { label: "Entregado", variant: "outline" as const },
  CANCELLED: { label: "Cancelado", variant: "destructive" as const },
};

export function OrderStatusChanger({ 
  orderId, 
  currentStatus 
}: { 
  orderId: string; 
  currentStatus: keyof typeof STATUS_MAP;
}) {
  const [loading, setLoading] = useState(false);

  async function handleStatusChange(newStatus: keyof typeof STATUS_MAP) {
    if (newStatus === currentStatus) return;
    
    setLoading(true);
    await updateOrderStatus(orderId, newStatus);
    setLoading(false);
  }

  const current = STATUS_MAP[currentStatus] || STATUS_MAP.PENDING;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={loading} className="focus:outline-none">
        <Badge 
          variant={current.variant} 
          className="ml-auto cursor-pointer flex items-center gap-1"
        >
          {current.label}
          <ChevronDown className="w-3 h-3" />
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
