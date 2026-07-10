import React from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Column {
  key: string;
  label: string;
}

interface DataTableProps {
  title: string;
  description: string;
  columns: Column[];
  data: any[];
  onAdd: () => void;
  onEdit: (item: any) => void;
  onDelete: (id: number) => void;
}

const DataTable: React.FC<DataTableProps> = ({ title, description, columns, data, onAdd, onEdit, onDelete }) => {
  // Lấy vai trò (role) và trạng thái đăng nhập từ Auth Context
  const { isAuthenticated, role } = useAuth();
  
  // Xác định quyền chỉnh sửa (Chỉ cho phép Admin và Developer thực hiện CRUD)
  const isWritable = isAuthenticated && (role === 'Admin' || role === 'Developer');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#E2E8F0] mb-2 font-mono tracking-wide">{title}</h1>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
        
        {/* Nút "Add New" chỉ hiển thị khi người dùng có quyền ghi */}
        {isWritable && (
          <button 
            onClick={onAdd}
            className="bg-gradient-to-r from-[#7C3AED] to-[#F43F5E] hover:from-[#6D28D9] hover:to-[#E11D48] text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 shadow-md shadow-[#7C3AED]/20 hover:shadow-[#7C3AED]/35 active:scale-95 cursor-pointer"
          >
            <Plus size={18} /> Add New
          </button>
        )}
      </div>

      {/* Table Container với lớp kính mờ glass-panel và viền neon mờ */}
      <div className="glass-panel rounded-2xl border border-[#4C1D95]/40 shadow-2xl shadow-[#7C3AED]/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#161633]/65 border-b border-[#4C1D95]/30">
                {columns.map((col) => (
                  <th key={col.key} className="p-4 text-xs font-semibold text-[#A78BFA] uppercase tracking-wider font-mono">
                    {col.label}
                  </th>
                ))}
                {/* Tiêu đề cột Actions chỉ hiển thị khi có quyền ghi */}
                {isWritable && (
                  <th className="p-4 text-xs font-semibold text-[#A78BFA] uppercase tracking-wider text-right font-mono">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#4C1D95]/20">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (isWritable ? 1 : 0)} className="p-12 text-center text-gray-500 font-medium">
                    No data found. {isWritable && `Add your first ${title.toLowerCase()}!`}
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-[#27273B]/20 transition-colors group">
                    {columns.map((col) => (
                      <td key={col.key} className="p-4 text-sm text-[#E2E8F0] font-sans">
                        {item[col.key]}
                      </td>
                    ))}
                    {/* Cột nút thao tác chỉ render khi có quyền ghi */}
                    {isWritable && (
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button 
                            onClick={() => onEdit(item)}
                            className="p-2 text-gray-400 hover:text-[#A78BFA] hover:bg-[#7C3AED]/15 rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => onDelete(item.id)}
                            className="p-2 text-gray-400 hover:text-[#EF4444] hover:bg-[#EF4444]/15 rounded-lg transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
