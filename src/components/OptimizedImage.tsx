import React, { useState, useEffect } from 'react';

const globalLoadedImages = new Set<string>();

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const isAlreadyLoaded = globalLoadedImages.has(src);
  const [isLoaded, setIsLoaded] = useState(isAlreadyLoaded);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) return;
    if (globalLoadedImages.has(src)) {
      setIsLoaded(true);
      return;
    }

    setIsLoaded(false);
    setHasError(false);

    // Preload image in memory
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
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-[#FAF8F5] ${containerClassName}`}>
      {/* Luxury Skeleton Shimmer while loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#FAF8F5] via-[#EFEAE2] to-[#FAF8F5] animate-pulse" />
      )}

      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => {
          globalLoadedImages.add(src);
          setIsLoaded(true);
        }}
        onError={() => setHasError(true)}
        className={`${className} transition-opacity duration-500 ease-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
};
