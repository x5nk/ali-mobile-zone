import { useState } from "react";
import { ShoppingBag } from "lucide-react";

export function ProductImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const [error, setError] = useState(false);
  if (error || !src) {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-secondary to-muted text-muted-foreground ${className}`}>
        <ShoppingBag className="h-10 w-10 opacity-60" />
        <span className="px-3 text-center text-xs font-medium opacity-80 line-clamp-2">{alt}</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setError(true)}
      className={className}
    />
  );
}
