import { Link } from '@/i18n/navigation';

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

export function SocialLink({ href, icon, label }: SocialLinkProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-secondary/20 hover:bg-secondary/40 rounded-lg p-4 border transition-colors flex items-center gap-3"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
