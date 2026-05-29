import { useState, useCallback } from 'react';
import { ai, budgetAssistantConfig } from '../lib/gemini';
import { useNavigate } from 'react-router-dom';
import * as api from '../lib/api/budgets';
import { useUiStore } from '../stores/uiStore';

// Assuming we reuse VerkoDesignConversation for the chat state shape
import type { VerkoDesignConversation } from '../types/designer';

const DEFAULT_COSTEO_CONFIG = {
  margen_pct: 35,
  iva_pct: 21,
  iibb_pct: 0,
  descuento_pct: 0,
  descuento_monto: 0,
  tarifa_horaria: 8000,
  moneda_default: 'ARS',
  redondeo: 100,
  validez_dias: 15,
};

const WELCOME_MESSAGE: VerkoDesignConversation = {
  id: 'welcome',
  session_id: null,
  thread_id: null,
  user_id: null,
  rol: 'agent',
  canal: 'web',
  intent: null,
  texto: 'Hola. Soy el Asistente IA de Presupuestos. Estoy acá para ayudarte a recopilar todos los datos necesarios para armar un nuevo presupuesto. ¿Para qué cliente estamos armando el presupuesto y cuál es el proyecto?',
  transcripcion: null,
  vision_json: null,
  tokens_in: null,
  tokens_out: null,
  latency_ms: null,
  created_at: new Date().toISOString(),
};

export function useBudgetAssistantChat() {
  const [messages, setMessages] = useState<VerkoDesignConversation[]>([WELCOME_MESSAGE]);
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();
  const { addToast } = useUiStore();

  const handleCreateBudget = async (params: any) => {
    try {
      addToast('Creando presupuesto...', 'info');
      
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
        validez_dias: params.validez_dias || 15
      };

      payload.metadata = { 
        lead: { 
          nombre: params.cliente?.nombre || 'Consumidor Final', 
          domicilio: params.cliente?.domicilio || '',
          localidad: params.cliente?.localidad || '',
          proyecto: params.cliente?.proyecto || ''
        },
        proyecto: params.cliente?.proyecto || ''
      };

      // Como mínimo creamos el Presupuesto
      const budget = await api.createPresupuesto(payload);
      
      // Creamos los items provistos por Gemini
      if (params.items && Array.isArray(params.items)) {
        for (const item of params.items) {
           await api.upsertLinea({
             presupuesto_id: budget.id,
             concepto: item.nombre || item.descripcion || 'Mueble/Ítem',
             tipo_linea: 'mueble',
             precio_unitario: Number(item.precio) || 0,
             subtotal: Number(item.precio) || 0,
             cantidad: 1,
             metadata: {
               tipo_mueble: item.tipo || 'a_medida'
             }
           });
        }
      }

      addToast('Presupuesto creado con éxito usando asistente IA', 'success');
      
      // We navigate immediately
      navigate(`/budget/${budget.id}`);
      
    } catch(err: any) {
      addToast(err.message || 'Error al crear presupuesto desde IA', 'error');
    }
  };

  const sendTurn = useCallback(async (text: string) => {
    setIsSending(true);
    
    const currentThreadId = crypto.randomUUID();

    const tempMessage: VerkoDesignConversation = {
      id: Math.random().toString(),
      session_id: null,
      thread_id: currentThreadId,
      user_id: null,
      rol: 'user',
      canal: 'web',
      intent: null,
      texto: text,
      transcripcion: null,
      vision_json: null,
      tokens_in: 0,
      tokens_out: 0,
      latency_ms: 0,
      created_at: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, tempMessage]);

    try {
      const geminiHistory = messages
        .filter(m => m.id !== 'welcome' && (m.rol === 'user' || m.rol === 'agent'))
        .map(m => ({
          role: m.rol === 'user' ? 'user' : 'model',
          parts: [{ text: m.texto || '' }]
        }));

      const chat = ai.chats.create({
        ...budgetAssistantConfig,
        history: geminiHistory as any,
      });

      const result = await chat.sendMessage({ message: text });
      let cleanText = result.text || '';
      let budgetParams = null;

      // Extract JSON if it exists
      const startIdx = cleanText.indexOf('{');
      const endIdx = cleanText.lastIndexOf('}');

      if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
        const jsonStr = cleanText.substring(startIdx, endIdx + 1);
        if (jsonStr.includes('"create_budget"')) {
          try {
            budgetParams = JSON.parse(jsonStr);
            cleanText = cleanText.substring(0, startIdx).trim();
          } catch (e) {
            console.error('Error parsing create_budget parameters:', e);
          }
        }
      }

      if (cleanText) {
        const responseMessage: VerkoDesignConversation = {
          id: Math.random().toString(),
          session_id: null,
          thread_id: currentThreadId,
          user_id: null,
          rol: 'agent',
          canal: 'web',
          intent: null,
          texto: cleanText,
          transcripcion: null,
          vision_json: null,
          tokens_in: 0,
          tokens_out: 0,
          latency_ms: 0,
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, responseMessage]);
      }

      if (budgetParams) {
        // Ejecutamos la logica para redirigir/crear el PPT
        await handleCreateBudget(budgetParams);
      }

    } catch (err: unknown) {
      console.error(err);
      addToast('Error al enviar el mensaje', 'error');
    } finally {
      setIsSending(false);
    }
  }, [messages]);

  return {
    messages,
    isSending,
    sendTurn
  };
}
