export function ImageCard({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="w-full h-full">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-full object-cover rounded-xl shadow-lg"
      />
    </div>
  );
}

export function KitetripImageCard({
  srcDesktop,
  srcMobile,
  alt,
  width,
  height,
  className,
}: {
  srcDesktop: string;
  srcMobile: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}) {
  return (
    <div className="w-full h-full">
      <picture>
        {/* Desktop version */}
        <source media="(min-width: 768px)" srcSet={srcDesktop} />
        {/* Mobile version */}
        <source media="(max-width: 767px)" srcSet={srcMobile} />
        <img
          src={srcDesktop}
          alt={alt}
          width={width}
          height={height}
          loading="eager"
          decoding="async"
          className={`w-full h-full object-cover rounded-xl shadow-lg ${className}`}
          style={{
            aspectRatio: `${width} / ${height}`,
          }}
        />
      </picture>
    </div>
  );
}
