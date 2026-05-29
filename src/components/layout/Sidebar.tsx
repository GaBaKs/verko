import { useAuthStore } from '../../stores/authStore';
import { useUiStore } from '../../stores/uiStore';
import { LogOut, Home, MessageSquare, FileText, Menu, Sliders } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const { isSidebarOpen, closeSidebar } = useUiStore();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('[Sidebar] Logout error:', err);
    }
  };

  const navItems = [
    { to: '/dashboard', label: 'Inicio', icon: <Home className="w-4 h-4" /> },
    { to: '/designer', label: 'Diseñador IA', icon: <MessageSquare className="w-4 h-4" /> },
    { to: '/budgets', label: 'Presupuestos', icon: <FileText className="w-4 h-4" /> },
    { to: '/margins', label: 'Márgenes', icon: <Sliders className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-[199]" 
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 w-[min(88vw,240px)] bg-verko-sidebar flex flex-col h-screen rounded-r-[28px] lg:rounded-none z-[200] transition-transform duration-[320ms] ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-[110%] lg:translate-x-0'
        }`}
      >
        <div className="px-5 pt-6 pb-5 border-b border-[rgba(255,255,255,0.06)]">
          <h2 className="font-serif text-[20px] font-semibold text-[#F5F3EF] tracking-[0.06em]">VERKO</h2>
          <p className="text-[10px] text-verko-dim tracking-[0.12em] uppercase mt-0.5">Plataforma</p>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          <div className="font-mono text-[8px] tracking-[0.14em] uppercase text-verko-dim px-[14px] pt-[10px] pb-1">
            Principal
          </div>
          <div className="h-px bg-verko-border mx-3 my-1.5" />

          <nav className="px-2 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-[10px] w-full text-left px-[14px] min-h-[48px] py-3 rounded-2xl border transition relative ` +
                  (isActive
                    ? `text-verko-text border-[rgba(199,153,67,0.24)] bg-gradient-to-br from-[rgba(199,153,67,0.2)] to-[rgba(255,255,255,0.05)] shadow-[0_16px_32px_rgba(0,0,0,0.18)]`
                    : `border-transparent text-verko-muted text-[12px] font-sans hover:translate-x-[2px] hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.06)] hover:text-verko-text`)
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`flex-shrink-0 transition-opacity ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                      {item.icon}
                    </div>
                    <span className="text-[12px] font-sans flex-1">{item.label}</span>
                    {isActive && (
                      <div className="absolute left-[14px] right-[14px] bottom-[6px] h-px bg-gradient-to-r from-transparent via-[rgba(231,197,124,0.85)] to-transparent" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-3 border-t border-[rgba(255,255,255,0.06)] flex items-center gap-[10px]">
          <div className="w-[34px] h-[34px] rounded-full bg-verko-gold text-white text-[12px] font-semibold flex items-center justify-center flex-shrink-0">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] text-[rgba(255,255,255,0.8)] truncate">
              {user?.email || 'Usuario'}
            </div>
            <div className="text-[10px] text-verko-dim uppercase tracking-[0.08em]">
              Miembro
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex-shrink-0 bg-transparent border-none text-[rgba(255,255,255,0.3)] hover:text-[rgba(255,255,255,0.7)] p-2 rounded-xl transition"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
}
