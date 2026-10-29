import React, { useState, useEffect, useRef } from 'react';

// Global cache for images loaded during the session so re-visits render in 0ms
const globalLoadedImages = new Set<string>();

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  priority = false,
  ...props
}) => {
  const isAlreadyCached = Boolean(src && globalLoadedImages.has(src));
  const [isInView, setIsInView] = useState(priority || isAlreadyCached);
  const [isLoaded, setIsLoaded] = useState(isAlreadyCached);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 1. Intersection Observer: Only activate image loading when within 250px of viewport
  useEffect(() => {
    if (priority || isAlreadyCached || isInView) return;

    if (!containerRef.current) return;

    // If IntersectionObserver is not supported, load immediately
    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '250px 0px' }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [priority, isAlreadyCached, isInView]);

  // 2. Preload & verify image once in view
  useEffect(() => {
    if (!src || !isInView) return;

    if (globalLoadedImages.has(src)) {
      setIsLoaded(true);
      return;
    }

    setIsLoaded(false);
    setHasError(false);

    const img = new Image();
    img.src = src;

    if (img.complete && img.naturalWidth > 0) {
      globalLoadedImages.add(src);
      setIsLoaded(true);
    } else {
      img.onload = () => {
        globalLoadedImages.add(src);
        setIsLoaded(true);
      };
      img.onerror = () => {
        setHasError(true);
      };
    }
  }, [src, isInView]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-[#FAF8F5] ${containerClassName}`}
    >
      {/* Luxury Skeleton Shimmer while waiting for viewport or download */}
      {(!isLoaded || !isInView) && !hasError && (
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#FAF8F5] via-[#EFEAE2] to-[#FAF8F5] animate-pulse pointer-events-none" />
      )}

      {/* Render actual <img> element only when near viewport or prioritized */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'low'}
          onLoad={() => {
            globalLoadedImages.add(src);
            setIsLoaded(true);
          }}
          onError={() => setHasError(true)}
          className={`${className} transition-opacity duration-300 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...props}
        />
      )}
    </div>
  );
};
