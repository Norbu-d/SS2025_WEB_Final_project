

import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bookmark, Grid3X3, Heart, Settings, Tag } from "lucide-react";
import { LeftSidebar } from "@/components/Home/LeftSidebar";

export function ProfilePage() {
  // Image URLs
  const profileImage = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80";
  const highlightImages = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
  ];
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

  return (
    <div className="flex bg-black text-white">
      {/* Include the LeftSidebar */}
      <LeftSidebar />
      
      {/* Main profile content */}
      <div className="max-w-screen-md mx-auto pb-20 flex-1">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-4 md:p-8">
          <Avatar className="w-20 h-20 md:w-36 md:h-36 border-2 border-white shadow">
            <AvatarImage src={`${profileImage}?w=150&h=150&fit=crop`} alt="@username" />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <h1 className="text-xl font-semibold text-white">username</h1>
              <div className="flex gap-2">
                <Button size="sm" className="h-8 bg-white text-black hover:bg-gray-200">
                  Edit profile
                </Button>
                <Button size="sm" variant="outline" className="h-8 border-gray-600">
                  <Settings className="h-4 w-4 text-white" />
                  <span className="sr-only">Settings</span>
                </Button>
              </div>
            </div>

            {/* Stats - Mobile */}
            <div className="flex justify-between border-y border-gray-800 py-3 md:hidden text-white">
              <div className="text-center">
                <div className="font-semibold">{postImages.length}</div>
                <div className="text-xs text-gray-400">Posts</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">8.5K</div>
                <div className="text-xs text-gray-400">Followers</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">512</div>
                <div className="text-xs text-gray-400">Following</div>
              </div>
            </div>

            {/* Stats - Desktop */}
            <div className="hidden md:flex gap-8 text-white">
              <div>
                <span className="font-semibold">{postImages.length}</span> posts
              </div>
              <div>
                <span className="font-semibold">8.5K</span> followers
              </div>
              <div>
                <span className="font-semibold">512</span> following
              </div>
            </div>

            <div className="space-y-1 text-white">
              <h2 className="font-semibold">Display Name</h2>
              <p className="text-sm text-gray-300">
                Bio goes here. This is a sample Instagram profile page with a brief description about the user.
              </p>
              <Link to="#" className="text-sm text-blue-400 font-medium hover:text-blue-300">
                website.com
              </Link>
            </div>
          </div>
        </div>

        {/* Story Highlights */}
        <div className="px-4 py-2">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {highlightImages.map((imageUrl, index) => (
              <div key={index} className="flex flex-col items-center gap-1 min-w-[72px]">
                <div className="w-16 h-16 rounded-full border border-gray-600 flex items-center justify-center overflow-hidden">
                  <img
                    src={`${imageUrl}?w=80&h=80&fit=crop`}
                    alt={`Highlight ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </div>
                <span className="text-xs text-white truncate w-full text-center">Highlight {index + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="w-full h-12 bg-black border-t border-gray-800 justify-around">
            <TabsTrigger
              value="posts"
              className="flex-1 data-[state=active]:border-t-2 data-[state=active]:border-white rounded-none text-white"
            >
              <Grid3X3 className="h-5 w-5 text-white" />
              <span className="sr-only md:not-sr-only md:ml-2">Posts</span>
            </TabsTrigger>
            <TabsTrigger
              value="saved"
              className="flex-1 data-[state=active]:border-t-2 data-[state=active]:border-white rounded-none text-white"
            >
              <Bookmark className="h-5 w-5 text-white" />
              <span className="sr-only md:not-sr-only md:ml-2">Saved</span>
            </TabsTrigger>
            <TabsTrigger
              value="tagged"
              className="flex-1 data-[state=active]:border-t-2 data-[state=active]:border-white rounded-none text-white"
            >
              <Tag className="h-5 w-5 text-white" />
              <span className="sr-only md:not-sr-only md:ml-2">Tagged</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-0">
            <div className="grid grid-cols-3 gap-1">
              {postImages.map((imageUrl, index) => (
                <div key={index} className="aspect-square relative group">
                  <img
                    src={`${imageUrl}?w=300&h=300&fit=crop`}
                    alt={`Post ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-4 text-white">
                      <div className="flex items-center gap-1">
                        <Heart className="h-5 w-5 fill-white" />
                        <span className="font-semibold">{Math.floor(Math.random() * 1000)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-5 w-5 fill-white" />
                        <span className="font-semibold">{Math.floor(Math.random() * 100)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="saved" className="mt-0">
            <div className="grid grid-cols-3 gap-1">
              {postImages.slice(0, 6).map((imageUrl, index) => (
                <div key={index} className="aspect-square relative group">
                  <img
                    src={`${imageUrl}?w=300&h=300&fit=crop`}
                    alt={`Saved post ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-4 text-white">
                      <div className="flex items-center gap-1">
                        <Heart className="h-5 w-5 fill-white" />
                        <span className="font-semibold">{Math.floor(Math.random() * 1000)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-5 w-5 fill-white" />
                        <span className="font-semibold">{Math.floor(Math.random() * 100)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tagged" className="mt-0">
            <div className="grid grid-cols-3 gap-1">
              {postImages.slice(0, 3).map((imageUrl, index) => (
                <div key={index} className="aspect-square relative group">
                  <img
                    src={`${imageUrl}?w=300&h=300&fit=crop`}
                    alt={`Tagged post ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex gap-4 text-white">
                      <div className="flex items-center gap-1">
                        <Heart className="h-5 w-5 fill-white" />
                        <span className="font-semibold">{Math.floor(Math.random() * 1000)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-5 w-5 fill-white" />
                        <span className="font-semibold">{Math.floor(Math.random() * 100)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Mobile Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 py-3 px-6 flex justify-around md:hidden">
          <button className="p-1 text-white">
            <Heart className="h-6 w-6" />
          </button>
          <button className="p-1 text-white">
            <Heart className="h-6 w-6" />
          </button>
          <button className="p-1 text-white">
            <Heart className="h-6 w-6" />
          </button>
          <button className="p-1 text-white">
            <Heart className="h-6 w-6" />
          </button>
          <button className="p-1">
            <Avatar className="w-6 h-6">
              <AvatarImage 
                src={`${profileImage}?w=30&h=30&fit=crop`} 
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









































































































































































































































































































































































































































































































