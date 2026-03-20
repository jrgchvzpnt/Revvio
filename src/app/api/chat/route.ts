import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { sendWhatsAppMessage } from '@/services/whatsapp.service';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    system: `Eres "RevvioBot", el agente de Inteligencia Artificial y asistente operativo de Revvio, un sistema de gestión en la nube diseñado para talleres mecánicos en Latinoamérica. 
Tu objetivo principal es ayudar a los dueños de talleres, recepcionistas y mecánicos a abandonar el papel y Excel, automatizando y organizando sus operaciones diarias de manera eficiente y sin fricciones.

Tus responsabilidades principales son:
1. GESTIÓN DE ÓRDENES DE TRABAJO (OT): Registrar nuevas órdenes, actualizar estados (Pendiente, En Proceso, Finalizado, Entregado).
2. CONTROL DE INVENTARIO: Consultar disponibilidad, descontar repuestos, generar alertas de stock mínimo.
3. HISTORIAL Y TRAZABILIDAD: Buscar historial de clientes o vehículos.
4. COMUNICACIÓN CON EL CLIENTE: Enviar notificaciones de WhatsApp cuando el estado cambie a Finalizado o Entregado.
5. REPORTES: Generar resúmenes rápidos del estado del taller.

REGLAS DE INTERACCIÓN Y TONO:
- Tono: Profesional, directo, claro y muy útil. Ve directo al grano.
- Lenguaje: Usa términos comunes en la mecánica automotriz latinoamericana (repuestos, placa/patente, orden de trabajo, stock, diagnóstico).
- Precisión: Si te piden datos y no los tienes, pide los datos faltantes antes de inventar información.
- Formato: Usa listas, viñetas o tablas cortas para que la información sea fácil de leer.

Tienes acceso a herramientas para interactuar con la base de datos y enviar mensajes de WhatsApp. Úsalas cuando sea necesario para cumplir con las solicitudes del usuario.`,
    messages,
    tools: {
      updateOrderStatus: tool({
        description: 'Actualiza el estado de una orden de trabajo (OT) buscando por placa del vehículo.',
        parameters: z.object({
          plate: z.string().describe('La placa o patente del vehículo (ej. ABCD)'),
          status: z.enum(['PENDING', 'IN_PROCESS', 'READY', 'DELIVERED']).describe('El nuevo estado de la orden'),
        }),
        execute: async ({ plate, status }: { plate: string, status: 'PENDING' | 'IN_PROCESS' | 'READY' | 'DELIVERED' }) => {
          const vehicle = await prisma.vehicle.findFirst({
            where: { plate: { contains: plate } },
            include: { client: true }
          });

          if (!vehicle) return { success: false, message: `No se encontró un vehículo con la placa ${plate}` };

          const order = await prisma.workOrder.findFirst({
            where: { vehicleId: vehicle.id },
            orderBy: { createdAt: 'desc' }
          });

          if (!order) return { success: false, message: `No se encontró una orden activa para el vehículo ${plate}` };

          const updatedOrder = await prisma.workOrder.update({
            where: { id: order.id },
            data: { status }
          });

          return { 
            success: true, 
            message: `Estado de la orden actualizado a ${status}`,
            order: {
              id: updatedOrder.id,
              orderNumber: updatedOrder.orderNumber,
              status: updatedOrder.status,
              total: updatedOrder.total
            },
            clientPhone: vehicle.client?.phone,
            clientName: vehicle.client?.name
          };
        },
      }),
      deductInventory: tool({
        description: 'Descuenta una cantidad específica de un repuesto del inventario buscando por nombre o SKU.',
        parameters: z.object({
          itemName: z.string().describe('Nombre o parte del nombre del repuesto (ej. filtro de aceite)'),
          quantity: z.number().describe('Cantidad a descontar'),
        }),
        execute: async ({ itemName, quantity }: { itemName: string, quantity: number }) => {
          const item = await prisma.inventoryItem.findFirst({
            where: { name: { contains: itemName } }
          });

          if (!item) return { success: false, message: `No se encontró el repuesto "${itemName}" en el inventario` };

          if (item.stock < quantity) {
            return { success: false, message: `Stock insuficiente. Solo hay ${item.stock} unidades de ${item.name}` };
          }

          const updatedItem = await prisma.inventoryItem.update({
            where: { id: item.id },
            data: { stock: item.stock - quantity }
          });

          const isLowStock = updatedItem.stock <= updatedItem.minStock;

          return {
            success: true,
            message: `Se descontaron ${quantity} unidades de ${item.name}. Stock restante: ${updatedItem.stock}.`,
            item: {
              id: updatedItem.id,
              name: updatedItem.name,
              stock: updatedItem.stock,
              minStock: updatedItem.minStock
            },
            isLowStock
          };
        },
      }),
      sendWhatsAppNotification: tool({
        description: 'Envía una notificación por WhatsApp al cliente.',
        parameters: z.object({
          phone: z.string().describe('Número de teléfono del cliente'),
          message: z.string().describe('Mensaje a enviar'),
        }),
        execute: async ({ phone, message }: { phone: string, message: string }) => {
          try {
            const result = await sendWhatsAppMessage(phone, message);
            return { success: result.success, message: result.success ? 'Mensaje enviado correctamente' : 'Error al enviar el mensaje' };
          } catch (error) {
            return { success: false, message: 'Error al enviar el mensaje de WhatsApp' };
          }
        },
      }),
      getWorkshopSummary: tool({
        description: 'Obtiene un resumen rápido del estado del taller (órdenes en proceso, listas, ingresos).',
        parameters: z.object({}),
        execute: async () => {
          const inProcess = await prisma.workOrder.count({ where: { status: 'IN_PROCESS' } });
          const ready = await prisma.workOrder.count({ where: { status: 'READY' } });
          
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const deliveredToday = await prisma.workOrder.findMany({
            where: { status: 'DELIVERED', updatedAt: { gte: today } },
            select: { total: true }
          });
          const revenueToday = deliveredToday.reduce((sum, order) => sum + order.total, 0);

          return {
            success: true,
            summary: {
              inProcess,
              ready,
              revenueToday
            }
          };
        },
      }),
    },
  });

  return result.toTextStreamResponse();
}
