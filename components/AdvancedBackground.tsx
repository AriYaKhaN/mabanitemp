// components/AdvancedBackground.tsx
import React from 'react';

type GradientDirection = 
  | 'to-t' 
  | 'to-tr' 
  | 'to-r' 
  | 'to-br' 
  | 'to-b' 
  | 'to-bl' 
  | 'to-l' 
  | 'to-tl';

interface BackgroundProps {
  children: React.ReactNode;
  className?: string;
  // رنگ‌های گرادینت
  fromColor?: string;
  toColor?: string;
  viaColor?: string;
  // جهت گرادینت
  gradientDirection?: GradientDirection;
  // تصویر بک‌گراند
  backgroundImage?: string;
  // overlay
  overlay?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
  // پترن
  pattern?: boolean;
  // ارتفاع
  fullScreen?: boolean;
}

const AdvancedBackground: React.FC<BackgroundProps> = ({
  children,
  className = '',
  fromColor = 'from-blue-500',
  toColor = 'to-purple-600',
  viaColor,
  gradientDirection = 'to-br',
  backgroundImage,
  overlay = false,
  overlayColor = 'black',
  overlayOpacity = 50,
  pattern = false,
  fullScreen = true
}) => {
  // ساخت استایل‌های داینامیک
  const backgroundStyle: React.CSSProperties = {};
  
  if (backgroundImage) {
    backgroundStyle.backgroundImage = `url(${backgroundImage})`;
    backgroundStyle.backgroundSize = 'cover';
    backgroundStyle.backgroundPosition = 'center';
  }

  // کلاس‌های گرادینت
  const gradientClasses = [
    'bg-gradient-to-br',
    `bg-gradient-${gradientDirection}`,
    fromColor,
    toColor,
    viaColor
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={`
        ${!backgroundImage ? gradientClasses : ''}
        ${pattern ? 'bg-pattern' : ''}
        ${fullScreen ? 'min-h-screen' : ''}
        relative
        ${className}
      `}
      style={backgroundImage ? backgroundStyle : undefined}
    >
      {/* Overlay */}
      {overlay && (
        <div 
          className={`absolute inset-0 bg-${overlayColor} bg-opacity-${overlayOpacity}`}
        />
      )}
      
      {/* محتوای اصلی */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AdvancedBackground;