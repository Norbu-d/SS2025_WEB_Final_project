// components/Profile/GridPost.tsx
import { Link } from "react-router-dom";
import { Heart, MessageCircle } from "lucide-react";

export function GridPost({ post }) {
  return (
    <Link to={`/p/${post.id}`} className="relative group">
      <div className="aspect-square overflow-hidden bg-gray-900">
        <img 
          src={post.image_url} 
          alt="Post" 
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center gap-6 opacity-0 group-hover:opacity-100 transition-all">
        <div className="flex items-center text-white font-bold">
          <Heart className="h-5 w-5 mr-1 fill-white" />
          {post.likes.length}
        </div>
        <div className="flex items-center text-white font-bold">
          <MessageCircle className="h-5 w-5 mr-1" />
          {post.comments.length}
        </div>
      </div>
    </Link>
  );
}