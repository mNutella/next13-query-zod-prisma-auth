import { NextResponse } from "next/server";

import isAuthValid from "@lib/auth/utils/isAuthValid";
import { API_ROUTES } from "@core/config/constants";
import { isAuthRoute } from "@core/utils/helpers";
import { RequestWithAuth } from "@core/types";

export async function middleware(request: RequestWithAuth) {
  if (
    isAuthRoute(request.nextUrl.pathname, [API_ROUTES.post, API_ROUTES.posts])
  ) {
    if (!(await isAuthValid(request))) {
      return NextResponse.rewrite(request.url, {
        status: 403,
      });
    }
  }

  return NextResponse.next();
}
