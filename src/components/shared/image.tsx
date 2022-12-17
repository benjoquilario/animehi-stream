import React from 'react';
import NextImage, { ImageProps as NextImageProps } from 'next/image';

type ImageProps = {
  containerclassname?: string;
} & NextImageProps;

const variants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,
  },
};

const Image: React.FC<ImageProps> = ({ ...props }) => {
  const { containerclassname } = props;

  return (
    <div className={containerclassname}>
      <NextImage {...props} />
    </div>
  );
};

export default React.memo(Image);
