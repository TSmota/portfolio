import { ReactNode } from "react";

interface BaseCardProps {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  hover?: boolean;
}

export function BaseCard({ 
  children, 
  className = "", 
  padding = "md", 
  hover = false 
}: BaseCardProps) {
  const paddingClasses = {
    sm: "p-4",
    md: "p-5", 
    lg: "p-6"
  };

  return (
    <div className={`
      bg-secondary/20 rounded-lg border ${paddingClasses[padding]}
      ${hover ? 'hover:shadow-lg transition-all duration-200' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
}
