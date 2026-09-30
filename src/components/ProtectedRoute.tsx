import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children?: React.ReactNode;
}

/**
 * Component ProtectedRoute bảo vệ các trang quản trị Web Admin:
 * 1. Chặn người dùng chưa đăng nhập, tự động chuyển hướng về /login kèm lưu lại trang trước đó.
 * 2. Ngăn cản hoàn toàn việc mount các component quản trị, giúp triệt tiêu các API GET nhạy cảm từ browser khi chưa có quyền.
 * 3. Hỗ trợ kiểm tra phân quyền (RBAC) theo danh sách allowedRoles (Admin, Developer).
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  // Nếu chưa đăng nhập hoặc không có trạng thái xác thực hợp lệ
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu route có yêu cầu phân quyền cụ thể
  if (allowedRoles && allowedRoles.length > 0) {
    if (!role || !allowedRoles.includes(role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
