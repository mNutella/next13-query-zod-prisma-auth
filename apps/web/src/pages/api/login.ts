import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import { createHash, randomBytes } from "crypto";

import { inputSignInSchema, OutputSignIn } from "@lib/auth/models/signIn";
import { generateJwt, verifyPassword } from "@core/utils/helpers";
import prisma from "@core/utils/prisma";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<OutputSignIn>
) {
  const { body, method } = request;
  const credentials = JSON.parse(body);
  const validatedSchema = inputSignInSchema.safeParse(credentials);

  if (!validatedSchema.success) {
    response.status(422).end("Cannot process the content");
    return;
  }

  switch (method) {
    case "POST": {
      try {
        const { username, password } = credentials;

        const user = await prisma.user.findFirst({
          where: {
            username,
          },
        });

        if (!user) {
          response.status(409).end("User doesn't exist");
          return;
        }

        if (!verifyPassword(password, user.password)) {
          response.status(401).end("Invalid credentials");
          return;
        }

        const fingerprint = randomBytes(128).toString("hex");
        const hashedFingerprint = createHash("sha256")
          .update(fingerprint)
          .digest("hex");
        const userData = {
          user: { name: "lex", surname: "fetov" },
          "X-User-Fingerprint": hashedFingerprint,
        };
        const accessToken = await generateJwt(
          userData,
          "urn:nextapp:issuer",
          `urn:lex:audience`,
          "15m"
          // "1m"
        );
        const refreshToken = await generateJwt(
          userData,
          "urn:nextapp:issuer",
          `urn:lex:audience`,
          "20m"
          // "3m"
        );

        response.setHeader("Set-Cookie", [
          serialize("jwt", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 2 * 24 * 60 * 60 * 1000,
            // maxAge: 3 * 60 * 1000,
          }),
          serialize("fingerprint", fingerprint, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 2 * 24 * 60 * 60 * 1000,
          }),
        ]);

        response.status(200).json({ token: accessToken });
      } catch (error) {
        response.status(500).end("Internal server error");
      }
      break;
    }

    default:
      response.setHeader("Allow", ["POST"]);
      response.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
