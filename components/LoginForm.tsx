'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const Router = useRouter();
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
        Router.push('/dashboard');
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
        onClick={() => Router.push('/')}
        className="home-button"
        title="بازگشت به خانه"
      >
        🏠
      </button>

      {/* کارت ورود */}
      <div className="login-card">
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
              className="form-input"
              disabled={loading}
            />
          </div>

          {/* فیلد رمز عبور */}
          <div className="form-group password-group">
            <div className="form-icon">🔒</div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="رمز عبور"
              required
              className="form-input password-input"
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
                Router.push('/forgot-password');
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
            className="submit-button"
          >
            {loading ? (
              <span className="button-content">
                <span className="loading-spinner"></span>
                در حال ورود...
              </span>
            ) : (
              <span className="button-content">
                <span className="button-icon">🚀</span>
                ورود به حساب
              </span>
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
                Router.push('/ta_register');
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
          font-family: system-ui, -apple-system, sans-serif;
        }

        .floating-shapes {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          pointer-events: none;
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

        .home-button {
          position: fixed;
          top: 25px;
          right: 25px;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: white;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          backdrop-filter: blur(10px);
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 20px;
          font-weight: 500;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .home-button:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .login-card {
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 20px;
          padding: 40px 35px;
          backdrop-filter: blur(20px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 420px;
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
          margin-bottom: 32px;
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
          font-weight: 700;
          margin-bottom: 8px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .login-subtitle {
          color: rgba(255, 255, 255, 0.85);
          font-size: 15px;
          line-height: 1.5;
        }

        .form-group {
          position: relative;
          margin-bottom: 20px;
        }

        .password-group {
          position: relative;
        }

        .form-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 18px;
          z-index: 1;
          pointer-events: none;
        }

        .form-input {
          width: 100%;
          padding: 16px 16px 16px 50px;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 12px;
          color: white;
          font-size: 15px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .password-input {
          padding-right: 50px;
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.65);
        }

        .form-input:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.18);
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
        }

        .form-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          font-size: 18px;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .password-toggle:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          transform: translateY(-50%) scale(1.05);
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
          color: rgba(255, 255, 255, 0.85);
          text-decoration: none;
          font-size: 14px;
          transition: color 0.3s ease;
          font-weight: 500;
        }

        .forgot-password a:hover {
          color: white;
          text-decoration: underline;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fecaca;
          padding: 14px 16px;
          border-radius: 12px;
          margin-bottom: 20px;
          font-size: 14px;
          backdrop-filter: blur(10px);
          line-height: 1.5;
        }

        .submit-button {
          width: 100%;
          padding: 16px;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          margin-bottom: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .submit-button:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .submit-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .button-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .button-icon {
          font-size: 18px;
        }

        .loading-spinner {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .login-footer {
          text-align: center;
          color: rgba(255, 255, 255, 0.85);
          font-size: 15px;
          margin-top: 10px;
        }

        .register-link {
          color: white;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .register-link:hover {
          text-decoration: underline;
          color: #f8fafc;
        }

        /* بهبود نمایش در دستگاه‌های موبایل */
        @media (max-width: 480px) {
          .login-container {
            padding: 15px;
          }
          
          .login-card {
            padding: 30px 25px;
          }
          
          .home-button {
            top: 15px;
            right: 15px;
            width: 45px;
            height: 45px;
            font-size: 18px;
          }
          
          .login-title {
            font-size: 24px;
          }
          
          .form-input {
            padding: 14px 14px 14px 46px;
            font-size: 14px;
          }
          
          .password-input {
            padding-right: 46px;
          }
          
          .password-toggle {
            width: 32px;
            height: 32px;
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}