'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { EstimateLine } from '@/models/types';

interface EstimateLineRowProps {
  line: EstimateLine;
  onChange: (updated: EstimateLine) => void;
  onDelete: () => void;
}

export default function EstimateLineRow({ line, onChange, onDelete }: EstimateLineRowProps) {
  function updateField(field: keyof EstimateLine, value: string | number) {
    const updated = { ...line, [field]: value };
    if (field === 'quantity' || field === 'unitPrice') {
      const qty = field === 'quantity' ? Number(value) : line.quantity;
      const price = field === 'unitPrice' ? Number(value) : line.unitPrice;
      updated.totalHT = Math.round(qty * price * 100) / 100;
    }
    onChange(updated);
  }

  return (
    <tr className="border-b border-iron-100 hover:bg-iron-50 transition">
      <td className="px-3 py-2">
        <Input
          value={line.designation}
          onChange={(e) => updateField('designation', e.target.value)}
          className="h-8 text-sm"
        />
      </td>
      <td className="px-3 py-2 w-24">
        <Input
          type="number"
          min="0"
          step="0.01"
          value={line.quantity}
          onChange={(e) => updateField('quantity', Number(e.target.value))}
          className="h-8 text-sm text-right"
        />
      </td>
      <td className="px-3 py-2 w-20 text-center text-sm text-iron-600">
        {line.unit}
      </td>
      <td className="px-3 py-2 w-28">
        <Input
          type="number"
          min="0"
          step="0.01"
          value={line.unitPrice}
          onChange={(e) => updateField('unitPrice', Number(e.target.value))}
          className="h-8 text-sm text-right"
        />
      </td>
      <td className="px-3 py-2 w-28 text-right text-sm font-medium text-iron-900">
        {line.totalHT.toFixed(2)} &euro;
      </td>
      <td className="px-3 py-2 w-12">
        <Button variant="ghost" size="icon" className="h-7 w-7 text-iron-400 hover:text-red-500" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
}
