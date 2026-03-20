"use server";

import { revalidatePath } from "next/cache";
import { ClientService } from "@/services/client.service";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";

const clientService = new ClientService();

export async function createClient(formData: FormData) {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No autorizado" };

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
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No autorizado" };

  return await clientService.getClients();
}

export async function updateClient(id: string, formData: FormData) {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No autorizado" };

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
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No autorizado" };

  const result = await clientService.deleteClient(id);

  if (result.success) {
    revalidatePath("/dashboard/clients");
  }

  return result;
}
