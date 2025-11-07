'use client'

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import './WindowFloat.css';

// تعریف انواع (Types)
interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface WindowFloatProps {
  title?: string;
  children: ReactNode;
  initialPosition?: Position;
  initialSize?: Size;
  minSize?: Size;
  maxSize?: Size;
  resizable?: boolean;
  draggable?: boolean;
  closable?: boolean;
  minimizable?: boolean;
  maximizable?: boolean;
  onClose?: () => void;
  onMinimize?: (minimized: boolean) => void;
  onMaximize?: (maximized: boolean) => void;
  onResize?: (size: Size) => void;
  onDrag?: (position: Position) => void;
  className?: string;
  zIndex?: number;
  defaultMinimized?: boolean;
  defaultMaximized?: boolean;
}

const WindowFloat: React.FC<WindowFloatProps> = ({
  title = 'پنجره شناور',
  children,
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 400, height: 300 },
  minSize = { width: 200, height: 150 },
  maxSize = { width: 800, height: 600 },
  resizable = true,
  draggable = true,
  closable = true,
  minimizable = true,
  maximizable = true,
  onClose,
  onMinimize,
  onMaximize,
  onResize,
  onDrag,
  className = '',
  zIndex = 1000,
  defaultMinimized = false,
  defaultMaximized = false
}) => {
  const [position, setPosition] = useState<Position>(initialPosition);
  const [size, setSize] = useState<Size>(initialSize);
  const [isMinimized, setIsMinimized] = useState<boolean>(defaultMinimized);
  const [isMaximized, setIsMaximized] = useState<boolean>(defaultMaximized);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [resizeDirection, setResizeDirection] = useState<string>('');
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [zIndexValue, setZIndexValue] = useState<number>(zIndex);

  const windowRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef<Position>({ x: 0, y: 0 });
  const originalSize = useRef<Size>(size);
  const originalPosition = useRef<Position>(position);

  // فعال کردن پنجره هنگام کلیک
  const activateWindow = (): void => {
    setZIndexValue(prev => prev + 1);
  };

  // مدیریت درگ کردن
  const handleMouseDown = (e: React.MouseEvent): void => {
    if (!draggable || isMaximized) return;
    
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    activateWindow();
    e.stopPropagation();
  };

  // مدیریت رسیز کردن
  const handleResizeMouseDown = (direction: string, e: React.MouseEvent): void => {
    if (!resizable || isMaximized) return;
    
    setIsResizing(true);
    setResizeDirection(direction);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    originalSize.current = { ...size };
    originalPosition.current = { ...position };
    activateWindow();
    e.stopPropagation();
  };

  // مدیریت حرکت موس
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent): void => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        // محدود کردن به مرزهای صفحه
        const boundedX = Math.max(0, newX);
        const boundedY = Math.max(0, newY);
        
        setPosition({ x: boundedX, y: boundedY });
        
        if (onDrag) {
          onDrag({ x: boundedX, y: boundedY });
        }
      } else if (isResizing) {
        const deltaX = e.clientX - dragStartPos.current.x;
        const deltaY = e.clientY - dragStartPos.current.y;
        
        let newWidth = originalSize.current.width;
        let newHeight = originalSize.current.height;
        let newX = originalPosition.current.x;
        let newY = originalPosition.current.y;

        // محاسبه اندازه جدید بر اساس جهت رسیز
        if (resizeDirection.includes('e')) {
          newWidth = Math.max(minSize.width, Math.min(maxSize.width, originalSize.current.width + deltaX));
        }
        if (resizeDirection.includes('s')) {
          newHeight = Math.max(minSize.height, Math.min(maxSize.height, originalSize.current.height + deltaY));
        }
        if (resizeDirection.includes('w')) {
          const widthChange = originalSize.current.width - Math.max(minSize.width, Math.min(maxSize.width, originalSize.current.width - deltaX));
          newWidth = originalSize.current.width - widthChange;
          newX = originalPosition.current.x + widthChange;
        }
        if (resizeDirection.includes('n')) {
          const heightChange = originalSize.current.height - Math.max(minSize.height, Math.min(maxSize.height, originalSize.current.height - deltaY));
          newHeight = originalSize.current.height - heightChange;
          newY = originalPosition.current.y + heightChange;
        }

        setSize({ width: newWidth, height: newHeight });
        setPosition({ x: newX, y: newY });
        
        if (onResize) {
          onResize({ width: newWidth, height: newHeight });
        }
      }
    };

    const handleMouseUp = (): void => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, resizeDirection, dragOffset, minSize, maxSize, onDrag, onResize]);

  // مدیریت دکمه‌های پنجره
  const handleMinimize = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
    if (onMinimize) onMinimize(!isMinimized);
  };

  const handleMaximize = (e: React.MouseEvent): void => {
    e.stopPropagation();
    if (isMaximized) {
      // بازگشت به اندازه و موقعیت قبلی
      setSize(originalSize.current);
      setPosition(originalPosition.current);
    } else {
      // ذخیره اندازه و موقعیت فعلی
      originalSize.current = { ...size };
      originalPosition.current = { ...position };
      
      // بزرگ کردن به اندازه صفحه
      setSize({
        width: window.innerWidth - 20,
        height: window.innerHeight - 20
      });
      setPosition({ x: 10, y: 10 });
    }
    
    setIsMaximized(!isMaximized);
    if (onMaximize) onMaximize(!isMaximized);
  };

  const handleClose = (e: React.MouseEvent): void => {
    e.stopPropagation();
    if (onClose) onClose();
  };

  // استایل‌های دینامیک
  const windowStyle: React.CSSProperties = {
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: isMinimized ? 'auto' : `${size.width}px`,
    height: isMinimized ? 'auto' : `${size.height}px`,
    zIndex: zIndexValue,
    display: isMinimized ? 'none' : 'block'
  };

  if (isMaximized) {
    windowStyle.left = '10px';
    windowStyle.top = '10px';
    windowStyle.width = `calc(100vw - 20px)`;
    windowStyle.height = `calc(100vh - 20px)`;
  }

  return (
    <div 
      ref={windowRef}
      className={`window-float ${className} ${isMaximized ? 'maximized' : ''}`}
      style={windowStyle}
      onClick={activateWindow}
    >
      {/* هدر پنجره */}
      <div 
        className="window-header"
        onMouseDown={handleMouseDown}
      >
        <div className="window-title">{title}</div>
        <div className="window-controls">
          {minimizable && (
            <button 
              className="window-control minimize"
              onClick={handleMinimize}
              aria-label="کوچک کردن"
            >
              &#8212;
            </button>
          )}
          {maximizable && (
            <button 
              className="window-control maximize"
              onClick={handleMaximize}
              aria-label={isMaximized ? "بازگرداندن" : "بزرگ کردن"}
            >
              {isMaximized ? '⧉' : '□'}
            </button>
          )}
          {closable && (
            <button 
              className="window-control close"
              onClick={handleClose}
              aria-label="بستن"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {/* محتوای پنجره */}
      {!isMinimized && (
        <div className="window-content">
          {children}
        </div>
      )}

      {/* کنترل‌های تغییر اندازه */}
      {resizable && !isMaximized && !isMinimized && (
        <>
          <div className="resize-handle n" onMouseDown={(e) => handleResizeMouseDown('n', e)}></div>
          <div className="resize-handle e" onMouseDown={(e) => handleResizeMouseDown('e', e)}></div>
          <div className="resize-handle s" onMouseDown={(e) => handleResizeMouseDown('s', e)}></div>
          <div className="resize-handle w" onMouseDown={(e) => handleResizeMouseDown('w', e)}></div>
          <div className="resize-handle ne" onMouseDown={(e) => handleResizeMouseDown('ne', e)}></div>
          <div className="resize-handle nw" onMouseDown={(e) => handleResizeMouseDown('nw', e)}></div>
          <div className="resize-handle se" onMouseDown={(e) => handleResizeMouseDown('se', e)}></div>
          <div className="resize-handle sw" onMouseDown={(e) => handleResizeMouseDown('sw', e)}></div>
        </>
      )}
    </div>
  );
};

export default WindowFloat;