import { JWTPayload } from "jose";
import { NextRequest } from "next/server";

export type JWTUser = { name: string; surname: string };

export type JWTPayloadWithUser = JWTPayload & {
  user: JWTUser;
  "X-User-Fingerprint": string;
};

export type RequestWithAuth = NextRequest & {
  headers: { Authentication: string };
};
