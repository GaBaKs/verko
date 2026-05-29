import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatComposer from './ChatComposer';
import TypingDots from './TypingDots';
import AttachmentBar from './AttachmentBar';
import { useDesignChat } from '../../hooks/useDesignChat';

export default function ChatPanel() {
  const { messages, attachments, setAttachments, isSending, sendTurn } = useDesignChat();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending, attachments]);

  const displayMessages = messages.length > 0 ? messages : [
    {
      id: 'welcome',
      session_id: null,
      thread_id: null,
      user_id: null,
      rol: 'agent' as const,
      canal: 'web' as const,
      intent: null,
      texto: 'Hola. Soy el **Diseñador IA de VERKO**. ¿En qué proyecto o ambiente nuevo vamos a trabajar hoy? Podés subir fotos del espacio o audios con lo que tenés en mente.',
      transcripcion: null,
      vision_json: null,
      tokens_in: null,
      tokens_out: null,
      latency_ms: null,
      created_at: new Date().toISOString()
    }
  ];

  const handleRemoveAttachment = (idx: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col h-full bg-[rgba(10,13,18,0.5)] rounded-t-xl overflow-hidden relative">
      <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
        {displayMessages.map(msg => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isSending && <TypingDots />}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="flex flex-col bg-[rgba(16,19,26,0.95)] border-t border-verko-border">
        {attachments && attachments.length > 0 && (
          <AttachmentBar attachments={attachments} onRemove={handleRemoveAttachment} />
        )}
        <ChatComposer onSend={sendTurn} isSending={isSending} />
      </div>
    </div>
  );
}
