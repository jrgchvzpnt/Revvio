"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export type DamagePoint = {
  id: string;
  x: number;
  y: number;
  description: string;
};

interface CarDamageSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  readonly?: boolean;
}

export function CarDamageSelector({ value, onChange, readonly = false }: CarDamageSelectorProps) {
  const [damages, setDamages] = useState<DamagePoint[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [tempPoint, setTempPoint] = useState<{ x: number; y: number } | null>(null);
  const [description, setDescription] = useState("");

  // Load initial value
  useEffect(() => {
    if (value) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          setDamages(parsed);
        }
      } catch (e) {
        console.error("Failed to parse damages", e);
      }
    }
  }, [value]);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAdding) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setTempPoint({ x, y });
  };

  const handleAddDamage = () => {
    if (tempPoint && description.trim()) {
      const newDamages = [
        ...damages,
        {
          id: Math.random().toString(36).substring(7),
          x: tempPoint.x,
          y: tempPoint.y,
          description: description.trim(),
        },
      ];
      setDamages(newDamages);
      setTempPoint(null);
      setDescription("");
      setIsAdding(false);
      
      if (onChange) {
        onChange(JSON.stringify(newDamages));
      }
    }
  };

  const handleRemoveDamage = (id: string) => {
    const newDamages = damages.filter((d) => d.id !== id);
    setDamages(newDamages);
    if (onChange) {
      onChange(JSON.stringify(newDamages));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Registro de Daños Previos</h3>
        {!readonly && (
          <Button
            type="button"
            variant={isAdding ? "secondary" : "outline"}
            size="sm"
            onClick={() => {
              setIsAdding(!isAdding);
              setTempPoint(null);
            }}
          >
            {isAdding ? "Cancelar" : "Agregar Daño"}
          </Button>
        )}
      </div>

      <div className="relative border rounded-lg overflow-hidden bg-slate-50 p-4 flex justify-center">
        <div 
          className={`relative inline-block ${!readonly && isAdding ? 'cursor-crosshair' : 'cursor-default'}`}
          onClick={!readonly ? handleImageClick : undefined}
        >
          {/* Simple SVG Car Top View */}
          <svg width="200" height="400" viewBox="0 0 200 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-300">
            <rect x="20" y="20" width="160" height="360" rx="40" stroke="currentColor" strokeWidth="4" fill="white" />
            {/* Windshield */}
            <path d="M30 100 Q100 80 170 100 L160 140 Q100 130 40 140 Z" stroke="currentColor" strokeWidth="4" fill="#f8fafc" />
            {/* Rear Window */}
            <path d="M30 300 Q100 320 170 300 L160 260 Q100 270 40 260 Z" stroke="currentColor" strokeWidth="4" fill="#f8fafc" />
            {/* Roof */}
            <rect x="40" y="140" width="120" height="120" stroke="currentColor" strokeWidth="4" fill="white" />
            {/* Headlights */}
            <rect x="30" y="20" width="30" height="15" rx="5" stroke="currentColor" strokeWidth="4" fill="#fef08a" />
            <rect x="140" y="20" width="30" height="15" rx="5" stroke="currentColor" strokeWidth="4" fill="#fef08a" />
            {/* Taillights */}
            <rect x="30" y="365" width="30" height="15" rx="5" stroke="currentColor" strokeWidth="4" fill="#fca5a5" />
            <rect x="140" y="365" width="30" height="15" rx="5" stroke="currentColor" strokeWidth="4" fill="#fca5a5" />
            {/* Wheels */}
            <rect x="10" y="60" width="10" height="40" rx="2" fill="#475569" />
            <rect x="180" y="60" width="10" height="40" rx="2" fill="#475569" />
            <rect x="10" y="280" width="10" height="40" rx="2" fill="#475569" />
            <rect x="180" y="280" width="10" height="40" rx="2" fill="#475569" />
          </svg>

          {/* Render existing damages */}
          {damages.map((damage, index) => (
            <div
              key={damage.id}
              className="absolute w-6 h-6 -ml-3 -mt-3 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md"
              style={{ left: `${damage.x}%`, top: `${damage.y}%` }}
              title={damage.description}
            >
              {index + 1}
            </div>
          ))}

          {/* Render temp point */}
          {tempPoint && (
            <div
              className="absolute w-6 h-6 -ml-3 -mt-3 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md animate-pulse"
              style={{ left: `${tempPoint.x}%`, top: `${tempPoint.y}%` }}
            >
              +
            </div>
          )}
        </div>
      </div>

      {tempPoint && (
        <div className="flex gap-2 items-center bg-amber-50 p-3 rounded-md border border-amber-200">
          <input
            type="text"
            placeholder="Describe el daño (ej. Rayón profundo, Abolladura)"
            className="flex-1 text-sm px-3 py-2 rounded-md border border-slate-300"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddDamage();
              }
            }}
          />
          <Button type="button" size="sm" onClick={handleAddDamage} className="bg-amber-600 hover:bg-amber-700">
            Guardar
          </Button>
        </div>
      )}

      {damages.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-slate-500 uppercase">Lista de Daños</h4>
          <div className="grid gap-2">
            {damages.map((damage, index) => (
              <div key={damage.id} className="flex items-center justify-between bg-white p-2 rounded-md border text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="w-5 h-5 p-0 flex items-center justify-center rounded-full">
                    {index + 1}
                  </Badge>
                  <span>{damage.description}</span>
                </div>
                {!readonly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-slate-400 hover:text-red-500"
                    onClick={() => handleRemoveDamage(damage.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Hidden input to submit with form */}
      {!readonly && <input type="hidden" name="damages" value={JSON.stringify(damages)} />}
    </div>
  );
}
