import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Helper function to format time ago
const formatTimeAgo = (dateString: string): string => {
  const now = new Date();
  const commentDate = new Date(dateString);
  const diffInMinutes = Math.floor((now.getTime() - commentDate.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'now';
  if (diffInMinutes < 60) return ${diffInMinutes}m;
  if (diffInMinutes < 1440) return ${Math.floor(diffInMinutes / 60)}h;
  return ${Math.floor(diffInMinutes / 1440)}d;
};

// API functions using cookie authentication
const addCommentAPI = async ({ postId, content }: { postId: number, content: string }) => {
  try {
    const response = await fetch(http://localhost:5000/api/posts/${postId}/comments, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ content })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || errorData.message || 'Failed to add comment');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Add comment error:', error);
    throw error;
  }
};

const deleteCommentAPI = async (commentId: number) => {
  try {
    const response = await fetch(http://localhost:5000/api/comments/${commentId}, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || errorData.message || 'Failed to delete comment');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Delete comment error:', error);
    throw error;
  }
};

// Custom hooks for comment operations
export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCommentAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
    onError: (error: Error) => {
      console.error('Failed to add comment:', error);
      alert(error.message);
    }
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCommentAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
    onError: (error: Error) => {
      console.error('Failed to delete comment:', error);
      alert(error.message);
    }
  });
};

interface CommentProps {
  comment: {
    id: number;
    content: string;
    user_id: number;
    user?: {
      username: string;
      profile_picture?: string;
    };
    created_at: string;
  };
  currentUser?: {
    id: number;
    username: string;
  };
  postOwnerId: number;
  onDelete: (commentId: number) => void;
  isDeleting?: boolean;
}

export function Comment({ 
  comment, 
  currentUser, 
  postOwnerId,
  onDelete,
  isDeleting = false 
}: CommentProps) {
  const [showOptions, setShowOptions] = useState(false);
  
  const canDelete = currentUser && (
    currentUser.id === comment.user_id || 
    currentUser.id === postOwnerId
  );

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      onDelete(comment.id);
    }
    setShowOptions(false);
  };

  return (
    <div className="flex gap-3 py-2 group">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage 
          src={comment.user?.profile_picture || "/placeholder.svg"} 
          alt={comment.user?.username} 
        />
        <AvatarFallback className="text-xs">
          {comment.user?.username?.substring(0, 2).toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="bg-zinc-800/50 rounded-2xl px-3 py-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm text-white">
              {comment.user?.username}
            </span>
            <span className="text-xs text-zinc-400">
              {formatTimeAgo(comment.created_at)}
            </span>
          </div>
          <p className="text-sm text-zinc-200 break-words">
            {comment.content}
          </p>
        </div>

        <div className="flex items-center gap-4 mt-1 ml-3">
          <button className="text-xs text-zinc-400 hover:text-zinc-300">
            Like
          </button>
          <button className="text-xs text-zinc-400 hover:text-zinc-300">
            Reply
          </button>
        </div>
      </div>

      {canDelete && (
        <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-400 hover:text-zinc-300"
            onClick={() => setShowOptions(!showOptions)}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>

          {showOptions && (
            <div className="absolute right-0 top-8 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-10 min-w-[120px]">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-zinc-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="h-4 w-4" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      )}

      {showOptions && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowOptions(false)}
        />
      )}
    </div>
  );
}

interface CommentInputProps {
  onSubmit: (content: string) => void;
  isSubmitting?: boolean;
  placeholder?: string;
  isLoggedIn?: boolean;
}

export function CommentInput({ 
  onSubmit, 
  isSubmitting = false, 
  placeholder = "Add a comment...",
  isLoggedIn = true
}: CommentInputProps) {
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim() && !isSubmitting && isLoggedIn) {
      onSubmit(comment.trim());
      setComment('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex gap-3 mt-4">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="text-xs">?</AvatarFallback>
        </Avatar>
        <div className="flex-1 bg-zinc-800/50 text-sm px-4 py-2 rounded-full text-zinc-500 border border-zinc-700/50">
          Please log in to comment
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 mt-4">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src="/placeholder.svg" alt="You" />
        <AvatarFallback className="text-xs">You</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 flex gap-2">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 bg-zinc-800/50 text-sm px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-white placeholder-zinc-500 border border-zinc-700/50"
          disabled={isSubmitting}
          maxLength={500}
        />
        <Button 
          type="submit"
          variant="ghost"
          className="text-blue-500 hover:text-blue-400 px-4 h-auto text-sm font-medium"
          disabled={!comment.trim() || isSubmitting}
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </Button>
      </div>
    </form>
  );
}

interface CommentSectionProps {
  comments?: Array<{
    id: number;
    content: string;
    user_id: number;
    user?: {
      username: string;
      profile_picture?: string;
    };
    created_at: string;
  }>;
  postId: number;
  postOwnerId: number;
  currentUser?: {
    id: number;
    username: string;
  };
  showComments?: boolean;
  onToggleComments: () => void;
  isLoggedIn?: boolean;
}

export function CommentSection({ 
  comments = [], 
  postId, 
  postOwnerId,
  currentUser,
  showComments = false,
  onToggleComments,
  isLoggedIn = true
}: CommentSectionProps) {
  const addCommentMutation = useAddComment();
  const deleteCommentMutation = useDeleteComment();
  
  const commentCount = comments.length;

  const handleAddComment = (content: string) => {
    addCommentMutation.mutate({ postId, content });
  };

  const handleDeleteComment = (commentId: number) => {
    deleteCommentMutation.mutate(commentId);
  };

  return (
    <div className="space-y-3">
      {commentCount > 0 && (
        <button 
          className="text-sm text-zinc-400 hover:text-zinc-300 transition-colors"
          onClick={onToggleComments}
        >
          {showComments 
            ? 'Hide comments' 
            : `View ${commentCount === 1 ? '1 comment' : all ${commentCount} comments}`
          }
        </button>
      )}

      {showComments && commentCount > 0 && (
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              currentUser={currentUser}
              postOwnerId={postOwnerId}
              onDelete={handleDeleteComment}
              isDeleting={deleteCommentMutation.isPending}
            />
          ))}
        </div>
      )}

      <CommentInput
        onSubmit={handleAddComment}
        isSubmitting={addCommentMutation.isPending}
        placeholder="Add a comment..."
        isLoggedIn={isLoggedIn}
      />
    </div>
  );
}