import { cn } from '../ui/Button';
import type { VerkoDesignConversation } from '../../types/designer';
import InlineRenderCard from './InlineRenderCard';

interface ChatMessageProps {
  message: VerkoDesignConversation;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isAgent = message.rol === 'agent';
  const isSystem = message.rol === 'system';

  if (isSystem) {
    if (message.intent === 'render_card') {
      let renderStatus: 'pending' | 'generating' | 'completed' | 'error' = 'pending';
      try {
        const parsed = JSON.parse(message.texto || '{}');
        if (parsed.status === 'simulated') {
          renderStatus = 'generating'; // Or whichever state you want for simulated
          // Let's just pretend it's completed for the simulated experience so the user sees a placeholder image hook
        }
      } catch (e) {
        // ignore
      }

      return (
        <div className="flex justify-start my-3">
          <InlineRenderCard 
            status="completed" 
            imageUrl="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80" 
          />
        </div>
      );
    }

    return (
      <div className="flex justify-center my-3">
        <div className="italic text-[12px] text-verko-muted px-[14px] py-1.5 border border-dashed border-[rgba(255,255,255,0.08)] rounded-xl text-center">
          {message.texto}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex gap-2 my-4 w-full", isAgent ? "justify-start" : "justify-end")}>
      {isAgent && (
        <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center font-mono text-[13px] font-bold bg-gradient-to-br from-[#c89b3c] to-[#a07a2a] text-[#1a1a1a] border border-[rgba(212,175,55,0.5)] shadow-[0_2px_8px_rgba(199,153,67,0.35)]">
          V
        </div>
      )}

      <div className={cn(
        "px-4 py-3 border text-[14px] leading-relaxed max-w-[85%]",
        isAgent 
          ? "rounded-2xl rounded-bl-[6px] bg-[rgba(255,255,255,0.04)] text-[#e8e8e8] border-[rgba(255,255,255,0.08)]"
          : "rounded-2xl rounded-br-[6px] bg-gradient-to-br from-[rgba(199,153,67,0.32)] to-[rgba(145,102,38,0.55)] text-[#fff7ea] border-[rgba(231,197,124,0.28)] shadow-[0_8px_22px_rgba(95,65,18,0.25)]"
      )}>
        {/* Simple markdown bold renderer for agent */}
        {isAgent ? (
          <div dangerouslySetInnerHTML={{ __html: (message.texto || '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#f0d99b] font-semibold">$1</strong>') }} />
        ) : (
          <div>{message.texto}</div>
        )}
      </div>

      {!isAgent && (
        <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center font-mono text-[11px] font-bold bg-gradient-to-br from-[#4a4a4a] to-[#2a2a2a] text-[#f0e6d2] border border-[rgba(255,255,255,0.12)]">
          U
        </div>
      )}
    </div>
  );
}
