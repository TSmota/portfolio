import { BaseCard } from "./base-card";

interface ContactInfoCardProps {
  icon: string;
  label: string;
  value: string | React.ReactNode;
  href?: string;
}

export function ContactInfoCard({ icon, label, value, href }: ContactInfoCardProps) {
  return (
    <BaseCard padding="sm">
      <div className="flex items-center gap-3">
        <div className="text-2xl">{icon}</div>
        <div>
          <h3 className="font-medium">{label}</h3>
          {href ? (
            <a 
              href={href}
              className="text-primary hover:underline"
            >
              {value}
            </a>
          ) : (
            <div>{value}</div>
          )}
        </div>
      </div>
    </BaseCard>
  );
}
