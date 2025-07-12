import arrow from './icons/arrow.svg';
import hamburguer from './icons/hamburguer.svg';

import type { FC, SVGProps } from 'react';

export type IconType = 'arrow' | 'hamburguer';

export interface IconProps extends SVGProps<SVGSVGElement> {
  type: IconType;
}

const iconMap: Record<IconType, FC<SVGProps<SVGSVGElement>>> = {
  arrow,
  hamburguer,
};

const Icon: FC<IconProps> = ({ type, className = '', ...rest }) => {
  const SvgIcon = iconMap[type];

  if (!SvgIcon) {
    console.warn(`⚠️ Unknown icon type: "${type}"`);
    return null;
  }

  return <SvgIcon className={className} {...rest} />;
};

export default Icon;
