export interface GoogleCredentials {
  client_email: string;
  private_key: string;
}

export class GoogleAuth {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(
    private credentials: GoogleCredentials,
    private scopes: string[],
  ) {}

  async getAccessToken(): Promise<string> {
    // Return cached token if valid (with 60 second buffer)
    if (this.accessToken && Date.now() < this.tokenExpiry - 60000) {
      return this.accessToken;
    }

    try {
      const now = Math.floor(Date.now() / 1000);
      const jwtHeader = { alg: "RS256", typ: "JWT" };
      const jwtPayload = {
        iss: this.credentials.client_email,
        scope: this.scopes.join(" "),
        aud: "https://oauth2.googleapis.com/token",
        exp: now + 3600,
        iat: now,
      };

      const encodedHeader = this.base64urlEncode(JSON.stringify(jwtHeader));
      const encodedPayload = this.base64urlEncode(JSON.stringify(jwtPayload));
      const unsignedToken = `${encodedHeader}.${encodedPayload}`;

      const signature = await this.signJwt(
        unsignedToken,
        this.credentials.private_key,
      );
      const signedJwt = `${unsignedToken}.${signature}`;

      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${signedJwt}`,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Auth failed: ${response.status} - ${errorText}`);
      }

      const data = (await response.json()) as {
        access_token: string;
        expires_in: number;
      };

      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + data.expires_in * 1000;

      return this.accessToken;
    } catch (error) {
      throw new Error("Failed to authenticate with Google");
    }
  }

  private async signJwt(data: string, privateKeyPem: string): Promise<string> {
    const pemContents = privateKeyPem
      .replace(/-----BEGIN PRIVATE KEY-----/, "")
      .replace(/-----END PRIVATE KEY-----/, "")
      .replace(/\s/g, "");

    const binaryKey = this.base64ToArrayBuffer(pemContents);

    const cryptoKey = await crypto.subtle.importKey(
      "pkcs8",
      binaryKey,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"],
    );

    const encoder = new TextEncoder();
    const signatureBuffer = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      cryptoKey,
      encoder.encode(data),
    );

    return this.arrayBufferToBase64Url(signatureBuffer);
  }

  // --- Utility Helpers ---
  private base64urlEncode(str: string): string {
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private arrayBufferToBase64Url(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }
}

// Shared Error Handler
export async function handleFetchError(
  message: string,
  response: Response,
): Promise<never> {
  let details = "Unknown error";
  try {
    const errorBody = await response.json();
    console.error("Google API Error:", errorBody);
    if (errorBody && typeof errorBody === "object" && "error" in errorBody) {
      const gError = errorBody.error as { message?: string };
      details = gError.message || JSON.stringify(errorBody);
    } else {
      details = JSON.stringify(errorBody);
    }
  } catch {
    details = await response.text();
  }
  throw new Error(`${message}: ${details}`);
}
