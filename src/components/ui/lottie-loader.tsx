import React from 'react';
import { cn } from '@/lib/utils';

interface LottieLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
  variant?: 'default' | 'lab' | 'tasting' | 'processing';
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24'
};

const textSizes = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg'
};

// SVG-based Lottie-style animations using CSS
const LoadingAnimations = {
  default: (size: string) => (
    <div className={cn('relative', size)}>
      <svg
        className="animate-spin text-beer-medium"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  ),

  lab: (size: string) => (
    <div className={cn('relative', size)}>
      <svg
        viewBox="0 0 100 100"
        className="text-beer-medium"
        aria-hidden="true"
      >
        {/* Flask animation */}
        <g className="animate-pulse">
          <path
            d="M35 20 L35 35 L25 55 L75 55 L65 35 L65 20 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="opacity-60"
          />
          <circle cx="50" cy="45" r="3" fill="currentColor" className="animate-bounce">
            <animate attributeName="cy" values="40;50;40" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="45" cy="48" r="2" fill="currentColor" className="animate-bounce">
            <animate attributeName="cy" values="43;53;43" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="55" cy="47" r="2" fill="currentColor" className="animate-bounce">
            <animate attributeName="cy" values="42;52;42" dur="1.3s" repeatCount="indefinite" />
          </circle>
        </g>
        {/* Bubbles */}
        <g className="opacity-40">
          <circle cx="40" cy="50" r="1" fill="currentColor">
            <animate attributeName="r" values="1;3;1" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="60" cy="48" r="1" fill="currentColor">
            <animate attributeName="r" values="1;2;1" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
    </div>
  ),

  tasting: (size: string) => (
    <div className={cn('relative', size)}>
      <svg
        viewBox="0 0 100 100"
        className="text-beer-medium"
        aria-hidden="true"
      >
        {/* Beer glass animation */}
        <g>
          <path
            d="M30 25 L30 75 L70 75 L70 25 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="opacity-60"
          />
          {/* Beer liquid */}
          <rect x="32" y="60" width="36" height="13" fill="currentColor" className="opacity-30">
            <animate attributeName="height" values="5;15;5" dur="2s" repeatCount="indefinite" />
            <animate attributeName="y" values="68;58;68" dur="2s" repeatCount="indefinite" />
          </rect>
          {/* Foam bubbles */}
          <circle cx="40" cy="30" r="2" fill="currentColor" className="opacity-50">
            <animate attributeName="cy" values="30;35;30" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="50" cy="28" r="3" fill="currentColor" className="opacity-40">
            <animate attributeName="cy" values="28;33;28" dur="1.8s" repeatCount="indefinite" />
          </circle>
          <circle cx="60" cy="31" r="2" fill="currentColor" className="opacity-50">
            <animate attributeName="cy" values="31;36;31" dur="1.3s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
    </div>
  ),

  processing: (size: string) => (
    <div className={cn('relative', size)}>
      <svg
        viewBox="0 0 100 100"
        className="text-beer-medium"
        aria-hidden="true"
      >
        {/* Gear animation */}
        <g className="animate-spin" style={{ transformOrigin: '50px 50px' }}>
          <path
            d="M50 10 L55 20 L65 15 L70 25 L80 30 L75 40 L85 45 L80 55 L70 60 L75 70 L65 75 L55 65 L50 75 L45 65 L35 70 L30 60 L20 55 L25 45 L15 40 L20 30 L30 25 L25 15 L35 10 L45 20 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="opacity-60"
          />
          <circle cx="50" cy="50" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
        </g>
        {/* Center dot */}
        <circle cx="50" cy="50" r="3" fill="currentColor" className="animate-pulse" />
      </svg>
    </div>
  )
};

export function LottieLoader({ 
  size = 'md', 
  text, 
  className, 
  variant = 'default' 
}: LottieLoaderProps) {
  const sizeClass = sizeClasses[size];
  const textSizeClass = textSizes[size];
  const animation = LoadingAnimations[variant];

  return (
    <div 
      className={cn('flex flex-col items-center justify-center gap-3', className)}
      role="status"
      aria-live="polite"
      aria-label={text || 'Carregando...'}
    >
      {animation(sizeClass)}
      {text && (
        <p className={cn('font-medium text-beer-dark animate-pulse', textSizeClass)}>
          {text}
        </p>
      )}
      <span className="sr-only">Carregando...</span>
    </div>
  );
}