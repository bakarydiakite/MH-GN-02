import { ReactNode, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "low" | "medium" | "high" | "highest" | "none";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  className?: string;
  onClick?: () => void;
}

export const Card = ({
  children,
  variant = "medium",
  padding = "md",
  className = "",
  onClick
}: CardProps) => {
  const baseStyles = "rounded-[32px] transition duration-300";
  
  const variants = {
    none: "bg-transparent",
    low: "bg-white/5 border border-white/10 backdrop-blur-sm",
    medium: "bg-white border border-[#e9eef5] shadow-[0_18px_50px_rgba(15,53,99,0.04)]",
    high: "bg-white shadow-[0_18px_55px_rgba(15,53,99,0.06)]",
    highest: "bg-white shadow-[0_22px_70px_rgba(15,53,99,0.08)]"
  };

  const paddings = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10"
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${paddings[padding]} ${className}`;

  return (
    <div className={combinedClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
