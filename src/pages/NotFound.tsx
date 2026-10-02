import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Home, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGoHome = () => {
    // Điều hướng thẳng về Home page thay vì navigate(-1) để tránh vòng lặp 404 khi refresh trang
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0F0F23] flex items-center justify-center p-6 text-[#E2E8F0] relative overflow-hidden space-grid font-sans antialiased">
      {/* Background glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-[#38BDF8]/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#7C3AED]/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="bg-[#161633]/90 border border-[#38BDF8]/30 p-8 sm:p-12 rounded-3xl max-w-lg w-full backdrop-blur-xl shadow-2xl relative z-10 text-center animate-in fade-in zoom-in-95 duration-300">
        {/* Radar / Compass Icon Badge */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center shadow-lg shadow-[#38BDF8]/20">
          <Compass size={42} className="text-[#38BDF8] animate-spin" style={{ animationDuration: '8s' }} />
        </div>

        {/* Error Code & Title */}
        <div className="inline-block px-3 py-1 mb-3 rounded-full text-xs font-mono font-semibold tracking-widest text-[#38BDF8] bg-[#38BDF8]/15 border border-[#38BDF8]/30">
          ERROR 404 • SECTOR NOT FOUND
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 font-mono tracking-tight">
          Không Tìm Thấy Trang
        </h1>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-6 font-sans">
          Tọa độ không gian bạn đang truy cập không tồn tại hoặc đã bị di dời khỏi hệ thống trạm chỉ huy Rogue-Kie.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleGoHome}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#38BDF8] hover:from-[#6D28D9] hover:to-[#0EA5E9] text-white font-medium text-sm transition-all duration-300 shadow-lg shadow-[#7C3AED]/25 cursor-pointer"
          >
            <Home size={18} />
            <span>Về Trang Chủ (Dashboard)</span>
          </button>

          {!isAuthenticated && (
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#27273B] hover:bg-[#32324D] text-[#E2E8F0] font-medium text-sm transition-all duration-200 border border-gray-700/60 cursor-pointer"
            >
              <LogIn size={18} />
              <span>Đăng Nhập</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
