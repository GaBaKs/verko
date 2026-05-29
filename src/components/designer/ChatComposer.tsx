import { useState, useRef } from 'react';
import { Mic, Send, Paperclip, X } from 'lucide-react';
import { useVoiceRecording } from '../../hooks/useVoiceRecording';
import cn from 'clsx'; // Simple clsx import for this component

interface ChatComposerProps {
  onSend: (text: string) => void;
  isSending: boolean;
}

export default function ChatComposer({ onSend, isSending }: ChatComposerProps) {
  const [text, setText] = useState('');
  const { isRecording, startRecording, stopRecording } = useVoiceRecording();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const MAX_HEIGHT = 120;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, MAX_HEIGHT)}px`;
    setText(e.target.value);
  };

  const handleSend = () => {
    if ((!text.trim() && !isRecording) || isSending) return;
    onSend(text);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    // in full impl, handle voice blobs and photos too
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-[rgba(255,255,255,0.06)] bg-gradient-to-t from-[rgba(11,14,20,0.8)] to-transparent">
      {/* Container simulating a unified pill design */}
      <div className="flex items-end gap-2 bg-verko-card border border-verko-border rounded-2xl p-2 shadow-sm transition hover:border-[rgba(255,255,255,0.14)] focus-within:border-[rgba(199,153,67,0.58)] focus-within:shadow-[0_0_0_4px_rgba(199,153,67,0.12),inset_0_1px_0_rgba(255,255,255,0.06)] min-w-0">
        
        <button 
          className="p-2 text-verko-muted hover:text-verko-text rounded-full shrink-0"
          title="Adjuntar archivo o foto"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Escribí tu mensaje..."
          className="flex-1 min-w-0 w-full bg-transparent text-[13px] text-verko-text resize-none outline-none py-[10px] px-1 overflow-y-auto overflow-x-hidden placeholder:text-verko-muted"
          style={{ maxHeight: `${MAX_HEIGHT}px` }}
          rows={1}
        />

        <div className="flex items-center gap-1 shrink-0 pb-1">
          {text.trim().length === 0 ? (
            <button 
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onMouseLeave={stopRecording}
              className={cn(
                "p-2 rounded-full transition-colors",
                isRecording ? "bg-[rgba(192,57,43,0.2)] text-verko-red" : "text-verko-muted hover:text-verko-text bg-[rgba(255,255,255,0.04)]"
              )}
              title="Mantené presionado para grabar voz"
            >
              <Mic className="w-5 h-5" />
            </button>
          ) : (
            <button 
              onClick={handleSend}
              disabled={isSending}
              className="p-2 bg-verko-gold text-white rounded-full hover:bg-[rgba(199,153,67,0.85)] transition-colors disabled:opacity-50"
              title="Enviar mensaje"
            >
              <Send className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
