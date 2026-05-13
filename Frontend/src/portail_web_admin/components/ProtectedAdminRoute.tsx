import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authService } from '../../services/api';

export default function ProtectedAdminRoute() {
  const location = useLocation();

  if (!authService.isAuthenticated()) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
