import { sanityClient } from "sanity:client";
import type { PortableTextBlock } from "@portabletext/types";
import type { ImageAsset, Slug } from "@sanity/types";
import groq from "groq";

export async function getNews(): Promise<News[]> {
  return await sanityClient.fetch(
    groq`*[_type == "news" && defined(slug.current)] | order(_createdAt desc)`
  );
}

export async function getLatestNews(): Promise<News[]> {
  return await sanityClient.fetch(
    groq`*[_type == "news" && defined(slug.current)] | order(_createdAt desc) [0...3]`
  );
}

export async function getSingleNews(slug: string): Promise<News> {
  return await sanityClient.fetch(
    groq`*[_type == "news" && slug.current == $slug][0]`,
    {
      slug,
    }
  );
}

export interface News {
  _type: "post";
  _createdAt: string;
  title?: string;
  slug: Slug;
  summary: string;
  image?: ImageAsset & { alt?: string };
  body: PortableTextBlock[];
}
