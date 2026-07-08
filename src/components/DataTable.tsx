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
          <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
        
        {/* Nút "Add New" chỉ hiển thị khi người dùng có quyền ghi */}
        {isWritable && (
          <button 
            onClick={onAdd}
            className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all duration-200 shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/25 active:scale-95 cursor-pointer"
          >
            <Plus size={18} /> Add New
          </button>
        )}
      </div>

      {/* Table Container với lớp kính mờ glass-panel */}
      <div className="glass-panel rounded-2xl border border-white/[0.04] shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/[0.04]">
                {columns.map((col) => (
                  <th key={col.key} className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {col.label}
                  </th>
                ))}
                {/* Tiêu đề cột Actions chỉ hiển thị khi có quyền ghi */}
                {isWritable && (
                  <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (isWritable ? 1 : 0)} className="p-12 text-center text-gray-500 font-medium">
                    No data found. {isWritable && `Add your first ${title.toLowerCase()}!`}
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-white/[0.01] transition-colors group">
                    {columns.map((col) => (
                      <td key={col.key} className="p-4 text-sm text-gray-300">
                        {item[col.key]}
                      </td>
                    ))}
                    {/* Cột nút thao tác chỉ render khi có quyền ghi */}
                    {isWritable && (
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button 
                            onClick={() => onEdit(item)}
                            className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => onDelete(item.id)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
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
