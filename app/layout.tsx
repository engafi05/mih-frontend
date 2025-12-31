import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingBookingButton from '@/components/Shared/FloatingBookingButton';

export const metadata = {
  title: 'International Misr Hospital | مستشفى مصر الدولى',
  description: 'أحدث الخدمات الطبية والرعاية الصحية المتكاملة',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* حل مشكلة الحظر للمحتوى غير الآمن (Mixed Content) */}
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      </head>
      <body className="bg-white text-slate-900 antialiased overflow-x-hidden">
        <div className="flex flex-col min-h-screen">
          {/* شريط التنقل (التبّات) */}
          <Navbar />
          
          {/* محتوى الصفحة المتغير */}
          <main className="flex-grow w-full overflow-hidden">
            {children}
          </main>
          
          <FloatingBookingButton />
          
          {/* الفوتر */}
          <Footer />
        </div>
      </body>
    </html>
  );
}