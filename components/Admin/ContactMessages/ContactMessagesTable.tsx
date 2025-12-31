'use client';
import React, { useState, useEffect } from 'react';
import { FaTrash, FaEnvelope, FaEnvelopeOpen, FaReply, FaSpinner } from 'react-icons/fa';
import AdminModal from '../AdminModal';

interface ContactMessage {
    MessageID: number;
    SenderName: string;
    SenderEmail: string;
    Subject: string;
    MessageContent: string;
    SentAt: string;
    IsRead: boolean;
}

const ContactMessagesTable = () => {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch('https://engafi05-001-site1.stempurl.com/api/admin/contact-messages', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error('Error fetching messages:', error);
            alert('فشل تحميل الرسائل');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleView = async (message: ContactMessage) => {
        setSelectedMessage(message);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;
        
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`https://engafi05-001-site1.stempurl.com/api/admin/contact-messages/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('فشل حذف الرسالة');
            }

            setMessages(messages.filter(msg => msg.MessageID !== id));
            alert('تم حذف الرسالة بنجاح');
        } catch (error: any) {
            console.error('Error deleting message:', error);
            alert(error.message || 'حدث خطأ أثناء حذف الرسالة');
        }
    };

    const toggleReadStatus = async (id: number, currentStatus: boolean) => {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`https://engafi05-001-site1.stempurl.com/api/admin/contact-messages/${id}/read`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isRead: !currentStatus })
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'فشل تحديث حالة الرسالة');
            }

            setMessages(messages.map(msg => 
                msg.MessageID === id ? { ...msg, IsRead: result.isRead } : msg
            ));
        } catch (error: any) {
            console.error('Error toggling message status:', error);
            alert(error.message || 'حدث خطأ أثناء تحديث حالة الرسالة');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <FaSpinner className="animate-spin text-2xl text-blue-500" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">إدارة رسائل الاتصال</h2>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                المرسل
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                البريد الإلكتروني
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                الموضوع
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                تاريخ الإرسال
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                الحالة
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                الإجراءات
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {messages.map((message) => (
                            <tr 
                                key={message.MessageID} 
                                className={!message.IsRead ? 'bg-blue-50' : 'hover:bg-gray-50'}
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {message.SenderName}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {message.SenderEmail}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                    {message.Subject || 'بدون موضوع'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(message.SentAt).toLocaleDateString('ar-SA', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button
                                        onClick={() => toggleReadStatus(message.MessageID, message.IsRead)}
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            message.IsRead 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}
                                    >
                                        {message.IsRead ? (
                                            <FaEnvelopeOpen className="ml-1" />
                                        ) : (
                                            <FaEnvelope className="ml-1" />
                                        )}
                                        {message.IsRead ? 'مقروءة' : 'جديدة'}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center space-x-2 space-x-reverse">
                                        <button
                                            onClick={() => handleView(message)}
                                            className="text-blue-600 hover:text-blue-900"
                                            title="عرض الرسالة"
                                        >
                                            عرض
                                        </button>
                                        <a
                                            href={`mailto:${message.SenderEmail}${message.Subject ? `?subject=Re: ${message.Subject}` : ''}`}
                                            className="text-green-600 hover:text-green-900"
                                            title="الرد على المرسل"
                                        >
                                            <FaReply />
                                        </a>
                                        <button
                                            onClick={() => handleDelete(message.MessageID)}
                                            className="text-red-600 hover:text-red-900"
                                            title="حذف الرسالة"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Message Detail Modal */}
            <AdminModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedMessage(null);
                }}
                title="تفاصيل الرسالة"
                size="lg"
            >
                {selectedMessage && (
                    <div className="space-y-4 text-right" dir="rtl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">المرسل:</h4>
                                <p className="mt-1 text-sm text-gray-900">{selectedMessage.SenderName}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">البريد الإلكتروني:</h4>
                                <p className="mt-1 text-sm text-gray-900">
                                    <a 
                                        href={`mailto:${selectedMessage.SenderEmail}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {selectedMessage.SenderEmail}
                                    </a>
                                </p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">التاريخ والوقت:</h4>
                                <p className="mt-1 text-sm text-gray-900">
                                    {new Date(selectedMessage.SentAt).toLocaleString('ar-SA', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">الحالة:</h4>
                                <p className="mt-1 text-sm text-gray-900">
                                    {selectedMessage.IsRead ? 'مقروءة' : 'غير مقروءة'}
                                </p>
                            </div>
                        </div>
                        
                        {selectedMessage.Subject && (
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">الموضوع:</h4>
                                <p className="mt-1 text-sm text-gray-900">{selectedMessage.Subject}</p>
                            </div>
                        )}
                        
                        <div>
                            <h4 className="text-sm font-medium text-gray-500">محتوى الرسالة:</h4>
                            <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm text-gray-900 whitespace-pre-line">
                                {selectedMessage.MessageContent}
                            </div>
                        </div>
                        
                        <div className="pt-4 flex justify-end space-x-3 space-x-reverse">
                            <a
                                href={`mailto:${selectedMessage.SenderEmail}${selectedMessage.Subject ? `?subject=Re: ${selectedMessage.Subject}` : ''}`}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                            >
                                <FaReply className="ml-2" />
                                الرد على المرسل
                            </a>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                            >
                                إغلاق
                            </button>
                        </div>
                    </div>
                )}
            </AdminModal>
        </div>
    );
};

export default ContactMessagesTable;