import { Link } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Bookmark,
  Compass,
  Heart,
  Home,
  MessageCircle,
  PlusSquare,
  Search as SearchIcon,
  User,
  Video,
} from "lucide-react";
import { SearchModal } from "@/components/Search/SearchModal";
import { CreatePostModal } from "@/components/CreatePost/CreatePostModal"; // Import the new component

export function LeftSidebar() {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false); // Add state for create modal
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Logout failed");
      return response.json();
    },
    onSuccess: () => {
      queryClient.clear();
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      console.error("Logout error:", error);
      navigate("/login", { replace: true });
    }
  });

  return (
    <>
      {/* Search Modal */}
      {showSearchModal && (
        <SearchModal onClose={() => setShowSearchModal(false)} />
      )}

      {/* Create Post Modal */}
      {showCreateModal && (
        <CreatePostModal onClose={() => setShowCreateModal(false)} />
      )}

      {/* Left Sidebar */}
      <div className="w-64 border-r border-zinc-800 p-4 flex flex-col h-screen fixed">
        <div className="py-6">
          <h1 className="text-2xl font-serif italic font-bold tracking-tighter">Instagram</h1>
        </div>
        
        <nav className="space-y-4 mt-6 flex-grow">
          <SidebarLink icon={<Home className="h-6 w-6" />} text="Home" to="/" />
          
          {/* Search button */}
          <button
            onClick={() => setShowSearchModal(true)}
            className="flex items-center gap-3 py-2.5 font-medium text-white hover:text-zinc-300 w-full"
          >
            <SearchIcon className="h-6 w-6" />
            <span>Search</span>
          </button>
          
          <SidebarLink icon={<Compass className="h-6 w-6" />} text="Explore" to="/explore" />
          <SidebarLink icon={<Video className="h-6 w-6" />} text="Reels" to="/reels" />
          <SidebarLink icon={<MessageCircle className="h-6 w-6" />} text="Messages" to="/direct/inbox" />
          <SidebarLink icon={<Heart className="h-6 w-6" />} text="Notifications" to="/notifications" />
          
          {/* Create button - now opens modal instead of navigating */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-3 py-2.5 font-medium text-white hover:text-zinc-300 w-full"
          >
            <PlusSquare className="h-6 w-6" />
            <span>Create</span>
          </button>
          
          <SidebarLink icon={<Bookmark className="h-6 w-6" />} text="Saved" to="/saved" />
          <SidebarLink icon={<User className="h-6 w-6" />} text="Profile" to="/profile" />
        </nav>
        
        <div className="mt-auto relative">
          <button
            onClick={() => setShowMoreMenu(v => !v)}
            className="flex items-center gap-3 py-2.5 font-medium text-zinc-400 hover:text-white w-full"
          >
            <span className="flex h-6 w-6 items-center justify-center">≡</span>
            <span>More</span>
          </button>

          {showMoreMenu && (
            <div 
              className="absolute bottom-14 left-0 w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 space-y-2 z-50"
              onClick={() => setShowMoreMenu(false)}
            >
              <Link to="/settings" className="block p-2 hover:bg-zinc-800 rounded text-sm">
                Settings
              </Link>
              <button
                onClick={() => logoutMutation.mutate()}
                className="w-full text-left p-2 hover:bg-zinc-800 rounded text-sm text-red-500"
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? "Logging out..." : "Log out"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function SidebarLink({
  icon,
  text,
  to,
  muted = false,
}: {
  icon: React.ReactNode;
  text: string;
  to: string;
  muted?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 py-2.5 font-medium transition-colors ${
        muted ? "text-zinc-400" : "text-white hover:text-zinc-300"
      }`}
    >
      {icon}
      <span>{text}</span>
    </Link>
  );
}