import { lazy, Suspense, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Spinner from './components/ui/Spinner';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AppShell from './components/layout/AppShell';
import { useAuthStore } from './stores/authStore';

const LoginPage     = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const DesignerPage  = lazy(() => import('./components/designer/DesignerPage'));
const BudgetsPage   = lazy(() => import('./components/budgets/BudgetsPage'));
const BudgetEditor  = lazy(() => import('./components/budgets/BudgetEditor'));
const MarginsPage   = lazy(() => import('./pages/MarginsPage'));

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Suspense fallback={<div className="flex h-screen items-center justify-center bg-verko-bg"><Spinner /></div>}><LoginPage /></Suspense>,
  },
  {
    element: <ProtectedRoute><AppShell /></ProtectedRoute>,
    children: [
      { path: '/dashboard', element: <Suspense fallback={<div className="flex h-full items-center justify-center"><Spinner /></div>}><DashboardPage /></Suspense> },
      { path: '/designer',  element: <Suspense fallback={<div className="flex h-full items-center justify-center"><Spinner /></div>}><DesignerPage /></Suspense> },
      { path: '/budgets',   element: <Suspense fallback={<div className="flex h-full items-center justify-center"><Spinner /></div>}><BudgetsPage /></Suspense> },
      { path: '/budget/:id',element: <Suspense fallback={<div className="flex h-full items-center justify-center"><Spinner /></div>}><BudgetEditor /></Suspense> },
      { path: '/margins',   element: <Suspense fallback={<div className="flex h-full items-center justify-center"><Spinner /></div>}><MarginsPage /></Suspense> },
      { path: '/',          element: <Suspense fallback={<div className="flex h-full items-center justify-center"><Spinner /></div>}><DashboardPage /></Suspense> },
    ],
  },
]);

export default function App() {
  const init = useAuthStore((state) => state.init);

  useEffect(() => {
    init();
  }, [init]);

  return <RouterProvider router={router} />;
}
