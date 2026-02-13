import type { TiendaNubeProduct } from "./types";

const TIENDANUBE_ACCESS_TOKEN = import.meta.env.TIENDANUBE_ACCESS_TOKEN;
const TIENDANUBE_USER_ID = import.meta.env.TIENDANUBE_USER_ID;
const TN_FEATURED_CATEGORY_ID = import.meta.env.TN_FEATURED_CATEGORY_ID;

const accessToken = TIENDANUBE_ACCESS_TOKEN;
const userId = TIENDANUBE_USER_ID;
const FEATURED_CATEGORY_ID = TN_FEATURED_CATEGORY_ID;

const TIENDANUBE_API_URL = `https://api.tiendanube.com/v1/${userId}`;

export async function getProducts(): Promise<TiendaNubeProduct[] | null> {
  try {
    const result = await fetch(
      `${TIENDANUBE_API_URL}/products?category_id=${FEATURED_CATEGORY_ID}`,
      {
        headers: {
          Authentication: `bearer ${accessToken} `,
          "User-Agent": "FaunaKite (facundopellicer4@gmail.com)",
        },
      },
    );

    const products: TiendaNubeProduct[] = await result.json();
    return products.slice(0, 3);
  } catch (error) {
    console.log("[TIENDANUBE] GET PRODUCTS ERROR:", error);
    return null;
  }
}
