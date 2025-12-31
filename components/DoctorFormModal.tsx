// C:\MIH_Web\frontend\web-site\components\DoctorFormModal.tsx (الكود الكامل)

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

// تعريف أنواع البيانات
interface Specialty {
  SpecialtyID: number;
  Name: string; // يستخدم 'Name' لأن الـ Backend يعيد تسمية 'SpecialtyName' إلى 'Name'
}

interface TitleItem { // جديد: تعريف لنوع بيانات الألقاب
    TitleID: number;
    Name: string; // يستخدم 'Name' لأن الـ Backend يعيد تسمية 'TitleName' إلى 'Name'
}

interface Doctor {
    DoctorID?: number; // اختياري للإضافة
    Name: string;
    Title: string; // يظل Title سلسلة نصية (string)
    SpecialtyID: number;
    SpecialtyName?: string; // للقراءة فقط
    ExperienceYears: number;
    Bio?: string;
    ProfileImagePath?: string;
    AppointmentLink?: string;
}

interface DoctorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentDoctor: Doctor | null; // بيانات الطبيب الحالي للتعديل
}

const API_URL = 'http://engafi05-001-site1.stempurl.com/api/doctors'; 
const SPECIALTY_API_URL = 'http://engafi05-001-site1.stempurl.com/api/specialties'; 
const TITLE_API_URL = 'http://engafi05-001-site1.stempurl.com/api/titles'; // جديد: نقطة وصول الألقاب

const DoctorFormModal: React.FC<DoctorFormModalProps> = ({ isOpen, onClose, onSuccess, currentDoctor }) => {
  const [formData, setFormData] = useState<Doctor>({
    Name: '',
    Title: '', // ستبدأ بقيمة فارغة
    SpecialtyID: 0,
    ExperienceYears: 0,
    Bio: '',
    ProfileImagePath: '',
    AppointmentLink: '',
  });
  
  // States for Specialties
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [specialtyQuery, setSpecialtyQuery] = useState(''); 

  // States for Titles (جديد)
  const [titles, setTitles] = useState<TitleItem[]>([]); 
  const [titleQuery, setTitleQuery] = useState(''); // لقيمة البحث في اللقب

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 1. جلب قائمة التخصصات والألقاب عند فتح الـ Modal
  const fetchData = useCallback(async () => {
    try {
      const [specialtyResponse, titleResponse] = await Promise.all([
        axios.get(SPECIALTY_API_URL),
        axios.get(TITLE_API_URL) // جلب الألقاب
      ]);
      setSpecialties(specialtyResponse.data);
      setTitles(titleResponse.data); // تخزين الألقاب
    } catch (err) {
      console.error("Error fetching data:", err);
      setError('فشل في جلب قائمة التخصصات أو الألقاب.');
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchData();
      setError('');
      
      // تعبئة البيانات في حالة التعديل
      if (currentDoctor) {
        setFormData(currentDoctor);
        setSpecialtyQuery(currentDoctor.SpecialtyName || ''); 
        setTitleQuery(currentDoctor.Title || ''); // جديد: تعيين اللقب الحالي في مربع البحث
      } else {
        // إعادة تعيين النموذج للإضافة
        setFormData({
            Name: '',
            Title: '',
            SpecialtyID: 0,
            ExperienceYears: 0,
            Bio: '',
            ProfileImagePath: '',
            AppointmentLink: '',
        });
        setSpecialtyQuery('');
        setTitleQuery(''); // جديد: مسح حقل اللقب
      }
    }
  }, [isOpen, fetchData, currentDoctor]);

  // 2. معالجة تغيير حقول النموذج (مُعدلة: لا يتم استخدامها للتخصص أو اللقب)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // يتم تحديث Title عبر setTitleQuery فقط، ولكن نسمح بتحديث باقي الحقول
    if (name !== 'Title') {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // 3. حساب قائمة التخصصات المفلترة (مع الحماية)
  const filteredSpecialties = useMemo(() => {
    if (!specialties || specialties.length === 0) return []; 
    
    return specialties.filter(spec => {
      // الحماية: التأكد من أن الكائن والخاصية Name موجودان
      return (
        spec && 
        spec.Name && 
        spec.Name.toLowerCase().includes(specialtyQuery.toLowerCase())
      );
    }).slice(0, 10); 
  }, [specialties, specialtyQuery]);


  // 4. حساب قائمة الألقاب المفلترة (جديد - مع الحماية)
  const filteredTitles = useMemo(() => {
    if (!titles || titles.length === 0) return [];

    return titles.filter(titleItem => {
      // الحماية: التأكد من أن الكائن والخاصية Name موجودان
      return (
        titleItem && 
        titleItem.Name && 
        titleItem.Name.toLowerCase().includes(titleQuery.toLowerCase())
      );
    }).slice(0, 10);
  }, [titles, titleQuery]);


  // 5. اختيار تخصص من القائمة المنسدلة
  const handleSelectSpecialty = (spec: Specialty) => {
    setFormData(prev => ({ ...prev, SpecialtyID: spec.SpecialtyID }));
    setSpecialtyQuery(spec.Name); 
  };
  
  // 6. اختيار لقب من القائمة المنسدلة (جديد)
  const handleSelectTitle = (titleItem: TitleItem) => {
    setFormData(prev => ({ ...prev, Title: titleItem.Name }));
    setTitleQuery(titleItem.Name); 
  };


  // 7. إرسال النموذج (إضافة أو تعديل)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const token = Cookies.get('authToken');
    if (!token) {
      setError('خطأ في المصادقة. يرجى تسجيل الدخول مرة أخرى.');
      setIsSubmitting(false);
      return;
    }

    // تحقق من المتطلبات الأساسية
    if (formData.SpecialtyID === 0 || titleQuery.trim() === '') {
        setError('يجب اختيار تخصص من القائمة المقترحة، ويجب إدخال لقب/منصب.');
        setIsSubmitting(false);
        return;
    }
    
    // التأكد من أن حقل Title في الـ formData هو نفسه القيمة النهائية المكتوبة في titleQuery
    const finalFormData = { ...formData, Title: titleQuery };


    try {
      const url = currentDoctor ? `${API_URL}/${currentDoctor.DoctorID}` : API_URL;
      const method = currentDoctor ? 'put' : 'post';

      await axios({
        method: method,
        url: url,
        data: finalFormData, // استخدام البيانات النهائية
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(`تم ${currentDoctor ? 'تعديل' : 'إضافة'} الطبيب بنجاح.`);
      onSuccess(); 
      onClose();
    } catch (err: any) {
        console.error("Submit error:", err);
        setError(`فشل ${currentDoctor ? 'التعديل' : 'الإضافة'}: ${err.response?.data?.message || 'خطأ في السيرفر.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 mx-4">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            {currentDoctor ? 'تعديل بيانات الطبيب' : 'إضافة طبيب جديد'}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-800 text-3xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label htmlFor="Name" className="block text-sm font-medium text-gray-700">الاسم الكامل</label>
            <input
              type="text"
              name="Name"
              id="Name"
              value={formData.Name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            />
          </div>

          {/* جديد: حقل اللقب/المنصب مع Autocomplete (يشبه التخصص) */}
          <div className="relative">
            <label htmlFor="title-search" className="block text-sm font-medium text-gray-700">اللقب / المنصب</label>
            <input
              type="text"
              id="title-search"
              value={titleQuery}
              onChange={(e) => {
                setTitleQuery(e.target.value);
                // تحديث formData.Title عند الكتابة لضمان تمرير القيمة المكتوبة إذا لم يتم الاختيار من القائمة
                setFormData(prev => ({ ...prev, Title: e.target.value }));
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              placeholder="مثال: أستاذ دكتور، استشاري"
              autoComplete="off"
              required
            />
            {titleQuery.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto mt-1">
                    {filteredTitles.map((titleItem) => (
                        <li
                            key={titleItem.TitleID}
                            className="px-4 py-2 text-sm cursor-pointer hover:bg-indigo-500 hover:text-white"
                            onClick={() => handleSelectTitle(titleItem)}
                        >
                            {titleItem.Name}
                        </li>
                    ))}
                    {filteredTitles.length === 0 && (
                        <li className="px-4 py-2 text-sm text-gray-500">لا توجد ألقاب موحدة مطابقة. يمكنك كتابة لقب جديد.</li>
                    )}
                </ul>
            )}
            {/* عرض اللقب المختار للتأكيد (في حال تم اختياره من القائمة) */}
            {formData.Title.trim() !== '' && titleQuery === formData.Title && (
                 <p className="mt-1 text-xs text-green-600">اللقب المختار: {formData.Title}</p>
            )}
          </div>
          {/* نهاية حقل اللقب/المنصب */}


          {/* حقل التخصص مع البحث و Autocomplete */}
          <div className="relative">
            <label htmlFor="specialty-search" className="block text-sm font-medium text-gray-700">التخصص</label>
            <input
                type="text"
                id="specialty-search"
                value={specialtyQuery}
                onChange={(e) => {
                    setSpecialtyQuery(e.target.value);
                    setFormData(prev => ({ ...prev, SpecialtyID: 0 })); // مسح الـ ID عند بدء الكتابة
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                placeholder="ابحث عن التخصص أو اكتبه"
                autoComplete="off"
                required
            />
            {specialtyQuery && formData.SpecialtyID === 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto mt-1">
                    {filteredSpecialties.map((spec) => (
                        <li
                            key={spec.SpecialtyID}
                            className="px-4 py-2 text-sm cursor-pointer hover:bg-indigo-500 hover:text-white"
                            onClick={() => handleSelectSpecialty(spec)}
                        >
                            {spec.Name}
                        </li>
                    ))}
                    {filteredSpecialties.length === 0 && (
                        <li className="px-4 py-2 text-sm text-gray-500">لا توجد نتائج مطابقة.</li>
                    )}
                </ul>
            )}
            {formData.SpecialtyID !== 0 && (
                 <p className="mt-1 text-xs text-green-600">التخصص المختار (ID: {formData.SpecialtyID})</p>
            )}
          </div>
          {/* نهاية حقل التخصص */}
          
          <div>
            <label htmlFor="ExperienceYears" className="block text-sm font-medium text-gray-700">سنوات الخبرة</label>
            <input
              type="number"
              name="ExperienceYears"
              id="ExperienceYears"
              value={formData.ExperienceYears}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            />
          </div>

          <div>
            <label htmlFor="Bio" className="block text-sm font-medium text-gray-700">السيرة الذاتية (Bio)</label>
            <textarea
              name="Bio"
              id="Bio"
              value={formData.Bio}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            />
          </div>
          
          {/* ProfileImagePath and AppointmentLink fields */}
          <div>
            <label htmlFor="ProfileImagePath" className="block text-sm font-medium text-gray-700">مسار صورة الطبيب (Profile Image Path)</label>
            <input
              type="text"
              name="ProfileImagePath"
              id="ProfileImagePath"
              value={formData.ProfileImagePath}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            />
          </div>

          <div>
            <label htmlFor="AppointmentLink" className="block text-sm font-medium text-gray-700">رابط حجز المواعيد (Appointment Link)</label>
            <input
              type="text"
              name="AppointmentLink"
              id="AppointmentLink"
              value={formData.AppointmentLink}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            />
          </div>
          {/* End of additional fields */}


          <div className="flex justify-end pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-300 ml-2"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 disabled:opacity-50"
            >
              {isSubmitting ? 'جاري الحفظ...' : (currentDoctor ? 'حفظ التعديلات' : 'إضافة الطبيب')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorFormModal;