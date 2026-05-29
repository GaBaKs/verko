import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import ToastContainer from '../ui/Toast';

export default function AppShell() {
  return (
    <div className="flex h-screen overflow-hidden bg-verko-bg text-verko-text">
      <Sidebar />
      <div className="flex-1 overflow-hidden flex flex-col relative w-full lg:w-auto">
        <MobileHeader />
        <main className="flex-1 overflow-y-auto flex flex-col bg-verko-bg">
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
