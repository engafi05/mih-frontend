'use client';
import React, { useState, useEffect } from 'react';
import { 
  FaUserPlus, FaTrash, FaShieldAlt, FaSpinner, 
  FaEdit, FaSave, FaTimes, FaCheckCircle, FaUserLock 
} from 'react-icons/fa';

// تعريف أنواع البيانات
interface PagePermission {
  PageID: number;
  PageName: string;
  Description: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [pages, setPages] = useState<PagePermission[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State لإضافة مستخدم جديد
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Editor'
  });
  const [selectedPageIds, setSelectedPageIds] = useState<number[]>([]);

  // State لتعديل صلاحيات مستخدم موجود
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editSelectedPages, setEditSelectedPages] = useState<number[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // جلب البيانات من السيرفر
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [usersRes, pagesRes] = await Promise.all([
        fetch('https://engafi05-001-site1.stempurl.com/api/admin/users', { headers }),
        fetch('https://engafi05-001-site1.stempurl.com/api/admin/pages', { headers })
      ]);
      
      const usersData = await usersRes.json();
      const pagesData = await pagesRes.json();
      
      setUsers(Array.isArray(usersData) ? usersData : []);
      setPages(Array.isArray(pagesData) ? pagesData : []);
    } catch (err) {
      console.error("خطأ في جلب البيانات:", err);
    } finally {
      setLoading(false);
    }
  };

  // إنشاء مستخدم جديد مع صلاحياته
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');

    try {
      const res = await fetch('https://engafi05-001-site1.stempurl.com/api/admin/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, isActive: true })
      });
      
      const newUser = await res.json();

      if (res.ok && selectedPageIds.length > 0) {
        await fetch(`https://engafi05-001-site1.stempurl.com/api/admin/users/${newUser.id}/permissions`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            permissions: selectedPageIds.map(id => ({
              pageId: id,
              canView: true,
              canEdit: true
            }))
          })
        });
      }
      
      alert("تم إضافة المستخدم بنجاح");
      setFormData({ username: '', email: '', password: '', role: 'Editor' });
      setSelectedPageIds([]);
      fetchData();
    } catch (err) {
      alert("حدث خطأ أثناء الإضافة");
    }
  };

  // فتح نافذة التعديل وجلب صلاحيات المستخدم المختار
  const openEditModal = async (user: User) => {
    setEditingUser(user);
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`https://engafi05-001-site1.stempurl.com/api/admin/users/${user.id}/permissions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      const activePages = data.filter((p: any) => p.CanView).map((p: any) => p.PageID);
      setEditSelectedPages(activePages);
    } catch (err) {
      console.error("خطأ في جلب الصلاحيات");
    }
  };

  // حفظ الصلاحيات المعدلة
  const handleUpdatePermissions = async () => {
    if (!editingUser) return;
    setIsUpdating(true);
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`https://engafi05-001-site1.stempurl.com/api/admin/users/${editingUser.id}/permissions`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          permissions: editSelectedPages.map(id => ({
            pageId: id,
            canView: true,
            canEdit: true
          }))
        })
      });
      
      if (res.ok) {
        alert("تم تحديث صلاحيات " + editingUser.username + " بنجاح");
        setEditingUser(null);
      }
    } catch (err) {
      alert("فشل التحديث");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <FaSpinner className="animate-spin text-4xl text-indigo-600" />
      <p className="font-bold text-gray-500">جاري تحميل البيانات...</p>
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-10">
          <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
            <FaShieldAlt className="text-indigo-600" /> إدارة النظام والصلاحيات
          </h1>
          <p className="text-gray-500 mt-2 text-sm">إضافة مستخدمين جدد وتحديد الأقسام المسموح لهم بإدارتها</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* قسم إضافة مستخدم (4 أعمدة) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-fit sticky top-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-indigo-700">
              <FaUserPlus /> مستخدم جديد
            </h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <input 
                type="text" placeholder="اسم المستخدم" 
                className="w-full p-3.5 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-indigo-500" 
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})} required 
              />
              <input 
                type="email" placeholder="البريد الإلكتروني" 
                className="w-full p-3.5 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-indigo-500" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})} required 
              />
              <input 
                type="password" placeholder="كلمة المرور" 
                className="w-full p-3.5 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-indigo-500" 
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})} required 
              />

              <div className="py-2">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">الصلاحيات المتاحة</p>
                <div className="grid grid-cols-1 gap-2 max-h-52 overflow-y-auto p-3 border border-dashed border-gray-200 rounded-2xl">
                  {pages.map(page => (
                    <label key={page.PageID} className={`flex items-center gap-3 cursor-pointer p-2 rounded-xl transition-all ${selectedPageIds.includes(page.PageID) ? 'bg-indigo-50 border-indigo-100' : 'hover:bg-gray-50'}`}>
                      <input 
                        type="checkbox" 
                        checked={selectedPageIds.includes(page.PageID)}
                        onChange={() => setSelectedPageIds(prev => prev.includes(page.PageID) ? prev.filter(p => p !== page.PageID) : [...prev, page.PageID])}
                        className="w-5 h-5 rounded-md text-indigo-600 border-gray-300"
                      />
                      <span className="text-sm font-bold text-gray-700">{page.Description || page.PageName}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2">
                إنشاء الحساب والصلاحيات
              </button>
            </form>
          </div>

          {/* جدول المستخدمين (8 أعمدة) */}
          <div className="lg:col-span-8 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h2 className="font-black text-gray-800">قائمة المسؤولين الحاليين</h2>
              <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold">{users.length} مستخدم</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-widest">
                  <tr>
                    <th className="p-5 font-black">المسؤول</th>
                    <th className="p-5 font-black">البريد الإلكتروني</th>
                    <th className="p-5 font-black">الدور</th>
                    <th className="p-5 font-black">التحكم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm uppercase">
                            {user.username.substring(0,2)}
                          </div>
                          <span className="font-bold text-gray-800">{user.username}</span>
                        </div>
                      </td>
                      <td className="p-5 text-gray-500 text-sm font-medium">{user.email}</td>
                      <td className="p-5">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase ${user.role === 'Admin' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => openEditModal(user)}
                            className="w-9 h-9 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                            title="تعديل الصلاحيات"
                          >
                            <FaUserLock size={16} />
                          </button>
                          <button className="w-9 h-9 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* مودال تعديل الصلاحيات (Modal) */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl border border-white">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-black text-gray-800">تعديل الصلاحيات</h3>
                <p className="text-indigo-600 font-bold text-sm mt-1">المستخدم: {editingUser.username}</p>
              </div>
              <button 
                onClick={() => setEditingUser(null)}
                className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:rotate-90 transition-all"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="space-y-2 max-h-[400px] overflow-y-auto border border-gray-100 p-4 rounded-3xl bg-gray-50/50 mb-8">
              {pages.map(page => (
                <label key={page.PageID} className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${editSelectedPages.includes(page.PageID) ? 'bg-white shadow-sm border border-indigo-100' : 'hover:bg-gray-100'}`}>
                  <input 
                    type="checkbox" 
                    checked={editSelectedPages.includes(page.PageID)}
                    onChange={() => setEditSelectedPages(prev => prev.includes(page.PageID) ? prev.filter(id => id !== page.PageID) : [...prev, page.PageID])}
                    className="w-6 h-6 rounded-lg text-indigo-600 border-gray-300 focus:ring-0"
                  />
                  <div>
                    <span className="block text-sm font-black text-gray-800">{page.Description || page.PageName}</span>
                    <span className="text-[10px] text-gray-400 uppercase font-bold">{page.PageName}</span>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleUpdatePermissions} 
                disabled={isUpdating}
                className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-indigo-700 disabled:bg-gray-400 transition-all shadow-lg shadow-indigo-100"
              >
                {isUpdating ? <FaSpinner className="animate-spin" /> : <FaSave />}
                حفظ التعديلات
              </button>
              <button 
                onClick={() => setEditingUser(null)} 
                className="px-6 bg-gray-100 text-gray-500 py-4 rounded-2xl font-black hover:bg-gray-200 transition-all"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}