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
    baseHealth: 100,
    baseDamage: 10,
    skillSet: '',
    unlockPrice: 0,
    currencyType: 'Gem'
  });

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'baseHealth', label: 'Base HP' },
    { key: 'baseDamage', label: 'Base DMG' },
    { key: 'skillSet', label: 'Skills' },
    { key: 'unlockPrice', label: 'Unlock Price' },
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
      baseHealth: 100,
      baseDamage: 10,
      skillSet: '',
      unlockPrice: 0,
      currencyType: 'Gem'
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
      baseDamage: item.baseDamage,
      skillSet: item.skillSet || '',
      unlockPrice: item.unlockPrice,
      currencyType: item.currencyType || 'Gem'
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
        description="Quản lý thông số cơ bản, kỹ năng và giá mở khóa của các nhân vật chơi được."
        columns={columns}
        data={data}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-[#1e1e1e] p-8 rounded-2xl border border-gray-800 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingItem ? 'Sửa thông tin nhân vật' : 'Thêm nhân vật mới'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Tên nhân vật</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Mô tả</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Máu cơ bản</label>
                  <input required type="number" value={formData.baseHealth} onChange={e => setFormData({...formData, baseHealth: parseInt(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Sát thương</label>
                  <input required type="number" value={formData.baseDamage} onChange={e => setFormData({...formData, baseDamage: parseInt(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Giá mở khóa</label>
                  <input required type="number" value={formData.unlockPrice} onChange={e => setFormData({...formData, unlockPrice: parseInt(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Loại tiền tệ</label>
                  <select value={formData.currencyType} onChange={e => setFormData({...formData, currencyType: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500">
                    <option value="Gem">Gem</option>
                    <option value="Ruby">Ruby</option>
                    <option value="Free">Free</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Danh sách kỹ năng (SkillSet)</label>
                <input type="text" value={formData.skillSet} onChange={e => setFormData({...formData, skillSet: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="e.g. Fireball, Dash, Shield" />
              </div>
              
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Hủy</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium">Lưu cấu hình</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CharacterManager;
