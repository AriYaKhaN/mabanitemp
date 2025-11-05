// components/RegistrationForm.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface RegistrationFormProps {
  loading?: boolean;
  savingMessage?: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  studentNumber: string;
  phone: string;
  birthDate: {
    day: string;
    month: string;
    year: string;
  };
  section: string;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  loading = false,
  savingMessage = "لطفاً کمی صبر کنید..."
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    studentNumber: '',
    phone: '',
    birthDate: {
      day: '',
      month: '',
      year: ''
    },
    section: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;

    if (id === 'day' || id === 'month' || id === 'year') {
      setFormData(prev => ({
        ...prev,
        birthDate: {
          ...prev.birthDate,
          [id]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [id]: value
      }));
    }
  };

  const getSectionName = (section: string): string => {
    const sections: { [key: string]: string } = {
      'mabahes': 'مباحث ویژه - (دکتر کاردان)',
      'paygah': 'پایگاه داده - (دکتر کاردان)',
      'graphic': 'گرافیک کامپیوتر - (دکتر کاردان)',
      'mabani': 'مبانی کامپیوتر - (دکتر کاردان)'
    };
    return sections[section] || section;
  };

  const validateForm = (): boolean => {
    const { firstName, lastName, phone, studentNumber, section, birthDate } = formData;

    if (!firstName || firstName.length < 2) return false;
    if (!lastName || lastName.length < 2) return false;
    if (!phone || phone.length !== 11 || !/^\d+$/.test(phone)) return false;
    if (!studentNumber || studentNumber.length < 2 || !/^\d+$/.test(studentNumber)) return false;
    if (!section) return false;
    if (!birthDate.day || !birthDate.month || !birthDate.year) return false;

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert('لطفا فیلد ها را به درستی پر کنید');
      return;
    }

    const birthDateString = `${formData.birthDate.year}/${formData.birthDate.month}/${formData.birthDate.day}`;

    const confirmationMessage = `
آیا از صحت اطلاعات خود جهت ثبت نام مطمئنید؟\n\n
نام و نام خانوادگی: ${formData.firstName + ' ' + formData.lastName}
شماره دانشجویی: ${formData.studentNumber}
موبایل: ${formData.phone}
تاریخ تولد: ${birthDateString}
کلاس: ${getSectionName(formData.section)}
    `;

    if (window.confirm(confirmationMessage)) {
      // اینجا می‌توانید API call خود را اضافه کنید
      try {
        // const response = await fetch('/api/ethan/register', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     firstName: formData.firstName,
        //     lastName: formData.lastName,
        //     phone: parseInt(formData.phone),
        //     studentNumber: parseInt(formData.studentNumber),
        //     birthDate: birthDateString,
        //     section: formData.section
        //   })
        // });

        // const result = await response.json();

        // if (result.success) {
        //   alert('ثبت نام با موفقیت انجام شد!');
        //   router.push('/');
        // } else {
        //   alert(result.msg || 'خطا در ثبت نام');
        // }

        alert('فرم با موفقیت ارسال شد! (API call در کامنت قرار دارد)');

      } catch (error) {
        alert('خطا در ارسال فرم');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 p-4 font-sans relative overflow-hidden" dir="rtl">

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full mx-4">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900">
                در حال پردازش
              </h3>
              <p className="mt-2 text-sm text-gray-600 text-center">
                {savingMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-l from-blue-500/20 to-cyan-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-l from-purple-500/20 to-pink-500/10 rounded-full blur-3xl animate-float delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-l from-cyan-500/10 to-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute top-20 right-20 w-2 h-2 bg-white/30 rounded-full animate-float delay-1000"></div>
      <div className="absolute top-40 left-40 w-1 h-1 bg-cyan-300/40 rounded-full animate-float delay-1500"></div>
      <div className="absolute bottom-20 right-40 w-3 h-3 bg-purple-300/30 rounded-full animate-float delay-3000"></div>
      <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-blue-300/40 rounded-full animate-float delay-2500"></div>

      <div className="relative z-10 max-w-md mx-auto pt-8 md:pt-12">

        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 mb-6 shadow-2xl shadow-purple-500/10">
            <div className="w-3 h-3 bg-gradient-to-l from-cyan-400 to-blue-400 rounded-full animate-pulse shadow-lg shadow-cyan-400/50"></div>
            <span className="text-white/90 mr-3 font-medium text-base md:text-lg ml-3">ثبت نام دانشجوی جدید</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black mb-4 md:mb-6 leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-white via-cyan-100 to-blue-100">Join The</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-cyan-400 via-blue-400 to-purple-400 animate-text-shimmer">Future</span>
          </h1>

          <p className="text-gray-300 text-center text-base md:text-xl font-light leading-relaxed px-4">
            <span className="font-bold">برای ثبت نام در کلاس های دکتر کاردان، لطفا اطلاعات خود را وارد کنید</span>
          </p>
        </div>

        {/* Registration Card */}
        <div className="relative group">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-l from-cyan-500 via-blue-500 to-purple-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-all duration-1000 animate-pulse"></div>

          {/* Main Card */}
          <div className="relative bg-gray-900/80 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl shadow-purple-500/10">

            <div className="space-y-6 md:space-y-8">

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-3 md:space-y-4">
                  <label className="block text-cyan-300 font-semibold text-xs md:text-sm uppercase tracking-wider">نام</label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 md:py-4 bg-black/40 border border-cyan-500/30 rounded-2xl text-white placeholder-cyan-200/50 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-300 font-medium text-base md:text-lg text-right"
                    placeholder="نام"
                    required
                  />
                </div>

                <div className="space-y-3 md:space-y-4">
                  <label className="block text-purple-300 font-semibold text-xs md:text-sm uppercase tracking-wider">نام خانوادگی</label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 md:py-4 bg-black/40 border border-purple-500/30 rounded-2xl text-white placeholder-purple-200/50 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all duration-300 font-medium text-base md:text-lg text-right"
                    placeholder="نام خانوادگی"
                    required
                  />
                </div>
              </div>

              {/* Student ID */}
              <div className="space-y-3 md:space-y-4">
                <label className="block text-blue-300 font-semibold text-xs md:text-sm uppercase tracking-wider">شماره دانشجویی</label>
                <input
                  type="text"
                  id="studentNumber"
                  value={formData.studentNumber}
                  onChange={handleInputChange}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="w-full px-4 py-3 md:py-4 bg-black/40 border border-blue-500/30 rounded-2xl text-white placeholder-blue-200/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 font-medium text-base md:text-lg text-center tracking-widest"
                  placeholder="401123456"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-3 md:space-y-4">
                <label className="block text-green-300 font-semibold text-xs md:text-sm uppercase tracking-wider">شماره موبایل</label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  inputMode="tel"
                  className="w-full px-4 py-3 md:py-4 bg-black/40 border border-green-500/30 rounded-2xl text-white placeholder-green-200/50 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/30 transition-all duration-300 font-medium text-base md:text-lg text-center"
                  placeholder="09123456789"
                  required
                />
              </div>

              {/* Birth Date - Persian Format */}
              <div className="space-y-3 md:space-y-4">
                <label className="block text-yellow-300 font-semibold text-xs md:text-sm uppercase tracking-wider">تاریخ تولد (شمسی)</label>
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  {/* Day */}
                  <div className="space-y-2">
                    <label className="block text-yellow-200/80 text-xs font-medium text-center">روز</label>
                    <select
                      id="day"
                      value={formData.birthDate.day}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 md:py-3 bg-black/40 border border-yellow-500/30 rounded-2xl text-white focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition-all duration-300 font-medium text-base text-center appearance-none"
                      required
                    >
                      <option value="" className="bg-gray-900">روز</option>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                        <option key={day} value={day} className="bg-gray-900 text-center">{day}</option>
                      ))}
                    </select>
                  </div>

                  {/* Month */}
                  <div className="space-y-2">
                    <label className="block text-yellow-200/80 text-xs font-medium text-center">ماه</label>
                    <select
                      id="month"
                      value={formData.birthDate.month}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 md:py-3 bg-black/40 border border-yellow-500/30 rounded-2xl text-white focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition-all duration-300 font-medium text-base text-center appearance-none"
                      required
                    >
                      <option value="" className="bg-gray-900">ماه</option>
                      <option value="1" className="bg-gray-900 text-center">فروردین</option>
                      <option value="2" className="bg-gray-900 text-center">اردیبهشت</option>
                      <option value="3" className="bg-gray-900 text-center">خرداد</option>
                      <option value="4" className="bg-gray-900 text-center">تیر</option>
                      <option value="5" className="bg-gray-900 text-center">مرداد</option>
                      <option value="6" className="bg-gray-900 text-center">شهریور</option>
                      <option value="7" className="bg-gray-900 text-center">مهر</option>
                      <option value="8" className="bg-gray-900 text-center">آبان</option>
                      <option value="9" className="bg-gray-900 text-center">آذر</option>
                      <option value="10" className="bg-gray-900 text-center">دی</option>
                      <option value="11" className="bg-gray-900 text-center">بهمن</option>
                      <option value="12" className="bg-gray-900 text-center">اسفند</option>
                    </select>
                  </div>

                  {/* Year */}
                  <div className="space-y-2">
                    <label className="block text-yellow-200/80 text-xs font-medium text-center">سال</label>
                    <select
                      id="year"
                      value={formData.birthDate.year}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 md:py-3 bg-black/40 border border-yellow-500/30 rounded-2xl text-white focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition-all duration-300 font-medium text-base text-center appearance-none"
                      required
                    >
                      <option value="" className="bg-gray-900">سال</option>
                      {Array.from({ length: 50 }, (_, i) => 1403 - i).map(year => (
                        <option key={year} value={year} className="bg-gray-900 text-center">{year}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section Selection */}
              <div className="space-y-3 md:space-y-4">
                <label className="block text-pink-300 font-semibold text-xs md:text-sm uppercase tracking-wider">انتخاب کلاس</label>
                <select
                  id="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 md:py-4 bg-black/40 border border-pink-500/30 rounded-2xl text-white focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/30 transition-all duration-300 font-medium text-base md:text-lg appearance-none text-right"
                  required
                >
                  <option value="" className="bg-gray-900 text-right">کلاس مورد نظر را انتخاب کنید</option>
                  <option value="mabahes" className="bg-gray-900 text-right">⚡ مباحث ویژه - (دکتر کاردان) </option>
                  <option value="paygah" className="bg-gray-900 text-right">🚀 پایگاه داده - (دکتر کاردان) </option>
                  <option value="graphic" className="bg-gray-900 text-right">💫 گرافیک کامپیوتر - (دکتر کاردان) </option>
                  <option value="mabani" className="bg-gray-900 text-right">💎 مبانی کامپیوتر- (دکتر کاردان) </option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-gradient-to-l from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 text-white font-black py-4 md:py-5 px-6 rounded-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25 text-lg md:text-xl uppercase tracking-wider border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={loading}
              >
                <svg className="w-5 h-5 md:w-6 md:h-6 inline-block ml-3 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
                <span className="font-bold">ثبت نام نهایی</span>
              </button>

            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 md:mt-12 pb-4">
          <p className="text-gray-400 text-xs md:text-sm font-light">
            طراحی شده با 💘 توسط تیم پژوهشی تورینگ
          </p>
        </div>

      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(120deg); }
          66% { transform: translateY(10px) rotate(240deg); }
        }
        
        @keyframes textShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-text-shimmer {
          background-size: 200% auto;
          animation: textShimmer 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default RegistrationForm;