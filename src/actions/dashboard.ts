"use server";

import prisma from "@/lib/prisma";

export async function getDashboardStats() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // OTs Hoy
    const ordersToday = await prisma.workOrder.count({
      where: {
        createdAt: {
          gte: today,
        },
      },
    });

    // En Proceso
    const ordersInProcess = await prisma.workOrder.count({
      where: {
        status: "IN_PROCESS",
      },
    });

    // Listas para entrega
    const ordersReady = await prisma.workOrder.count({
      where: {
        status: "READY",
      },
    });

    // Ingresos del Día (sum of total for orders delivered today)
    const deliveredOrdersToday = await prisma.workOrder.findMany({
      where: {
        status: "DELIVERED",
        updatedAt: {
          gte: today,
        },
      },
      select: {
        total: true,
      },
    });
    const revenueToday = deliveredOrdersToday.reduce((sum, order) => sum + order.total, 0);

    // Ingresos del Mes
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const deliveredOrdersMonth = await prisma.workOrder.findMany({
      where: {
        status: "DELIVERED",
        updatedAt: {
          gte: firstDayOfMonth,
        },
      },
      select: {
        total: true,
      },
    });
    const revenueMonth = deliveredOrdersMonth.reduce((sum, order) => sum + order.total, 0);

    // Alertas de Stock
    const lowStockItemsCount = await prisma.inventoryItem.count({
      where: {
        stock: {
          lte: prisma.inventoryItem.fields.minStock,
        },
      },
    });

    const lowStockItemsList = await prisma.inventoryItem.findMany({
      where: {
        stock: {
          lte: prisma.inventoryItem.fields.minStock,
        },
      },
      take: 5,
    });

    // OTs Recientes
    const recentOrders = await prisma.workOrder.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        vehicle: {
          include: {
            client: true,
          }
        }
      }
    });

    // Ingresos de los últimos 7 días
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // 7 days including today

    const recentDeliveredOrders = await prisma.workOrder.findMany({
      where: {
        status: "DELIVERED",
        updatedAt: {
          gte: sevenDaysAgo,
        },
      },
      select: {
        total: true,
        updatedAt: true,
      },
    });

    // Agrupar por día
    const revenueByDay = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(sevenDaysAgo);
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      
      const dayRevenue = recentDeliveredOrders
        .filter(order => order.updatedAt.toISOString().split('T')[0] === dateString)
        .reduce((sum, order) => sum + order.total, 0);

      return {
        date: dateString,
        revenue: dayRevenue,
      };
    });

    return {
      success: true,
      data: {
        ordersToday,
        ordersInProcess,
        ordersReady,
        revenueToday,
        revenueMonth,
        lowStockItems: lowStockItemsCount,
        lowStockItemsList,
        recentOrders,
        revenueByDay,
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { success: false, error: "Error al obtener estadísticas del dashboard" };
  }
}
