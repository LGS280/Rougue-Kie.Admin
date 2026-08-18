import React from 'react';
import { X } from 'lucide-react';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'checkbox';
  options?: { value: string | number; label: string }[];
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

interface EntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: FormField[];
  formData: any;
  onChange: (name: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitButtonText?: string;
}

export function EntityModal({
  isOpen,
  onClose,
  title,
  fields,
  formData,
  onChange,
  onSubmit,
  submitButtonText = 'Save'
}: EntityModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-xl rounded-2xl border border-[#4C1D95]/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#4C1D95]/30 bg-[#161633]/80 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-200 font-mono tracking-wide">{title}</h3>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-[#27273B] text-gray-400 hover:text-white rounded-lg transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => {
              const isFullWidth = field.type === 'textarea';
              return (
                <div 
                  key={field.name} 
                  className={`flex flex-col gap-1.5 ${isFullWidth ? 'md:col-span-2' : ''}`}
                >
                  <label className="text-xs font-semibold text-gray-400 font-mono">
                    {field.label} {field.required && <span className="text-[#F43F5E]">*</span>}
                  </label>
                  
                  {field.type === 'textarea' ? (
                    <textarea
                      placeholder={field.placeholder}
                      value={formData[field.name] || ''}
                      onChange={(e) => onChange(field.name, e.target.value)}
                      required={field.required}
                      rows={3}
                      className="w-full text-sm bg-[#0F0F23]/80 border border-[#4C1D95]/30 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#7C3AED]"
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={formData[field.name] ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        // Keep type consistent (number or string)
                        const option = field.options?.find(o => String(o.value) === val);
                        onChange(field.name, option ? option.value : val);
                      }}
                      required={field.required}
                      className="w-full text-sm bg-[#0F0F23]/80 border border-[#4C1D95]/30 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#7C3AED]"
                    >
                      <option value="">Select option</option>
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'checkbox' ? (
                    <label className="flex items-center gap-2.5 cursor-pointer py-2">
                      <input
                        type="checkbox"
                        checked={!!formData[field.name]}
                        onChange={(e) => onChange(field.name, e.target.checked)}
                        className="w-4 h-4 rounded border-[#4C1D95]/40 text-[#7C3AED] focus:ring-[#7C3AED]/35 focus:ring-2 bg-[#0F0F23]"
                      />
                      <span className="text-sm text-gray-300 font-sans">{field.placeholder || 'Enable'}</span>
                    </label>
                  ) : (
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.name] ?? ''}
                      onChange={(e) => {
                        const val = field.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value;
                        onChange(field.name, val);
                      }}
                      required={field.required}
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      className="w-full text-sm bg-[#0F0F23]/80 border border-[#4C1D95]/30 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#7C3AED]"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer inside the form */}
          <div className="flex justify-end gap-3 pt-6 border-t border-[#4C1D95]/20 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-[#27273B] hover:bg-[#31314a] text-gray-300 hover:text-white rounded-xl text-sm font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-[#7C3AED] to-[#F43F5E] hover:from-[#6D28D9] hover:to-[#E11D48] text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-[#7C3AED]/20 cursor-pointer active:scale-98"
            >
              {submitButtonText}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
