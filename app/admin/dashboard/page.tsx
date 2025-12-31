// C:\MIH_Web\frontend\web-site\app\admin\dashboard\page.tsx

export default function AdminDashboardPage() {
    return (
        <div className="p-8 min-h-screen bg-gray-50">
            <h1 className="text-4xl font-extrabold text-gray-800 border-b pb-4 mb-8">
                👨‍💻 لوحة تحكم المسؤول (Admin Dashboard)
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-500">
                    <h2 className="text-xl font-semibold text-indigo-700">إدارة الأطباء</h2>
                    <p className="mt-2 text-gray-600">إضافة، تعديل، أو حذف سجلات الأطباء.</p>
                    {/* سنضيف الرابط هنا لاحقا */}
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                    <h2 className="text-xl font-semibold text-green-700">إدارة التخصصات</h2>
                    <p className="mt-2 text-gray-600">إضافة أو تعديل التخصصات الطبية.</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
                    <h2 className="text-xl font-semibold text-red-700">إدارة المستخدمين</h2>
                    <p className="mt-2 text-gray-600">التحكم في صلاحيات الوصول للمحررين.</p>
                </div>
            </div>

            <p className="mt-10 text-sm text-gray-500">
                ملاحظة: هذه الصفحة غير مؤمنة بعد، أي شخص يمكنه الوصول إليها حالياً.
            </p>
        </div>
    );
}