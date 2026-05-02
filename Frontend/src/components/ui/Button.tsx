import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string;
  to?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  href,
  to,
  onClick,
  type = "button"
}: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center rounded-2xl font-bold transition duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-accent-500 text-white shadow-[0_14px_34px_rgba(23,169,127,0.35)] hover:bg-accent-400",
    secondary: "bg-[#174a7f] text-white shadow-[0_14px_34px_rgba(23,74,127,0.25)] hover:bg-[#1f5a95]",
    outline: "border border-white/16 bg-transparent text-white hover:bg-white/6",
    ghost: "bg-[#f6f8fb] text-[#153f6f] hover:bg-[#e9eef5]"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-7 py-4 text-base",
    lg: "px-10 py-5 text-lg"
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={combinedClasses} onClick={onClick}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={combinedClasses} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={combinedClasses} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
