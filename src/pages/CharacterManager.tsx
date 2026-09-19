import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import axiosClient from '../api/axiosClient';

// Lớp quản lý cấu hình các nhân vật playable trong hệ thống Web Admin
const CharacterManager = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    baseHealth: 5,
    baseArmor: 4,
    baseMana: 200,
    prefabName: 'Rookie',
    skillSet: '',
    unlockPrice: 0,
    currencyType: 'Free'
  });

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'prefabName', label: 'Prefab' },
    { key: 'baseHealth', label: 'HP' },
    { key: 'baseArmor', label: 'Armor' },
    { key: 'baseMana', label: 'Mana' },
    { key: 'skillSet', label: 'Skills' },
    { key: 'unlockPrice', label: 'Price' },
    { key: 'currencyType', label: 'Currency' }
  ];

  // Tải danh sách nhân vật từ API backend
  const loadData = async () => {
    try {
      const res: any = await axiosClient.get('/characters');
      // Ánh xạ characterId sang id để đảm bảo tương thích hoàn toàn với DataTable component
      const mapped = res.map((c: any) => ({
        ...c,
        id: c.characterId
      }));
      setData(mapped);
    } catch (e) {
      console.error("Lỗi khi tải dữ liệu nhân vật:", e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Mở modal thêm mới
  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      baseHealth: 5,
      baseArmor: 4,
      baseMana: 200,
      prefabName: 'Rookie',
      skillSet: '',
      unlockPrice: 0,
      currencyType: 'Free'
    });
    setModalOpen(true);
  };

  // Mở modal chỉnh sửa cấu hình
  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      baseHealth: item.baseHealth,
      baseArmor: item.baseArmor !== undefined ? item.baseArmor : 0,
      baseMana: item.baseMana !== undefined ? item.baseMana : 200,
      prefabName: item.prefabName || 'Rookie',
      skillSet: item.skillSet || '',
      unlockPrice: item.unlockPrice,
      currencyType: item.currencyType || 'Free'
    });
    setModalOpen(true);
  };

  // Xử lý xóa nhân vật
  const handleDelete = async (id: number) => {
    if(confirm("Bạn có chắc chắn muốn xóa nhân vật này không?")) {
      try {
        await axiosClient.delete(`/characters/${id}`);
        loadData();
      } catch (e) {
        console.error("Lỗi khi xóa nhân vật:", e);
      }
    }
  };

  // Lưu thông tin nhân vật (Thêm mới / Cập nhật)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axiosClient.put(`/characters/${editingItem.characterId}`, formData);
      } else {
        await axiosClient.post('/characters', formData);
      }
      setModalOpen(false);
      loadData();
    } catch (error) {
      console.error("Lỗi khi lưu cấu hình nhân vật:", error);
    }
  };

  return (
    <>
      <DataTable 
        title="Playable Characters" 
        description="Quản lý thông số cơ bản (Máu, Giáp, Mana), Unity Prefab và giá mở khóa của các nhân vật chơi được."
        columns={columns}
        data={data}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-[#161633] p-8 rounded-2xl border border-[#4C1D95]/40 w-full max-w-md shadow-2xl shadow-[#7C3AED]/10 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-[#E2E8F0] mb-6 font-mono tracking-wide">
              {editingItem ? 'Sửa thông tin nhân vật' : 'Thêm nhân vật mới'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1 font-sans">Tên nhân vật</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#0F0F23]/80 border border-[#4C1D95]/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/50 transition-all font-sans" placeholder="e.g. Kie Warrior" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1 font-sans">Tên Unity Prefab</label>
                <div className="flex gap-2 mb-1.5">
                  <button type="button" onClick={() => setFormData({...formData, prefabName: 'Rookie'})} className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition-all ${formData.prefabName === 'Rookie' ? 'border-[#7C3AED] bg-[#7C3AED]/20 text-[#A78BFA]' : 'border-gray-700 bg-gray-800/50 text-gray-400'}`}>
                    Rookie
                  </button>
                  <button type="button" onClick={() => setFormData({...formData, prefabName: 'Zero'})} className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition-all ${formData.prefabName === 'Zero' ? 'border-[#7C3AED] bg-[#7C3AED]/20 text-[#A78BFA]' : 'border-gray-700 bg-gray-800/50 text-gray-400'}`}>
                    Zero
                  </button>
                </div>
                <input required type="text" value={formData.prefabName} onChange={e => setFormData({...formData, prefabName: e.target.value})} className="w-full bg-[#0F0F23]/80 border border-[#4C1D95]/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/50 transition-all font-sans" placeholder="e.g. Rookie hoặc Zero" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1 font-sans">Mô tả</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#0F0F23]/80 border border-[#4C1D95]/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/50 transition-all font-sans" rows={2} />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1 font-sans">Máu (HP)</label>
                  <input required type="number" value={formData.baseHealth} onChange={e => setFormData({...formData, baseHealth: parseInt(e.target.value) || 0})} className="w-full bg-[#0F0F23]/80 border border-[#4C1D95]/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#7C3AED] text-sm font-sans" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1 font-sans">Giáp (Armor)</label>
                  <input required type="number" value={formData.baseArmor} onChange={e => setFormData({...formData, baseArmor: parseInt(e.target.value) || 0})} className="w-full bg-[#0F0F23]/80 border border-[#4C1D95]/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#7C3AED] text-sm font-sans" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1 font-sans">Mana</label>
                  <input required type="number" value={formData.baseMana} onChange={e => setFormData({...formData, baseMana: parseInt(e.target.value) || 0})} className="w-full bg-[#0F0F23]/80 border border-[#4C1D95]/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#7C3AED] text-sm font-sans" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1 font-sans">Giá mở khóa</label>
                  <input required type="number" value={formData.unlockPrice} onChange={e => setFormData({...formData, unlockPrice: parseInt(e.target.value) || 0})} className="w-full bg-[#0F0F23]/80 border border-[#4C1D95]/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/50 transition-all font-sans" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1 font-sans">Loại tiền tệ</label>
                  <select value={formData.currencyType} onChange={e => setFormData({...formData, currencyType: e.target.value})} className="w-full bg-[#0F0F23]/80 border border-[#4C1D95]/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/50 transition-all font-sans">
                    <option value="Free">Miễn phí (Free)</option>
                    <option value="Gem">Gem (Tiền game)</option>
                    <option value="VND">VND (Tiền nạp)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1 font-sans">Danh sách kỹ năng (SkillSet)</label>
                <input type="text" value={formData.skillSet} onChange={e => setFormData({...formData, skillSet: e.target.value})} className="w-full bg-[#0F0F23]/80 border border-[#4C1D95]/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/50 transition-all font-mono" placeholder="e.g. Dash, Shield, Berserk" />
              </div>
              
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white hover:bg-[#27273B]/50 rounded-xl transition-all cursor-pointer">Hủy</button>
                <button type="submit" className="px-5 py-2.5 bg-gradient-to-r from-[#7C3AED] to-[#F43F5E] hover:from-[#6D28D9] hover:to-[#E11D48] text-white rounded-xl transition-all duration-300 font-medium shadow-md shadow-[#7C3AED]/20 cursor-pointer">Lưu cấu hình</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CharacterManager;
