import type { ImgHTMLAttributes } from 'react';
import styles from './blendedImage.module.scss';
/**
 * A custom image component that wraps images in a vignette container.
 */
export default function BlendedImage(
  props: ImgHTMLAttributes<HTMLImageElement>
) {
  return (
    <div
      className={styles['vignette-img']}
      style={{ '--bg-image': `url(${props.src})` } as React.CSSProperties}>
      <img {...props} />
    </div>
  );
}
