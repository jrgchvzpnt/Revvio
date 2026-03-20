"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const inventorySchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  sku: z.string().optional(),
  costPrice: z.coerce.number().min(0, "El costo debe ser mayor o igual a 0"),
  salePrice: z.coerce.number().min(0, "El precio de venta debe ser mayor o igual a 0"),
  stock: z.coerce.number().min(0, "El stock debe ser mayor o igual a 0"),
  minStock: z.coerce.number().min(0, "El stock mínimo debe ser mayor o igual a 0"),
});

export async function createInventoryItem(formData: FormData) {
  try {
    const isAuth = cookies().has("local_auth");
    if (!isAuth) return { success: false, error: "No autorizado" };

    const data = {
      name: formData.get("name") as string,
      sku: formData.get("sku") as string,
      costPrice: Number(formData.get("costPrice") || 0),
      salePrice: Number(formData.get("salePrice") || 0),
      stock: Number(formData.get("stock") || 0),
      minStock: Number(formData.get("minStock") || 1),
    };

    const validatedData = inventorySchema.parse(data);

    const item = await prisma.inventoryItem.create({
      data: validatedData,
    });

    revalidatePath("/dashboard/inventory");
    return { success: true, data: item };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Error al crear el repuesto" };
  }
}

export async function getInventoryItems() {
  try {
    const isAuth = cookies().has("local_auth");
    if (!isAuth) return { success: false, error: "No autorizado" };

    const items = await prisma.inventoryItem.findMany({
      orderBy: { name: "asc" },
    });
    return { success: true, data: items };
  } catch {
    return { success: false, error: "Error al obtener el inventario" };
  }
}

export async function updateStock(id: string, newStock: number) {
  try {
    const isAuth = cookies().has("local_auth");
    if (!isAuth) return { success: false, error: "No autorizado" };

    if (newStock < 0) {
      return { success: false, error: "El stock no puede ser negativo" };
    }

    const item = await prisma.inventoryItem.update({
      where: { id },
      data: { stock: newStock },
    });

    revalidatePath("/dashboard/inventory");
    return { success: true, data: item };
  } catch {
    return { success: false, error: "Error al actualizar el stock" };
  }
}

export async function updateInventoryItem(id: string, formData: FormData) {
  try {
    const isAuth = cookies().has("local_auth");
    if (!isAuth) return { success: false, error: "No autorizado" };

    const data = {
      name: formData.get("name") as string,
      sku: formData.get("sku") as string,
      costPrice: Number(formData.get("costPrice") || 0),
      salePrice: Number(formData.get("salePrice") || 0),
      stock: Number(formData.get("stock") || 0),
      minStock: Number(formData.get("minStock") || 1),
    };

    const validatedData = inventorySchema.parse(data);

    const item = await prisma.inventoryItem.update({
      where: { id },
      data: validatedData,
    });

    revalidatePath("/dashboard/inventory");
    return { success: true, data: item };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Error al actualizar el repuesto" };
  }
}

export async function deleteInventoryItem(id: string) {
  try {
    const isAuth = cookies().has("local_auth");
    if (!isAuth) return { success: false, error: "No autorizado" };

    await prisma.inventoryItem.delete({
      where: { id },
    });

    revalidatePath("/dashboard/inventory");
    return { success: true };
  } catch {
    return { success: false, error: "Error al eliminar el repuesto" };
  }
}
