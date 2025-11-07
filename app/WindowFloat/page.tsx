// src/pages/WindowFloatShowcase.tsx
"use client";

import React, { useState } from 'react';
import WindowFloat from '@/components/WindowFloat';
import './WindowFloatShowcase.css';

// تعریف انواع TypeScript
interface WindowInstance {
  id: number;
  title: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  features: string[];
  content: React.ReactNode;
}

const WindowFloatShowcase: React.FC = () => {
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [activeDemo, setActiveDemo] = useState<string>('');

  // ایجاد پنجره نمایشی
  const createDemoWindow = (demoType: string): void => {
    const basePosition = { x: 100 + (windows.length * 30), y: 100 + (windows.length * 30) };
    
    const demos: Record<string, Omit<WindowInstance, 'id'>> = {
      basic: {
        title: '🧩 پنجره پایه',
        type: 'basic',
        position: basePosition,
        size: { width: 400, height: 300 },
        features: ['جابجایی', 'بستن'],
        content: (
          <div className="demo-content">
            <h3>پنجره ساده</h3>
            <p>این یک پنجره پایه با قابلیت‌های اصلی است.</p>
            <ul>
              <li>✅ قابلیت جابجایی</li>
              <li>✅ دکمه بستن</li>
              <li>✅ نمایش محتوا</li>
            </ul>
          </div>
        )
      },
      resizable: {
        title: '📏 پنجره قابل تغییر اندازه',
        type: 'resizable',
        position: basePosition,
        size: { width: 500, height: 400 },
        features: ['جابجایی', 'تغییر اندازه', 'کوچک/بزرگ کردن', 'بستن'],
        content: (
          <div className="demo-content">
            <h3>تغییر اندازه پیشرفته</h3>
            <p>این پنجره را می‌توانید از تمام جهات تغییر اندازه دهید.</p>
            <div className="resize-guide">
              <p>🔄 از گوشه‌ها و لبه‌ها برای تغییر اندازه استفاده کنید</p>
              <p>📐 حداقل اندازه: 200x150 پیکسل</p>
              <p>📏 حداکثر اندازه: 800x600 پیکسل</p>
            </div>
          </div>
        )
      },
      minimized: {
        title: '📌 پنجره کوچک شده',
        type: 'minimized',
        position: basePosition,
        size: { width: 350, height: 250 },
        features: ['جابجایی', 'کوچک کردن', 'بستن'],
        content: (
          <div className="demo-content">
            <h3>حالت کوچک شده</h3>
            <p>این پنجره را می‌توانید با دکمه − کوچک کنید.</p>
            <p>پس از کوچک کردن، فقط هدر پنجره نمایش داده می‌شود.</p>
          </div>
        )
      },
      maximized: {
        title: '🖥️ پنجره بزرگ شده',
        type: 'maximized',
        position: basePosition,
        size: { width: 600, height: 500 },
        features: ['جابجایی', 'بزرگ کردن', 'بستن'],
        content: (
          <div className="demo-content">
            <h3>حالت تمام صفحه</h3>
            <p>با کلیک روی دکمه □ می‌توانید پنجره را بزرگ کنید.</p>
            <p>در حالت بزرگ شده، پنجره کل صفحه را می‌پوشاند.</p>
          </div>
        )
      },
      custom: {
        title: '🎨 پنجره سفارشی',
        type: 'custom',
        position: basePosition,
        size: { width: 450, height: 350 },
        features: ['جابجایی', 'تغییر اندازه', 'کوچک/بزرگ کردن', 'بستن', 'طرح سفارشی'],
        content: (
          <div className="demo-content">
            <h3>پنجره سفارشی</h3>
            <p>این پنجره با استایل‌های خاص طراحی شده است.</p>
            <div className="custom-features">
              <div className="feature-item">✨ طراحی مدرن</div>
              <div className="feature-item">🎯 انیمیشن نرم</div>
              <div className="feature-item">📱 واکنش‌گرا</div>
            </div>
          </div>
        )
      },
      multiple: {
        title: '🔢 مدیریت چندین پنجره',
        type: 'multiple',
        position: basePosition,
        size: { width: 400, height: 300 },
        features: ['z-index مدیریت', 'چند پنجره همزمان'],
        content: (
          <div className="demo-content">
            <h3>مدیریت چندین پنجره</h3>
            <p>می‌توانید چندین پنجره همزمان باز کنید.</p>
            <p>با کلیک روی هر پنجره، به foreground می‌آید.</p>
          </div>
        )
      }
    };

    const demo = demos[demoType];
    if (demo) {
      const newWindow: WindowInstance = {
        id: Date.now() + Math.random(),
        ...demo
      };
      setWindows(prev => [...prev, newWindow]);
      setActiveDemo(demoType);
    }
  };

  // بستن پنجره
  const closeWindow = (id: number): void => {
    setWindows(prev => prev.filter(window => window.id !== id));
  };

  // بستن همه پنجره‌ها
  const closeAllWindows = (): void => {
    setWindows([]);
    setActiveDemo('');
  };

  // مدیریت رویدادهای پنجره
  const handleWindowEvent = (windowId: number, eventType: string, data: any): void => {
    console.log(`Window ${windowId} ${eventType}:`, data);
    
    // نمایش نوتیفیکیشن برای برخی رویدادها
    if (eventType === 'close') {
      // نوتیفیکیشن به صورت خودکار توسط state مدیریت می‌شود
    }
  };

  // محتوای نمایش ویژگی‌ها
  const FeatureCard: React.FC<{ title: string; description: string; icon: string; onClick: () => void }> = ({
    title,
    description,
    icon,
    onClick
  }) => (
    <div className="feature-card" onClick={onClick}>
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <button className="demo-button">مشاهده دمو</button>
    </div>
  );

  return (
    <div className="showcase-page">
      {/* هدر صفحه */}
      <header className="showcase-header">
        <div className="container">
          <h1>🪟 نمایشگاه کامپوننت WindowFloat</h1>
          <p>یک کامپوننت پنجره شناور مدرن و کامل برای React</p>
        </div>
      </header>

      {/* محتوای اصلی */}
      <main className="showcase-main">
        <div className="container">
          {/* معرفی */}
          <section className="intro-section">
            <h2>🚀 ویژگی‌های اصلی</h2>
            <div className="features-overview">
              <div className="feature-badge">🎯 جابجایی</div>
              <div className="feature-badge">📏 تغییر اندازه</div>
              <div className="feature-badge">📌 کوچک کردن</div>
              <div className="feature-badge">🖥️ بزرگ کردن</div>
              <div className="feature-badge">❌ بستن</div>
              <div className="feature-badge">🎨 z-index مدیریت</div>
              <div className="feature-badge">📱 واکنش‌گرا</div>
              <div className="feature-badge">✨ انیمیشن</div>
            </div>
          </section>

          {/* دموهای تعاملی */}
          <section className="demos-section">
            <h2>🎮 دموهای تعاملی</h2>
            <div className="demos-grid">
              <FeatureCard
                title="پنجره پایه"
                description="یک پنجره ساده با قابلیت‌های اصلی"
                icon="🧩"
                onClick={() => createDemoWindow('basic')}
              />
              
              <FeatureCard
                title="تغییر اندازه"
                description="قابلیت تغییر اندازه از تمام جهات"
                icon="📏"
                onClick={() => createDemoWindow('resizable')}
              />
              
              <FeatureCard
                title="حالت‌های مختلف"
                description="کوچک و بزرگ کردن پنجره"
                icon="📌"
                onClick={() => createDemoWindow('minimized')}
              />
              
              <FeatureCard
                title="مدیریت چند پنجره"
                description="باز کردن و مدیریت چندین پنجره همزمان"
                icon="🔢"
                onClick={() => createDemoWindow('multiple')}
              />
              
              <FeatureCard
                title="پنجره سفارشی"
                description="پنجره با استایل و محتوای دلخواه"
                icon="🎨"
                onClick={() => createDemoWindow('custom')}
              />
              
              <FeatureCard
                title="همه ویژگی‌ها"
                description="نمایش تمام قابلیت‌ها در یک پنجره"
                icon="🔄"
                onClick={() => createDemoWindow('maximized')}
              />
            </div>
          </section>

          {/* کنترل‌های صفحه */}
          <section className="controls-section">
            <h2>🎛️ کنترل‌های صفحه</h2>
            <div className="page-controls">
              <button 
                className="control-btn danger" 
                onClick={closeAllWindows}
                disabled={windows.length === 0}
              >
                ❌ بستن همه پنجره‌ها
              </button>
              
              <button 
                className="control-btn secondary"
                onClick={() => {
                  createDemoWindow('basic');
                  createDemoWindow('resizable');
                  createDemoWindow('custom');
                }}
              >
                🔄 باز کردن چندین دمو
              </button>
            </div>
          </section>

          {/* وضعیت فعلی */}
          <section className="status-section">
            <h2>📊 وضعیت فعلی</h2>
            <div className="status-grid">
              <div className="status-card">
                <span className="status-number">{windows.length}</span>
                <span className="status-label">پنجره‌های باز</span>
              </div>
              <div className="status-card">
                <span className="status-number">
                  {windows.filter(w => w.type === 'resizable').length}
                </span>
                <span className="status-label">قابل تغییر اندازه</span>
              </div>
              <div className="status-card">
                <span className="status-number">
                  {windows.filter(w => w.type === 'multiple').length}
                </span>
                <span className="status-label">مدیریت چندتایی</span>
              </div>
            </div>
          </section>

          {/* راهنمای استفاده */}
          <section className="guide-section">
            <h2>📖 راهنمای استفاده</h2>
            <div className="guide-content">
              <div className="guide-item">
                <strong>🖱️ جابجایی:</strong> روی هدر پنجره کلیک کرده و بکشید
              </div>
              <div className="guide-item">
                <strong>📏 تغییر اندازه:</strong> از گوشه‌ها یا لبه‌های پنجره استفاده کنید
              </div>
              <div className="guide-item">
                <strong>📌 کوچک کردن:</strong> از دکمه − در هدر استفاده کنید
              </div>
              <div className="guide-item">
                <strong>🖥️ بزرگ کردن:</strong> از دکمه □ در هدر استفاده کنید
              </div>
              <div className="guide-item">
                <strong>❌ بستن:</strong> از دکمه × در هدر استفاده کنید
              </div>
              <div className="guide-item">
                <strong>🎯 فعال سازی:</strong> روی هر پنجره کلیک کنید تا به foreground بیاید
              </div>
            </div>
          </section>

          {/* اطلاعات فنی */}
          <section className="technical-section">
            <h2>⚙️ اطلاعات فنی</h2>
            <div className="technical-info">
              <div className="tech-item">
                <strong>تکنولوژی:</strong> React + TypeScript
              </div>
              <div className="tech-item">
                <strong>استایل:</strong> CSS Modules + Modern CSS
              </div>
              <div className="tech-item">
                <strong>قابلیت‌ها:</strong> Draggable, Resizable, Minimizable, Maximizable
              </div>
              <div className="tech-item">
                <strong>واکنش‌گرایی:</strong> پشتیبانی از موبایل و تبلت
              </div>
              <div className="tech-item">
                <strong>دسترسی‌پذیری:</strong> ARIA labels + Keyboard Navigation
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* فوتر */}
      <footer className="showcase-footer">
        <div className="container">
          <p>© 2024 کامپوننت WindowFloat - ساخته شده با ❤️ و React</p>
        </div>
      </footer>

      {/* رندر پنجره‌های نمایشی */}
      {windows.map((window, index) => (
        <WindowFloat
          key={window.id}
          title={window.title}
          initialPosition={window.position}
          initialSize={window.size}
          minSize={{ width: 200, height: 150 }}
          maxSize={{ width: 800, height: 600 }}
          resizable={window.type === 'resizable' || window.type === 'custom'}
          draggable={true}
          closable={true}
          minimizable={true}
          maximizable={true}
          onClose={() => {
            closeWindow(window.id);
            handleWindowEvent(window.id, 'close', null);
          }}
          onMinimize={(minimized) => handleWindowEvent(window.id, 'minimize', { minimized })}
          onMaximize={(maximized) => handleWindowEvent(window.id, 'maximize', { maximized })}
          onResize={(size) => handleWindowEvent(window.id, 'resize', size)}
          onDrag={(position) => handleWindowEvent(window.id, 'drag', position)}
          zIndex={1000 + index}
          className={`demo-window ${window.type}`}
        >
          {window.content}
        </WindowFloat>
      ))}
    </div>
  );
};

export default WindowFloatShowcase;