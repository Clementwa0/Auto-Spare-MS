interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    body: string;
    compact?: boolean;
  }
  
  export function EmptyState({ icon, title, body, compact }: EmptyStateProps) {
    return (
      <div
        className={`flex flex-col items-center justify-center text-center ${
          compact ? "py-10" : "py-20"
        }`}
      >
        <div className="grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
          {icon}
        </div>
        <p className="mt-3 text-sm font-medium">{title}</p>
        <p className="mt-1 max-w-xs text-xs text-muted-foreground">{body}</p>
      </div>
    );
  }
  