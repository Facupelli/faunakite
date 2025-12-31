import { sanityClient } from "sanity:client";
import groq from "groq";
import type { ImageAsset } from "sanity";

export async function getKitecamps(): Promise<Kitecamp[]> {
  const today = new Date().toISOString().split("T")[0];

  return await sanityClient.fetch(
    groq`*[_type == "kitecamp" && date >= $today] | order(date asc)`,
    { today }
  );
}

export async function getPastKitecamps(): Promise<Kitecamp[]> {
  const today = new Date().toISOString().split("T")[0];

  return await sanityClient.fetch(
    groq`*[_type == "kitecamp" && date < $today] | order(date desc)`,
    { today }
  );
}

export interface Kitecamp {
  _type: "kitecamp";
  _createdAt: string;
  title?: string;
  description: string;
  image?: ImageAsset & { alt?: string };
  date: string;
}
