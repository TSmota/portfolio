interface SectionHeaderProps {
  icon: string;
  title: string;
  className?: string;
}

export function SectionHeader({ icon, title, className = "" }: SectionHeaderProps) {
  return (
    <h2 className={`text-xl sm:text-2xl font-semibold mb-4 flex items-center gap-2 ${className}`}>
      <span>{icon}</span> {title}
    </h2>
  );
}
