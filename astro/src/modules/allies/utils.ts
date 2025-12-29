import type { ImageAsset } from "sanity";
import { sanityClient } from "sanity:client";
import groq from "groq";

export async function getAllies(): Promise<Ally[]> {
  return await sanityClient.fetch(
    groq`*[_type == "ally"] | order(_createdAt desc)`
  );
}

export interface Ally {
  _type: "ally";
  _createdAt: string;
  category: "lodging" | "restaurant" | "other";
  title: string;
  description: string;
  link?: string;
  phone?: string;
  image?: ImageAsset & { alt?: string };
}
