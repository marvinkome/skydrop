import fleekStorage from "@fleekhq/fleek-storage-js";

export async function pinJson(key: string, body: any) {
  const result = await fleekStorage.upload({
    apiKey: process.env.FLEEK_API_KEY || "",
    apiSecret: process.env.FLEEK_API_SECRET || "",
    key,
    data: JSON.stringify(body),
  });

  return result.hashV0;
}
