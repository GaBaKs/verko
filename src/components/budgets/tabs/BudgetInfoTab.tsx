import React, { useState, useEffect } from 'react';
import Card from '../../ui/Card';
import Input from '../../ui/Input';
import Button from '../../ui/Button';

export function BudgetInfoTab({ editor }: { editor: any }) {
  const p = editor.presupuesto;
  const lead = (p?.metadata?.lead as Record<string, any>) || {};
  
  const [domicilio, setDomicilio] = useState(lead.domicilio || lead.direccion || '');
  const [localidad, setLocalidad] = useState(lead.localidad || lead.ciudad || '');
  const [proyecto, setProyecto] = useState((p?.metadata?.proyecto as string) || lead.proyecto || '');
  const [validezDias, setValidezDias] = useState(p?.costeo_config?.validez_dias?.toString() || '15');

  useEffect(() => {
    const newLead = (editor.presupuesto?.metadata?.lead as Record<string, any>) || {};
    setDomicilio(newLead.domicilio || newLead.direccion || '');
    setLocalidad(newLead.localidad || newLead.ciudad || '');
    setProyecto((editor.presupuesto?.metadata?.proyecto as string) || newLead.proyecto || '');
    setValidezDias(editor.presupuesto?.costeo_config?.validez_dias?.toString() || '15');
  }, [editor.presupuesto]);

  const handleSave = async () => {
    const newMetadata = {
      ...p?.metadata,
      proyecto,
      lead: {
        ...lead,
        domicilio,
        localidad,
        proyecto, // Keep sync with lead data if necessary, though we also put it at root
      }
    };
    
    let newCosteoConfig = p?.costeo_config;
    if (newCosteoConfig) {
      newCosteoConfig = {
        ...newCosteoConfig,
        validez_dias: parseInt(validezDias, 10) || 15
      };
    } else {
      // Create it if null
      newCosteoConfig = { validez_dias: parseInt(validezDias, 10) || 15 };
    }

    await editor.updatePresupuestoData({
      metadata: newMetadata,
      costeo_config: newCosteoConfig
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-serif text-[20px] text-verko-text mb-2">Información del Proyecto y Cliente</h2>
          <p className="text-sm text-verko-secondary">Ajusta los detalles para la exportación y presentación formal del presupuesto.</p>
        </div>
        <Button variant="primary" onClick={handleSave} disabled={editor.saving}>
          {editor.saving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-mono text-[10px] tracking-[0.16em] uppercase text-verko-dim mb-4">Datos del Cliente</h3>
          <div className="space-y-4">
            <div>
              <label className="font-mono text-[10px] tracking-[0.16em] uppercase text-verko-dim mb-2 block">Domicilio</label>
              <Input 
                value={domicilio} 
                onChange={(e) => setDomicilio(e.target.value)} 
                placeholder="Ej. Av. del Libertador 1234, 5to B"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] tracking-[0.16em] uppercase text-verko-dim mb-2 block">Localidad</label>
              <Input 
                value={localidad} 
                onChange={(e) => setLocalidad(e.target.value)} 
                placeholder="Ej. CABA"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-mono text-[10px] tracking-[0.16em] uppercase text-verko-dim mb-4">Datos del Proyecto</h3>
          <div className="space-y-4">
            <div>
              <label className="font-mono text-[10px] tracking-[0.16em] uppercase text-verko-dim mb-2 block">Proyecto</label>
              <Input 
                value={proyecto} 
                onChange={(e) => setProyecto(e.target.value)} 
                placeholder="Ej. Casa nordelta lote 4"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] tracking-[0.16em] uppercase text-verko-dim mb-2 block">Validez (días)</label>
              <Input 
                type="number"
                value={validezDias} 
                onChange={(e) => setValidezDias(e.target.value)} 
                placeholder="15"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
