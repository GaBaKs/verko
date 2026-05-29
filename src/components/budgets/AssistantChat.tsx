import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import BudgetChatPanel from './BudgetChatPanel';

export default function AssistantChat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-verko-gold text-white rounded-full shadow-lg flex items-center justify-center hover:bg-verko-gold-light transition hover:scale-105 z-[90]"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Slide-over chat */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-[min(90vw,400px)] bg-verko-bg border-l border-verko-border shadow-2xl z-[200] flex flex-col">
          <div className="p-4 border-b border-[rgba(255,255,255,0.06)] flex justify-between items-center bg-verko-card">
            <h3 className="font-serif text-lg text-verko-gold">Asistente de Presupuestos</h3>
            <button onClick={() => setIsOpen(false)} className="text-verko-dim hover:text-white">Cerrar</button>
          </div>
          <div className="flex-1 overflow-hidden flex flex-col pt-2">
            <BudgetChatPanel />
          </div>
        </div>
      )}
    </>
  );
}
