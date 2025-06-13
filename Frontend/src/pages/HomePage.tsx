// HomePage.tsx
import { useState } from "react";
import { LeftSidebar } from "../components/Home/LeftSidebar";
import { MiddleContent } from "../components/Home/MiddleContent";
import { RightSidebar } from "../components/Home/RightSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function HomePage() {
  const [showSearchModal, setShowSearchModal] = useState(false);

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Left sidebar remains fixed */}
      <LeftSidebar setShowSearchModal={setShowSearchModal} />
      
      {/* Main content container */}
      <div className="flex flex-1 ml-64"> {/* Changed to flex container */}
        {/* Middle content - now takes available space */}
        <div className="flex-1 min-w-0">
          <ScrollArea className="h-full w-full border-r border-zinc-800">
            <div className="max-w-[500px] mx-auto">
              <MiddleContent />
            </div>
          </ScrollArea>
        </div>
        
        {/* Right sidebar - now adjacent to middle content */}
        <div className="w-[400px] min-w-[400px]">
          <ScrollArea className="h-full w-full">
            <RightSidebar />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}