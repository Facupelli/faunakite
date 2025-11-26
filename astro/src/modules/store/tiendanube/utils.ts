import type { TiendaNubeProduct } from "./types";
import { TIENDANUBE_ACCESS_TOKEN, TIENDANUBE_USER_ID } from "astro:env/server";

const accessToken = TIENDANUBE_ACCESS_TOKEN;
const userId = TIENDANUBE_USER_ID;

const TIENDANUBE_API_URL = `https://api.tiendanube.com/v1/${userId}`;

export async function getProducts(): Promise<TiendaNubeProduct[] | null> {
  try {
    const result = await fetch(`${TIENDANUBE_API_URL}/products`, {
      headers: {
        Authentication: `bearer ${accessToken} `,
        "User-Agent": "FaunaKite (facundopellicer4@gmail.com)",
      },
    });

    const products: TiendaNubeProduct[] = await result.json();
    return products;
  } catch (error) {
    console.log("[TIENDANUBE] GET PRODUCTS ERROR:", error);
    return null;
  }
}

export function formatPrice(value: string): string {
  const price = parseFloat(value);
  const formattedPrice = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);

  return formattedPrice;
}
