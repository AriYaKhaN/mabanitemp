// components/PatternBackground.tsx
import React from 'react';

interface PatternBackgroundProps {
  children: React.ReactNode;
  patternType?: 'dots' | 'grid' | 'lines' | 'circles';
  patternColor?: string;
  patternOpacity?: number;
  backgroundColor?: string;
  className?: string;
}

const PatternBackground: React.FC<PatternBackgroundProps> = ({
  children,
  patternType = 'dots',
  patternColor = 'gray',
  patternOpacity = 10,
  backgroundColor = 'white',
  className = ''
}) => {
  const getPatternStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      backgroundColor,
      position: 'relative'
    };

    // استایل‌های مختلف پترن
    const patterns = {
      dots: {
        backgroundImage: `radial-gradient(${patternColor} ${patternOpacity}%, transparent 1%)`,
        backgroundSize: '50px 50px',
        backgroundPosition: '0 0'
      },
      grid: {
        backgroundImage: `
          linear-gradient(to right, ${patternColor}${patternOpacity} 1px, transparent 1px),
          linear-gradient(to bottom, ${patternColor}${patternOpacity} 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      },
      lines: {
        backgroundImage: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 20px,
          ${patternColor}${patternOpacity} 20px,
          ${patternColor}${patternOpacity} 21px
        )`
      },
      circles: {
        backgroundImage: `
          radial-gradient(circle at 25px 25px, ${patternColor}${patternOpacity} 2%, transparent 3%),
          radial-gradient(circle at 75px 75px, ${patternColor}${patternOpacity} 2%, transparent 3%)
        `,
        backgroundSize: '100px 100px'
      }
    };

    return { ...baseStyle, ...patterns[patternType] };
  };

  return (
    <div 
      style={getPatternStyle()}
      className={`min-h-screen ${className}`}
    >
      {children}
    </div>
  );
};

export default PatternBackground;