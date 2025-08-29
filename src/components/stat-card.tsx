import { BaseCard } from "./base-card";

interface StatCardProps {
  value: number;
  label: string;
  color?: string;
  className?: string;
}

export function StatCard({ value, label, color = "", className = "" }: StatCardProps) {
  return (
    <BaseCard padding="sm" className={`text-center ${className}`}>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </BaseCard>
  );
}
