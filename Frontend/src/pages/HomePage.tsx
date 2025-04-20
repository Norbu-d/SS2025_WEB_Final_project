import { LeftSidebar } from "../components/Home/LeftSidebar";
import { MiddleContent } from "../components/Home/MiddleContent";
import { RightSidebar } from "../components/Home/RightSidebar";

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <LeftSidebar />
      <MiddleContent />
      <RightSidebar />
    </div>
  );
}