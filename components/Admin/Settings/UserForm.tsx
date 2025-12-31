'use client';
import React, { useState } from 'react';

const UserForm: React.FC<{ onSave: () => void, onClose: () => void }> = ({ onSave, onClose }) => {
  const [formData, setFormData] = useState({
    Username: '', Email: '', Password: '', UserRole: 'Editor'
  });
  
  // نظام الصلاحيات لكل صفحة
  const [allowedPages, setAllowedPages] = useState<string[]>(['dashboard']);

  const pages = [
    { id: 'doctors', name: 'الأطباء' },
    { id: 'jobs', name: 'الوظائف' },
    { id: 'messages', name: 'الرسائل' },
    { id: 'specialties', name: 'التخصصات' },
    { id: 'success-stories', name: 'قصص النجاح' },
    { id: 'settings', name: 'الإعدادات' },
  ];

  const handlePageToggle = (id: string) => {
    setAllowedPages(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    
    // سنرسل الصلاحيات كـ String مفصول بفاصلة
    const payload = { ...formData, AllowedPages: allowedPages.join(',') };

    const res = await fetch('http://engafi05-001-site1.stempurl.com/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(payload)
    });

    if (res.ok) { onSave(); onClose(); } else { alert('فشل الإضافة'); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-right">
      <div className="grid grid-cols-2 gap-4">
        <input type="text" placeholder="اسم المستخدم" className="p-2 border rounded" required
               onChange={e => setFormData({...formData, Username: e.target.value})} />
        <input type="email" placeholder="البريد الإلكتروني" className="p-2 border rounded" required
               onChange={e => setFormData({...formData, Email: e.target.value})} />
      </div>
      <input type="password" placeholder="كلمة المرور" className="w-full p-2 border rounded" required
             onChange={e => setFormData({...formData, Password: e.target.value})} />

      <div className="border p-3 rounded bg-gray-50">
        <p className="font-bold mb-2 text-sm text-gray-700">الصفحات المسموح بالتحكم فيها:</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {pages.map(page => (
            <label key={page.id} className="flex items-center gap-2 cursor-pointer bg-white p-2 border rounded hover:bg-blue-50">
              <input 
                type="checkbox" 
                checked={allowedPages.includes(page.id)}
                onChange={() => handlePageToggle(page.id)}
              />
              {page.name}
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">إلغاء</button>
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded shadow-md hover:bg-indigo-700">حفظ وحماية الحساب</button>
      </div>
    </form>
  );
};
export default UserForm;