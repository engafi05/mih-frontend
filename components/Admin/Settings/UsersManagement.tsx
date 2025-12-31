'use client';
import React, { useEffect, useState } from 'react';
import { FaUserPlus, FaUserShield, FaTrash, FaSpinner } from 'react-icons/fa';
import AdminModal from '../AdminModal';
import UserForm from './UserForm';

export default function UsersManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // حالات التحكم في النافذة المنبثقة (Modal)
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch('http://engafi05-001-site1.stempurl.com/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setError(data.message || "حدث خطأ في جلب البيانات");
      }
    } catch (err) {
      setError("لا يمكن الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDeleteUser = async (id: number, username: string) => {
    if (username === 'admin') return alert('لا يمكن حذف المدير الرئيسي');
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
    
    // ملاحظة: ستحتاج لإضافة مسار DELETE في server.js لاحقاً إذا أردت تفعيل الحذف برمجياً
    alert('خاصية الحذف تتطلب إضافة endpoint DELETE في السيرفر');
  };

  if (loading) return <div className="p-10 text-center"><FaSpinner className="animate-spin inline text-2xl text-indigo-600"/></div>;

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-700">قائمة موظفي النظام</h3>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 text-white px-5 py-2 rounded-lg flex items-center shadow-md hover:bg-green-700 transition"
        >
          <FaUserPlus className="ml-2" /> إضافة مستخدم جديد
        </button>
      </div>

      {error && <div className="p-3 bg-red-100 text-red-700 rounded mb-4">{error}</div>}

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="p-4 border-b">اسم المستخدم</th>
              <th className="p-4 border-b">البريد الإلكتروني</th>
              <th className="p-4 border-b">الصلاحية</th>
              <th className="p-4 border-b">تاريخ الإنشاء</th>
              <th className="p-4 border-b">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user.UserID} className="hover:bg-blue-50/30 transition border-b">
                <td className="p-4 font-medium">{user.Username}</td>
                <td className="p-4 text-gray-600">{user.Email}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    user.UserRole === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.UserRole}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-400">
                  {new Date(user.CreatedAt).toLocaleDateString('ar-EG')}
                </td>
                <td className="p-4 text-center">
                  <button className="text-indigo-600 hover:scale-125 transition ml-4"><FaUserShield title="تعديل الصلاحيات" /></button>
                  <button 
                    onClick={() => handleDeleteUser(user.UserID, user.Username)}
                    className={`text-red-500 hover:scale-125 transition ${user.Username === 'admin' ? 'opacity-20 cursor-not-allowed' : ''}`}
                  >
                    <FaTrash title="حذف المستخدم" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* النافذة المنبثقة لإضافة مستخدم */}
      {isModalOpen && (
        <AdminModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          title="إضافة حساب موظف جديد"
        >
          <UserForm onSave={fetchUsers} onClose={() => setIsModalOpen(false)} />
        </AdminModal>
      )}
    </div>
  );
}