import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import Spinner from '../ui/Spinner';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, initializing } = useAuthStore();

  if (initializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-verko-bg">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
