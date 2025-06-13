// RightSidebar.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function RightSidebar() {
  const suggestions = [
    { username: "khee", verified: true, followedBy: "sonamdorji237" },
    { username: "talney2020" },
    { username: "instagram", verified: true, followedBy: "way_design" },
    { username: "tenzy_lambda", followedBy: "busyplots" },
    { username: "memory_in_bushstrokes", followedBy: "Viewoutlines" },
  ];
  
  return (
    <div className="pl-6 pr-6 py-6">
      {/* User Profile */}
      <div className="flex items-center gap-4 mb-8"> 
        <Avatar className="h-14 w-14">
          <AvatarImage src="/placeholder.svg" alt="Profile" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold">andy_505dends</div>
          <div className="text-zinc-400 text-sm">Norbu Dendup</div>
        </div>
        <Button variant="link" className="ml-auto text-blue-500 font-medium">
          Switch
        </Button>
      </div>
      
      {/* Suggestions */}
      <div className="mb-6"> 
        <div className="flex justify-between items-center mb-4">
          <span className="text-zinc-400 font-medium text-sm">Suggested for you</span>
          <Button variant="link" className="text-xs font-medium text-white">
            See All
          </Button>
        </div>
        <div className="space-y-4">
          {suggestions.map((s, i) => (
            <div key={i} className="flex items-center">
              <Avatar className="h-9 w-9 mr-3">
                <AvatarImage src="/placeholder.svg" alt={s.username} />
                <AvatarFallback>{s.username.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="text-sm font-medium">{s.username}</span>
                  {s.verified && (
                    <svg 
                      className="ml-1 h-4 w-4 text-blue-500" 
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  )}
                </div>
                <p className="text-xs text-zinc-400">
                  {s.followedBy ? `Followed by ${s.followedBy}` : "Suggested for you"}
                </p>
              </div>
              <Button variant="link" className="text-xs font-medium text-blue-500">
                Follow
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer Links */}
      <div className="mt-10 text-xs text-zinc-500"> 
        <div className="flex flex-wrap gap-x-2 gap-y-1 mb-3">
          {[
            "About", "Help", "Press", "API", "Jobs", "Privacy", 
            "Terms", "Locations", "Language", "Meta Verified"
          ].map((item, i) => (
            <Link 
              key={i} 
              to="#" 
              className="hover:underline hover:text-zinc-300"
            >
              {item}
            </Link>
          ))}
        </div>
        <div>© 2025 INSTAGRAM FROM META</div>
      </div>
    </div>
  );
}