import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useCallback, useRef } from 'react';
import { LeftSidebar } from "../components/Home/LeftSidebar";

type User = {
  username: string;
  profile_picture: string | null;
};

type Like = {
  user: User;
};

type Comment = {
  user: User;
};

type Post = {
  id: number;
  image_url: string;
  caption: string | null;
  created_at: string;
  user: User;
  like_count: number;
  comment_count: number;
  likes: Like[];
  comments: Comment[];
};

type ExploreResponse = {
  success: boolean;
  data: Post[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    postsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    isRepeating: boolean;
  };
  count: number;
};

export function ExplorePage() {
  const observerRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery<ExploreResponse>({
    queryKey: ['explore-posts'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch(
        `http://localhost:5000/api/posts/explore?page=${pageParam}&limit=6`
      );
      if (!response.ok) throw new Error('Failed to load posts');
      
      const result = await response.json();
      
      if (!result.success || !Array.isArray(result.data)) {
        throw new Error('Invalid response format');
      }
      
      return result;
    },
    getNextPageParam: (lastPage) => {
      // Always allow next page for infinite scroll (including repetition)
      return lastPage.pagination.hasNextPage || lastPage.pagination.isRepeating
        ? lastPage.pagination.currentPage + 1
        : undefined;
    },
    initialPageParam: 1,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Intersection Observer for infinite scroll
  const lastPostElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observerRef.current) observerRef.current.disconnect();
      
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      });
      
      if (node) observerRef.current.observe(node);
    },
    [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Flatten all posts from all pages
  const allPosts = data?.pages.flatMap(page => 
    page.data.filter((post: Post) => post.image_url)
  ) || [];

  // Check if we're showing repeated content
  const isShowingRepeatedContent = data?.pages.some(page => page.pagination.isRepeating) || false;

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px' 
      }}>
        <div>Loading posts...</div>
      </div>
    );
  }

  if (error) {
    console.error('Explore posts error:', error);
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '20px',
        color: 'red' 
      }}>
        <p>Error loading posts: {error.message}</p>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  if (!allPosts.length) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px',
        color: '#666' 
      }}>
        <h2>No posts found</h2>
        <p>Be the first to share something!</p>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh',
      backgroundColor: '#000000',
      color: 'white'
    }}>
      {/* Left Sidebar */}
      <LeftSidebar />
      
      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        marginLeft: '250px',
        padding: '20px 40px'
      }}>
        <h1 style={{ 
          marginBottom: '30px', 
          textAlign: 'center',
          fontSize: '24px',
          fontWeight: '300',
          color: '#ffffff'
        }}>
          Explore
        </h1>

        {/* Repeated content indicator */}
        {isShowingRepeatedContent && (
          <div style={{
            textAlign: 'center',
            marginBottom: '20px',
            padding: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: '#ffffff',
            fontSize: '14px'
          }}>
            🔄 You've seen all posts! Showing content again...
          </div>
        )}
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '4px',
          maxWidth: '935px',
          margin: '0 auto'
        }}>
          {allPosts.map((post, index) => (
            <div 
              key={`${post.id}-${index}`} // Use index to handle repeated posts
              ref={index === allPosts.length - 1 ? lastPostElementRef : null}
              style={{
                position: 'relative',
                aspectRatio: '1',
                overflow: 'hidden',
                cursor: 'pointer',
                backgroundColor: '#f8f8f8',
                border: '1px solid #e1e1e1'
              }}
              onMouseEnter={(e) => {
                const overlay = e.currentTarget.querySelector('.hover-overlay') as HTMLElement;
                if (overlay) {
                  overlay.style.opacity = '1';
                }
              }}
              onMouseLeave={(e) => {
                const overlay = e.currentTarget.querySelector('.hover-overlay') as HTMLElement;
                if (overlay) {
                  overlay.style.opacity = '0';
                }
              }}
            >
              <img 
                src={post.image_url} 
                alt={post.caption || `Post by ${post.user.username}`}
                style={{ 
                  width: '100%', 
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
                onLoad={(e) => {
                  console.log('Image loaded successfully:', post.image_url);
                }}
                onError={(e) => {
                  console.error('Failed to load image:', post.image_url);
                  const target = e.target as HTMLImageElement;
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div style="
                        width: 100%; 
                        height: 100%; 
                        background: #f0f0f0; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center;
                        color: #8e8e8e;
                        font-size: 14px;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                      ">
                        <svg width="53" height="53" viewBox="0 0 53 53" fill="none">
                          <path d="M5 48C5 44.134 8.13401 41 12 41H41C44.866 41 48 44.134 48 48V48C48 48.552 47.552 49 47 49H6C5.448 49 5 48.552 5 48V48Z" fill="#8e8e8e"/>
                          <circle cx="35" cy="16" r="6" fill="#8e8e8e"/>
                          <circle cx="26.5" cy="26.5" r="26.5" stroke="#8e8e8e" stroke-width="3" fill="none"/>
                        </svg>
                      </div>
                    `;
                  }
                }}
                loading="lazy"
              />
              
              {/* Hover Overlay */}
              <div 
                className="hover-overlay"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.15s ease-in-out',
                  color: 'white',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '20px' 
                }}>
                  {/* Heart Icon with Like Count */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px' 
                  }}>
                    <svg 
                      width="19" 
                      height="19" 
                      viewBox="0 0 48 48" 
                      fill="white"
                    >
                      <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"/>
                    </svg>
                    <span>{post.like_count || 0}</span>
                  </div>
                  
                  {/* Comment Icon with Comment Count */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px' 
                  }}>
                    <svg 
                      width="19" 
                      height="19" 
                      viewBox="0 0 48 48" 
                      fill="white"
                    >
                      <path d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1 2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2 1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7.8-2.6 11.2-.2.4-.3.9-.2 1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-3.4 1.8-7.2 2.6-11.2 2.6-11.2 0-20.2-9.1-20.2-20.4S12.7 4 24 4s20.5 9.1 20.5 20.4z"/>
                    </svg>
                    <span>{post.comment_count || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading indicator for infinite scroll */}
        {isFetchingNextPage && (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            color: '#ffffff'
          }}>
            <div style={{
              display: 'inline-block',
              width: '20px',
              height: '20px',
              border: '2px solid #ffffff',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ marginTop: '10px', fontSize: '14px' }}>Loading more posts...</p>
          </div>
        )}

        {/* CSS for loading spinner */}
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
  );
}