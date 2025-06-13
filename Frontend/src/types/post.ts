// src/types/post.ts
export type Post = {
  id: number;
  image_url: string;
  user_id: number;
  created_at: string;
  user: {
    username: string;
    profile_picture?: string | null;
  };
  likes: Array<{
    id: number;
    user_id: number;
  }>;
  comments: Array<{
    id: number;
    content: string;
  }>;
};