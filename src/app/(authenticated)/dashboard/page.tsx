'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Estimate, STATUS_LABELS, STATUS_COLORS } from '@/models/types';

interface Stats {
  totalEstimates: number;
  totalDraft: number;
  totalSent: number;
  totalAccepted: number;
  totalRefused: number;
  totalMaterials: number;
  totalHTAccepted: number;
}

export default function DashboardPage() {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [estRes, matRes] = await Promise.all([
        fetch('/api/estimates'),
        fetch('/api/materials'),
      ]);

      let allEstimates: Estimate[] = [];
      let materialCount = 0;

      if (estRes.ok) allEstimates = await estRes.json();
      if (matRes.ok) {
        const mats = await matRes.json();
        materialCount = mats.length;
      }

      setEstimates(allEstimates);
      setStats({
        totalEstimates: allEstimates.length,
        totalDraft: allEstimates.filter((e) => e.status === 'DRAFT').length,
        totalSent: allEstimates.filter((e) => e.status === 'SENT').length,
        totalAccepted: allEstimates.filter((e) => e.status === 'ACCEPTED').length,
        totalRefused: allEstimates.filter((e) => e.status === 'REFUSED').length,
        totalMaterials: materialCount,
        totalHTAccepted: allEstimates
          .filter((e) => e.status === 'ACCEPTED')
          .reduce((sum, e) => sum + e.totalTTC, 0),
      });
      setLoading(false);
    }
    load();
  }, []);

  const recentEstimates = estimates.slice(0, 5);

  return (
    <>
      <Header title="Dashboard" />
      <div className="p-6 max-w-5xl">
        {loading ? (
          <p className="text-iron-500">Chargement...</p>
        ) : (
          <div className="space-y-6">
            {/* Stats cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-2xl font-bold text-iron-900">{stats?.totalEstimates ?? 0}</p>
                  <p className="text-sm text-iron-500">Devis total</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-2xl font-bold text-green-600">{stats?.totalAccepted ?? 0}</p>
                  <p className="text-sm text-iron-500">Acceptés</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-2xl font-bold text-forge-600">
                    {(stats?.totalHTAccepted ?? 0).toFixed(0)} &euro;
                  </p>
                  <p className="text-sm text-iron-500">CA accepté (TTC)</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-2xl font-bold text-iron-900">{stats?.totalMaterials ?? 0}</p>
                  <p className="text-sm text-iron-500">Matériaux</p>
                </CardContent>
              </Card>
            </div>

            {/* Status breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="h-2 w-2 rounded-full bg-iron-400"></span>
                <span className="text-iron-600">Brouillons : {stats?.totalDraft ?? 0}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                <span className="text-iron-600">Envoyés : {stats?.totalSent ?? 0}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                <span className="text-iron-600">Acceptés : {stats?.totalAccepted ?? 0}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                <span className="text-iron-600">Refusés : {stats?.totalRefused ?? 0}</span>
              </div>
            </div>

            {/* Recent estimates + CTA */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-iron-900">Derniers devis</h2>
              <Link href="/estimates/new">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Nouveau devis
                </Button>
              </Link>
            </div>

            {recentEstimates.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-iron-500">
                  Aucun devis pour le moment. Créez votre premier devis !
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {recentEstimates.map((est) => (
                  <Link key={est.id} href={`/estimates/${est.id}`}>
                    <Card className="hover:shadow-sm transition cursor-pointer">
                      <CardContent className="py-3 px-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-sm font-medium text-iron-900">{est.reference}</span>
                          <span className="text-sm text-iron-600">{est.clientName}</span>
                          <Badge className={STATUS_COLORS[est.status]}>
                            {STATUS_LABELS[est.status]}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-iron-500">
                            {new Date(est.date).toLocaleDateString('fr-FR')}
                          </span>
                          <span className="text-sm font-medium text-forge-600">
                            {est.totalTTC.toFixed(2)} &euro;
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
