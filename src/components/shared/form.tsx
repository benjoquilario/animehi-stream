import React from 'react';

type Icon = {
  className?: string;
};

type FormProps = {
  Icon: React.ComponentType<Icon>;
  onSubmit?: () => void;
  children?: React.ReactNode;
} & React.HTMLProps<HTMLInputElement>;

const FormSearch = React.forwardRef<HTMLInputElement, FormProps>(
  (props, ref) => {
    const { Icon, onSubmit, ...inputProps } = props;

    return (
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-[34px_1fr] items-center">
          <button
            className="text-slate-300 flex justify-center items-center"
            type="submit"
          >
            <Icon className="h-6 w-6" />
          </button>
          <div>
            <input
              className="bg-background-900 focus:outline-none text-slate-300 text-sm md:text-base"
              type="text"
              placeholder="Search anime..."
              {...inputProps}
            />
          </div>
        </div>
      </form>
    );
  }
);

FormSearch.displayName = 'Form';

export default FormSearch;
