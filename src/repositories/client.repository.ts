import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class ClientRepository {
  async create(data: Prisma.ClientCreateInput) {
    return await prisma.client.create({
      data,
    });
  }

  async findAll() {
    return await prisma.client.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        vehicles: true,
        workOrders: true,
      },
    });
  }

  async update(id: string, data: Prisma.ClientUpdateInput) {
    return await prisma.client.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return await prisma.client.delete({
      where: { id },
    });
  }
}
