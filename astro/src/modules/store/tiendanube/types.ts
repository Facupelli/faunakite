export interface TiendaNubeProduct {
  id: number;
  name: Name;
  description: Description;
  handle: Handle;
  attributes: any[];
  published: boolean;
  free_shipping: boolean;
  requires_shipping: boolean;
  canonical_url: string;
  video_url: any;
  seo_title: SeoTitle;
  seo_description: SeoDescription;
  brand: any;
  created_at: string;
  updated_at: string;
  variants: Variant[];
  tags: string;
  images: Image[];
  categories: any[];
}

export interface Name {
  es: string;
}

export interface Description {
  es: string;
}

export interface Handle {
  es: string;
}

export interface SeoTitle {
  es: string;
}

export interface SeoDescription {
  es: string;
}

export interface Variant {
  id: number;
  image_id: number;
  product_id: number;
  position: number;
  price: string;
  compare_at_price: string;
  promotional_price: any;
  stock_management: boolean;
  stock: any;
  weight: string;
  width: string;
  height: string;
  depth: string;
  sku: any;
  values: any[];
  barcode: any;
  mpn: any;
  age_group: any;
  gender: any;
  created_at: string;
  updated_at: string;
  cost: any;
  visible: boolean;
  inventory_levels: InventoryLevel[];
}

export interface InventoryLevel {
  id: number;
  variant_id: number;
  location_id: string;
  stock: any;
}

export interface Image {
  id: number;
  product_id: number;
  src: string;
  position: number;
  alt: any[];
  height: number;
  width: number;
  thumbnails_generated: number;
  created_at: string;
  updated_at: string;
}
