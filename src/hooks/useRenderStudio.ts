import { useState, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

export type Render = Database['public']['Tables']['renders']['Row'] | {
  id: string;
  estado: 'en_cola' | 'procesando' | 'completado' | 'fallido' | 'cancelado';
  resultado_url: string | null;
  [key: string]: unknown;
};

export function useRenderStudio(obraId: string) {
  const [renders, setRenders] = useState<Render[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRenders = useCallback(async () => {
    // In actual impl, fetch from 'renders'
    const { data } = await supabase
      .from('renders' as any)
      .select('*')
      .eq('obra_id', obraId)
      .order('created_at', { ascending: false });
    if (data) setRenders(data as Render[]);
  }, [obraId]);

  const generateRender = useCallback(async (params: { modelo_codigo: string; ambiente: string; prompt: string; }) => {
    setIsGenerating(true);
    setError(null);
    try {
      const { data, error: funcError } = await supabase.functions.invoke('generar-render', {
        body: {
          obra_id: obraId,
          ...params
        }
      });
      if (funcError) throw new Error(funcError.message);
      
      return data.render_id; // Return ID to start polling
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [obraId]);

  const pollRenderStatus = useCallback(async (renderId: string) => {
    return new Promise<Render>((resolve, reject) => {
      const interval = setInterval(async () => {
        const { data, error } = await supabase
          .from('renders' as any)
          .select('*')
          .eq('id', renderId)
          .single();
          
        if (error) {
          clearInterval(interval);
          reject(error);
        } else if (data && typeof data === 'object') {
          const d = data as Render;
          if (d.estado === 'completado' || d.estado === 'fallido' || d.estado === 'cancelado') {
            clearInterval(interval);
            resolve(d);
            // Refetch gallery
            fetchRenders();
          }
        }
      }, 5000);
    });
  }, [fetchRenders]);

  return {
    renders,
    fetchRenders,
    isGenerating,
    error,
    generateRender,
    pollRenderStatus
  };
}
