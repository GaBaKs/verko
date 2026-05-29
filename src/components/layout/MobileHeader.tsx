import { Menu } from 'lucide-react';
import { useUiStore } from '../../stores/uiStore';

export default function MobileHeader() {
  const { toggleSidebar } = useUiStore();

  return (
    <div className="lg:hidden flex h-14 px-4 items-center gap-3 bg-[rgba(10,13,18,0.76)] border border-verko-border rounded-[22px] backdrop-blur-[22px] shadow m-4 mb-2 flex-shrink-0 z-[100]">
      <button 
        onClick={toggleSidebar}
        className="w-[38px] h-[38px] rounded-xl border border-verko-border bg-[rgba(255,255,255,0.04)] flex items-center justify-center text-verko-secondary hover:text-verko-text transition"
      >
        <Menu className="w-5 h-5" />
      </button>
      <h1 className="font-serif text-[16px] font-semibold flex-1 text-verko-text">
        VERKO
      </h1>
    </div>
  );
}
