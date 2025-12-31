'use client';
import React, { useState } from 'react';
import { FaLock, FaCheck } from 'react-icons/fa';

export default function ChangePassword() {
  const [passwords, setPasswords] = useState({ old: '', new: '' });
  const [status, setStatus] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_token');
    const res = await fetch('https://engafi05-001-site1.stempurl.com/api/admin/update-password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(passwords)
    });
    if (res.ok) { setStatus('success'); setPasswords({old:'', new:''}); }
    else { setStatus('error'); }
  };

  return (
    <form onSubmit={handleUpdate} className="max-w-md bg-gray-50 p-6 rounded-xl border">
      <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-700">
        <FaLock className="text-red-500" /> تغيير كلمة المرور الخاصة بك
      </h3>
      <input 
        type="password" placeholder="كلمة المرور الحالية" required
        className="w-full p-2 mb-3 border rounded outline-none"
        onChange={e => setPasswords({...passwords, old: e.target.value})}
        value={passwords.old}
      />
      <input 
        type="password" placeholder="كلمة المرور الجديدة" required
        className="w-full p-2 mb-4 border rounded outline-none"
        onChange={e => setPasswords({...passwords, new: e.target.value})}
        value={passwords.new}
      />
      <button className="w-full bg-slate-800 text-white py-2 rounded-lg hover:bg-black transition">
        تحديث كلمة السر
      </button>
      {status === 'success' && <p className="text-green-600 text-xs mt-2 flex items-center gap-1"><FaCheck/> تم التحديث بنجاح</p>}
    </form>
  );
}