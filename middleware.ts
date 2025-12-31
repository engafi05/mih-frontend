import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. استخراج البيانات من الكوكيز
  const token = request.cookies.get('authToken')?.value;
  const userRole = request.cookies.get('userRole')?.value;
  const allowedPagesString = request.cookies.get('user_allowed_pages')?.value || '';

  // 2. إذا حاول المستخدم دخول لوحة التحكم وهو غير مسجل دخول
  if (path.startsWith('/admin') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. حماية المسارات بناءً على الصلاحيات (لغير الأدمن)
  if (path.startsWith('/admin') && userRole !== 'Admin') {
    
    // استثناء الصفحة الرئيسية للوحة التحكم (Dashboard) ليتمكن الجميع من دخولها
    if (path === '/admin') {
      return NextResponse.next();
    }

    // مصفوفة الصفحات المسموحة للمستخدم
    const allowedPages = allowedPagesString.split(',');

    // تعريف خريطة المسارات وما يقابلها من معرفات (IDs)
    const routePermissions: { [key: string]: string } = {
      '/admin/services': 'services',
      '/admin/doctors': 'doctors',
      '/admin/specialties': 'specialties',
      '/admin/careers': 'jobs',
      '/admin/contact-messages': 'messages',
      '/admin/success-stories': 'success-stories',
      '/admin/settings': 'settings',
    };

    // التحقق مما إذا كان المسار الحالي ضمن القائمة المحظورة لهذا المستخدم
    const requiredPermission = routePermissions[path];
    
    if (requiredPermission && !allowedPages.includes('all') && !allowedPages.includes(requiredPermission)) {
      // إذا كان غير مصرح له، يتم توجيهه لصفحة الإدارة الرئيسية
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|favicon.ico|login).*)'],
};