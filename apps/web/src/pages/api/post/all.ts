import { NextApiRequest, NextApiResponse } from "next";

// import prisma from "@core/utils/prisma";
import { OutputPosts } from "../../../lib/posts/models/allPosts";
import mockPosts from "../../../fixtures/posts.json";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<OutputPosts>
) {
  const { body, method } = request;

  if (response.statusCode === 403) {
    response.end(response.statusMessage);
    return;
  }

  switch (method) {
    case "GET": {
      try {
        response.status(200).json(mockPosts);
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
