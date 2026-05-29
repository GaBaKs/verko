import React from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { Upload, File } from 'lucide-react';

export function BudgetAttachmentsTab({ editor }: { editor: any }) {

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-serif text-[20px] text-verko-text">Adjuntos</h2>
        <Button variant="default" onClick={() => {}}>
          <Upload className="w-4 h-4 mr-2" /> Subir Archivo
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-[rgba(255,255,255,0.12)] rounded-3xl bg-[rgba(255,255,255,0.01)] hover:bg-[rgba(255,255,255,0.02)] transition-colors cursor-pointer">
         <File className="w-8 h-8 text-verko-dim mb-4" />
         <p className="font-sans text-sm text-verko-secondary mb-2">Arrastrá archivos acá o hacé click para seleccionar.</p>
         <p className="font-mono text-[10px] uppercase tracking-wider text-verko-dim">Soporta PDF, JPG, PNG, DXF</p>
      </div>
    </div>
  );
}
