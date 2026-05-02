import { useEffect, useRef, useState, ReactNode } from "react";

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  variant?: "reveal-left" | "reveal-right" | "reveal-up" | "reveal-down" | string;
  delay?: number;
}

export const RevealOnScroll = ({ 
  children, 
  className = "", 
  variant = "", 
  delay = 0 
}: RevealOnScrollProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${variant} ${visible ? "reveal-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default RevealOnScroll;
