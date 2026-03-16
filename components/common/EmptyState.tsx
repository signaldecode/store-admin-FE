import { Inbox } from "lucide-react";

interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ message, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
      {icon || <Inbox className="h-12 w-12" aria-hidden="true" />}
      <p className="text-sm">{message}</p>
    </div>
  );
}
