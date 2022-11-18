import { API_ROUTES } from '@core/config/constants';
import { pathToApiUrl } from '@core/utils/helpers';
import { fetcher } from '@core/utils/api';
import { OutputPosts } from '@lib/posts/models/allPosts';

export async function getPosts() {
  // const promise = new Promise((resolve) =>
  //   setTimeout(
  //     // async () => resolve(await fetch(pathToApiUrl(API_ROUTES.posts))),
  //     async () => resolve({}),
  //     3000,
  //   ),
  // );
  // const response = await promise;

  const response = await fetcher<OutputPosts>(
    pathToApiUrl(API_ROUTES.posts),
    true,
  );

  return response;
}
