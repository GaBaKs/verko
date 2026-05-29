import ChatPanel from './ChatPanel';

export default function DesignerPage() {
  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-8 pt-6 pb-4 flex-shrink-0">
        <h1 className="font-serif text-[22px] font-semibold text-verko-text">Diseñador IA</h1>
      </div>
      <div className="flex-1 px-4 lg:px-8 pb-4 h-full">
        <div className="h-full border border-verko-border rounded-2xl bg-[rgba(255,255,255,0.015)] shadow-lg flex max-w-4xl mx-auto overflow-hidden">
          <div className="flex-1 flex flex-col h-full w-full">
            <ChatPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
