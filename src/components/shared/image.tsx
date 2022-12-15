import React from 'react';
import NextImage, { ImageProps as NextImageProps } from 'next/image';

type ImageProps = {
  containerclassname?: string;
} & NextImageProps;

const Image: React.FC<ImageProps> = ({ ...props }) => {
  const { containerclassname } = props;

  return (
    <div className={containerclassname}>
      <NextImage {...props} />
    </div>
  );
};

export default React.memo(Image);
