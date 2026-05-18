import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  icon?: ReactNode;
  extra?: ReactNode;
  onViewAll?: () => void;
}

export function SectionHeader({ title, icon, extra, onViewAll }: SectionHeaderProps) {
  return (
    <div className="section-header-row">
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="section-accent-bar" />
        <h2 className="section-header-title">{title}</h2>
        {icon && (
          <span className="section-header-icon">{icon}</span>
        )}
        {extra}
      </div>

      {onViewAll && (
        <button
          onClick={onViewAll}
          className="view-all-btn"
          aria-label={`عرض كل ${title}`}
        >
          <span>عرض الكل</span>
          <ChevronLeft size={13} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
