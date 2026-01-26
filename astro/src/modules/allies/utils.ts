import type { ImageAsset } from "sanity";
import { sanityClient } from "sanity:client";
import groq from "groq";
import { getLocalizedValue } from "../../i18n/utils";

export async function getAllies(language: "es" | "en"): Promise<Ally[]> {
  const allies = await sanityClient.fetch(
    groq`*[_type == "ally"] | order(_createdAt desc)`,
  );

  return allies.map((ally: any) => ({
    _id: ally._id,
    category: ally.category,
    title: getLocalizedValue(ally.title, language) || "",
    description: getLocalizedValue(ally.description, language) || "",
    phone: ally.phone,
    link: ally.link,
    contact: ally.contact,
    image: ally.image,
    whatsappLink: ally.whatsappLink,
    discount: ally.discount,
  }));
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
  whatsappLink?: string;
  contact?: string;
  discount?: {
    value: string;
    details?: { _key: string; value: string }[];
  };
}
