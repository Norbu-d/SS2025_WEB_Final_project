
import { LeftSidebar } from "../components/Home/LeftSidebar";
import { MiddleContent } from "../components/Home/MiddleContent";
import { RightSidebar } from "../components/Home/RightSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function HomePage() {
  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <LeftSidebar />
      <ScrollArea className="w-full max-w-[750px] border-x border-zinc-800"> 
        <MiddleContent />
      </ScrollArea>
      <RightSidebar />
    </div>
  );
}