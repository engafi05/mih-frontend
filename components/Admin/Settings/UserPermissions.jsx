import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserPermissions = ({ userId, onClose }) => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('admin_token');
                const [pagesRes, permissionsRes] = await Promise.all([
                    axios.get('http://engafi05-001-site1.stempurl.com/api/admin/pages', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    axios.get(`http://engafi05-001-site1.stempurl.com/api/admin/users/${userId}/permissions`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                setPages(pagesRes.data.map(page => ({
                    ...page,
                    canView: permissionsRes.data.find(p => p.PageID === page.PageID)?.CanView || false,
                    canEdit: permissionsRes.data.find(p => p.PageID === page.PageID)?.CanEdit || false
                })));
            } catch (error) {
                console.error('Error fetching data:', error);
                setMessage({ type: 'error', text: 'حدث خطأ في تحميل البيانات' });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    const handlePermissionChange = (pageId, field) => {
        setPages(pages.map(page => 
            page.PageID === pageId 
                ? { ...page, [field]: !page[field] } 
                : page
        ));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const token = localStorage.getItem('admin_token');
            await axios.put(
                `http://engafi05-001-site1.stempurl.com/api/admin/users/${userId}/permissions`,
                {
                    permissions: pages.map(page => ({
                        pageId: page.PageID,
                        canView: page.canView,
                        canEdit: page.canEdit
                    }))
                },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            setMessage({ type: 'success', text: 'تم حفظ التغييرات بنجاح' });
            setTimeout(() => onClose(), 1000);
        } catch (error) {
            console.error('Error saving permissions:', error);
            setMessage({ 
                type: 'error', 
                text: error.response?.data?.message || 'حدث خطأ أثناء حفظ التغييرات' 
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-center py-4">جاري التحميل...</div>;
    }

    return (
        <div className="space-y-4">
            {message.text && (
                <div className={`p-3 rounded-md ${
                    message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                    {message.text}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                الصفحة
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                عرض
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                تعديل
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {pages.map((page) => (
                            <tr key={page.PageID} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {page.PageName}
                                    <p className="text-xs text-gray-500">{page.Description}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <input
                                        type="checkbox"
                                        checked={page.canView}
                                        onChange={() => handlePermissionChange(page.PageID, 'canView')}
                                        className="h-4 w-4 text-blue-600 rounded border-gray-300"
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <input
                                        type="checkbox"
                                        checked={page.canEdit}
                                        onChange={() => handlePermissionChange(page.PageID, 'canEdit')}
                                        disabled={!page.canView}
                                        className="h-4 w-4 text-blue-600 rounded border-gray-300"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    disabled={saving}
                >
                    إلغاء
                </button>
                <button
                    type="button"
                    onClick={handleSave}
                    className={`px-4 py-2 text-white rounded-md ${
                        saving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    disabled={saving}
                >
                    {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </button>
            </div>
        </div>
    );
};

export default UserPermissions;