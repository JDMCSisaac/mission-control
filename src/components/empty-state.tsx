import { cn } from "@/lib/utils";

export function EmptyState({ icon, title, description, className }: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      {icon && <div className="mb-3 text-white/20">{icon}</div>}
      <p className="text-sm font-medium text-white/40">{title}</p>
      {description && <p className="mt-1 text-xs text-white/25 max-w-[280px]">{description}</p>}
    </div>
  );
}
