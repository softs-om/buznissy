function Button({
  children,
  type = "button",
  variant = "primary",
  className = "",
  ...props
}) {
  const variantClass =
    variant === "secondary" ? "button-secondary" : "button-primary";

  return (
    <button
      type={type}
      className={`button ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;