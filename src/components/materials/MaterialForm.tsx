'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Material, CATEGORIES, UNITS } from '@/models/types';

interface MaterialFormProps {
  material?: Material;
  onSubmit: (data: Omit<Material, 'id'>) => Promise<void>;
  onCancel: () => void;
}

export default function MaterialForm({ material, onSubmit, onCancel }: MaterialFormProps) {
  const [name, setName] = useState(material?.name || '');
  const [category, setCategory] = useState(material?.category || CATEGORIES[0]);
  const [unit, setUnit] = useState(material?.unit || UNITS[0].value);
  const [unitPrice, setUnitPrice] = useState(material?.unitPrice?.toString() || '');
  const [description, setDescription] = useState(material?.description || '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Le nom est requis';
    if (!unitPrice || isNaN(Number(unitPrice)) || Number(unitPrice) <= 0) {
      newErrors.unitPrice = 'Le prix doit être un nombre positif';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    await onSubmit({
      name: name.trim(),
      category,
      unit,
      unitPrice: Number(unitPrice),
      description: description.trim() || undefined,
    });
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Nom du matériau</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Fer plat 40x8mm"
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label>Catégorie</Label>
        <Select value={category} onValueChange={(v) => v && setCategory(v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Unité</Label>
        <Select value={unit} onValueChange={(v) => v && setUnit(v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {UNITS.map((u) => (
              <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Prix unitaire (&euro;)</Label>
        <Input
          type="number"
          step="0.01"
          min="0"
          value={unitPrice}
          onChange={(e) => setUnitPrice(e.target.value)}
          placeholder="0.00"
        />
        {errors.unitPrice && <p className="text-sm text-red-500">{errors.unitPrice}</p>}
      </div>

      <div className="space-y-2">
        <Label>Description (optionnel)</Label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description du matériau..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Enregistrement...' : material ? 'Modifier' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
}
