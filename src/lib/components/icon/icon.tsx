import Arrow from './icons/arrow.svg';

import type { FC, SVGProps } from 'react';

export type IconType = 'arrow';

export interface IconProps extends SVGProps<SVGSVGElement> {
  type: IconType;
}

const iconMap: Record<IconType, FC<SVGProps<SVGSVGElement>>> = {
  arrow: Arrow,
};

const Icon: FC<IconProps> = ({ type, className = '', ...rest }) => {
  const SvgIcon = iconMap[type];

  if (!SvgIcon) {
    console.warn(`⚠️ Unknown icon type: "${type}"`);
    return null;
  }
  console.log(SvgIcon);

  return <SvgIcon className={className} {...rest} />;
};

export default Icon;
