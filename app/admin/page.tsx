'use client';
import React, { useEffect, useState } from 'react';
import { FaUserMd, FaEnvelope, FaBriefcase, FaUsers } from 'react-icons/fa';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ doctors: 0, messages: 0, jobs: 0, users: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('http://engafi05-001-site1.stempurl.com/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setStats(data);
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'الأطباء المسجلين', count: stats.doctors, icon: FaUserMd, color: 'bg-blue-600' },
    { label: 'رسائل التواصل', count: stats.messages, icon: FaEnvelope, color: 'bg-green-600' },
    { label: 'الوظائف النشطة', count: stats.jobs, icon: FaBriefcase, color: 'bg-yellow-600' },
    { label: 'مديرين النظام', count: stats.users, icon: FaUsers, color: 'bg-purple-600' },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-right">مرحباً بك في لوحة التحكم</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`${card.color} text-white p-4 rounded-lg`}>
              <card.icon size={25} />
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm font-medium">{card.label}</p>
              <h3 className="text-2xl font-bold text-gray-800">{card.count}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}