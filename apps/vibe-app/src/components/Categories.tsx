import { useState } from "react";
import { l1Categories } from "../data/catalog";
import { useCategories } from "../hooks/useCategories";

interface CategoriesProps {
  showLabels?: boolean;
  bg?: string;
  value?: string;
  onChange?: (id: string) => void;
}

export function Categories({
  showLabels = true,
  bg = "var(--bg-card)",
  value,
  onChange,
}: CategoriesProps) {
  const [internalId, setInternalId] = useState(l1Categories[0].id);
  const [failedIds, setFailedIds]   = useState<Set<string>>(new Set());
  const activeId = value ?? internalId;
  const { categories } = useCategories();

  function handleSelect(id: string) {
    if (onChange) onChange(id);
    else setInternalId(id);
  }

  function handleImgError(id: string) {
    setFailedIds((prev) => new Set([...prev, id]));
  }

  return (
    <div className="px-3 pt-3 pb-2" style={{ background: bg }}>
      <div className="flex items-start justify-between overflow-x-auto hide-scrollbar gap-1">
        {categories.map((cat) => {
          const isActive   = activeId === cat.id;
          const imgFailed  = failedIds.has(cat.id);
          return (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat.id)}
              className="flex flex-col items-center gap-1.5 flex-1"
            >
              {/* THAWQ gradient border ring */}
              <div
                style={{
                  width: "clamp(48px, 13vw, 62px)",
                  height: "clamp(48px, 13vw, 62px)",
                  flexShrink: 0,
                  borderRadius: "50%",
                  padding: "1px",
                  background: isActive
                    ? "linear-gradient(135deg, #FED7AA, #F97316, #C2410C)"
                    : "linear-gradient(135deg, #FED7AA, #EA580C)",
                  transition: "background var(--duration-fast) var(--ease-standard)",
                }}
              >
                <div
                  className="rounded-full overflow-hidden"
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "#FFFFFF",
                  }}
                >
                  {imgFailed ? (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: isActive ? "var(--gold-light)" : "var(--bg-surface-subtle)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "clamp(17px, 5vw, 22px)",
                          color: isActive ? "var(--text-brand)" : "var(--text-muted)",
                          lineHeight: 1,
                        }}
                      >
                        {cat.label[0]}
                      </span>
                    </div>
                  ) : (
                    <img
                      src={cat.img}
                      alt={cat.label}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={() => handleImgError(cat.id)}
                    />
                  )}
                </div>
              </div>

              {showLabels && (
                <span
                  className="text-center"
                  style={{
                    fontSize: "clamp(9px, 2.8vw, 11.5px)",
                    lineHeight: 1.5,
                    color: isActive ? "var(--text-brand)" : "var(--text-secondary)",
                    fontWeight: isActive ? 700 : 400,
                  }}
                >
                  {cat.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
