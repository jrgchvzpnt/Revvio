"use server";

import { revalidatePath } from "next/cache";
import { ClientService } from "@/services/client.service";

const clientService = new ClientService();

export async function createClient(formData: FormData) {
  const data = {
    name: formData.get("name")?.toString() || "",
    phone: formData.get("phone")?.toString() || "",
    email: formData.get("email")?.toString() || "",
    notes: formData.get("notes")?.toString() || "",
  };

  const result = await clientService.createClient(data);

  if (result.success) {
    revalidatePath("/dashboard/clients");
  }

  return result;
}

export async function getClients() {
  return await clientService.getClients();
}

export async function updateClient(id: string, formData: FormData) {
  const data = {
    name: formData.get("name")?.toString() || "",
    phone: formData.get("phone")?.toString() || "",
    email: formData.get("email")?.toString() || "",
    notes: formData.get("notes")?.toString() || "",
  };

  const result = await clientService.updateClient(id, data);

  if (result.success) {
    revalidatePath("/dashboard/clients");
  }

  return result;
}

export async function deleteClient(id: string) {
  const result = await clientService.deleteClient(id);

  if (result.success) {
    revalidatePath("/dashboard/clients");
  }

  return result;
}
