import { ReactNode } from 'react';
import Navbar from '../../features/landing/components/Navbar';
import Footer from '../../features/landing/components/Footer';
import { Outlet } from 'react-router-dom';

export default function LandingLayout() {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
