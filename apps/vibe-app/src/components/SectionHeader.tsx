import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Skeleton } from "./ui/Skeleton";

interface SectionHeaderProps {
  title:       string;
  icon?:       ReactNode;
  extra?:      ReactNode;
  actionSlot?: ReactNode;
  onViewAll?:  () => void;
  loading?:    boolean;
}

export function SectionHeader({ title, icon, extra, actionSlot, onViewAll, loading }: SectionHeaderProps) {
  return (
    <div className="section-header-row">
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="section-accent-bar" />
        {loading
          ? <Skeleton variant="text" width={80} height={14} />
          : <h2 className="section-header-title">{title}</h2>
        }
        {!loading && icon && (
          <span className="section-header-icon">{icon}</span>
        )}
        {!loading && extra}
      </div>

      <div className="flex items-center gap-2">
        {actionSlot}
        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="view-all-btn"
            aria-label={`عرض كل ${title}`}
          >
            <span>عرض الكل</span>
            <ChevronLeft size={13} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  );
}
