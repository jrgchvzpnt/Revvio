'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createReminder(data: {
  vehicleId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type: any;
  description?: string;
  date: Date;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendType: any;
}) {
  try {
    const reminder = await prisma.reminder.create({
      data: {
        vehicleId: data.vehicleId,
        type: data.type,
        description: data.description,
        date: data.date,
        sendType: data.sendType,
        status: 'PENDING',
      },
    });

    revalidatePath(`/dashboard/vehicles/${data.vehicleId}`);
    return { success: true, data: reminder };
  } catch (error) {
    console.error('Error creating reminder:', error);
    return { success: false, error: 'Error al crear el recordatorio' };
  }
}
