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
  const activeId  = value ?? internalId;
  const { categories } = useCategories();

  function handleSelect(id: string) {
    if (onChange) onChange(id);
    else setInternalId(id);
  }

  function handleImgError(id: string) {
    setFailedIds((prev) => new Set([...prev, id]));
  }

  return (
    <div className="categories-strip" style={{ background: bg }}>
      <div className="categories-row hide-scrollbar" dir="rtl">
        {categories.map((cat) => {
          const isActive  = activeId === cat.id;
          const imgFailed = failedIds.has(cat.id);

          return (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat.id)}
              className="category-item"
              aria-pressed={isActive}
            >
              {/* Ring wrap */}
              <div
                className="category-ring"
                style={{
                  background: "linear-gradient(145deg, #C45500, #A03D00)",
                  padding: "1px",
                }}
              >
                <div
                  className="category-img-wrap"
                  style={{ background: "#FFFFFF" }}
                >
                  {imgFailed ? (
                    <div className="category-fallback" style={{ background: isActive ? "var(--gold-light)" : "#F5F5F5" }}>
                      <span className="category-fallback-letter" style={{ color: isActive ? "var(--text-brand)" : "var(--text-muted)" }}>
                        {cat.label[0]}
                      </span>
                    </div>
                  ) : (
                    <img
                      src={cat.img}
                      alt={cat.label}
                      className="category-img"
                      onError={() => handleImgError(cat.id)}
                    />
                  )}
                </div>
              </div>


              {showLabels && (
                <span
                  className="category-label"
                  style={{
                    color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                    fontWeight: isActive ? 700 : 500,
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
