import "./Button.scss";

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  disabled = false,
  darkMode = false,
  onClick,
  ...props
}) => {
  const className = [
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    disabled && "btn--disabled",
    darkMode && "btn--dark",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={className} onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

export default Button;
