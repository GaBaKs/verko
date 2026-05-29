import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { getCosteoConfigGlobal, saveCosteoConfigGlobal } from '../lib/api/budgets';
import { useUiStore } from '../stores/uiStore';

const marginsSchema = z.object({
  importMultiplier: z.coerce.number().min(0, 'Debe ser mayor o igual a 0'),
  premiumMultiplier: z.coerce.number().min(0, 'Debe ser mayor o igual a 0')
});

type MarginsFormValues = z.infer<typeof marginsSchema>;

export default function MarginsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { addToast } = useUiStore();

  const { register, handleSubmit, formState: { errors, isDirty }, reset } = useForm<MarginsFormValues>({
    resolver: zodResolver(marginsSchema),
    defaultValues: {
      importMultiplier: 2.5,
      premiumMultiplier: 5.0
    }
  });

  useEffect(() => {
    async function loadConfig() {
      try {
        const config = await getCosteoConfigGlobal();
        if (config) {
          reset({
            importMultiplier: config.multiplicador_mueble_importado ?? 2.5,
            premiumMultiplier: config.multiplicador_mueble_premium ?? 5.0,
          });
        }
      } catch (err) {
        console.error('[MarginsPage] Error cargando configuración:', err);
        addToast('Ocurrió un error al cargar la configuración de márgenes', 'error');
      } finally {
        setLoading(false);
      }
    }
    
    loadConfig();
  }, [reset]);

  const onSubmit = async (data: MarginsFormValues) => {
    setSaving(true);
    try {
      await saveCosteoConfigGlobal({
        multiplicador_mueble_importado: data.importMultiplier,
        multiplicador_mueble_premium: data.premiumMultiplier,
      });
      reset(data);
      addToast('Márgenes actualizados correctamente', 'success');
    } catch (err) {
      console.error('[MarginsPage] Error guardando configuración:', err);
      addToast('Ocurrió un error al guardar los márgenes', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      <div className="flex items-center justify-between px-8 pt-6 pb-4 flex-shrink-0">
        <h1 className="font-serif text-[22px] font-semibold text-verko-text">Márgenes</h1>
      </div>
      
      <div className="flex-1 px-8 pb-8">
        <p className="text-sm text-verko-secondary mb-8 max-w-[700px]">
          Configuración global de los multiplicadores de precio. Estos valores impactarán por defecto a los nuevos diseños de obras, estableciendo su precio base.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-[1200px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <h2 className="font-mono text-[10px] tracking-[0.16em] uppercase text-verko-dim mb-6">
                Multiplicadores Globales
              </h2>
              
              <div className="space-y-6">
                <Input
                  label="Multiplicador mueble importado"
                  type="number"
                  step="0.01"
                  {...register('importMultiplier')}
                  error={errors.importMultiplier?.message}
                  placeholder="Ej: 2.5"
                />
                <Input
                  label="Multiplicador mueble premium"
                  type="number"
                  step="0.01"
                  {...register('premiumMultiplier')}
                  error={errors.premiumMultiplier?.message}
                  placeholder="Ej: 5.0"
                />
              </div>
            </Card>
          </div>

          <div className="flex pt-4">
            <Button variant="primary" type="submit" disabled={saving || !isDirty}>
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
