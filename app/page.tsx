"use client"

import Link from 'next/link';
import { useRouter } from 'next/navigation';

// const Router = useRouter()

export default function HomePage() {
  return (
    <div className="home-container">
      {/* اشکال شناور در پس‌زمینه */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="hero-content">
        {/* آواتار */}
        <div className="hero-avatar">
          <div className="avatar">🚀</div>
        </div>

        {/* عنوان و توضیحات */}
        <h1 className="hero-title">
          به کلاس
          <br />
           مبانی کامپیوتر <br /> دکتر ساعدی
          <br />
         خوش آمدید
        </h1>

        <p className="hero-subtitle">
         سیستم مدیریت دانشجویان
        </p>

        {/* دکمه‌های اقدام */}
        <div className="cta-buttons">
          <Link href="/ta_register" className="cta-primary glass-button">
            🎯 ثبت نام
          </Link>
          <Link href="/login" className="cta-secondary glass-card">
            ورود به حساب
          </Link>
        </div>
        {/* ویژگی‌ها */}
        <div className="features-grid">
          {[
            {
              icon: '⚡',
              title: 'سکشن اول',
              desc: 'دوشنبه ساعت 13:15 الی 15:45',
              url : 'sec1'
            },
            {
              icon: '⚡',
              title: 'سکشم دوم',
              desc: 'دوشنبه ساعت 15:45 الی 18:30',
              url : 'sec2'
            },
            // {
            //   icon: '🎨',
            //   title: 'طراحی مدرن',
            //   desc: 'رابط کاربری زیبا و intuitive با افکت‌های پیشرفته'
            // },
          ].map((feature, index) => (
            // <a href={`/${feature.url}`}>
            <div key={index} onClick={()=>{
              // useRouter.push(`${feature.url}`)
            }} className="feature-card glass-card">
              <span className="feature-icon">{feature.icon}</span>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
            </div>
            // </a>

          ))}
        </div>
      </div>
    </div>
  );
}