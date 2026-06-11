import { Monitor, User } from "lucide-react";

export function POSFooter({ userName }: { userName?: string }) {
  return (
    <footer className="border-t bg-background px-4 py-2 text-xs text-muted-foreground lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5" />
          Operator:{" "}
          <span className="font-medium text-foreground">{userName || "—"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Monitor className="h-3.5 w-3.5" />
          Terminal POS-001
        </div>
        <div>v2.3.1</div>
      </div>
    </footer>
  );
}
