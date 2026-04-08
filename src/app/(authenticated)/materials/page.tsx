'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import MaterialForm from '@/components/materials/MaterialForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';
import { Material } from '@/models/types';

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Material | undefined>();

  async function fetchMaterials() {
    setLoading(true);
    const url = search ? `/api/materials?q=${encodeURIComponent(search)}` : '/api/materials';
    const res = await fetch(url);
    if (res.ok) setMaterials(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    const debounce = setTimeout(fetchMaterials, 300);
    return () => clearTimeout(debounce);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  async function handleCreate(data: Omit<Material, 'id'>) {
    const res = await fetch('/api/materials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setShowForm(false);
      fetchMaterials();
    }
  }

  async function handleUpdate(data: Omit<Material, 'id'>) {
    if (!editing) return;
    const res = await fetch(`/api/materials/${editing.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setEditing(undefined);
      setShowForm(false);
      fetchMaterials();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer ce matériau ?')) return;
    const res = await fetch(`/api/materials/${id}`, { method: 'DELETE' });
    if (res.ok) fetchMaterials();
  }

  const grouped = materials.reduce<Record<string, Material[]>>((acc, mat) => {
    if (!acc[mat.category]) acc[mat.category] = [];
    acc[mat.category].push(mat);
    return acc;
  }, {});

  return (
    <>
      <Header title="Matériaux" />
      <div className="p-6 max-w-5xl">
        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-iron-400" />
            <Input
              placeholder="Rechercher un matériau..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={() => { setEditing(undefined); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-1" />
            Ajouter
          </Button>
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-iron-500">Chargement...</p>
        ) : materials.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-iron-500">
              Aucun matériau trouvé.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped).map(([category, mats]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-sm font-semibold text-iron-700 uppercase tracking-wide">{category}</h3>
                  <Badge variant="outline" className="text-xs">{mats.length}</Badge>
                </div>
                <div className="grid gap-2">
                  {mats.map((mat) => (
                    <Card key={mat.id} className="hover:shadow-sm transition">
                      <CardContent className="py-3 px-4 flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-sm text-iron-900 truncate">{mat.name}</span>
                            {mat.description && (
                              <span className="text-xs text-iron-400 truncate hidden md:inline">{mat.description}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 ml-4 shrink-0">
                          <span className="text-sm font-medium text-forge-600">
                            {mat.unitPrice.toFixed(2)} &euro; / {mat.unit}
                          </span>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => { setEditing(mat); setShowForm(true); }}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-iron-400 hover:text-red-500"
                              onClick={() => handleDelete(mat.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Form Dialog */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Modifier le matériau' : 'Ajouter un matériau'}</DialogTitle>
            </DialogHeader>
            <MaterialForm
              material={editing}
              onSubmit={editing ? handleUpdate : handleCreate}
              onCancel={() => setShowForm(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
