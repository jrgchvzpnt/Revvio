'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createReminder } from '@/actions/reminders';
import { Bell, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface NewReminderDialogProps {
  vehicleId: string;
}

export function NewReminderDialog({ vehicleId }: NewReminderDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!date) return;

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const data = {
      vehicleId,
      type: formData.get('type') as string,
      description: formData.get('description') as string,
      date: date,
      sendType: formData.get('sendType') as string,
    };

    const result = await createReminder(data);

    if (result.success) {
      setOpen(false);
      router.refresh();
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button className="w-full sm:w-auto">
          <Bell className="w-4 h-4 mr-2" />
          Nuevo recordatorio
        </Button>
      } />
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nuevo recordatorio</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de recordatorio</Label>
            <Select name="type" required defaultValue="Cambio de aceite">
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cambio de aceite">Cambio de aceite</SelectItem>
                <SelectItem value="Revisión general">Revisión general</SelectItem>
                <SelectItem value="Llantas">Llantas</SelectItem>
                <SelectItem value="Frenos">Frenos</SelectItem>
                <SelectItem value="Otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción / nota</Label>
            <Textarea 
              id="description" 
              name="description" 
              placeholder="Ej: incluir revisión de frenos, luces y nivel de coolant antes del envío."
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Fecha programada</Label>
            <Popover>
              <PopoverTrigger render={
                <Button
                  type="button"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                </Button>
              } />
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sendType">Tipo de envío</Label>
            <Select name="sendType" required defaultValue="MANUAL">
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de envío" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MANUAL">Manual</SelectItem>
                <SelectItem value="AUTOMATIC">Automático</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !date}>
              {loading ? 'Guardando...' : 'Guardar recordatorio'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
