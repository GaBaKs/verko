import { FormEvent, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useUiStore } from '../stores/uiStore';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  const addToast = useUiStore((state) => state.addToast);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        addToast(err.message, 'error');
      } else {
        addToast('Ocurrió un error al iniciar sesión.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-verko-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-verko-text tracking-wider mb-2">VERKO</h1>
          <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-verko-dim">
            Plataforma Interna
          </p>
        </div>

        <form 
          onSubmit={handleLogin}
          className="bg-verko-card border border-verko-border rounded-3xl p-8 shadow-lg relative overflow-hidden"
        >
          {/* Shine effect */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.22)] to-transparent" />

          <div className="mb-5">
            <label className="font-mono text-[10px] tracking-[0.16em] uppercase text-verko-dim mb-2 block">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full min-h-[48px] px-[15px] py-3 rounded-2xl text-sm text-verko-text bg-transparent outline-none transition border border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-[rgba(255,255,255,0.025)] to-[rgba(255,255,255,0.01)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] placeholder:text-verko-muted hover:border-[rgba(255,255,255,0.14)] focus:border-[rgba(199,153,67,0.58)] focus:shadow-[0_0_0_4px_rgba(199,153,67,0.12),inset_0_1px_0_rgba(255,255,255,0.06)]"
              placeholder="tu@verko.com"
            />
          </div>

          <div className="mb-8">
            <label className="font-mono text-[10px] tracking-[0.16em] uppercase text-verko-dim mb-2 block">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full min-h-[48px] px-[15px] py-3 rounded-2xl text-sm text-verko-text bg-transparent outline-none transition border border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-[rgba(255,255,255,0.025)] to-[rgba(255,255,255,0.01)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] placeholder:text-verko-muted hover:border-[rgba(255,255,255,0.14)] focus:border-[rgba(199,153,67,0.58)] focus:shadow-[0_0_0_4px_rgba(199,153,67,0.12),inset_0_1px_0_rgba(255,255,255,0.06)]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-1.5 min-h-[48px] rounded-2xl font-sans text-[13px] font-medium bg-verko-gold text-white border border-verko-gold hover:bg-[#7A6549] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}
