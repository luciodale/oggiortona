import { forwardRef, useId } from "react";
import { FormError } from "./FormError";

type InputProps = {
  label?: string;
  required?: boolean;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, required, error, className = "", id: externalId, ...props }, ref) {
    const autoId = useId();
    const id = externalId ?? autoId;
    const errorId = error ? `${id}-error` : undefined;

    return (
      <div>
        {label && (
          <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-primary">
            {label}
            {required && <span className="ml-0.5 text-danger" aria-hidden="true">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          aria-required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={errorId}
          className={`w-full rounded-xl border bg-card px-3 py-2.5 text-[13px] outline-none transition-colors placeholder:text-muted ${
            error
              ? "border-danger focus:border-danger"
              : "border-border focus:border-accent"
          } ${className}`}
          {...props}
        />
        {error && <FormError id={errorId} message={error} />}
      </div>
    );
  },
);
