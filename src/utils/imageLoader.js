// Custom image loader for Next.js with error handling
export default function imageLoader({ src, width, quality }) {
  // Normalize the source path
  let normalizedSrc = src;
  
  // If it's already a full path starting with /images/, return as is
  if (src.startsWith('/images/')) {
    normalizedSrc = src;
  }
  // If it starts with /, assume it's missing the images prefix
  else if (src.startsWith('/')) {
    normalizedSrc = `/images${src}`;
  }
  // If it doesn't start with /, add the full path
  else {
    normalizedSrc = `/images/${src}`;
  }

  // For local images, use the API route for optimization
  if (normalizedSrc.startsWith('/images/')) {
    const params = new URLSearchParams({
      path: normalizedSrc.replace('/images/', ''),
      width: width.toString(),
      quality: (quality || 75).toString()
    });
    
    return `/api/image?${params.toString()}`;
  }

  // For external images, use Next.js default optimization
  return `${normalizedSrc}?w=${width}&q=${quality || 75}`;
}
