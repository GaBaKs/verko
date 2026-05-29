import React from 'react';
import AssistantChat from '../AssistantChat';

export function BudgetChatTab({ editor }: { editor: any }) {

  return (
    <div className="h-[600px] border border-verko-border rounded-2xl overflow-hidden shadow-md">
      {/* We reuse AssistantChat but we can map thread_id later */}
      <AssistantChat />
    </div>
  );
}
