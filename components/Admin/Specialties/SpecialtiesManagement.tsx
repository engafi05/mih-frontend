'use client';
import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaStethoscope, FaSpinner } from 'react-icons/fa';

export default function SpecialtiesManagement() {
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');

  const fetchSpecs = async () => {
    const token = localStorage.getItem('admin_token');
    const res = await fetch('http://engafi05-001-site1.stempurl.com/api/admin/specialties', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setSpecialties(data);
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    const token = localStorage.getItem('admin_token');
    const res = await fetch('http://engafi05-001-site1.stempurl.com/api/admin/specialties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ SpecialtyName: newName })
    });
    if (res.ok) { setNewName(''); fetchSpecs(); }
  };

  useEffect(() => { fetchSpecs(); }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <FaStethoscope className="text-indigo-600" /> إدارة التخصصات الطبية
      </h2>

      <form onSubmit={handleAdd} className="flex gap-2 mb-8">
        <input 
          type="text" placeholder="اسم التخصص الجديد..." value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
          إضافة
        </button>
      </form>

      {loading ? <FaSpinner className="animate-spin mx-auto text-2xl" /> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {specialties.map(spec => (
            <div key={spec.SpecialtyID} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border group hover:border-indigo-200 transition">
              <span className="font-medium text-gray-700">{spec.SpecialtyName}</span>
              <button className="text-red-300 hover:text-red-600 transition opacity-0 group-hover:opacity-100">
                <FaTrash size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}