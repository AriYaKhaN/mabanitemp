// components/AnimatedBackground.tsx
'use client'; // برای Next.js با App Router

import React from 'react';

interface AnimatedBackgroundProps {
  children: React.ReactNode;
  animationType?: 'pulse' | 'float' | 'gradient' | 'particles';
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  children,
  animationType = 'gradient',
  speed = 'normal',
  className = ''
}) => {
  const getAnimationClass = (): string => {
    const speedClasses = {
      slow: 'animate-slow',
      normal: 'animate-normal', 
      fast: 'animate-fast'
    };

    const animationClasses = {
      pulse: 'animate-pulse',
      float: 'animate-float',
      gradient: 'animate-gradient',
      particles: 'animate-particles'
    };

    return `${animationClasses[animationType]} ${speedClasses[speed]}`;
  };

  return (
    <div className={`
      min-h-screen 
      bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500
      bg-300% 
      ${getAnimationClass()}
      ${className}
    `}>
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 15s ease infinite;
        }
        .animate-slow {
          animation-duration: 3s;
        }
        .animate-normal {
          animation-duration: 2s;
        }
        .animate-fast {
          animation-duration: 1s;
        }
      `}</style>
      {children}
    </div>
  );
};

export default AnimatedBackground;