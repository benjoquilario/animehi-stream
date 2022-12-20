import React from 'react';
import classNames from 'classnames';

type Icon = {
  className?: string;
};

type InputProps = {
  containerClassName?: string;
  labelClassName?: string;
  label?: string;
  Icon?: React.ComponentType<Icon>;
  iconClassName?: string;
  className?: string;
  name?: string;
} & React.HTMLProps<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    containerClassName,
    label,
    labelClassName,
    name,
    Icon,
    iconClassName,
    className,
    ...inputProps
  } = props;

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={name} className={labelClassName}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={classNames(
          'bg-[#111] focus:outline-none text-slate-300 text-sm md:text-base',
          className
        )}
        {...inputProps}
      />
      {Icon && <Icon className={iconClassName} />}
    </div>
  );
});

Input.displayName = 'Input';

export default React.memo(Input);
