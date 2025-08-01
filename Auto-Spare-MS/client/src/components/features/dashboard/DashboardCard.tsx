import type { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  color?: string; // Tailwind color class e.g. 'text-green-600'
}

export default function DashboardCard({
  title,
  value,
  icon,
  color = "text-primary",
}: DashboardCardProps) {
  return (
    <div className="bg-card shadow-md rounded-xl p-4 flex items-center justify-between hover:shadow-lg transition-shadow">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <h2 className={`text-2xl font-bold mt-1 ${color}`}>{value}</h2>
      </div>
      {icon && (
        <div className="p-2 bg-muted rounded-full text-muted-foreground">
          {icon}
        </div>
      )}
    </div>
  );
}
