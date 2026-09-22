function Input({
  id,
  label,
  helperText,
  error,
  className = "",
  ...props
}) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>

      <input
        id={id}
        className={`field-input ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${id}-error` : helperText ? `${id}-helper` : undefined
        }
        {...props}
      />

      {helperText && !error && (
        <p id={`${id}-helper`} className="text-small text-muted">
          {helperText}
        </p>
      )}

      {error && (
        <p id={`${id}-error`} role="alert" className="message-error">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;