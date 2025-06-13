import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, MoreHorizontal, Bookmark, Send } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Import comment components from separate file
import { Comment, CommentInput, CommentSection } from '../CreateComment/Comment'; // Adjust path as needed

// Import like components and hooks
import { 
  useLikePost, 
  LikeButton, 
  LikeCount,
  isUserLoggedIn 
} from '../CreateLike/CreateLikeModal'; // Adjust path as needed

// Time formatting utility
const formatTimeAgo = (dateString) => {
  const now = new Date();
  const commentDate = new Date(dateString);
  const diffInMinutes = Math.floor((now - commentDate) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'now';
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
  return `${Math.floor(diffInMinutes / 1440)}d`;
};

// Enhanced API functions (without like functionality - moved to CreateLike)
const api = {
  getPosts: async () => {
    try {
      const possibleEndpoints = [
        'http://localhost:5000/api/posts',
        '/api/posts',
        'http://localhost:3000/api/posts',
        '/posts'
      ];
      
      let response;
      let lastError;
      
      for (const endpoint of possibleEndpoints) {
        try {
          response = await fetch(endpoint, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });
          
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            throw new Error(`Expected JSON but got ${contentType}`);
          }
          
          if (response.ok) {
            const data = await response.json();
            console.log('API Response:', data);
            return data;
          }
        } catch (error) {
          lastError = error;
          console.log(`Failed to fetch from ${endpoint}:`, error.message);
          continue;
        }
      }
      
      // If all endpoints failed, return mock data
      console.warn('All API endpoints failed, using mock data');
      return {
        success: true,
        data: [
          {
            id: 1,
            user: {
              id: 1,
              username: "family_street_blrutan",
              profile_picture: "/placeholder.svg"
            },
            image_url: "https://sm.ign.com/t/ign_ap/tv/a/anime/anime_ejbs.600.jpg",
            caption: "Original audio",
            created_at: new Date(Date.now() - 3600000).toISOString(),
            like_count: 24,
            comment_count: 3,
            likes: [],
            comments: [
              { 
                id: 1, 
                content: "Great post!", 
                user: { id: 2, username: "user1" }, 
                user_id: 2,
                created_at: new Date(Date.now() - 1800000).toISOString()
              },
              { 
                id: 2, 
                content: "Amazing content! Keep it up 🔥", 
                user: { id: 3, username: "user2" }, 
                user_id: 3,
                created_at: new Date(Date.now() - 900000).toISOString()
              }
            ]
          },
          {
            id: 2,
            user: {
              id: 4,
              username: "travel_moments",
              profile_picture: "/placeholder.svg"
            },
            image_url: "https://sm.ign.com/t/ign_ap/tv/a/anime/anime_ejbs.600.jpg",
            caption: "Beautiful sunset at the beach #travel #sunset",
            created_at: new Date(Date.now() - 10800000).toISOString(),
            like_count: 156,
            comment_count: 12,
            likes: [],
            comments: []
          }
        ]
      };
    } catch (error) {
      console.error('API Error:', error);
      throw new Error(`API Error: ${error.message}`);
    }
  },

  getComments: async (postId) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/comments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Get comments error:', error);
      return [];
    }
  },

  addComment: async ({ postId, content }) => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('Please log in to comment');
      }
      
      console.log('Adding comment with token:', token ? 'Present' : 'Missing');
      console.log('Post ID:', postId, 'Content:', content);
      
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned non-JSON response');
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add comment');
      }
      
      return data;
    } catch (error) {
      console.error('Add comment error:', error);
      throw error;
    }
  },

  deleteComment: async (commentId) => {
    try {
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('Please log in to delete comments');
      }
      
      const response = await fetch(`http://localhost:5000/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete comment');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Delete comment error:', error);
      throw error;
    }
  }
};

export function MiddleContent() {
  const queryClient = useQueryClient();
  const [showCommentsForPost, setShowCommentsForPost] = useState({});
  const [commentAuthError, setCommentAuthError] = useState('');

  // Use the separated like functionality
  const { 
    handleLikePost, 
    isLiking, 
    authError: likeAuthError, 
    setAuthError: setLikeAuthError 
  } = useLikePost();

  // Check if user is logged in
  const isLoggedIn = isUserLoggedIn();

  // Mock current user - replace this with actual user data from your auth context
  const currentUser = isLoggedIn ? {
    id: 1,
    username: "current_user",
    profile_picture: "/placeholder.svg"
  } : null;

  // Fetch posts using TanStack Query
  const { 
    data: postsResponse, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['posts'],
    queryFn: api.getPosts,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
    onError: (error) => {
      console.error('Query error:', error);
    }
  });

  // Add comment mutation
  const commentMutation = useMutation({
    mutationFn: api.addComment,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
      setCommentAuthError('');
    },
    onError: (error) => {
      console.error('Failed to add comment:', error);
      setCommentAuthError(error.message);
    }
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: api.deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setCommentAuthError('');
    },
    onError: (error) => {
      console.error('Failed to delete comment:', error);
      setCommentAuthError(error.message);
    }
  });

  const handleAddComment = (postId, content) => {
    if (!isLoggedIn) {
      setCommentAuthError('Please log in to comment');
      return;
    }
    commentMutation.mutate({ postId, content });
  };

  const handleDeleteComment = (commentId) => {
    if (!isLoggedIn) {
      setCommentAuthError('Please log in to delete comments');
      return;
    }
    deleteCommentMutation.mutate(commentId);
  };

  const toggleCommentsForPost = (postId) => {
    setShowCommentsForPost(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const stories = [
    "kd3oyy_",
    "gkeyxdd", 
    "w_wabbittt",
    "sonchacho",
    "jamyang_c",
    "tennzeyy_nn",
    "charles_san_",
    "notorious_",
  ];

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="px-4 py-4 border-b border-zinc-800"> 
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-4 pb-4">
              {stories.map((name, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-fuchsia-600">
                    <Avatar className="h-16 w-16 border-2 border-[#121212]">
                      <AvatarImage src="/placeholder.svg?height=60&width=60" alt={name} />
                      <AvatarFallback>{name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <span className="text-xs truncate max-w-[64px]">{name}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex items-center justify-center h-64">
          <div className="text-zinc-400">Loading posts...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="px-4 py-4 border-b border-zinc-800"> 
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-4 pb-4">
              {stories.map((name, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-fuchsia-600">
                    <Avatar className="h-16 w-16 border-2 border-[#121212]">
                      <AvatarImage src="/placeholder.svg?height=60&width=60" alt={name} />
                      <AvatarFallback>{name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <span className="text-xs truncate max-w-[64px]">{name}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="text-red-400">Error: {error.message}</div>
          <Button 
            onClick={() => refetch()} 
            variant="outline" 
            className="text-white border-zinc-700"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const posts = postsResponse?.data || [];
  
  return (
    <div className="w-full">
      {/* Auth Error Display - Combined like and comment errors */}
      {(likeAuthError || commentAuthError) && (
        <div className="mx-4 mb-4 p-3 bg-red-900/20 border border-red-700 rounded-lg">
          {likeAuthError && (
            <div className="mb-2">
              <p className="text-red-400 text-sm">{likeAuthError}</p>
              <button 
                onClick={() => setLikeAuthError('')}
                className="text-red-300 hover:text-red-200 text-xs mt-1"
              >
                Dismiss
              </button>
            </div>
          )}
          {commentAuthError && (
            <div>
              <p className="text-red-400 text-sm">{commentAuthError}</p>
              <button 
                onClick={() => setCommentAuthError('')}
                className="text-red-300 hover:text-red-200 text-xs mt-1"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      )}

      {/* Login Status */}
      {!isLoggedIn && (
        <div className="mx-4 mb-4 p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
          <p className="text-blue-400 text-sm">
            ℹ️ You're browsing as a guest. Log in to like posts and comment.
          </p>
        </div>
      )}

      {/* Stories Section */}
      <div className="px-4 py-4 border-b border-zinc-800"> 
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-4 pb-4">
            {stories.map((name, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-fuchsia-600">
                  <Avatar className="h-16 w-16 border-2 border-[#121212]">
                    <AvatarImage src="/placeholder.svg?height=60&width=60" alt={name} />
                    <AvatarFallback>{name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                </div>
                <span className="text-xs truncate max-w-[64px]">{name}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Posts Section */}
      <div className="space-y-6 py-4">
        {posts.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-zinc-400">No posts found</div>
          </div>
        ) : (
          posts.map((post) => (
            <Post 
              key={post.id}
              post={post}
              currentUser={currentUser}
              onLike={handleLikePost}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
              onToggleComments={() => toggleCommentsForPost(post.id)}
              showComments={showCommentsForPost[post.id] || false}
              isLiking={isLiking}
              isCommenting={commentMutation.isPending}
              isDeletingComment={deleteCommentMutation.isPending}
              isLoggedIn={isLoggedIn}
            />
          ))
        )}
      </div>
    </div>
  );
}

function Post({ 
  post,
  currentUser,
  onLike,
  onAddComment,
  onDeleteComment,
  onToggleComments,
  showComments,
  isLiking,
  isCommenting,
  isDeletingComment,
  isLoggedIn
}) {
  return (
    <div className="border-b border-zinc-800 pb-6 last:border-b-0">
      {/* Post Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={post.user?.profile_picture || "/placeholder.svg"} 
              alt={post.user?.username} 
            />
            <AvatarFallback>
              {post.user?.username?.substring(0, 2).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <span className="font-medium">{post.user?.username}</span>
            <span className="text-zinc-400 text-sm"> • {formatTimeAgo(post.created_at)}</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 text-white">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Post Image */}
      {post.image_url && (
        <div className="flex justify-center my-2">
          <div className="relative w-full max-w-[500px]">
            <img 
              src={post.image_url} 
              alt="Post" 
              className="w-full aspect-square object-cover" 
              loading="lazy"
            />
          </div>
        </div>
      )}

      {/* Post Actions */}
      <div className="px-4 pt-3">
        <div className="flex justify-between mb-2">
          <div className="flex gap-4">
            {/* Use the separated LikeButton component */}
            <LikeButton 
              postId={post.id}
              onLike={onLike}
              isLiking={isLiking}
              isLoggedIn={isLoggedIn}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 text-white"
              onClick={onToggleComments}
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-white">
              <Send className="h-6 w-6" />
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-white">
            <Bookmark className="h-6 w-6" />
          </Button>
        </div>

        {/* Use the separated LikeCount component */}
        <LikeCount count={post.like_count} className="mb-2" />

        {/* Caption */}
        {post.caption && (
          <div className="text-sm mb-3">
            <span className="font-medium">{post.user?.username}</span> 
            <span className="ml-2">{post.caption}</span>
          </div>
        )}

        {/* Comments Section */}
        <CommentSection
          comments={post.comments || []}
          postId={post.id}
          postOwnerId={post.user?.id}
          currentUser={currentUser}
          onAddComment={onAddComment}
          onDeleteComment={onDeleteComment}
          onToggleComments={onToggleComments}
          showComments={showComments}
          isCommenting={isCommenting}
          isDeletingComment={isDeletingComment}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </div>
  );
}