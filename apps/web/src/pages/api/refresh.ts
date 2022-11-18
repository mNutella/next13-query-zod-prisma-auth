import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

import { OutputSignIn } from "@lib/auth/models/signIn";
import { generateJwt, isJwtValid } from "@core/utils/helpers";
import { decodeJwt } from "jose";
import { JWTPayloadWithUser } from "@core/types";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<OutputSignIn>
) {
  const { cookies, method } = request;

  if (!cookies?.jwt || !(await isJwtValid(cookies.jwt))) {
    response.status(403).end("Unauthorized");
    return;
  }

  switch (method) {
    case "GET": {
      try {
        const { user } = decodeJwt(cookies.jwt) as JWTPayloadWithUser;
        const userData = {
          user,
        };
        const accessToken = await generateJwt(
          userData,
          "urn:nextapp:issuer",
          `urn:${user.name}:audience`,
          "15m"
          // "1m"
        );

        // TODO: if the refresh token close to expiration then update it too
        // const refreshToken = await generateJwt(
        //   userData,
        //   "urn:nextapp:issuer",
        //   `urn:${user.name}:audience`,
        //   "2d"
        // );

        // response.setHeader(
        //   "Set-Cookie",
        //   serialize("jwt", refreshToken, {
        //     httpOnly: true,
        //     sameSite: "strict",
        //     maxAge: 2 * 24 * 60 * 60 * 1000,
        //   })
        // );

        response.status(200).json({ token: accessToken });
      } catch (error) {
        response.status(500).end("Internal server error");
      }
      break;
    }

    default:
      response.setHeader("Allow", ["GET"]);
      response.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
