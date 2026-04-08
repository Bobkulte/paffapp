'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { Material } from '@/models/types';

interface MaterialPickerProps {
  onSelectMultiple: (materials: Material[]) => void;
  onCustomLine: () => void;
  onClose: () => void;
}

export default function MaterialPicker({ onSelectMultiple, onCustomLine, onClose }: MaterialPickerProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Material[]>([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const url = search ? `/api/materials?q=${encodeURIComponent(search)}` : '/api/materials';
      const res = await fetch(url);
      if (res.ok) setMaterials(await res.json());
      setLoading(false);
    }
    const debounce = setTimeout(load, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  function toggleMaterial(mat: Material) {
    setSelected((prev) => {
      const exists = prev.find((m) => m.id === mat.id);
      if (exists) return prev.filter((m) => m.id !== mat.id);
      return [...prev, mat];
    });
  }

  function handleConfirm() {
    if (selected.length > 0) {
      onSelectMultiple(selected);
    }
  }

  const grouped = materials.reduce<Record<string, Material[]>>((acc, mat) => {
    if (!acc[mat.category]) acc[mat.category] = [];
    acc[mat.category].push(mat);
    return acc;
  }, {});

  const selectedIds = new Set(selected.map((m) => m.id));

  return (
    <div className="space-y-4">
      <Input
        placeholder="Rechercher un matériau..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoFocus
      />

      {selected.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-iron-500">Sélectionnés :</span>
          {selected.map((mat) => (
            <Badge
              key={mat.id}
              variant="outline"
              className="cursor-pointer hover:bg-red-50 hover:text-red-600"
              onClick={() => toggleMaterial(mat)}
            >
              {mat.name} &times;
            </Badge>
          ))}
        </div>
      )}

      <div className="max-h-80 overflow-y-auto border border-iron-200 rounded-lg">
        {loading ? (
          <p className="p-4 text-iron-500 text-sm">Chargement...</p>
        ) : Object.keys(grouped).length === 0 ? (
          <p className="p-4 text-iron-500 text-sm">Aucun matériau trouvé.</p>
        ) : (
          Object.entries(grouped).map(([category, mats]) => (
            <div key={category}>
              <div className="px-4 py-2 bg-iron-50 text-xs font-semibold text-iron-500 uppercase tracking-wide sticky top-0">
                {category}
              </div>
              {mats.map((mat) => {
                const isSelected = selectedIds.has(mat.id);
                return (
                  <button
                    key={mat.id}
                    onClick={() => toggleMaterial(mat)}
                    className={`w-full px-4 py-2.5 flex items-center justify-between transition text-left ${
                      isSelected ? 'bg-forge-50' : 'hover:bg-iron-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`flex h-4 w-4 items-center justify-center rounded border ${
                        isSelected ? 'bg-forge-600 border-forge-600' : 'border-iron-300'
                      }`}>
                        {isSelected && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <span className="text-sm text-iron-900">{mat.name}</span>
                    </div>
                    <span className="text-xs text-iron-500">
                      {mat.unitPrice.toFixed(2)} &euro; / {mat.unit}
                    </span>
                  </button>
                );
              })}
            </div>
          ))
        )}
      </div>

      <div className="flex justify-between pt-2">
        <Button variant="ghost" size="sm" onClick={onCustomLine}>
          + Ligne personnalisée
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Fermer
          </Button>
          {selected.length > 0 && (
            <Button size="sm" onClick={handleConfirm}>
              Ajouter {selected.length} matériau{selected.length > 1 ? 'x' : ''}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
