import { decodeJwt } from "jose";

import { isJwtValid, verifyFingerprint } from "@core/utils/helpers";
import { JWTPayloadWithUser, RequestWithAuth } from "@core/types";

export default async function isAuthValid(request: RequestWithAuth) {
  let accessToken = request.headers.get("Authentication") as string;
  const refreshToken = request.cookies.get("jwt");
  const fingerprint = request.cookies.get("fingerprint");

  if (!accessToken || !refreshToken || !fingerprint) return false;

  accessToken = accessToken.split(" ")[1];

  if (!(await isJwtValid(accessToken))) return false;

  const decodedJwt = decodeJwt(accessToken) as JWTPayloadWithUser;

  if (!verifyFingerprint(fingerprint, decodedJwt["X-User-Fingerprint"]))
    return false;

  return true;
}
