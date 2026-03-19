"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const orderSchema = z.object({
  clientId: z.string().min(1, "El cliente es requerido"),
  vehicleId: z.string().min(1, "El vehículo es requerido"),
  mileageIn: z.coerce.number().optional().or(z.literal(0)),
  diagnosis: z.string().optional(),
  damages: z.string().optional(),
});

export async function createOrder(formData: FormData) {
  try {
    const data = {
      clientId: formData.get("clientId") as string,
      vehicleId: formData.get("vehicleId") as string,
      mileageIn: formData.get("mileageIn") ? Number(formData.get("mileageIn")) : undefined,
      diagnosis: formData.get("diagnosis") as string,
      damages: formData.get("damages") as string || undefined,
    };

    const validatedData = orderSchema.parse(data);

    // Generate order number (e.g., OT-0001)
    const count = await prisma.workOrder.count();
    const orderNumber = `OT-${String(count + 1).padStart(4, "0")}`;

    const order = await prisma.workOrder.create({
      data: {
        ...validatedData,
        orderNumber,
        mileageIn: validatedData.mileageIn || null,
      },
    });

    revalidatePath("/dashboard/orders");
    return { success: true, data: order };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Error al crear la orden" };
  }
}

export async function getOrders() {
  try {
    const orders = await prisma.workOrder.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        client: true,
        vehicle: true,
        mechanic: true,
      },
    });
    return { success: true, data: orders };
  } catch {
    return { success: false, error: "Error al obtener las órdenes" };
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const order = await prisma.workOrder.update({
      where: { id: orderId },
      data: { status },
    });
    
    revalidatePath("/dashboard/orders");
    return { success: true, data: order };
  } catch {
    return { success: false, error: "Error al actualizar el estado de la orden" };
  }
}

const orderItemSchema = z.object({
  workOrderId: z.string().min(1, "La orden es requerida"),
  inventoryItemId: z.string().optional(),
  description: z.string().min(1, "La descripción es requerida"),
  quantity: z.coerce.number().min(1, "La cantidad debe ser mayor a 0"),
  unitPrice: z.coerce.number().min(0, "El precio no puede ser negativo"),
  type: z.enum(["PART", "SERVICE"]),
});

export async function addOrderItem(formData: FormData) {
  try {
    const data = {
      workOrderId: formData.get("workOrderId") as string,
      inventoryItemId: formData.get("inventoryItemId") as string || undefined,
      description: formData.get("description") as string,
      quantity: Number(formData.get("quantity")),
      unitPrice: Number(formData.get("unitPrice")),
      type: formData.get("type") as "PART" | "SERVICE",
    };

    const validatedData = orderItemSchema.parse(data);
    const subtotal = validatedData.quantity * validatedData.unitPrice;

    // Start a transaction to add the item and update the order total
    await prisma.$transaction(async (tx) => {
      // Create the item
      await tx.workOrderItem.create({
        data: {
          ...validatedData,
          subtotal,
        },
      });

      // If it's a part and has an inventory item, decrease stock
      if (validatedData.type === "PART" && validatedData.inventoryItemId) {
        await tx.inventoryItem.update({
          where: { id: validatedData.inventoryItemId },
          data: {
            stock: {
              decrement: validatedData.quantity,
            },
          },
        });
      }

      // Update order total
      const orderItems = await tx.workOrderItem.findMany({
        where: { workOrderId: validatedData.workOrderId },
      });
      
      const newTotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
      
      await tx.workOrder.update({
        where: { id: validatedData.workOrderId },
        data: { total: newTotal },
      });
    });

    revalidatePath(`/dashboard/orders/${validatedData.workOrderId}`);
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Error al agregar el ítem" };
  }
}
