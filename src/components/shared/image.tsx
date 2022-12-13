import React from 'react';
import NextImage, { ImageProps as NextImageProps } from 'next/image';

interface ImageProps extends NextImageProps {
  containerclassname?: string;
}

const Image: React.FC<ImageProps> = ({ ...props }) => {
  const { containerclassname } = props;

  return (
    <div className={containerclassname}>
      <NextImage {...props} />
    </div>
  );
};

export default React.memo(Image);
