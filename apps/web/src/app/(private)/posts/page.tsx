import { PostsList } from './PostsList';

export default async function Page() {
  // const data = await getPosts();

  return (
    <section>
      <h1 className="text-2xl">Posts</h1>
      {/* <PostsList items={data} /> */}
      <PostsList />
    </section>
  );
}
