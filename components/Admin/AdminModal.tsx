// C:\MIH_Web\frontend\web-site\components\Admin\AdminModal.tsx

'use client'; 
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: string; // أضف هذا السطر
  children: React.ReactNode;
}

const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, title, children }) => {
  // للتحقق من أننا في بيئة المتصفح قبل استخدام createPortal
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
    
    // لإغلاق النافذة باستخدام مفتاح ESC
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // منع تمرير الصفحة الخلفية
      document.addEventListener('keydown', handleEscape);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) {
    return null;
  }

  // استخدام createPortal لضمان ظهور الـ Modal في نهاية الـ DOM
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900 bg-opacity-75 transition-opacity duration-300" 
         onClick={onClose} // إغلاق عند النقر خارج الـ Modal
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()} // منع الإغلاق عند النقر داخل الـ Modal
      >
        
        {/* رأس النافذة (Header) */}
        <div className="flex justify-between items-center p-5 border-b bg-indigo-50/50">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* محتوى النافذة (Body) */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
        
        {/* التذييل (Footer) - يمكن إضافة أزرار الحفظ/الإلغاء هنا إذا لزم الأمر */}
      </div>
    </div>,
    document.body // يتم إلحاق الـ Modal بـ <body>
  );
};

export default AdminModal;