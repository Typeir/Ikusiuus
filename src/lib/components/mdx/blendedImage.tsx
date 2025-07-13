import type { ImgHTMLAttributes } from 'react';
import styles from './blendedImage.module.scss';
/**
 * A custom image component that wraps images in a vignette container.
 */
const BlendedImage = (
  props: ImgHTMLAttributes<HTMLImageElement>,
  mode = 'square'
) => {
  return (
    <div
      className={`${styles['vignette-img']} ${styles[mode]}`}
      style={{ '--bg-image': `url(${props.src})` } as React.CSSProperties}>
      <img {...props} />
    </div>
  );
};

export default BlendedImage;
