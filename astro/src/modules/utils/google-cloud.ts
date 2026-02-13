export function getGoogleServiceAccountPrivateKey(): string {
  const jsonKey = import.meta.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (!jsonKey) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY is not set");
  }

  try {
    const { privateKey } = JSON.parse(jsonKey);
    return privateKey;
  } catch (error) {
    throw new Error("Invalid GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY");
  }
}
