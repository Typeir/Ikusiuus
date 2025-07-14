import BlendedImage from './blendedImage';
import FlexRenderer from './flexRenderer';
import mdxComponents from './mdxComponents';

const components = {
  BlendedImage,
  FlexRenderer,
  ...mdxComponents,
  table: ({ children }: any) => (
    <div className='overflow-x-auto max-w-full'>{children}</div>
  ),
};

export default components;
