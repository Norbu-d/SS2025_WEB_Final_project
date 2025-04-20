<<<<<<< HEAD
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Heart, MessageCircle, MoreHorizontal, Send, Bookmark } from "lucide-react";

// export function MiddleContent() {
//   const stories = [
//     "kd3oyy_",
//     "gkeyxdd",
//     "w_wabbittt",
//     "sonchacho",
//     "jamyang_c",
//     "tennzeyy_nn",
//     "charles_san_",
//     "notorious_",
//   ];
//   return (
//     <div className="flex-1 max-w-[630px] border-r border-zinc-800 ml-8"> 
//       <div className="px-8 py-4 ml-1"> 
//         <ScrollArea className="w-full whitespace-nowrap">
//           <div className="flex gap-4 pb-4 ml-1">
//             {stories.map((name, i) => (
//               <div key={i} className="flex flex-col items-center gap-1">
//                 <div className="rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-fuchsia-600">
//                   <Avatar className="h-16 w-16 border-2 border-[#121212]">
//                     <AvatarImage src="/placeholder.svg?height=60&width=60" alt={name} />
//                     <AvatarFallback>{name.substring(0, 2)}</AvatarFallback>
//                   </Avatar>
//                 </div>
//                 <span className="text-xs truncate max-w-[64px]">{name}</span>
//               </div>
//             ))}
//           </div>
//         </ScrollArea>
//       </div>

//       <div className="space-y-4 ml-4"> 
//         <Post 
//           username="funky_street_bhutan" 
//           timeAgo="1h" 
//           caption="Original audio" 
//           imageUrl="https://sm.ign.com/t/ign_ap/tv/a/anime/anime_ejbs.600.jpg"
//         />
//         <Post 
//           username="travel_moments" 
//           timeAgo="3h" 
//           caption="Beautiful sunset at the beach #travel #sunset" 
//           imageUrl="https://sm.ign.com/t/ign_ap/tv/a/anime/anime_ejbs.600.jpg"
//         />
//       </div>
//     </div>
//   );
// }

// function Post({ 
//   username, 
//   timeAgo, 
//   caption,
//   imageUrl
// }: { 
//   username: string; 
//   timeAgo: string; 
//   caption: string;
//   imageUrl: string;
// }) {
//   return (
//     <div className="border-b border-zinc-800 pb-4 ml-4"> 
//       <div className="flex items-center justify-between px-4 py-3">
//         <div className="flex items-center gap-3">
//           <Avatar className="h-8 w-8">
//             <AvatarImage src="/placeholder.svg" alt={username} />
//             <AvatarFallback>{username.substring(0, 2)}</AvatarFallback>
//           </Avatar>
//           <div>
//             <span className="font-medium">{username}</span>
//             <span className="text-zinc-400 text-sm"> • {timeAgo}</span>
//           </div>
//         </div>
//         <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 text-white">
//           <MoreHorizontal className="h-5 w-5" />
//         </Button>
//       </div>
//       <div className="flex justify-center ml-4"> 
//         <div className="relative aspect-square bg-zinc-900 w-[60%]">
//           <img 
//             src={imageUrl} 
//             alt="Post" 
//             className="w-full h-full object-cover" 
//           />
//         </div>
//       </div>
//       <div className="px-4 pt-3 ml-26">
//         <div className="flex justify-between mb-2">
//           <div className="flex gap-4">
//             <Button variant="ghost" size="icon" className="h-9 w-9 text-white">
//               <Heart className="h-6 w-6" />
//             </Button>
//             <Button variant="ghost" size="icon" className="h-9 w-9 text-white">
//               <MessageCircle className="h-6 w-6" />
//             </Button>
//             <Button variant="ghost" size="icon" className="h-9 w-9 text-white">
//               <Send className="h-6 w-6" />
//             </Button>
//           </div>
//           <Button variant="ghost" size="icon" className="h-9 w-9 text-white">
//             <Bookmark className="h-6 w-6" />
//           </Button>
//         </div>
//         <div className="text-sm">
//           <span className="font-medium">{username}</span> <span>{caption}</span>
//         </div>
//       </div>
//     </div>
//   );
// }
=======
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, MessageCircle, MoreHorizontal, Send, Bookmark } from "lucide-react";

export function MiddleContent() {
  const stories = [
    "kd3oyy_",
    "gkeyxdd",
    "w_wabbittt",
    "sonchacho",
    "jamyang_c",
    "tennzeyy_nn",
    "charles_san_",
    "notorious_",
  ];
  return (
    <div className="flex-1 max-w-[630px] border-r border-zinc-800 ml-8"> 
      <div className="px-8 py-4 ml-1"> 
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-4 pb-4 ml-1">
            {stories.map((name, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-fuchsia-600">
                  <Avatar className="h-16 w-16 border-2 border-[#121212]">
                    <AvatarImage src="/placeholder.svg?height=60&width=60" alt={name} />
                    <AvatarFallback>{name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                </div>
                <span className="text-xs truncate max-w-[64px]">{name}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="space-y-4 ml-4"> 
        <Post 
          username="funky_street_bhutan" 
          timeAgo="1h" 
          caption="Original audio" 
          imageUrl="https://sm.ign.com/t/ign_ap/tv/a/anime/anime_ejbs.600.jpg"
        />
        <Post 
          username="travel_moments" 
          timeAgo="3h" 
          caption="Beautiful sunset at the beach #travel #sunset" 
          imageUrl="https://sm.ign.com/t/ign_ap/tv/a/anime/anime_ejbs.600.jpg"
        />
      </div>
    </div>
  );
}

function Post({ 
  username, 
  timeAgo, 
  caption,
  imageUrl
}: { 
  username: string; 
  timeAgo: string; 
  caption: string;
  imageUrl: string;
}) {
  return (
    <div className="border-b border-zinc-800 pb-4 ml-4"> 
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" alt={username} />
            <AvatarFallback>{username.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <span className="font-medium">{username}</span>
            <span className="text-zinc-400 text-sm"> • {timeAgo}</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 text-white">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex justify-center ml-4"> 
        <div className="relative aspect-square bg-zinc-900 w-[60%]">
          <img 
            src={imageUrl} 
            alt="Post" 
            className="w-full h-full object-cover" 
          />
        </div>
      </div>
      <div className="px-4 pt-3 ml-26">
        <div className="flex justify-between mb-2">
          <div className="flex gap-4">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-white">
              <Heart className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-white">
              <MessageCircle className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-white">
              <Send className="h-6 w-6" />
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-white">
            <Bookmark className="h-6 w-6" />
          </Button>
        </div>
        <div className="text-sm">
          <span className="font-medium">{username}</span> <span>{caption}</span>
        </div>
      </div>
    </div>
  );
}
>>>>>>> ff678ebe110a12db3bf2e860efe21720099fba15
