import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
  error?: string;
  helperText?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      error,
      helperText,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const checkboxId = id || props.name;

    return (
      <div className="w-full">
        <label className="flex items-start cursor-pointer group">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={`
              w-5 h-5 mt-0.5
              border-2 rounded
              text-secondary
              focus:ring-2 focus:ring-secondary focus:ring-offset-2
              disabled:opacity-50 disabled:cursor-not-allowed
              cursor-pointer
              ${error ? 'border-error' : 'border-border'}
              ${className}
            `}
            {...props}
          />
          <span className="ml-3 text-sm text-foreground group-hover:text-primary transition-colors">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </span>
        </label>
        {error && (
          <p className="mt-1.5 text-sm text-error ml-8">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-muted-foreground ml-8">{helperText}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
