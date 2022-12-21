import React from 'react';

type ButtonProps = {
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  children?: React.ReactNode;
} & React.HTMLProps<HTMLButtonElement>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const { type, className, children, ...buttonProps } = props;
    return (
      <button ref={ref} type={type} className={className} {...buttonProps}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default React.memo(Button);
