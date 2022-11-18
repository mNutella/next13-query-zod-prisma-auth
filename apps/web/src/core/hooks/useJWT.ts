import { useMemo } from "react";
import { JWTPayload, ProtectedHeaderParameters } from "jose";

import { parseJwt } from "@core/utils/helpers";
import { JWTUser } from "@core/types";

type UseJWTReturn =
  | {
      headers?: ProtectedHeaderParameters;
      payload?: JWTPayload & { user?: JWTUser };
      expired: boolean;
    }
  | null
  | undefined;

export default function useJWT(jwt?: string | null): UseJWTReturn {
  return useMemo(() => parseJwt(jwt), [jwt]);
}
