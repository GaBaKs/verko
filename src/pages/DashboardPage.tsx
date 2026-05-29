export default function DashboardPage() {
  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      <div className="flex items-center justify-between px-8 pt-6 pb-4 flex-shrink-0">
        <h1 className="font-serif text-[22px] font-semibold text-verko-text">Dashboard</h1>
      </div>
      
      <div className="flex-1 px-8 pb-8">
        <p className="text-sm text-verko-secondary">Bienvenido al panel principal de VERKO.</p>
        {/* Futuros componentes: KPIs, Pipeline, etc. */}
      </div>
    </div>
  );
}
