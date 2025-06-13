import { Post } from "@/types/post";

// Helper to unwrap the data property
async function unwrapData<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }
  const json = await response.json();
  // Assumes the shape: { success: boolean, data: T, ... }
  return json.data as T;
}

// Fetch all posts (feed)
export const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch('http://localhost:5000/api/posts');
  return unwrapData<Post[]>(response);
};

// Fetch a single post
export const fetchPostById = async (postId: string): Promise<Post> => {
  const response = await fetch(`http://localhost:5000/api/posts/${postId}`);
  return unwrapData<Post>(response);
};

// Create a post (with image upload)
export const createPost = async (formData: FormData): Promise<Post> => {
  const response = await fetch('http://localhost:5000/api/posts', {
    method: 'POST',
    credentials: 'include', // For cookies (if using auth)
    body: formData, // Handles file upload
  });
  return unwrapData<Post>(response);
};

// Delete a post
export const deletePost = async (postId: string): Promise<void> => {
  const response = await fetch(`http://localhost:5000/api/posts/${postId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to delete post');
  }
};
