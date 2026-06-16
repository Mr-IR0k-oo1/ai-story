import { randomBytes } from "crypto";

const ID_BYTES = 4;
const MAX_RETRIES = 3;

export function generateId(): string {
  return randomBytes(ID_BYTES).toString("hex");
}

export async function generateUniqueId(
  checkExists: (id: string) => Promise<boolean>
): Promise<string> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const id = generateId();
    const exists = await checkExists(id);
    if (!exists) return id;
  }
  throw new Error("Failed to generate unique story ID after retries");
}
