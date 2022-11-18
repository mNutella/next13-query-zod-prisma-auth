import { API_ROUTES } from "@core/config/constants";
import { pathToApiUrl } from "@core/utils/helpers";
import { useFetch } from "@core/utils/reactQuery";
import { OutputPosts } from "../models/allPosts";

export default function usePosts() {
  return useFetch<OutputPosts>(
    pathToApiUrl(API_ROUTES.posts),
    undefined,
    {
      retry: 2,
      // suspense: true,
      // useErrorBoundary: true,
    },
    true
  );
}
