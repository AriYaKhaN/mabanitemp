'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Home } from 'lucide-react';

export default function AdminLoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    taId: '' // اضافه کردن فیلد TA ID
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
      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // ذخیره اطلاعات ادمین در localStorage
        localStorage.setItem('admin', JSON.stringify(data.admin));
        alert('✅ ورود موفقیت‌آمیز!');
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'خطایی در ورود رخ داده است');
      }
    } catch (err) {
      setError('خطای شبکه رخ داده است');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <button 
        onClick={() => router.push('/')}
        className="back-button glass-card"
      >
        <Home></Home>
        {/* ← بازگشت به خانه */}
      </button>

      <div className="register-card glass-card">
        <div className="register-header">
          <div className="avatar-container">
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>👑</div>
            <div className="avatar-ring"></div>
          </div>
          <h1 className="register-title">ورود ادمین</h1>
          <p className="register-subtitle">پنل مدیریت TAها</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          {/* TA ID */}
          <div className="form-group">
            <div className="form-icon">🆔</div>
            <input
              type="number"
              name="taId"
              value={formData.taId}
              onChange={handleChange}
              placeholder="TA-id"
              required
              min="0"
              max="9"
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

          <button
            type="submit"
            disabled={loading}
            className="glass-button submit-button"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
          >
            {loading ? (
              <span>
                در حال ورود
                <span className="loading-spinner"></span>
              </span>
            ) : (
              '👑 ورود به پنل'
            )}
          </button>
        </form>

        {/* <div className="register-footer">
          <p className="text-white/70">
            حساب ندارید؟{' '}
            <button
              onClick={() => router.push('/admin/register')}
              className="text-yellow-300 hover:text-yellow-200 font-semibold transition-colors underline"
            >
              ثبت نام ادمین
            </button>
          </p>
        </div> */}
      </div>
    </div>
  );
}