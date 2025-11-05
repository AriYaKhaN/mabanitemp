'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
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
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setError('');
        alert('✅ ورود با موفقیت انجام شد!');
        router.push('/dashboard');
      } else {
        setError(data.error || 'خطایی در ورود رخ داده است');
      }
    } catch (err) {
      console.error('خطا در ارسال درخواست:', err);
      setError('خطای شبکه رخ داده است. لطفا اتصال اینترنت را بررسی کنید.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
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

      {/* کارت ورود */}
      <div className="login-card glass-card">
        <div className="login-header">
          <div className="avatar-container">
            <div className="avatar">🔐</div>
            <div className="avatar-ring"></div>
          </div>
          <h1 className="login-title">ورود به حساب</h1>
          <p className="login-subtitle">خوش آمدید! لطفا وارد حساب خود شوید</p>
        </div>

        <form onSubmit={handleSubmit}>
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

          {/* لینک فراموشی رمز عبور */}
          <div className="forgot-password">
            <a 
              href="/forgot-password"
              onClick={(e) => {
                e.preventDefault();
                router.push('/forgot-password');
              }}
            >
              رمز عبور را فراموش کرده‌اید؟
            </a>
          </div>

          {/* نمایش خطا */}
          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}

          {/* دکمه ورود */}
          <button
            type="submit"
            disabled={loading}
            className="glass-button submit-button"
          >
            {loading ? (
              <span>
                در حال ورود
                <span className="loading-spinner"></span>
              </span>
            ) : (
              '🚀 ورود به حساب'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            حساب کاربری ندارید؟{' '}
            <a 
              href="/register" 
              className="register-link"
              onClick={(e) => {
                e.preventDefault();
                router.push('/register');
              }}
            >
              ثبت نام کنید
            </a>
          </p>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
          padding: 20px;
        }

        .floating-shapes {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .shape {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .shape-1 {
          width: 80px;
          height: 80px;
          top: 10%;
          left: 10%;
          animation: float 6s ease-in-out infinite;
        }

        .shape-2 {
          width: 120px;
          height: 120px;
          top: 60%;
          right: 10%;
          animation: float 8s ease-in-out infinite 1s;
        }

        .shape-3 {
          width: 60px;
          height: 60px;
          bottom: 20%;
          left: 20%;
          animation: float 5s ease-in-out infinite 0.5s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }

        .back-button {
          position: absolute;
          top: 30px;
          left: 30px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 12px 20px;
          border-radius: 12px;
          backdrop-filter: blur(10px);
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateX(-5px);
        }

        .login-card {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 40px;
          backdrop-filter: blur(20px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
          animation: slideUp 0.5s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .login-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .avatar-container {
          position: relative;
          display: inline-block;
          margin-bottom: 20px;
        }

        .avatar {
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          backdrop-filter: blur(10px);
        }

        .avatar-ring {
          position: absolute;
          top: -5px;
          left: -5px;
          right: -5px;
          bottom: -5px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.7; }
        }

        .login-title {
          color: white;
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 8px;
        }

        .login-subtitle {
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
        }

        .form-group {
          position: relative;
          margin-bottom: 20px;
        }

        .form-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 18px;
          z-index: 1;
        }

        .form-input {
          width: 100%;
          padding: 15px 15px 15px 50px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          color: white;
          font-size: 14px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .form-input:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.15);
        }

        .form-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .password-toggle {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          font-size: 16px;
          padding: 5px;
        }

        .password-toggle:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .forgot-password {
          text-align: left;
          margin-bottom: 20px;
        }

        .forgot-password a {
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          font-size: 14px;
          transition: color 0.3s ease;
        }

        .forgot-password a:hover {
          color: white;
          text-decoration: underline;
        }

        .error-message {
          background: rgba(255, 0, 0, 0.1);
          border: 1px solid rgba(255, 0, 0, 0.3);
          color: #ff6b6b;
          padding: 12px;
          border-radius: 12px;
          margin-bottom: 20px;
          font-size: 14px;
          backdrop-filter: blur(10px);
        }

        .submit-button {
          width: 100%;
          padding: 15px;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          color: white;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          margin-bottom: 20px;
        }

        .submit-button:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .loading-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 8px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .login-footer {
          text-align: center;
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
        }

        .register-link {
          color: white;
          text-decoration: none;
          font-weight: bold;
          transition: all 0.3s ease;
        }

        .register-link:hover {
          text-decoration: underline;
          color: #f0f0f0;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(20px);
        }

        .glass-input {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
        }

        .glass-button {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
        }
      `}</style>
    </div>
  );
}