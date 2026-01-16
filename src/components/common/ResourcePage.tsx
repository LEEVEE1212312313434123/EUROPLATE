import type { ReactNode } from "react";

interface ResourcePageProps {
  title: string;
  subtitle?: string;
  isLoading: boolean;
  error?: string | null;
  headerActions?: ReactNode;
  toolbar?: ReactNode;
  children: ReactNode;
}

export function ResourcePage({
  title,
  subtitle,
  isLoading,
  error,
  headerActions,
  toolbar,
  children,
}: ResourcePageProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {headerActions}
      </div>

      {toolbar}
      {children}
    </div>
  );
}
