import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  label: string;
  variant?: "default" | "success" | "warning" | "destructive";
}

const variantStyles: Record<string, string> = {
  default: "",
  success:
    "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900 dark:text-emerald-300",
  warning:
    "bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900 dark:text-amber-300",
  destructive: "",
};

export default function StatusBadge({
  label,
  variant = "default",
}: StatusBadgeProps) {
  if (variant === "destructive") {
    return <Badge variant="destructive">{label}</Badge>;
  }

  return (
    <Badge variant="secondary" className={cn(variantStyles[variant])}>
      {label}
    </Badge>
  );
}
