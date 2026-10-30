import { useState, useEffect } from "react";
import { Package } from "lucide-react";

export default function LoadedImage({ src, alt, className = "", containerClassName = "" }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  return (
    <div className={`relative overflow-hidden bg-black/20 ${containerClassName}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-10 animate-pulse opacity-40 bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%]" />
      )}

      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
          className={`${className} transition-opacity duration-500 ease-out ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 opacity-50">
          <Package size={30} strokeWidth={1.2} />
          <span className="text-[10px]">No image</span>
        </div>
      )}
    </div>
  );
}