// src/components/PostsList.tsx
import { useQuery } from '@tanstack/react-query';

type Post = {
  id: string;
  image_url: string;
  caption?: string;
  user: {
    username: string;
    profile_picture?: string;
  };
};

export default function PostsList() {
  // Step 1: Fetch posts
  const { data: posts, isLoading, error } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/api/posts');
      if (!response.ok) throw new Error('Failed to fetch posts');
      return response.json();
    }
  });

  // Step 2: Handle loading/error states
  if (isLoading) return <div className="p-4">Loading posts...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;

  // Step 3: Render posts
  return (
    <div className="space-y-4">
      {posts?.map((post) => (
        <div key={post.id} className="border p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <img 
              src={post.user.profile_picture || '/default-avatar.png'} 
              alt={post.user.username}
              className="w-8 h-8 rounded-full"
            />
            <span className="font-bold">{post.user.username}</span>
          </div>
          <img 
            src={post.image_url} 
            alt={post.caption || 'Post image'} 
            className="w-full rounded"
          />
          {post.caption && <p className="mt-2">{post.caption}</p>}
        </div>
      ))}
    </div>
  );
}