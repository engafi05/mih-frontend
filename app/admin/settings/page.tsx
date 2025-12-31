"use client";
import React from 'react';
import GeneralSettings from '@/components/Admin/Settings/GeneralSettings';

export default function SettingsPage() {
    return (
        <div className="container mx-auto py-6 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">إدارة النظام</h1>
                <p className="text-gray-600 mt-2">تحكم في إعدادات المستشفى، المستخدمين، والصلاحيات</p>
            </div>
            
            {/* استدعاء المكون الرئيسي الذي يحتوي على التبويبات */}
            <GeneralSettings />
        </div>
    );
}