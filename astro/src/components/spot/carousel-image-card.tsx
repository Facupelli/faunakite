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
