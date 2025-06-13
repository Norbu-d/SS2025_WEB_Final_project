import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

// API function for liking posts - FIXED to use cookies like CreatePostModal
const likePostAPI = async (postId) => {
  try {
    // FIXED: Use same pattern as CreatePostModal - credentials: 'include' instead of Authorization header
    const response = await fetch(`http://localhost:5000/api/likes/${postId}`, {
      method: 'POST',
      credentials: 'include', // This matches your CreatePostModal pattern
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        // Removed Authorization header - using cookies instead
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || errorData.message || 'Failed to like post');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Like post error:', error);
    throw error;
  }
};

// Check if user is logged in - simplified since we're using cookies
const isUserLoggedIn = () => {
  // Since you're using cookies, you might want to check if user data exists
  // or make a simple API call to verify authentication
  return true; // Simplified - let the server handle auth validation
};

// Custom hook for like functionality
export const useLikePost = () => {
  const queryClient = useQueryClient();
  const [authError, setAuthError] = useState('');

  const likeMutation = useMutation({
    mutationFn: likePostAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['explore-posts'] });
      setAuthError('');
    },
    onError: (error) => {
      console.error('Failed to like post:', error);
      setAuthError(error.message);
    }
  });

  const handleLikePost = (postId) => {
    likeMutation.mutate(postId);
  };

  return {
    handleLikePost,
    isLiking: likeMutation.isPending,
    authError,
    setAuthError,
    isUserLoggedIn
  };
};

// Like Button Component
export const LikeButton = ({ 
  postId, 
  isLiked = false, 
  onLike, 
  isLiking = false, 
  isLoggedIn = true,
  className = "" 
}) => {
  const handleClick = () => {
    if (!isLiking && onLike) {
      onLike(postId);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className={`h-9 w-9 text-white ${className}`}
      onClick={handleClick}
      disabled={isLiking}
    >
      <Heart 
        className={`h-6 w-6 transition-colors duration-200 ${
          isLiked 
            ? 'text-red-500 fill-red-500' 
            : isLiking 
              ? 'text-red-400' 
              : 'text-white hover:text-red-400'
        }`} 
      />
    </Button>
  );
};

// Like Count Display Component
export const LikeCount = ({ count, className = "" }) => {
  if (!count || count === 0) return null;
  
  return (
    <div className={`text-sm font-medium ${className}`}>
      {count} {count === 1 ? 'like' : 'likes'}
    </div>
  );
};

// Main Like Component that combines button and count
export const LikeComponent = ({ 
  postId, 
  likeCount = 0, 
  isLiked = false, 
  onLike,
  isLiking = false,
  isLoggedIn = true,
  showCount = true,
  className = ""
}) => {
  return (
    <div className={className}>
      <LikeButton
        postId={postId}
        isLiked={isLiked}
        onLike={onLike}
        isLiking={isLiking}
        isLoggedIn={isLoggedIn}
      />
      {showCount && (
        <LikeCount count={likeCount} className="mt-2" />
      )}
    </div>
  );
};

// Removed token-based functions since we're using cookies
export { isUserLoggedIn, likePostAPI };