import React, { useState } from 'react';
import { Edit2, Trash2, Plus, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export interface Column<T> {
  key?: string;
  label?: string;
  header?: string;
  accessor?: keyof T | ((item: T) => React.ReactNode);
  fontMono?: boolean;
}

interface DataTableProps<T> {
  title: string;
  description?: string;
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchKey?: keyof T;
  onEdit?: (item: T) => void;
  onDelete?: (item: any) => void; // Support old delete item.id format
  onAdd?: () => void;
  addButtonText?: string;
  isWritable?: boolean;
}

export default function DataTable<T extends { id: any }>({
  title,
  description,
  data,
  columns,
  searchPlaceholder = 'Search...',
  searchKey,
  onEdit,
  onDelete,
  onAdd,
  addButtonText = 'Add New',
  isWritable = true
}: DataTableProps<T>) {
  const { isAuthenticated, role } = useAuth();
  const userIsWritable = isAuthenticated && (role === 'Admin' || role === 'Developer');
  const finalIsWritable = isWritable && userIsWritable;

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter
  const filteredData = searchKey && searchQuery
    ? data.filter(item => {
        const val = item[searchKey];
        return val ? String(val).toLowerCase().includes(searchQuery.toLowerCase()) : false;
      })
    : data;

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-[#4C1D95]/40 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-200 font-mono tracking-wide">{title}</h3>
          {description && <p className="text-xs text-gray-400 mt-1 font-mono">{description}</p>}
          <p className="text-[10px] text-gray-500 mt-0.5 font-mono">Total records: {filteredData.length}</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {searchKey && (
            <div className="relative flex-1 sm:flex-initial">
              <span className="absolute left-3.5 top-3.5 text-gray-500">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-4 py-2.5 text-sm bg-[#0F0F23]/80 border border-[#4C1D95]/30 rounded-xl text-white focus:outline-none focus:border-[#7C3AED] w-full"
              />
            </div>
          )}

          {finalIsWritable && onAdd && (
            <button
              onClick={onAdd}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#7C3AED] to-[#F43F5E] hover:from-[#6D28D9] hover:to-[#E11D48] text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-[#7C3AED]/20 cursor-pointer active:scale-98"
            >
              <Plus size={16} />
              <span>{addButtonText}</span>
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[#4C1D95]/20">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#161633]/60 border-b border-[#4C1D95]/30">
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-4 text-xs font-semibold text-[#A78BFA] uppercase tracking-wider font-mono">
                  {col.header || col.label || ''}
                </th>
              ))}
              {(onEdit || onDelete) && finalIsWritable && (
                <th className="px-6 py-4 text-xs font-semibold text-[#A78BFA] uppercase tracking-wider font-mono text-right">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#4C1D95]/10">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + ((onEdit || onDelete) && finalIsWritable ? 1 : 0)} className="px-6 py-8 text-center text-gray-500 font-mono text-sm">
                  No records found.
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-[#27273B]/20 transition-all duration-150">
                  {columns.map((col, idx) => {
                    const cellContent = col.accessor
                      ? (typeof col.accessor === 'function' ? col.accessor(item) : (item[col.accessor] as any))
                      : (col.key ? (item[col.key as keyof T] as any) : null);
                    return (
                      <td key={idx} className={`px-6 py-4 text-sm text-gray-300 ${col.fontMono ? 'font-mono' : ''}`}>
                        {cellContent}
                      </td>
                    );
                  })}
                  {(onEdit || onDelete) && finalIsWritable && (
                    <td className="px-6 py-4 text-sm text-right space-x-2 whitespace-nowrap">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="p-2 hover:bg-[#7C3AED]/20 text-[#A78BFA] hover:text-[#C084FC] rounded-lg transition-all cursor-pointer inline-flex items-center"
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item.id || item)}
                          className="p-2 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 rounded-lg transition-all cursor-pointer inline-flex items-center"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center font-mono text-xs text-gray-500 pt-2 border-t border-[#4C1D95]/10">
          <span>Page {currentPage} of {totalPages}</span>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="px-3 py-1.5 rounded-lg border border-[#4C1D95]/20 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#27273B]/50 transition-all cursor-pointer"
            >
              Prev
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="px-3 py-1.5 rounded-lg border border-[#4C1D95]/20 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#27273B]/50 transition-all cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
