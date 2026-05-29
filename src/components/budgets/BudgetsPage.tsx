import { useState } from 'react';
import BudgetList from './BudgetList';
import AssistantChat from './AssistantChat';
import Button from '../ui/Button';
import { BudgetNewModal } from './BudgetNewModal';

export default function BudgetsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto flex flex-col relative">
      <div className="flex items-center justify-between px-8 pt-6 pb-4 flex-shrink-0">
        <h1 className="font-serif text-[22px] font-semibold text-verko-text">Presupuestos</h1>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          + Nuevo Presupuesto
        </Button>
      </div>
      <div className="flex-1 px-8 pb-8">
        <BudgetList />
      </div>
      <AssistantChat />
      
      {isModalOpen && (
        <BudgetNewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
