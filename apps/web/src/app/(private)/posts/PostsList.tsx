'use client';

import usePosts from '@lib/posts/hooks/usePosts';
import Skeletons from './PostsSkeletons';

// export function PostsList({ items }: { items: OutputPosts }) {
export function PostsList() {
  const { data, isLoading, error } = usePosts();

  if (error) {
    throw new Error('Posts fetch failed');
  }

  if (isLoading) {
    return <Skeletons />;
  }

  return (
    <ul aria-labelledby="ellipsis-list-demo" className="space-y-4">
      {data?.map((post) => (
        <li key={post.id}>
          <article className="p-4 transition-colors duration-100 rounded hover:cursor-pointer hover:bg-blue-50">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-slate-300" />
              <p className="ml-4 text-gray-700">{post.author.username}</p>
            </div>
            <div>
              <h2 className="mt-4 text-xl leading-tight">{post.title}</h2>
              <p className="mt-2 text-gray-700">{post.description}</p>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
