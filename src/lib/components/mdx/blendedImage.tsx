import type { ImgHTMLAttributes } from 'react';

/**
 * A custom image component that wraps images in a vignette container.
 */
export default function BlendedImage(
  props: ImgHTMLAttributes<HTMLImageElement>
) {
  return (
    <div className='vignette-img'>
      <img {...props} />
    </div>
  );
}
