import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, LogIn, ArrowLeft, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, username, role, logout } = useAuth();

  const handleLogoutAndLogin = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0F0F23] flex items-center justify-center p-6 text-[#E2E8F0] relative overflow-hidden space-grid font-sans antialiased">
      {/* Glow background blobs */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-[#EF4444]/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#7C3AED]/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="bg-[#161633]/90 border border-[#EF4444]/30 p-8 sm:p-12 rounded-3xl max-w-lg w-full backdrop-blur-xl shadow-2xl relative z-10 text-center animate-in fade-in zoom-in-95 duration-300">
        {/* Warning Icon Badge */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center justify-center shadow-lg shadow-[#EF4444]/20">
          <ShieldAlert size={42} className="text-[#EF4444] animate-pulse" />
        </div>

        {/* Error Code & Title */}
        <div className="inline-block px-3 py-1 mb-3 rounded-full text-xs font-mono font-semibold tracking-widest text-[#EF4444] bg-[#EF4444]/15 border border-[#EF4444]/30">
          ERROR 401 / 403 • ACCESS RESTRICTED
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 font-mono tracking-tight">
          Từ Chối Quyền Truy Cập
        </h1>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6 font-sans">
          Khu vực chỉ huy này yêu cầu thẩm quyền cấp cao (<span className="text-[#A78BFA] font-mono font-semibold">Admin</span> / <span className="text-[#A78BFA] font-mono font-semibold">Developer</span>) hoặc phiên làm việc của bạn đã hết hạn.
        </p>

        {/* Current Identity info if logged in */}
        {isAuthenticated && (
          <div className="bg-[#0F0F23]/80 border border-[#4C1D95]/40 rounded-xl p-4 mb-6 text-left text-xs font-mono">
            <div className="text-gray-400 mb-1">Tài khoản đang nhận diện:</div>
            <div className="flex justify-between items-center text-sm font-sans font-semibold text-white">
              <span>{username}</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#7C3AED]/20 text-[#A78BFA] border border-[#7C3AED]/40">
                {role || 'Unknown'}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate('/', { replace: true })}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#27273B] hover:bg-[#32324D] text-[#E2E8F0] font-medium text-sm transition-all duration-200 border border-gray-700/60"
              >
                <ArrowLeft size={16} />
                <span>Về Bảng Điều Khiển</span>
              </button>
              <button
                onClick={handleLogoutAndLogin}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#EF4444] to-[#DC2626] hover:from-[#DC2626] hover:to-[#B91C1C] text-white font-medium text-sm transition-all duration-200 shadow-md shadow-[#EF4444]/20"
              >
                <LogOut size={16} />
                <span>Đăng Xuất & Đổi Nick</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#F43F5E] hover:from-[#6D28D9] hover:to-[#E11D48] text-white font-medium text-sm transition-all duration-300 shadow-lg shadow-[#7C3AED]/25"
            >
              <LogIn size={18} />
              <span>Đăng Nhập Vào Hệ Thống</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
