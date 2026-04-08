'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Material } from '@/models/types';

interface MaterialPickerProps {
  onSelect: (material: Material) => void;
  onCustomLine: () => void;
  onClose: () => void;
}

export default function MaterialPicker({ onSelect, onCustomLine, onClose }: MaterialPickerProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

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

  const grouped = materials.reduce<Record<string, Material[]>>((acc, mat) => {
    if (!acc[mat.category]) acc[mat.category] = [];
    acc[mat.category].push(mat);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <Input
        placeholder="Rechercher un matériau..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoFocus
      />

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
              {mats.map((mat) => (
                <button
                  key={mat.id}
                  onClick={() => onSelect(mat)}
                  className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-forge-50 transition text-left"
                >
                  <span className="text-sm text-iron-900">{mat.name}</span>
                  <span className="text-xs text-iron-500">
                    {mat.unitPrice.toFixed(2)} &euro; / {mat.unit}
                  </span>
                </button>
              ))}
            </div>
          ))
        )}
      </div>

      <div className="flex justify-between pt-2">
        <Button variant="ghost" size="sm" onClick={onCustomLine}>
          + Ligne personnalisée
        </Button>
        <Button variant="outline" size="sm" onClick={onClose}>
          Fermer
        </Button>
      </div>
    </div>
  );
}
