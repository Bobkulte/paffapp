'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import MaterialPicker from './MaterialPicker';
import EstimateLineRow from './EstimateLineRow';
import { Estimate, EstimateLine, Material } from '@/models/types';

interface EstimateFormProps {
  estimate?: Estimate;
}

export default function EstimateForm({ estimate }: EstimateFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  // Client info
  const [clientName, setClientName] = useState(estimate?.clientName || '');
  const [clientEmail, setClientEmail] = useState(estimate?.clientEmail || '');
  const [clientPhone, setClientPhone] = useState(estimate?.clientPhone || '');
  const [clientAddress, setClientAddress] = useState(estimate?.clientAddress || '');
  const [clientCity, setClientCity] = useState(estimate?.clientCity || '');
  const [clientZipCode, setClientZipCode] = useState(estimate?.clientZipCode || '');

  // Dates
  const [date, setDate] = useState(
    estimate?.date
      ? new Date(estimate.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  );
  const [validityDate, setValidityDate] = useState(
    estimate?.validityDate
      ? new Date(estimate.validityDate).toISOString().split('T')[0]
      : ''
  );

  // Lines
  const [lines, setLines] = useState<EstimateLine[]>(estimate?.lines || []);

  // TVA & notes
  const [tvaRate, setTvaRate] = useState(estimate?.tvaRate?.toString() || '20');
  const [notes, setNotes] = useState(estimate?.notes || '');

  // Calculs
  const totalHT = lines.reduce((sum, l) => sum + l.totalHT, 0);
  const totalTVA = totalHT * (Number(tvaRate) / 100);
  const totalTTC = totalHT + totalTVA;

  function addMaterialLines(materials: Material[]) {
    const newLines = materials.map((material, i) => ({
      designation: material.name,
      quantity: 1,
      unit: material.unit,
      unitPrice: material.unitPrice,
      totalHT: material.unitPrice,
      order: lines.length + i,
      materialId: material.id,
    }));
    setLines([...lines, ...newLines]);
    setShowPicker(false);
  }

  function addCustomLine() {
    const newLine: EstimateLine = {
      designation: '',
      quantity: 1,
      unit: 'pce',
      unitPrice: 0,
      totalHT: 0,
      order: lines.length,
    };
    setLines([...lines, newLine]);
    setShowPicker(false);
  }

  function updateLine(index: number, updated: EstimateLine) {
    const newLines = [...lines];
    newLines[index] = updated;
    setLines(newLines);
  }

  function deleteLine(index: number) {
    setLines(lines.filter((_, i) => i !== index));
  }

  async function handleSave(asDraft = true) {
    if (!clientName.trim()) return;
    if (lines.length === 0) return;

    setSaving(true);

    const payload = {
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim() || undefined,
      clientPhone: clientPhone.trim() || undefined,
      clientAddress: clientAddress.trim() || undefined,
      clientCity: clientCity.trim() || undefined,
      clientZipCode: clientZipCode.trim() || undefined,
      date,
      validityDate: validityDate || undefined,
      tvaRate: Number(tvaRate),
      notes: notes.trim() || undefined,
      status: asDraft ? 'DRAFT' : 'SENT',
      lines: lines.map((l, i) => ({
        designation: l.designation,
        quantity: l.quantity,
        unit: l.unit,
        unitPrice: l.unitPrice,
        materialId: l.materialId || undefined,
        order: i,
      })),
    };

    const url = estimate ? `/api/estimates/${estimate.id}` : '/api/estimates';
    const method = estimate ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/estimates/${data.id}`);
    }

    setSaving(false);
  }

  return (
    <div className="space-y-6">
      {/* Section Client */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informations client</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-iron-700">Nom du client *</label>
              <Input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Nom du client" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-iron-700">Email</label>
              <Input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="client@email.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-iron-700">Téléphone</label>
              <Input value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} placeholder="06 12 34 56 78" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-iron-700">Adresse</label>
              <Input value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} placeholder="Adresse" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-iron-700">Ville</label>
              <Input value={clientCity} onChange={(e) => setClientCity(e.target.value)} placeholder="Ville" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-iron-700">Code postal</label>
              <Input value={clientZipCode} onChange={(e) => setClientZipCode(e.target.value)} placeholder="75001" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Dates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-iron-700">Date du devis</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-iron-700">Date de validité</label>
              <Input type="date" value={validityDate} onChange={(e) => setValidityDate(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Lignes */}
      <Card>
        <div className="px-6 py-4 border-b border-iron-100 flex items-center justify-between">
          <h3 className="text-base font-semibold text-iron-900">Lignes du devis</h3>
          <Button size="sm" onClick={() => setShowPicker(true)}>
            + Ajouter une ligne
          </Button>
        </div>
        {lines.length === 0 ? (
          <div className="p-8 text-center text-iron-500 text-sm">
            Aucune ligne. Cliquez sur &quot;Ajouter une ligne&quot; pour commencer.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-iron-200 bg-iron-50">
                  <th className="px-3 py-2 text-left text-xs font-medium text-iron-500 uppercase">Désignation</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-iron-500 uppercase w-24">Qté</th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-iron-500 uppercase w-20">Unité</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-iron-500 uppercase w-28">PU HT</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-iron-500 uppercase w-28">Total HT</th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line, i) => (
                  <EstimateLineRow
                    key={i}
                    line={line}
                    onChange={(updated) => updateLine(i, updated)}
                    onDelete={() => deleteLine(i)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Section Récapitulatif */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h3 className="text-base font-semibold text-iron-900 mb-4">Notes</h3>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Conditions de paiement, remarques..."
              />
            </div>
            <div className="w-full md:w-80">
              <h3 className="text-base font-semibold text-iron-900 mb-4">Totaux</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-iron-600">Total HT</span>
                  <span className="font-medium">{totalHT.toFixed(2)} &euro;</span>
                </div>
                <div className="flex justify-between text-sm items-center gap-2">
                  <span className="text-iron-600">TVA</span>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={tvaRate}
                      onChange={(e) => setTvaRate(e.target.value)}
                      className="w-16 h-7 text-sm text-right"
                    />
                    <span className="text-iron-500">%</span>
                    <span className="font-medium ml-auto">{totalTVA.toFixed(2)} &euro;</span>
                  </div>
                </div>
                <div className="border-t border-iron-200 pt-3 flex justify-between">
                  <span className="font-semibold text-iron-900">Total TTC</span>
                  <span className="font-bold text-lg text-forge-600">{totalTTC.toFixed(2)} &euro;</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.back()}>
          Annuler
        </Button>
        <Button
          variant="outline"
          onClick={() => handleSave(true)}
          disabled={saving || !clientName.trim() || lines.length === 0}
        >
          {saving ? 'Enregistrement...' : 'Enregistrer en brouillon'}
        </Button>
        <Button
          onClick={() => handleSave(false)}
          disabled={saving || !clientName.trim() || lines.length === 0}
        >
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
      </div>

      {/* Material Picker Dialog */}
      <Dialog open={showPicker} onOpenChange={setShowPicker}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une ligne</DialogTitle>
          </DialogHeader>
          <MaterialPicker
            onSelectMultiple={addMaterialLines}
            onCustomLine={addCustomLine}
            onClose={() => setShowPicker(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
