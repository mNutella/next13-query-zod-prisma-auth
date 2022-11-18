import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import { createHash, randomBytes } from "crypto";

import { inputSignUpSchema, OutputSignUp } from "@lib/auth/models/signUp";
import { generateJwt, hashPassword } from "@core/utils/helpers";
import prisma from "@core/utils/prisma";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<OutputSignUp>
) {
  const { body: credentials, method } = request;
  const validatedSchema = inputSignUpSchema.safeParse(credentials);

  if (!validatedSchema.success) {
    response.status(422).end("Cannot process the content");
    return;
  }

  switch (method) {
    case "POST": {
      const { username, password } = credentials;

      try {
        const user = await prisma.user.findFirst({
          where: {
            username,
          },
          select: { id: true },
        });

        if (user) {
          response.status(409).end("User already exists");
        }

        const hashedPassword = hashPassword(password);
        await prisma.user.create({
          data: {
            username,
            password: hashedPassword,
          },
        });

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
        );
        const refreshToken = await generateJwt(
          userData,
          "urn:nextapp:issuer",
          `urn:lex:audience`,
          "2d"
        );

        response.setHeader("Set-Cookie", [
          serialize("jwt", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            // maxAge: 2 * 24 * 60 * 60 * 1000,
            maxAge: 60 * 1000,
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
