import { randomBytes, scryptSync } from "crypto";
import { decodeJwt, decodeProtectedHeader, jwtVerify, SignJWT } from "jose";
import invariant from "tiny-invariant";

import { JWTPayloadWithUser } from "@core/types";
import { API_ROUTES } from "@core/config/constants";

export function pathToApiUrl(path: API_ROUTES): string {
  invariant(path, "Api path doesn't exist");

  const host = process.env["NEXT_PUBLIC_HOST"];
  let https = false;
  let port = process.env["NEXT_PUBLIC_PORT"];

  if (isProduction()) {
    https = true;
  }

  return `${https ? "https" : "http"}://${host}:${port}${path}`;
}

export function isProduction() {
  return process.env.NODE_ENV === "production";
}

export function parseJson<T>(value: string | null): T | undefined {
  try {
    return value === "undefined" ? undefined : JSON.parse(value ?? "");
  } catch {
    console.log("parsing error on", { value });
    return undefined;
  }
}

export function getEncodedSecret(name: string) {
  return new TextEncoder().encode(process.env[name]);
}

export async function generateJwt(
  payload: any,
  issuer: string,
  audience: string,
  expirationTime: string = "2h"
) {
  const secret = getEncodedSecret("JWT_SECRET");

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setIssuer(issuer)
    .setAudience(audience)
    .setExpirationTime(expirationTime)
    .sign(secret);
}

export async function isJwtValid(jwt: string) {
  try {
    const { user } = decodeJwt(jwt) as JWTPayloadWithUser;

    await jwtVerify(jwt, new TextEncoder().encode(process.env.JWT_SECRET!), {
      issuer: "urn:nextapp:issuer",
      audience: `urn:${user.name}:audience`,
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export function isJwtExpired(expirationDate?: number) {
  if (!expirationDate) return false;

  return +new Date() > expirationDate;
}

export function getJwt() {
  if (typeof window === "undefined") {
    return;
  }

  const jwt = window.sessionStorage.getItem("accessToken");
  if (!jwt) return;

  return JSON.parse(jwt);
}

export function parseJwt(jwt?: string | null) {
  if (!jwt) return null;

  try {
    const headers = decodeProtectedHeader(jwt);
    const payload = decodeJwt(jwt);
    if (!payload || !headers) return null;
    return { headers, payload, expired: isJwtExpired(payload.exp! * 1000) };
  } catch (error) {
    console.warn("Error decoding jwt token:", error);
    return null;
  }
}

export function hashPassword(password: string, salt?: Buffer) {
  invariant(password, "The password is empty");

  if (salt) {
    invariant(salt.length % 2 === 0, "The salt length can't be odd");
  } else {
    salt = randomBytes(128);
  }

  const hashedPassword = scryptSync(password, salt, 64).toString("hex");
  const saltPartLength = salt.length / 2;
  const [saltStart, saltEnd] = [
    salt.slice(0, saltPartLength).toString("hex"),
    salt.slice(saltPartLength).toString("hex"),
  ];

  return `${saltStart}${hashedPassword}${saltEnd}`;
}

export function parsePasswordSalt(password: string, saltLength: number = 256) {
  invariant(password, "The password is empty, the salt can't be parsed");
  invariant(saltLength % 2 === 0, "The salt length can't be odd");

  const saltPartLength = saltLength / 2;
  const saltParts = [
    password.slice(0, saltPartLength),
    password.slice(-saltPartLength),
  ];

  return Buffer.from(saltParts.join(""), "hex");
}

export function verifyPassword(origin: string, hashed: string) {
  invariant(origin, "The origin password is empty");
  invariant(hashed, "The hashed password is empty");

  const salt = parsePasswordSalt(hashed);
  const originHashedPassword = hashPassword(origin, salt);

  return originHashedPassword === hashed;
}

export async function verifyFingerprint(origin: string, hashed: string) {
  invariant(origin, "The origin fingerprint is empty");
  invariant(hashed, "The hashed fingerprint is empty");

  const hashedOrigin = await digestToHex("SHA-256", origin);

  return hashed === hashedOrigin;
}

export async function digestToHex(
  algorithm: AlgorithmIdentifier,
  message: any
) {
  const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest(algorithm, msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  return hashHex;
}

export function isAuthRoute(pathname: string, routes: string[]) {
  for (let route of routes) {
    if (pathname.startsWith(route)) {
      return true;
    }
  }

  return false;
}

export function isClientSide() {
  return typeof window !== "undefined";
}

export function setSessionStorageItem(key: string, value: any) {
  window.sessionStorage.setItem(key, JSON.stringify(value));
}
