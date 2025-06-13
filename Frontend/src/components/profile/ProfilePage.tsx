// components/Profile/ProfilePage.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GridPost } from "@/components/Profile/GridPost";

export function ProfilePage() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5000/api/users/profile/${userId}`,
          { credentials: 'include' }
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        
        const data = await response.json();
        if (data.success) {
          setProfile(data.profile);
          setIsFollowing(data.profile.isFollowing);
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleFollow = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/follow', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ followingId: userId })
      });
      
      const data = await response.json();
      if (data.success) {
        setIsFollowing(true);
        // Update follower count
        setProfile(prev => ({
          ...prev,
          _count: {
            ...prev._count,
            followers: prev._count.followers + 1
          }
        }));
      }
    } catch (error) {
      console.error("Follow error:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/unfollow', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ followingId: userId })
      });
      
      const data = await response.json();
      if (data.success) {
        setIsFollowing(false);
        // Update follower count
        setProfile(prev => ({
          ...prev,
          _count: {
            ...prev._count,
            followers: prev._count.followers - 1
          }
        }));
      }
    } catch (error) {
      console.error("Unfollow error:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="text-center py-8 text-gray-500">Profile not found</div>;
  }

  const isCurrentUser = currentUser && currentUser.id === parseInt(userId);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 py-6">
        <Avatar className="h-32 w-32 md:h-40 md:w-40">
          <AvatarImage 
            src={profile.profile_picture || "/placeholder.svg"} 
            alt={profile.username} 
          />
          <AvatarFallback>
            {profile.username.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 w-full">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <h1 className="text-2xl font-bold">{profile.username}</h1>
            
            {isCurrentUser ? (
              <Link to="/settings">
                <Button variant="outline">Edit Profile</Button>
              </Link>
            ) : isFollowing ? (
              <div className="flex gap-2">
                <Button onClick={handleUnfollow} variant="outline">Following</Button>
                <Button variant="outline">Message</Button>
              </div>
            ) : (
              <Button onClick={handleFollow}>Follow</Button>
            )}
          </div>
          
          <div className="flex gap-6 mb-4">
            <div>
              <span className="font-bold">{profile._count.posts}</span> posts
            </div>
            <div>
              <span className="font-bold">{profile._count.followers}</span> followers
            </div>
            <div>
              <span className="font-bold">{profile._count.following}</span> following
            </div>
          </div>
          
          <div>
            <p className="font-semibold">{profile.full_name}</p>
            {profile.bio && <p className="mt-2">{profile.bio}</p>}
          </div>
        </div>
      </div>
      
      {/* Posts Grid */}
      {profile.posts.length > 0 ? (
        <div className="grid grid-cols-3 gap-1 md:gap-4">
          {profile.posts.map(post => (
            <GridPost key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-t border-gray-800">
          <div className="text-4xl mb-4">📷</div>
          <p className="text-xl font-light">No posts yet</p>
        </div>
      )}
    </div>
  );
}