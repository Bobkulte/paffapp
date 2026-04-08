'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EstimateForm from '@/components/estimates/EstimateForm';
import { Estimate, EstimateStatus, STATUS_LABELS, STATUS_COLORS } from '@/models/types';

export default function EstimateDetailPage() {
  const params = useParams();
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  async function fetchEstimate() {
    setLoading(true);
    const res = await fetch(`/api/estimates/${params.id}`);
    if (res.ok) {
      setEstimate(await res.json());
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchEstimate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function updateStatus(status: EstimateStatus) {
    const res = await fetch(`/api/estimates/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setShowStatusModal(false);
      fetchEstimate();
    }
  }

  if (loading) return (
    <>
      <Header title="Détail du devis" />
      <div className="p-8 text-iron-500">Chargement...</div>
    </>
  );

  if (!estimate) return (
    <>
      <Header title="Devis introuvable" />
      <div className="p-8 text-iron-500">Ce devis n&apos;existe pas.</div>
    </>
  );

  if (editing) {
    return (
      <>
        <Header title={`Modifier ${estimate.reference}`} />
        <div className="p-8 max-w-5xl">
          <EstimateForm estimate={estimate} />
        </div>
      </>
    );
  }

  return (
    <>
      <Header title={estimate.reference} />
      <div className="p-8 max-w-5xl">
        {/* Actions bar */}
        <div className="flex items-center justify-between mb-6">
          <Badge className={STATUS_COLORS[estimate.status]}>
            {STATUS_LABELS[estimate.status]}
          </Badge>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowStatusModal(true)}>
              Changer le statut
            </Button>
            <Button variant="outline" onClick={() => setEditing(true)}>
              Modifier
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open(`/api/estimates/${params.id}/pdf`, '_blank')}
            >
              Télécharger PDF
            </Button>
          </div>
        </div>

        {/* Client info */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h3 className="text-base font-semibold text-iron-900 mb-3">Client</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-iron-500">Nom :</span> {estimate.clientName}</div>
              {estimate.clientEmail && <div><span className="text-iron-500">Email :</span> {estimate.clientEmail}</div>}
              {estimate.clientPhone && <div><span className="text-iron-500">Tél :</span> {estimate.clientPhone}</div>}
              {estimate.clientAddress && <div><span className="text-iron-500">Adresse :</span> {estimate.clientAddress}</div>}
              {estimate.clientCity && <div><span className="text-iron-500">Ville :</span> {estimate.clientCity} {estimate.clientZipCode}</div>}
            </div>
          </CardContent>
        </Card>

        {/* Dates */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-8 text-sm">
              <div><span className="text-iron-500">Date :</span> {new Date(estimate.date).toLocaleDateString('fr-FR')}</div>
              {estimate.validityDate && (
                <div><span className="text-iron-500">Validité :</span> {new Date(estimate.validityDate).toLocaleDateString('fr-FR')}</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Lines */}
        <Card className="mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-iron-200 bg-iron-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-iron-500 uppercase">Désignation</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-iron-500 uppercase">Qté</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-iron-500 uppercase">Unité</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-iron-500 uppercase">PU HT</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-iron-500 uppercase">Total HT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-iron-100">
                {estimate.lines.map((line, i) => (
                  <tr key={i}>
                    <td className="px-6 py-3 text-sm text-iron-900">{line.designation}</td>
                    <td className="px-6 py-3 text-sm text-right">{line.quantity}</td>
                    <td className="px-6 py-3 text-sm text-center text-iron-600">{line.unit}</td>
                    <td className="px-6 py-3 text-sm text-right">{line.unitPrice.toFixed(2)} &euro;</td>
                    <td className="px-6 py-3 text-sm text-right font-medium">{line.totalHT.toFixed(2)} &euro;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Totals */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex justify-end">
              <div className="w-72 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-iron-600">Total HT</span>
                  <span>{estimate.totalHT.toFixed(2)} &euro;</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-iron-600">TVA ({estimate.tvaRate}%)</span>
                  <span>{estimate.totalTVA.toFixed(2)} &euro;</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total TTC</span>
                  <span className="text-forge-600">{estimate.totalTTC.toFixed(2)} &euro;</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        {estimate.notes && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-base font-semibold text-iron-900 mb-2">Notes</h3>
              <p className="text-sm text-iron-600 whitespace-pre-wrap">{estimate.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Status Dialog */}
      <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Changer le statut</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {(['DRAFT', 'SENT', 'ACCEPTED', 'REFUSED'] as EstimateStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => updateStatus(s)}
                className={`w-full text-left px-4 py-3 rounded-lg transition text-sm font-medium ${
                  estimate.status === s
                    ? 'bg-forge-50 border-2 border-forge-500'
                    : 'bg-iron-50 hover:bg-iron-100 border-2 border-transparent'
                }`}
              >
                <Badge className={STATUS_COLORS[s]}>{STATUS_LABELS[s]}</Badge>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
