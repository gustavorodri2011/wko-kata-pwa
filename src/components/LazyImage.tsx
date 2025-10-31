import { useState } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: React.ReactNode;
}

export const LazyImage = ({ src, alt, className = '', placeholder }: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { elementRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px'
  });

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div ref={elementRef} className={`relative ${className}`}>
      {!hasIntersected ? (
        placeholder || (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        )
      ) : (
        <>
          {!isLoaded && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
          )}
          {!hasError && (
            <img
              src={src}
              alt={alt}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={handleLoad}
              onError={handleError}
              loading="lazy"
            />
          )}
          {hasError && (
            <div className="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
              <span className="text-gray-500 text-sm">Error al cargar</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};