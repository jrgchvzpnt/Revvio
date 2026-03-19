"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const vehicleSchema = z.object({
  plate: z.string().min(1, "La placa es requerida"),
  brand: z.string().min(1, "La marca es requerida"),
  model: z.string().min(1, "El modelo es requerido"),
  year: z.coerce.number().optional().or(z.literal(0)),
  color: z.string().optional(),
  mileage: z.coerce.number().optional().or(z.literal(0)),
  clientId: z.string().min(1, "El cliente es requerido"),
});

export async function createVehicle(formData: FormData) {
  try {
    const data = {
      plate: formData.get("plate")?.toString() || "",
      brand: formData.get("brand")?.toString() || "",
      model: formData.get("model")?.toString() || "",
      year: formData.get("year") ? Number(formData.get("year")) : undefined,
      color: formData.get("color")?.toString() || "",
      mileage: formData.get("mileage") ? Number(formData.get("mileage")) : undefined,
      clientId: formData.get("clientId")?.toString() || "",
    };

    const validatedData = vehicleSchema.parse(data);

    const existingVehicle = await prisma.vehicle.findUnique({
      where: { plate: validatedData.plate },
    });

    if (existingVehicle) {
      return { success: false, error: "Ya existe un vehículo con esta placa" };
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        ...validatedData,
        year: validatedData.year || null,
        mileage: validatedData.mileage || null,
      },
    });

    revalidatePath("/dashboard/vehicles");
    return { success: true, data: vehicle };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("Error creating vehicle:", error);
    return { success: false, error: "Error al crear el vehículo" };
  }
}

export async function getVehicles() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        client: true,
        workOrders: true,
      },
    });
    return { success: true, data: vehicles };
  } catch {
    return { success: false, error: "Error al obtener los vehículos" };
  }
}

export async function updateVehicle(id: string, formData: FormData) {
  try {
    const data = {
      plate: formData.get("plate")?.toString() || "",
      brand: formData.get("brand")?.toString() || "",
      model: formData.get("model")?.toString() || "",
      year: formData.get("year") ? Number(formData.get("year")) : undefined,
      color: formData.get("color")?.toString() || "",
      mileage: formData.get("mileage") ? Number(formData.get("mileage")) : undefined,
      clientId: formData.get("clientId")?.toString() || "",
    };

    const validatedData = vehicleSchema.parse(data);

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        ...validatedData,
        year: validatedData.year || null,
        mileage: validatedData.mileage || null,
      },
    });

    revalidatePath("/dashboard/vehicles");
    return { success: true, data: vehicle };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: "Error al actualizar el vehículo" };
  }
}

export async function deleteVehicle(id: string) {
  try {
    await prisma.vehicle.delete({
      where: { id },
    });

    revalidatePath("/dashboard/vehicles");
    return { success: true };
  } catch {
    return { success: false, error: "Error al eliminar el vehículo" };
  }
}
