import React, { useEffect, useState } from 'react';
import DataTable from '../components/DataTable';
import axiosClient from '../api/axiosClient';

// Lớp quản lý các vật phẩm bày bán trong Cửa Hàng (Shop Items) như Thuốc lắc, Vũ khí buff
const ShopItemManager = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    itemType: 'Consumable',
    description: '',
    price: 0,
    currencyType: 'Gem'
  });

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'itemType', label: 'Type' },
    { key: 'description', label: 'Description' },
    { key: 'price', label: 'Price' },
    { key: 'currencyType', label: 'Currency' }
  ];

  // Tải danh sách vật phẩm từ API backend
  const loadData = async () => {
    try {
      const res: any = await axiosClient.get('/shopitems');
      // Ánh xạ shopItemId sang id để tương thích với DataTable component
      const mapped = res.map((s: any) => ({
        ...s,
        id: s.shopItemId
      }));
      setData(mapped);
    } catch (e) {
      console.error("Lỗi khi tải dữ liệu vật phẩm shop:", e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      itemType: 'Consumable',
      description: '',
      price: 0,
      currencyType: 'Gem'
    });
    setModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      itemType: item.itemType || 'Consumable',
      description: item.description || '',
      price: item.price,
      currencyType: item.currencyType || 'Gem'
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa vật phẩm này khỏi cửa hàng?")) {
      try {
        await axiosClient.delete(`/shopitems/${id}`);
        loadData();
      } catch (e) {
        console.error("Lỗi khi xóa vật phẩm shop:", e);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axiosClient.put(`/shopitems/${editingItem.shopItemId}`, formData);
      } else {
        await axiosClient.post('/shopitems', formData);
      }
      setModalOpen(false);
      loadData();
    } catch (error) {
      console.error("Lỗi khi lưu cấu hình vật phẩm shop:", error);
    }
  };

  return (
    <>
      <DataTable 
        title="Shop Items Configuration" 
        description="Cấu hình các vật phẩm bổ trợ, vật phẩm tiêu hao mua được bằng tiền tệ trong game."
        columns={columns}
        data={data}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-[#161633] p-8 rounded-2xl border border-[#4C1D95]/40 w-full max-w-md shadow-2xl shadow-[#7C3AED]/10">
            <h2 className="text-xl font-bold text-[#E2E8F0] mb-6 font-mono tracking-wide">
              {editingItem ? 'Sửa vật phẩm cửa hàng' : 'Thêm vật phẩm cửa hàng mới'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1 font-sans">Tên vật phẩm</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#0F0F23]/80 border border-[#4C1D95]/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/50 transition-all font-sans" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1 font-sans">Mô tả vật phẩm</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#0F0F23]/80 border border-[#4C1D95]/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/50 transition-all font-sans" rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1 font-sans">Phân loại</label>
                  <select value={formData.itemType} onChange={e => setFormData({...formData, itemType: e.target.value})} className="w-full bg-[#0F0F23]/80 border border-[#4C1D95]/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/50 transition-all font-sans">
                    <option value="Consumable">Consumable</option>
                    <option value="Weapon">Weapon</option>
                    <option value="Boost">Boost</option>
                    <option value="Special">Special</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1 font-sans">Loại tiền tệ</label>
                  <select value={formData.currencyType} onChange={e => setFormData({...formData, currencyType: e.target.value})} className="w-full bg-[#0F0F23]/80 border border-[#4C1D95]/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/50 transition-all font-sans">
                    <option value="Gem">Gem</option>
                    <option value="Ruby">Ruby</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-1 font-sans">Giá bán</label>
                  <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: parseInt(e.target.value)})} className="w-full bg-[#0F0F23]/80 border border-[#4C1D95]/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/50 transition-all font-sans" />
                </div>
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

export default ShopItemManager;
