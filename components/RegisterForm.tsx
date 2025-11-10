'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentRegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    studentCode: '',
    section: '1',
    ta: '5'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // اعتبارسنجی کد دانشجویی
    if (!/^\d+$/.test(formData.studentCode)) {
      setError('کد دانشجویی باید فقط شامل اعداد باشد');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/register-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('🎉 ثبت نام دانشجو با موفقیت انجام شد!');
        router.push('/');
      } else {
        setError(data.error || 'خطایی در ثبت نام رخ داده است');
      }
    } catch (err) {
      console.error('خطا در ارسال درخواست:', err);
      setError('خطای شبکه رخ داده است. لطفا اتصال اینترنت را بررسی کنید.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* اشکال شناور در پس‌زمینه */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* دکمه بازگشت */}
      <button 
        onClick={() => router.push('/')}
        className="back-button glass-card"
      >
        ← بازگشت به خانه
      </button>

      {/* کارت ثبت نام */}
      <div className="register-card glass-card">
        <div className="register-header">
          <div className="avatar-container">
            <div className="avatar">🎓</div>
            <div className="avatar-ring"></div>
          </div>
          <h1 className="register-title">ثبت نام دانشجو</h1>
          <p className="register-subtitle">اطلاعات دانشجویی خود را وارد کنید</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* فیلد نام */}
          <div className="form-group">
            <div className="form-icon">👤</div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="نام و نام خانوادگی"
              required
              className="glass-input form-input"
              disabled={loading}
            />
          </div>

          {/* فیلد کد دانشجویی */}
          <div className="form-group">
            <div className="form-icon">🎫</div>
            <input
              type="text"
              name="studentCode"
              value={formData.studentCode}
              onChange={handleChange}
              placeholder="کد دانشجویی"
              required
              className="glass-input form-input"
              disabled={loading}
            />
          </div>

          {/* فیلد سکشن */}
          <div className="form-group">
            <div className="form-icon">📚</div>
            <select
              name="section"
              value={formData.section}
              onChange={handleChange}
              className="glass-input form-input"
              disabled={loading}
            >
              <option value="1">دوشنبه 13:15 الی 15:45</option>
              <option value="2">دوشنبه 15:45 الی 18:30</option>
            </select>
          </div>

          {/* فیلد TA */}
          <div className="form-group">
            <div className="form-icon">👨‍🏫</div>
            <select
              name="ta"
              value={formData.ta}
              onChange={handleChange}
              className="glass-input form-input"
              disabled={loading}
            >
              <option value="5" className='text-black bg-white'>آریا تاجدار</option>
              <option value="6" className='text-black bg-white'>رقیه اسلامی</option>
              <option value="7" className='text-black bg-white'>مبینا همتی</option>
              <option value="8" className='text-black bg-white'>میترا محمدی</option>
              <option value="9" className='text-black bg-white'>علیرضا درخشان</option>
            </select>
          </div>

          {/* نمایش خطا */}
          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}

          {/* دکمه ثبت نام */}
          <button
            type="submit"
            disabled={loading}
            className="glass-button submit-button"
          >
            {loading ? (
              <span>
                در حال ثبت نام
                <span className="loading-spinner"></span>
              </span>
            ) : (
              '🎓 ثبت نام دانشجو'
            )}
          </button>
        </form>

        <div className="register-footer">
          <p>
            قبلاً ثبت نام کرده‌اید؟{' '}
            <a 
              href="/" 
              className="login-link"
              onClick={(e) => {
                e.preventDefault();
                router.push('/');
              }}
            >
              بازگشت به صفحه اصلی
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}