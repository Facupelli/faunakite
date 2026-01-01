import { sanityClient } from "sanity:client";
import groq from "groq";
import type { ImageAsset } from "sanity";
import { getLocalizedValue } from "../../i18n/utils";

export async function getKitecamps(language: "es" | "en"): Promise<Kitecamp[]> {
  const today = new Date().toISOString().split("T")[0];

  const kitecamps = await sanityClient.fetch(
    groq`*[_type == "kitecamp" && date >= $today] | order(date asc)`,
    { today }
  );

  return kitecamps.map((camp: any) => ({
    _id: camp._id,
    title: getLocalizedValue(camp.title, language) || "",
    description: getLocalizedValue(camp.description, language) || "",
    image: camp.image,
    date: camp.date,
  }));
}

export async function getPastKitecamps(
  language: "es" | "en"
): Promise<Kitecamp[]> {
  const today = new Date().toISOString().split("T")[0];

  const kitecamps = await sanityClient.fetch(
    groq`*[_type == "kitecamp" && date < $today] | order(date desc)`,
    { today }
  );

  return kitecamps.map((camp: any) => ({
    _id: camp._id,
    title: getLocalizedValue(camp.title, language) || "",
    description: getLocalizedValue(camp.description, language) || "",
    image: camp.image,
    date: camp.date,
  }));
}

export interface Kitecamp {
  _type: "kitecamp";
  _createdAt: string;
  title?: string;
  description: string;
  image?: ImageAsset & { alt?: string };
  date: string;
}
