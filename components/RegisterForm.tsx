'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // نمایش پیام موفقیت
        setError('');
        alert('🎉 ثبت نام با موفقیت انجام شد!');
        router.push('/login');
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

  // تابع تست اتصال به دیتابیس
  const testDatabaseConnection = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/test-db');
      const data = await response.json();
      
      if (response.ok) {
        alert('✅ اتصال به دیتابیس موفقیت‌آمیز بود!');
        console.log('اطلاعات دیتابیس:', data);
      } else {
        alert('❌ خطا در اتصال به دیتابیس: ' + data.error);
      }
    } catch (error) {
      alert('❌ خطا در تست اتصال به دیتابیس');
      console.error('خطا:', error);
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

      {/* دکمه تست دیتابیس */}
      <button 
        onClick={testDatabaseConnection}
        className="back-button glass-card"
        style={{ top: '100px' }}
      >
        🗄️ تست اتصال دیتابیس
      </button>

      {/* کارت ثبت نام */}
      <div className="register-card glass-card">
        <div className="register-header">
          <div className="avatar-container">
            <div className="avatar">👤</div>
            <div className="avatar-ring"></div>
          </div>
          <h1 className="register-title">ثبت نام</h1>
          <p className="register-subtitle">حساب کاربری جدید ایجاد کنید</p>
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
              placeholder="نام کامل"
              required
              className="glass-input form-input"
              disabled={loading}
            />
          </div>

          {/* فیلد ایمیل */}
          <div className="form-group">
            <div className="form-icon">📧</div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="آدرس ایمیل"
              required
              className="glass-input form-input"
              disabled={loading}
            />
          </div>

          {/* فیلد رمز عبور */}
          <div className="form-group">
            <div className="form-icon">🔒</div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="رمز عبور (حداقل ۶ کاراکتر)"
              required
              minLength={6}
              className="glass-input form-input"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
              disabled={loading}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
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
              '🎯 ایجاد حساب کاربری'
            )}
          </button>
        </form>

        <div className="register-footer">
          <p>
            قبلاً حساب دارید؟{' '}
            <a 
              href="/login" 
              className="login-link"
              onClick={(e) => {
                e.preventDefault();
                router.push('/login');
              }}
            >
              وارد حساب شوید
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}