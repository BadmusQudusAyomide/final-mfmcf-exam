export const ADMIN_SESSION_COOKIE = "mfmcf_admin_session";

function getAdminSecret() {
  return process.env.ADMIN_SESSION_SECRET || "change-this-admin-secret";
}

async function sign(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getAdminSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value),
  );

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function validateAdminCredentials(username: string, password: string) {
  return (
    username === (process.env.ADMIN_USERNAME || "admin") &&
    password === (process.env.ADMIN_PASSWORD || "church123")
  );
}

export async function createAdminSessionToken(username: string) {
  const payload = `${username}:${Date.now()}`;
  const signature = await sign(payload);
  return Buffer.from(`${payload}:${signature}`).toString("base64url");
}

export async function verifyAdminSessionToken(token?: string) {
  if (!token) {
    return false;
  }

  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const lastColonIndex = decoded.lastIndexOf(":");

    if (lastColonIndex <= 0) {
      return false;
    }

    const payload = decoded.slice(0, lastColonIndex);
    const providedSignature = decoded.slice(lastColonIndex + 1);
    const expectedSignature = await sign(payload);
    return providedSignature === expectedSignature;
  } catch {
    return false;
  }
}
