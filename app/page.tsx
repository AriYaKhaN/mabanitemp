import Link from 'next/link';

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
          به دنیای مدرن
          <br />
          ما خوش آمدید
        </h1>

        <p className="hero-subtitle">
          با طراحی‌های پیشرفته و تجربه کاربری بی‌نظیر، سفری جذاب را در پلتفرم ما آغاز کنید
        </p>

        {/* دکمه‌های اقدام */}
        <div className="cta-buttons">
          <Link href="/ta_register" className="cta-primary glass-button">
            🎯 شروع کنید
          </Link>
          <Link href="/login" className="cta-secondary glass-card">
            ورود به حساب
          </Link>
        </div>
        {/* ویژگی‌ها */}
        <div className="features-grid">
          {[
            {
              icon: '🔐',
              title: 'امنیت پیشرفته',
              desc: 'اطلاعات شما با آخرین تکنولوژی‌های امنیتی محافظت می‌شود'
            },
            {
              icon: '⚡',
              title: 'سرعت فوق‌العاده',
              desc: 'تجربه کاربری سریع و روان با بهینه‌سازی پیشرفته'
            },
            {
              icon: '🎨',
              title: 'طراحی مدرن',
              desc: 'رابط کاربری زیبا و intuitive با افکت‌های پیشرفته'
            },
          ].map((feature, index) => (
            <div key={index} className="feature-card glass-card">
              <span className="feature-icon">{feature.icon}</span>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.desc}</p>
            </div>

          ))}
        </div>
      </div>
    </div>
  );
}