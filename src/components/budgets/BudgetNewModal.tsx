import React, { useState } from 'react';
import Modal from '../ui/Modal';
import { cn } from '../ui/Button';
import Input from '../ui/Input';
import CustomSelect from '../ui/CustomSelect';
import { useUiStore } from '../../stores/uiStore';
import * as api from '../../lib/api/budgets';
import { useNavigate } from 'react-router-dom';

interface BudgetNewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Mode = 'lead' | 'client' | 'obra';

const DEFAULT_COSTEO_CONFIG = {
  margen_pct: 35,
  iva_pct: 21,
  iibb_pct: 0,
  descuento_pct: 0,
  descuento_monto: 0,
  tarifa_horaria: 8000,
  moneda_default: 'ARS',
  redondeo: 100,
};

export function BudgetNewModal({ isOpen, onClose }: BudgetNewModalProps) {
  const [mode, setMode] = useState<Mode>('lead');
  const [saving, setSaving] = useState(false);
  const { addToast } = useUiStore();
  const navigate = useNavigate();

  // For simplicity, we just gather some basic info to create
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    cliente_id: '',
    obra_id: ''
  });

  const handleCreate = async () => {
    setSaving(true);
    try {
      const payload: any = {};
      const globalConfig = await api.getCosteoConfigGlobal();
      
      payload.costeo_config = {
        ...DEFAULT_COSTEO_CONFIG,
        margen_pct: globalConfig?.margen_pct ?? DEFAULT_COSTEO_CONFIG.margen_pct,
        iva_pct: globalConfig?.iva_pct ?? DEFAULT_COSTEO_CONFIG.iva_pct,
        iibb_pct: globalConfig?.retencion_iva_pct ?? DEFAULT_COSTEO_CONFIG.iibb_pct,
        descuento_pct: globalConfig?.descuento_pct ?? DEFAULT_COSTEO_CONFIG.descuento_pct,
        tarifa_horaria: globalConfig?.tarifa_horaria ?? DEFAULT_COSTEO_CONFIG.tarifa_horaria,
        moneda_default: globalConfig?.moneda_default ?? DEFAULT_COSTEO_CONFIG.moneda_default,
        redondeo: globalConfig?.redondeo ?? DEFAULT_COSTEO_CONFIG.redondeo,
        multiplicador_mueble_importado: globalConfig?.multiplicador_mueble_importado ?? 2.5,
        multiplicador_mueble_premium: globalConfig?.multiplicador_mueble_premium ?? 5.0,
      };

      if (mode === 'lead') {
        payload.metadata = { 
          lead: { 
            nombre: formData.nombre, 
            telefono: formData.telefono, 
            email: formData.email 
          } 
        };
      } else if (mode === 'client') {
        // mock to null if fake UUID to avoid FK violation, usually we'd pass the selected real UUID
        payload.cliente_id = formData.cliente_id?.startsWith('000') ? null : formData.cliente_id;
        payload.metadata = { mocked_client: true };
      } else if (mode === 'obra') {
        payload.obra_id = formData.obra_id?.startsWith('000') ? null : formData.obra_id;
        payload.metadata = { mocked_obra: true };
      }

      const budget = await api.createPresupuesto(payload);
      addToast('Presupuesto creado con éxito', 'success');
      onClose();
      // Redirect to new budget
      navigate(`/budget/${budget.id}`);
      
    } catch(err: any) {
      addToast(err.message || 'Error al crear presupuesto', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="px-8 py-7">
      <h2 className="font-serif text-[28px] font-[300] tracking-[-0.02em] text-verko-text mb-6">
        Nuevo Presupuesto
      </h2>
      
      <div className="flex flex-col gap-5">
        <div>
          <label className="font-mono text-[10px] tracking-[0.16em] uppercase text-verko-muted mb-2 block">Origen</label>
          <div className="flex gap-2">
            <button 
              onClick={() => setMode('lead')}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-sm transition-all border",
                mode === 'lead' 
                  ? "bg-verko-gold border-[#d8aa49] text-[#1a1400] font-semibold" 
                  : "bg-transparent border-[rgba(255,255,255,0.06)] text-verko-dim hover:text-verko-text hover:border-[rgba(255,255,255,0.15)]"
              )}
            >
              Prospecto (Lead)
            </button>
            <button 
              onClick={() => setMode('client')}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-sm transition-all border",
                mode === 'client' 
                  ? "bg-verko-gold border-[#d8aa49] text-[#1a1400] font-semibold" 
                  : "bg-transparent border-[rgba(255,255,255,0.06)] text-verko-dim hover:text-verko-text hover:border-[rgba(255,255,255,0.15)]"
              )}
            >
              Cliente Existente
            </button>
            <button 
              onClick={() => setMode('obra')}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-sm transition-all border",
                mode === 'obra' 
                  ? "bg-verko-gold border-[#d8aa49] text-[#1a1400] font-semibold" 
                  : "bg-transparent border-[rgba(255,255,255,0.06)] text-verko-dim hover:text-verko-text hover:border-[rgba(255,255,255,0.15)]"
              )}
            >
              Obra Existente
            </button>
          </div>
        </div>

        {mode === 'lead' && (
          <div className="flex flex-col gap-5">
             <Input 
               label="Nombre completo"
               value={formData.nombre} 
               onChange={(e) => setFormData(p => ({ ...p, nombre: e.target.value }))} 
               placeholder="Ej. Juan Pérez" 
             />
             <div className="grid grid-cols-2 gap-4">
               <Input 
                 label="Teléfono"
                 value={formData.telefono} 
                 onChange={(e) => setFormData(p => ({ ...p, telefono: e.target.value }))} 
                 placeholder="+54 9 11..." 
               />
               <Input 
                 label="Email"
                 type="email"
                 value={formData.email} 
                 onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))} 
                 placeholder="juan@email.com" 
               />
             </div>
          </div>
        )}

        {mode === 'client' && (
          <CustomSelect 
            label="Seleccionar cliente"
            value={formData.cliente_id} 
            onChange={(val) => setFormData(p => ({ ...p, cliente_id: val }))}
            placeholder="-- Buscar cliente --"
            options={[
              { value: '00000000-0000-0000-0000-000000000001', label: 'Cliente A' }
            ]}
          />
        )}

        {mode === 'obra' && (
          <CustomSelect 
            label="Seleccionar obra"
            value={formData.obra_id} 
            onChange={(val) => setFormData(p => ({ ...p, obra_id: val }))}
            placeholder="-- Buscar obra --"
            options={[
              { value: '00000000-0000-0000-0000-000000000002', label: 'Obra X' }
            ]}
          />
        )}

        <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-[rgba(255,255,255,0.06)]">
          <button 
            className="px-5 py-2.5 rounded-xl text-sm font-medium border border-[rgba(255,255,255,0.1)] text-verko-dim hover:text-verko-text hover:border-[rgba(255,255,255,0.2)] transition-all"
            onClick={onClose} 
            disabled={saving}
          >
            Cancelar
          </button>
          <button 
            className="px-6 py-2.5 rounded-xl text-[15px] bg-verko-gold text-white tracking-wide font-semibold shadow-[0_2px_12px_rgba(199,153,67,0.25)] hover:bg-[#b58835] transition-all"
            onClick={handleCreate} 
            disabled={saving}
          >
            {saving ? 'Creando...' : 'Crear Presupuesto'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
