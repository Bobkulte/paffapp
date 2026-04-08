'use client';

import Header from '@/components/layout/Header';
import EstimateForm from '@/components/estimates/EstimateForm';

export default function NewEstimatePage() {
  return (
    <>
      <Header title="Nouveau devis" />
      <div className="p-8 max-w-5xl">
        <EstimateForm />
      </div>
    </>
  );
}
