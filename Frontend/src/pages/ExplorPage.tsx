import { Link } from "react-router-dom";
import { LeftSidebar } from "@/components/Home/LeftSidebar";
import { Search, Heart, MessageCircle, Video, Home } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function ExplorePage() {
  const trendingPosts = Array.from({ length: 12 }).map((_, i) => ({
    id: i + 1,
    imageUrl: `/placeholder.svg?height=300&width=300&random=${i}`,
    likes: Math.floor(Math.random() * 1000) + 100,
    comments: Math.floor(Math.random() * 100) + 10,
  }));

  return (
    <div className="flex bg-black text-white min-h-screen">
      {/* Left Sidebar */}
      <LeftSidebar />

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto pb-20">
        {/* Search Bar */}
        <div className="sticky top-0 z-10 bg-black bg-opacity-90 backdrop-blur-sm p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-gray-900 text-white rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
          </div>
        </div>

        {/* Trending Posts Grid */}
        <div className="grid grid-cols-3 gap-1 mt-4">
          {trendingPosts.map((post) => (
            <div key={post.id} className="aspect-square relative group">
              <img
                src={post.imageUrl}
                alt={`Trending post ${post.id}`}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex gap-4 text-white">
                  <div className="flex items-center gap-1">
                    <Heart className="h-5 w-5 fill-white" />
                    <span className="font-semibold">{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-5 w-5 fill-white" />
                    <span className="font-semibold">{post.comments}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 py-3 px-6 flex justify-around md:hidden">
        <Link to="/" className="p-1 text-white">
          <Home className="h-6 w-6" />
        </Link>
        <Link to="/explore" className="p-1 text-white">
          <Search className="h-6 w-6" />
        </Link>
        <Link to="/reels" className="p-1 text-white">
          <Video className="h-6 w-6" />
        </Link>
        <Link to="/activity" className="p-1 text-white">
          <Heart className="h-6 w-6" />
        </Link>
        <Link to="/profile" className="p-1">
          <Avatar className="w-6 h-6">
            <AvatarImage src="/placeholder.svg?height=30&width=30" alt="@username" />
            <AvatarFallback className="text-black">UN</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </div>
  );
}
