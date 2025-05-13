import { Link } from "react-router-dom";
import { LeftSidebar } from "@/components/Home/LeftSidebar";
import { Heart, MessageCircle, Video, Home, Search } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function ExplorePage() {
  // Use the same postImages from ProfilePage
  const postImages = [
    "https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb",
    "https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
    "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df",
    "https://images.unsplash.com/photo-1531123897727-8f129e1688ce",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9",
    "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9"
  ];

  const trendingPosts = postImages.map((url, index) => ({
    id: index,
    imageUrl: `${url}?w=300&h=300&fit=crop`
  }));

  return (
    <div className="flex bg-black text-white">
      <LeftSidebar />

      <div className="flex-1 p-4 md:p-8 max-w-screen-md mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Explore</h1>
        <div className="grid grid-cols-3 gap-1">
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
                    <span className="font-semibold">{Math.floor(Math.random() * 1000)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-5 w-5 fill-white" />
                    <span className="font-semibold">{Math.floor(Math.random() * 100)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Mobile Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 py-3 px-6 flex justify-around md:hidden">
          <button className="p-1 text-white">
            <Home className="h-6 w-6" />
          </button>
          <button className="p-1 text-white">
            <Search className="h-6 w-6" />
          </button>
          <button className="p-1 text-white">
            <Video className="h-6 w-6" />
          </button>
          <button className="p-1 text-white">
            <Heart className="h-6 w-6" />
          </button>
          <button className="p-1">
            <Avatar className="w-6 h-6">
              <AvatarImage
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=30&h=30&fit=crop"
                alt="@username"
              />
              <AvatarFallback className="text-black">UN</AvatarFallback>
            </Avatar>
          </button>
        </div>
      </div>
    </div>
  );
}
