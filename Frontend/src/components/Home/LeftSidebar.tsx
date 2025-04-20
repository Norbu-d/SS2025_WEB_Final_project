import { Link } from "react-router-dom";
import {
  Bookmark,
  Compass,
  Heart,
  Home,
  MessageCircle,
  PlusSquare,
  Search,
  User,
  Video,
} from "lucide-react";

export function LeftSidebar() {
  return (
    <div className="w-64 border-r border-zinc-800 p-4 flex flex-col">
      <div className="w-64 border-r border-zinc-800 p-4 flex flex-col">
  <div className="py-6">
    <h1 className="text-2xl font-serif italic font-bold tracking-tighter">Instagram</h1>
  </div>
</div>
      <nav className="space-y-4 mt-6">
        <SidebarLink icon={<Home className="h-6 w-6" />} text="Home" to="/" />
        <SidebarLink icon={<Search className="h-6 w-6" />} text="Search" to="#" muted />
        <SidebarLink icon={<Compass className="h-6 w-6" />} text="Explore" to="#" muted />
        <SidebarLink icon={<Video className="h-6 w-6" />} text="Reels" to="/reels" muted />
        <SidebarLink icon={<MessageCircle className="h-6 w-6" />} text="Messages" to="#" muted />
        <SidebarLink icon={<Heart className="h-6 w-6" />} text="Notifications" to="#" muted />
        <SidebarLink icon={<PlusSquare className="h-6 w-6" />} text="Create" to="#" muted />
        <SidebarLink icon={<User className="h-6 w-6" />} text="Profile" to="#" muted />
      </nav>
      <div className="mt-auto">
        <SidebarLink icon={<span className="flex h-6 w-6 items-center justify-center">≡</span>} text="More" to="#" muted />
      </div>
    </div>
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
          className={`flex items-center gap-3 py-2.5 font-medium ${muted ? "text-muted-foreground" : ""}`}
        >
          {icon}
          <span>{text}</span>
        </Link>
      );
      
}