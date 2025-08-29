interface TechStackTagsProps {
  technologies: readonly string[];
  className?: string;
  size?: "sm" | "md";
}

export function TechStackTags({ technologies, className = "", size = "md" }: TechStackTagsProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1"
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {technologies.map((tech) => (
        <span 
          key={tech} 
          className={`bg-primary/10 text-primary font-medium rounded-full ${sizeClasses[size]}`}
        >
          {tech}
        </span>
      ))}
    </div>
  );
}
