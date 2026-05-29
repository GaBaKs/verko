import { useUiStore } from '../../stores/uiStore';
import { cn } from './Button';

export default function ToastContainer() {
  const { toasts, removeToast } = useUiStore();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => removeToast(toast.id)}
          className={cn(
            'pointer-events-auto cursor-pointer p-4 rounded-2xl border shadow-lg transition-all duration-300 translate-x-0',
            'bg-[rgba(20,24,30,0.9)] backdrop-blur-md',
            toast.type === 'error' ? 'border-[#C0392B] text-white' : 
            toast.type === 'success' ? 'border-[rgba(121,210,140,0.4)] text-verko-green' : 
            'border-verko-border text-verko-text'
          )}
          style={{ animation: 'slideIn 0.3s ease-out forwards' }}
        >
          <style>{`
            @keyframes slideIn {
              from { transform: translateX(120%); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
          `}</style>
          <p className="text-sm font-sans">{toast.message}</p>
        </div>
      ))}
    </div>
  );
}
