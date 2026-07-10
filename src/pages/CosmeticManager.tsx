import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import axiosClient from '../api/axiosClient';

// Lớp quản lý trang phục, ngoại trang và skin của nhân vật (Cosmetic Items)
const CosmeticManager = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    type: 'Skin',
    rarity: 'Common',
    price: 0,
    currencyType: 'Gem'
  });

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type' },
    { key: 'rarity', label: 'Rarity' },
    { key: 'price', label: 'Price' },
    { key: 'currencyType', label: 'Currency' }
  ];

  // Tải danh sách trang phục từ API backend
  const loadData = async () => {
    try {
      const res: any = await axiosClient.get('/cosmetics');
      // Ánh xạ cosmeticId sang id để hiển thị và thao tác trên DataTable
      const mapped = res.map((c: any) => ({
        ...c,
        id: c.cosmeticId
      }));
      setData(mapped);
    } catch (e) {
      console.error("Lỗi khi tải dữ liệu trang phục:", e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      type: 'Skin',
      rarity: 'Common',
      price: 0,
      currencyType: 'Gem'
    });
    setModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      type: item.type || 'Skin',
      rarity: item.rarity || 'Common',
      price: item.price,
      currencyType: item.currencyType || 'Gem'
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa trang phục này?")) {
      try {
        await axiosClient.delete(`/cosmetics/${id}`);
        loadData();
      } catch (e) {
        console.error("Lỗi khi xóa trang phục:", e);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axiosClient.put(`/cosmetics/${editingItem.cosmeticId}`, formData);
      } else {
        await axiosClient.post('/cosmetics', formData);
      }
      setModalOpen(false);
      loadData();
    } catch (error) {
      console.error("Lỗi khi lưu cấu hình trang phục:", error);
    }
  };

  return (
    <>
      <DataTable 
        title="Cosmetics Manager" 
        description="Quản lý danh sách Skin ngoại trang, độ hiếm, giá cả của trang phục trong cửa hàng."
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
              {editingItem ? 'Sửa thông tin ngoại trang' : 'Thêm ngoại trang mới'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Tên ngoại trang / Skin</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Phân loại</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500">
                    <option value="Skin">Skin</option>
                    <option value="Aura">Aura</option>
                    <option value="Hat">Hat</option>
                    <option value="Trail">Trail</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Độ hiếm</label>
                  <select value={formData.rarity} onChange={e => setFormData({...formData, rarity: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500">
                    <option value="Common">Common</option>
                    <option value="Rare">Rare</option>
                    <option value="Epic">Epic</option>
                    <option value="Legendary">Legendary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Giá bán</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: parseInt(e.target.value)})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Loại tiền tệ</label>
                  <select value={formData.currencyType} onChange={e => setFormData({...formData, currencyType: e.target.value})} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500">
                    <option value="Gem">Gem</option>
                    <option value="Ruby">Ruby</option>
                  </select>
                </div>
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

export default CosmeticManager;
