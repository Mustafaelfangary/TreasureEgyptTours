'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  fallbackSrc?: string;
}

export default function OptimizedImage({
  src,
  alt,
  width = 800,
  height = 600,
  className = '',
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  fallbackSrc = '/images/default-placeholder.svg'
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Normalize the image path
  const normalizeSrc = (imageSrc: string) => {
    // If it's already a full path starting with /images/, return as is
    if (imageSrc.startsWith('/images/')) {
      return imageSrc;
    }
    
    // If it starts with /, assume it's missing the images prefix
    if (imageSrc.startsWith('/')) {
      return `/images${imageSrc}`;
    }
    
    // If it doesn't start with /, add the full path
    return `/images/${imageSrc}`;
  };

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const normalizedSrc = normalizeSrc(imgSrc);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <Image
        src={normalizedSrc}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onError={handleError}
        onLoad={handleLoad}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}

// Utility function to generate optimized image URLs
export const getOptimizedImageUrl = (src: string, options?: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png';
}) => {
  const { width = 800, height = 600, quality = 75, format = 'webp' } = options || {};
  
  // Normalize the source path
  let normalizedSrc = src;
  if (src.startsWith('/') && !src.startsWith('/images/')) {
    normalizedSrc = `/images${src}`;
  } else if (!src.startsWith('/')) {
    normalizedSrc = `/images/${src}`;
  }

  // For now, return the normalized path
  // In production, you might want to integrate with an image optimization service
  return normalizedSrc;
};

// Preload critical images
export const preloadImages = (imageUrls: string[]) => {
  imageUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = getOptimizedImageUrl(url);
    document.head.appendChild(link);
  });
};
