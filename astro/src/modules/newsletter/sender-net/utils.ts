import type { NewSubscriberPayload, NewSubscriberResponse } from "./types";

const SENDER_NET_ACCESS_TOKEN =
  import.meta.env.SENDER_NET_ACCESS_TOKEN ??
  process.env.SENDER_NET_ACCESS_TOKEN;

const accessToken = SENDER_NET_ACCESS_TOKEN;
const url = new URL("https://api.sender.net/v2/subscribers");

let headers = {
  Authorization: `Bearer ${accessToken}`,
  "Content-Type": "application/json",
  Accept: "application/json",
};

export async function createSubscriber(
  data: NewSubscriberPayload,
): Promise<
  NewSubscriberResponse | { success: false; message: string; data: null }
> {
  try {
    const result = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    const response: NewSubscriberResponse = await result.json();
    return response;
  } catch (error) {
    console.log("[SENDER NET] CREATE SUBSCRIBER ERROR:", error);
    return {
      success: false,
      message: "Error al crear el suscriptor",
      data: null,
    };
  }
}
