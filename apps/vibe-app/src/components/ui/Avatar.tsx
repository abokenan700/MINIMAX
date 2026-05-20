import { forwardRef, useState, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const avatarVariants = cva(
  "inline-flex items-center justify-center rounded-full overflow-hidden flex-shrink-0 select-none font-bold",
  {
    variants: {
      size: {
        xs: "w-6 h-6 text-[10px]",
        sm: "w-8 h-8 text-[12px]",
        md: "w-10 h-10 text-[15px]",
        lg: "w-14 h-14 text-[20px]",
        xl: "w-20 h-20 text-[28px]",
      },
    },
    defaultVariants: { size: "md" },
  }
);

export interface AvatarProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  name?: string;
  alt?: string;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, src, name, alt, ...props }, ref) => {
    const [imgError, setImgError] = useState(false);
    const initial = name?.trim().charAt(0).toUpperCase() ?? "?";

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size }), className)}
        style={{ background: (!src || imgError) ? "var(--gradient-brand)" : undefined }}
        {...props}
      >
        {src && !imgError ? (
          <img
            src={src}
            alt={alt ?? name ?? "avatar"}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span style={{ color: "#fff", fontFamily: "var(--font-text)" }}>{initial}</span>
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";
