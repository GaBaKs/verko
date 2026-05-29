import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { ai, designerChatConfig } from '../lib/gemini';
import type { VerkoDesignConversation, VerkoDesignAttachment } from '../types/designer';

const WELCOME_MESSAGE: VerkoDesignConversation = {
  id: 'welcome',
  session_id: null,
  thread_id: null,
  user_id: null,
  rol: 'agent',
  canal: 'web',
  intent: null,
  texto: 'Hola. Soy el **Diseñador IA de VERKO**. ¿En qué proyecto o ambiente nuevo vamos a trabajar hoy? Podés subir fotos del espacio o audios con lo que tenés en mente.',
  transcripcion: null,
  vision_json: null,
  tokens_in: null,
  tokens_out: null,
  latency_ms: null,
  created_at: new Date().toISOString(),
};

export function useDesignChat(initialThreadId?: string) {
  const [threadId, setThreadId] = useState<string | null>(initialThreadId || null);
  const [messages, setMessages] = useState<VerkoDesignConversation[]>([WELCOME_MESSAGE]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async (tid: string) => {
    const { data } = await supabase
      .from('verko_design_conversations' as any)
      .select('*')
      .eq('thread_id', tid)
      .order('created_at', { ascending: true });
      
    if (data) {
      setMessages(data as VerkoDesignConversation[]);
    }
  }, []);

  const handleRenderRequest = async (params: any, currentThreadId: string) => {
    // Simulación - En el futuro, acá va a ir la llamada a la API real
    const systemMsg: VerkoDesignConversation = {
      id: Math.random().toString(),
      session_id: null,
      thread_id: currentThreadId,
      user_id: null,
      rol: 'system',
      canal: 'web',
      intent: null,
      texto: 'Generando render... (simulado)',
      transcripcion: null,
      vision_json: null,
      tokens_in: 0,
      tokens_out: 0,
      latency_ms: 0,
      created_at: new Date().toISOString(),
    };

    const renderCardMsg: VerkoDesignConversation = {
      id: Math.random().toString(),
      session_id: null,
      thread_id: currentThreadId,
      user_id: null,
      rol: 'system',
      canal: 'web',
      intent: 'render_card',
      texto: JSON.stringify(params),
      transcripcion: null,
      vision_json: null,
      tokens_in: 0,
      tokens_out: 0,
      latency_ms: 0,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, systemMsg, renderCardMsg]);
  };

  const sendTurn = useCallback(async (text: string, photoB64?: string, audioB64?: string, planB64?: string) => {
    setIsSending(true);
    setError(null);
    
    const currentThreadId = threadId || crypto.randomUUID();
    if (!threadId) {
      setThreadId(currentThreadId);
    }

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
    setAttachments([]);

    try {
      // Build history for Gemini
      const geminiHistory = messages
        .filter(m => m.id !== 'welcome' && (m.rol === 'user' || m.rol === 'agent'))
        .map(m => ({
          role: m.rol === 'user' ? 'user' : 'model',
          parts: [{ text: m.texto || '' }]
        }));

      const chat = ai.chats.create({
        ...designerChatConfig,
        history: geminiHistory as any,
      });

      const result = await chat.sendMessage({ message: text });
      const responseText = result.text;
      let cleanText = responseText || '';
      let renderParams = null;

      // Extract JSON if it exists
      const jsonMatch = cleanText.match(/\{[\s\S]*"action"\s*:\s*"generate_render"[\s\S]*?\}/);
      if (jsonMatch) {
        try {
          renderParams = JSON.parse(jsonMatch[0]);
          cleanText = cleanText.replace(jsonMatch[0], '').trim();
        } catch (e) {
          console.error('Error parsing render parameters:', e);
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

      if (renderParams) {
        await handleRenderRequest(renderParams, currentThreadId);
      }

    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Error al enviar el mensaje';
      setError(msg);
    } finally {
      setIsSending(false);
    }
  }, [threadId, messages]);

  return {
    threadId,
    messages,
    attachments,
    setAttachments,
    isSending,
    error,
    sendTurn,
    fetchHistory
  };
}
