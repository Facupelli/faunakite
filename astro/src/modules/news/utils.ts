import { sanityClient } from "sanity:client";
import type { PortableTextBlock } from "@portabletext/types";
import type { ImageAsset, Slug } from "@sanity/types";
import groq from "groq";
import { getLocalizedValue } from "../../i18n/utils";

export async function getNews(language: "es" | "en"): Promise<News[]> {
  const newsList = await sanityClient.fetch(
    groq`*[_type == "news" && count(slug) > 0] | order(_createdAt desc)`,
  );

  return newsList.map((news: any) => ({
    _id: news._id,
    _createdAt: news._createdAt,
    title: getLocalizedValue(news.title, language) || "",
    slug: getLocalizedValue(news.slug, language) || "",
    summary: getLocalizedValue(news.summary, language) || "",
    images: news.images,
    epigraph: getLocalizedValue(news.epigraph, language),
  }));
}

export async function getLatestNews(language: "es" | "en"): Promise<News[]> {
  const newsList = await sanityClient.fetch(
    groq`*[_type == "news" && count(slug) > 0] | order(_createdAt desc) [0...3]`,
  );

  return newsList.map((news: any) => ({
    _id: news._id,
    _createdAt: news._createdAt,
    title: getLocalizedValue(news.title, language) || "",
    slug: getLocalizedValue(news.slug, language) || "",
    summary: getLocalizedValue(news.summary, language) || "",
    images: news.images,
    epigraph: getLocalizedValue(news.epigraph, language),
  }));
}

export async function getNewsBySlug(
  slug: string,
  language: "es" | "en",
): Promise<News | null> {
  const news = await sanityClient.fetch(
    groq`*[_type == "news" && slug[].value.current match $slug][0]`,
    {
      slug,
    },
  );

  const localeSlug = getLocalizedValue<Slug>(news.slug, language);
  const body = getLocalizedValue<PortableTextBlock[]>(news.body, language);

  if (!localeSlug || !body) {
    return null;
  }

  const newsData: News = {
    _id: news._id,
    _createdAt: news._createdAt,
    title: getLocalizedValue(news.title, language) || "",
    slug: localeSlug,
    summary: getLocalizedValue(news.summary, language) || "",
    images: news.images,
    epigraph: getLocalizedValue(news.epigraph, language),
    body,
  };

  if (news.ctaButton != undefined) {
    newsData.ctaButton = {
      text: getLocalizedValue(news.ctaButton.text, language) || "",
      url: news.ctaButton.url,
    };
  }

  return newsData;
}

export interface News {
  _id: string;
  _createdAt: string;
  title?: string;
  slug: Slug;
  summary: string;
  epigraph?: string;
  images?: ImageAsset & { alt?: string }[];
  ctaButton?: {
    text: string;
    url: string;
  };
  body: PortableTextBlock[];
}
