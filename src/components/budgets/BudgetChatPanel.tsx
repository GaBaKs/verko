import React, { useEffect, useRef } from 'react';
import ChatMessage from '../designer/ChatMessage';
import ChatComposer from '../designer/ChatComposer';
import TypingDots from '../designer/TypingDots';
import { useBudgetAssistantChat } from '../../hooks/useBudgetAssistantChat';

export default function BudgetChatPanel() {
  const { messages, isSending, sendTurn } = useBudgetAssistantChat();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSend = async (text: string) => {
    await sendTurn(text);
  };

  return (
    <div className="flex flex-col h-full bg-[rgba(10,13,18,0.5)] rounded-t-xl overflow-hidden relative">
      <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isSending && <TypingDots />}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="flex flex-col bg-[rgba(16,19,26,0.95)] border-t border-verko-border">
        {/* We reuse ChatComposer. Note that ChatComposer also returns photo/audio data,
            we only pass text. We can ignore the others for budget chat for now. */}
        <ChatComposer onSend={(text) => handleSend(text)} isSending={isSending} />
      </div>
    </div>
  );
}
