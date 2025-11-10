'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Home } from 'lucide-react';

export default function AdminRegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
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
      const response = await fetch('/api/auth/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ ادمین با موفقیت ثبت نام شد!');
        router.push('/login');
      } else {
        setError(data.error || 'خطایی در ثبت نام ادمین رخ داده است');
      }
    } catch (err) {
      setError('خطای شبکه رخ داده است');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* اشکال شناور */}
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
        <Home></Home>
        {/* ← بازگشت به خانه */}
      </button>

      {/* کارت ثبت نام ادمین */}
      <div className="register-card glass-card">
        <div className="register-header">
          <div className="avatar-container">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>👑</div>
            <div className="avatar-ring"></div>
          </div>
          <h1 className="register-title">ثبت نام ادمین</h1>
          <p className="register-subtitle">سیستم مدیریت پنل ادمین</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* نام و نام خانوادگی */}
          <div className="form-group">
            <div className="form-icon">👤</div>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="نام و نام خانوادگی"
              required
              className="glass-input form-input"
              disabled={loading}
            />
          </div>

          {/* ایمیل */}
          <div className="form-group">
            <div className="form-icon">📧</div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ایمیل"
              required
              className="glass-input form-input"
              disabled={loading}
            />
          </div>

          {/* رمز عبور */}
          <div className="form-group">
            <div className="form-icon">🔒</div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="رمز عبور"
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
              ⚠️ {error}
            </div>
          )}

          {/* دکمه ثبت نام */}
          <button
            type="submit"
            disabled={loading}
            className="glass-button submit-button"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
          >
            {loading ? (
              <span>
                در حال ایجاد ادمین
                <span className="loading-spinner"></span>
              </span>
            ) : (
              '👑 ایجاد حساب ادمین'
            )}
          </button>
        </form>

        <div className="register-footer">
          <p className="text-white/60 text-sm">
            💡لطفا تا تایید رول شما توسط تیم میریت صبور باشید
          </p>
        </div>
      </div>
    </div>
  );
}