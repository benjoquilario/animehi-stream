import React from 'react';
import NextImage, { ImageProps as NextImageProps } from 'next/image';

interface ImageProps extends NextImageProps {
  containerClassName?: string;
}

const Image: React.FC<ImageProps> = ({ ...props }) => {
  const { containerClassName } = props;

  return (
    <div className={containerClassName}>
      <NextImage {...props} />
    </div>
  );
};

export default React.memo(Image);
