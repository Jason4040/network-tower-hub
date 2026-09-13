const SESSION_KEY = "nth-admin-ok";
const PASS_HASH_KEY = "nth-admin-hash";

/** SHA-256 of the default password. Change it from the dashboard after first login. */
export const DEFAULT_PASS_HASH = "a4a1a23803d4ac962ac914999e1acf74f54480e013dc50340668d0aa4b237383";

export async function sha256Hex(value: string) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function getStoredPassHash() {
  try {
    return window.localStorage.getItem(PASS_HASH_KEY) || DEFAULT_PASS_HASH;
  } catch {
    return DEFAULT_PASS_HASH;
  }
}

export async function verifyAdminPassword(password: string) {
  const hash = await sha256Hex(password.trim());
  return hash === getStoredPassHash();
}

export async function setAdminPassword(password: string) {
  const hash = await sha256Hex(password.trim());
  window.localStorage.setItem(PASS_HASH_KEY, hash);
}

export function isAdminSession() {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function startAdminSession() {
  window.sessionStorage.setItem(SESSION_KEY, "1");
}

export function endAdminSession() {
  window.sessionStorage.removeItem(SESSION_KEY);
}
