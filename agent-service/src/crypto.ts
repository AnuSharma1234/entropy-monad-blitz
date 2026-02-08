import { createCipheriv, createDecipheriv, randomBytes, scrypt } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);
const ALGORITHM = "aes-256-gcm";
const SALT_LENGTH = 32;
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32;

const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET || "default-secret-change-in-production";

export async function encryptApiKey(apiKey: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH);
  const iv = randomBytes(IV_LENGTH);
  
  const key = (await scryptAsync(ENCRYPTION_SECRET, salt, KEY_LENGTH)) as Buffer;
  const cipher = createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(apiKey, "utf8", "hex");
  encrypted += cipher.final("hex");
  
  const authTag = cipher.getAuthTag();
  
  const result = Buffer.concat([
    salt,
    iv,
    authTag,
    Buffer.from(encrypted, "hex")
  ]);
  
  return result.toString("base64");
}

export async function decryptApiKey(encryptedData: string): Promise<string> {
  const buffer = Buffer.from(encryptedData, "base64");
  
  const salt = buffer.subarray(0, SALT_LENGTH);
  const iv = buffer.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const authTag = buffer.subarray(
    SALT_LENGTH + IV_LENGTH,
    SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH
  );
  const encrypted = buffer.subarray(SALT_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH);
  
  const key = (await scryptAsync(ENCRYPTION_SECRET, salt, KEY_LENGTH)) as Buffer;
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted.toString("hex"), "hex", "utf8");
  decrypted += decipher.final("utf8");
  
  return decrypted;
}

export function validateApiKey(apiKey: string): boolean {
  return typeof apiKey === "string" && apiKey.length > 20 && apiKey.startsWith("AI");
}
