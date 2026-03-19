import { ClientRepository } from "@/repositories/client.repository";
import { z } from "zod";

const clientSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  phone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  notes: z.string().optional(),
});

export class ClientService {
  private repository: ClientRepository;

  constructor() {
    this.repository = new ClientRepository();
  }

  async createClient(data: { name: string; phone?: string; email?: string; notes?: string }) {
    try {
      const validatedData = clientSchema.parse(data);
      const client = await this.repository.create(validatedData);
      return { success: true, data: client };
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return { success: false, error: error.issues[0].message };
      }
      return { success: false, error: "Error al crear el cliente" };
    }
  }

  async getClients() {
    try {
      const clients = await this.repository.findAll();
      return { success: true, data: clients };
    } catch {
      return { success: false, error: "Error al obtener los clientes" };
    }
  }

  async updateClient(id: string, data: { name: string; phone?: string; email?: string; notes?: string }) {
    try {
      const validatedData = clientSchema.parse(data);
      const client = await this.repository.update(id, validatedData);
      return { success: true, data: client };
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return { success: false, error: error.issues[0].message };
      }
      return { success: false, error: "Error al actualizar el cliente" };
    }
  }

  async deleteClient(id: string) {
    try {
      await this.repository.delete(id);
      return { success: true };
    } catch {
      return { success: false, error: "Error al eliminar el cliente" };
    }
  }
}
