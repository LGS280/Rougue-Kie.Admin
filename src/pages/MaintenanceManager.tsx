import React, { useEffect, useState } from 'react';
import DataTable, { type Column } from '../components/DataTable';
import axiosClient from '../api/axiosClient';
import { Wrench, AlertTriangle, CheckCircle2, XCircle, Clock, ShieldAlert, Radio } from 'lucide-react';

interface MaintenanceItem {
  id: number;
  title: string;
  message: string;
  startTime: string;
  endTime: string;
  status: 'Active' | 'Completed' | 'Cancelled';
  createdAt: string;
  updatedAt?: string | null;
  isCurrentlyActive: boolean;
}

interface CurrentStatus {
  isUnderMaintenance: boolean;
  title: string;
  message: string;
  startTime?: string | null;
  endTime?: string | null;
  remainingMinutes?: number | null;
}

const MaintenanceManager: React.FC = () => {
  const [data, setData] = useState<MaintenanceItem[]>([]);
  const [currentStatus, setCurrentStatus] = useState<CurrentStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MaintenanceItem | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dữ liệu Form cho Modal Thêm/Sửa
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    startTime: '',
    endTime: '',
    status: 'Active' as 'Active' | 'Completed' | 'Cancelled'
  });

  // Chuyển đổi định dạng ISO UTC sang chuỗi datetime-local cho input HTML5 (YYYY-MM-DDTHH:mm)
  const toLocalDatetimeInput = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    const pad = (num: number) => String(num).padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Định dạng ngày giờ hiển thị thân thiện trên bảng
  const formatDateTime = (isoString: string) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Tải danh sách các đợt bảo trì và trạng thái hiện tại từ API
  const loadData = async () => {
    try {
      setLoading(true);
      const [listRes, statusRes] = await Promise.all([
        axiosClient.get('/maintenance'),
        axiosClient.get('/maintenance/current')
      ]);
      setData(listRes as any);
      setCurrentStatus(statusRes as any);
    } catch (error) {
      console.error('Lỗi khi tải danh sách bảo trì:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Tự động kiểm tra trạng thái mỗi 30 giây
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Mở modal thêm mới với giá trị mặc định là ngay bây giờ + 2 tiếng
  const handleAdd = () => {
    setEditingItem(null);
    setErrorMessage(null);
    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    setFormData({
      title: 'Thông Báo Bảo Trì Định Kỳ',
      message: 'Máy chủ đang tạm dừng để nâng cấp hệ thống và tối ưu hóa hiệu năng Co-op. Vui lòng quay lại sau!',
      startTime: toLocalDatetimeInput(now.toISOString()),
      endTime: toLocalDatetimeInput(twoHoursLater.toISOString()),
      status: 'Active'
    });
    setModalOpen(true);
  };

  // Mở modal chỉnh sửa đợt bảo trì có sẵn
  const handleEdit = (item: MaintenanceItem) => {
    setEditingItem(item);
    setErrorMessage(null);
    setFormData({
      title: item.title,
      message: item.message,
      startTime: toLocalDatetimeInput(item.startTime),
      endTime: toLocalDatetimeInput(item.endTime),
      status: item.status
    });
    setModalOpen(true);
  };

  // Xóa đợt bảo trì
  const handleDelete = async (item: MaintenanceItem | number) => {
    const id = typeof item === 'number' ? item : item.id;
    if (window.confirm(`Bạn có chắc chắn muốn xóa bản ghi bảo trì #${id} không?`)) {
      try {
        await axiosClient.delete(`/maintenance/${id}`);
        loadData();
      } catch (error) {
        console.error('Lỗi khi xóa bảo trì:', error);
        alert('Không thể xóa đợt bảo trì này.');
      }
    }
  };

  // Lưu bản ghi (Thêm mới hoặc Cập nhật)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const startDate = new Date(formData.startTime);
    const endDate = new Date(formData.endTime);

    if (endDate <= startDate) {
      setErrorMessage('Thời gian kết thúc phải lớn hơn thời gian bắt đầu!');
      return;
    }

    const payload = {
      title: formData.title.trim(),
      message: formData.message.trim(),
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      status: formData.status
    };

    try {
      if (editingItem) {
        await axiosClient.put(`/maintenance/${editingItem.id}`, payload);
      } else {
        await axiosClient.post('/maintenance', payload);
      }
      setModalOpen(false);
      loadData();
    } catch (error: any) {
      console.error('Lỗi khi lưu thông tin bảo trì:', error);
      setErrorMessage(error?.response?.data?.message || 'Có lỗi xảy ra khi lưu đợt bảo trì.');
    }
  };

  // Thiết lập các cột cho DataTable
  const columns: Column<MaintenanceItem>[] = [
    { key: 'id', label: 'ID', fontMono: true },
    {
      label: 'Title & Message',
      accessor: (item) => (
        <div className="max-w-md">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white tracking-wide">{item.title}</span>
            {item.isCurrentlyActive && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse font-mono">
                <Radio size={10} /> LIVE NOW
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.message}</p>
        </div>
      )
    },
    {
      label: 'Start Time',
      accessor: (item) => (
        <div className="font-mono text-xs text-gray-300 flex items-center gap-1.5">
          <Clock size={13} className="text-[#A78BFA]" />
          <span>{formatDateTime(item.startTime)}</span>
        </div>
      )
    },
    {
      label: 'End Time',
      accessor: (item) => (
        <div className="font-mono text-xs text-gray-300 flex items-center gap-1.5">
          <Clock size={13} className="text-[#F43F5E]" />
          <span>{formatDateTime(item.endTime)}</span>
        </div>
      )
    },
    {
      label: 'Status',
      accessor: (item) => {
        if (item.status === 'Active') {
          return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono">
              <AlertTriangle size={13} />
              Active
            </span>
          );
        }
        if (item.status === 'Completed') {
          return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono">
              <CheckCircle2 size={13} />
              Completed
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-500/15 text-gray-400 border border-gray-500/30 font-mono">
            <XCircle size={13} />
            Cancelled
          </span>
        );
      }
    },
    {
      label: 'Audit Info',
      accessor: (item) => (
        <div className="font-mono text-[11px] text-gray-500 space-y-0.5">
          <div>Created: {formatDateTime(item.createdAt)}</div>
          {item.updatedAt && <div>Updated: {formatDateTime(item.updatedAt)}</div>}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Banner Trạng Thái Bảo Trì Máy Chủ Thời Gian Thực */}
      <div className={`glass-panel p-5 rounded-2xl border transition-all duration-300 ${
        currentStatus?.isUnderMaintenance
          ? 'bg-rose-950/30 border-rose-500/50 shadow-lg shadow-rose-950/40'
          : 'bg-[#161633]/60 border-[#4C1D95]/40 shadow-xl'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold shadow-md ${
              currentStatus?.isUnderMaintenance
                ? 'bg-gradient-to-tr from-rose-600 to-amber-600 text-white animate-pulse shadow-rose-600/30'
                : 'bg-gradient-to-tr from-emerald-600 to-[#7C3AED] text-white shadow-emerald-600/20'
            }`}>
              {currentStatus?.isUnderMaintenance ? <ShieldAlert size={24} /> : <Wrench size={24} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-mono tracking-wide">
                  {currentStatus?.isUnderMaintenance ? 'SERVER UNDER ACTIVE MAINTENANCE' : 'SERVER OPERATIONAL STATUS'}
                </h2>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-semibold ${
                  currentStatus?.isUnderMaintenance
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {currentStatus?.isUnderMaintenance ? 'MAINTENANCE IN EFFECT' : 'NORMAL OPERATIONS'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1 font-sans">
                {currentStatus?.isUnderMaintenance
                  ? `${currentStatus.title} — Expected completion: ${formatDateTime(currentStatus.endTime || '')} (~${currentStatus.remainingMinutes}m remaining)`
                  : 'All game systems, multiplayer hubs, and matchmaking services are running smoothly.'}
              </p>
            </div>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="px-3.5 py-2 text-xs font-mono bg-[#0F0F23]/80 hover:bg-[#27273B] text-gray-300 rounded-xl border border-[#4C1D95]/30 transition-all cursor-pointer"
          >
            {loading ? 'Refreshing...' : 'Refresh Status'}
          </button>
        </div>
      </div>

      {/* Bảng Quản Lý Danh Sách Bảo Trì */}
      <DataTable
        title="Server Maintenance Schedules"
        description="Schedule maintenance windows, define downtime announcements, and manage server availability for all pilots."
        columns={columns}
        data={data}
        searchKey="title"
        searchPlaceholder="Search maintenance by title..."
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addButtonText="Schedule Maintenance"
      />

      {/* Modal Thêm / Chỉnh Sửa Lịch Bảo Trì */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-[#161633] p-6 sm:p-8 rounded-2xl border border-[#4C1D95]/60 w-full max-w-xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#4C1D95]/30 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#F43F5E] flex items-center justify-center text-white font-mono shadow-md">
                  <Wrench size={18} />
                </div>
                <h3 className="text-lg font-bold text-white font-mono">
                  {editingItem ? `Edit Maintenance #${editingItem.id}` : 'Schedule New Maintenance'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-950/50 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertTriangle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              {/* Tiêu đề */}
              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1.5 uppercase tracking-wider">
                  Title (Max 150 chars) <span className="text-[#F43F5E]">*</span>
                </label>
                <input
                  required
                  maxLength={150}
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder='e.g., "Thông Báo Bảo Trì Định Kỳ"'
                  className="w-full bg-[#0F0F23] border border-[#4C1D95]/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#7C3AED]"
                />
              </div>

              {/* Thông điệp chi tiết */}
              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1.5 uppercase tracking-wider">
                  Message Notice (Max 1000 chars) <span className="text-[#F43F5E]">*</span>
                </label>
                <textarea
                  required
                  maxLength={1000}
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Thông điệp hiển thị cho người chơi khi họ mở game..."
                  className="w-full bg-[#0F0F23] border border-[#4C1D95]/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#7C3AED]"
                />
              </div>

              {/* Khung thời gian */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1.5 uppercase tracking-wider">
                    Start Time <span className="text-[#F43F5E]">*</span>
                  </label>
                  <input
                    required
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full bg-[#0F0F23] border border-[#4C1D95]/40 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#7C3AED] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1.5 uppercase tracking-wider">
                    End Time <span className="text-[#F43F5E]">*</span>
                  </label>
                  <input
                    required
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full bg-[#0F0F23] border border-[#4C1D95]/40 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#7C3AED] font-mono"
                  />
                </div>
              </div>

              {/* Trạng thái */}
              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1.5 uppercase tracking-wider">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full bg-[#0F0F23] border border-[#4C1D95]/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#7C3AED] font-mono"
                >
                  <option value="Active">Active (Lên lịch / Kích hoạt)</option>
                  <option value="Completed">Completed (Đã hoàn tất)</option>
                  <option value="Cancelled">Cancelled (Hủy bỏ)</option>
                </select>
              </div>

              {/* Nút tác vụ */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#4C1D95]/30">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#7C3AED] to-[#F43F5E] hover:from-[#6D28D9] hover:to-[#E11D48] text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-[#7C3AED]/20 cursor-pointer"
                >
                  {editingItem ? 'Update Schedule' : 'Create Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceManager;
