import { LayoutGrid, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

// قمنا بتوحيد المسمى ليكون specialties ليتطابق مع ما نرسله من صفحة page.tsx
export default function SpecialtiesSection({ specialties }: { specialties: any[] }) {
  // إضافة فحص أمان للتأكد من أن المصفوفة موجودة
  if (!specialties || specialties.length === 0) return null;

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black text-[#003366] mb-4 tracking-tighter">تخصصاتنا الطبية</h2>
            <p className="text-slate-500 font-medium">نقدم رعاية شاملة في أكثر من 20 تخصصاً طبياً دقيقاً</p>
          </div>
          <Link href="/specialties" className="hidden md:flex items-center gap-2 text-blue-600 font-bold hover:gap-4 transition-all">
            عرض الكل <ChevronLeft size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {specialties.map((spec) => (
            <div key={spec.SpecialtyID} className="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 border border-slate-100 group text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-6 group-hover:bg-[#003366] group-hover:text-white transition-colors shadow-inner">
                {/* هنا يمكنك لاحقاً تبديل الأيقونة بناءً على IconClass من قاعدة البيانات */}
                <LayoutGrid size={32} />
              </div>
              <h3 className="font-black text-slate-800 group-hover:text-blue-600 transition-colors uppercase text-sm">
                {spec.SpecialtyName}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}