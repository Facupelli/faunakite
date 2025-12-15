import type { TiendaNubeProduct } from "../../modules/store/tiendanube/types";
import { ProductCard } from "./carousel-product-card";
import Carousel from "../embla-carousel";

export default function TiendaNubeCarousel({
  products,
}: {
  products: TiendaNubeProduct[] | null;
}) {
  return (
    <Carousel gridBreakpoint="md" gridCols={3}>
      {products?.map((product) => (
        <ProductCard product={product} />
      ))}
    </Carousel>
  );
}
