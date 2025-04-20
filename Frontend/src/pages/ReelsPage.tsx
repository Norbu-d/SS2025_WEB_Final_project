// // src/pages/ReelsPage.tsx
// import { Bookmark, Heart, MessageCircle, MoreHorizontal } from "lucide-react";
// import { LeftSidebar } from "../components/Home/LeftSidebar";

// const ReelsPage = () => {
//   const reels = [
//     {
//       username: "user1",
//       caption: "Bro's life flashed before his eyes 😊",
//       likes: "24.5K",
//       comments: "1.2K",
//       image: "https://sm.ign.com/t/ign_ap/tv/a/anime/anime_ejbs.600.jpg"
//     },
//     {
//       username: "traveler",
//       caption: "Beautiful sunset at the beach 🌅",
//       likes: "15.3K",
//       comments: "892",
//       image: "https://sm.ign.com/t/ign_ap/tv/a/anime/anime_ejbs.600.jpg"
//     },
//     {
//       username: "foodie",
//       caption: "Homemade pasta for dinner tonight 🍝",
//       likes: "32.1K",
//       comments: "2.4K",
//       image: "https://sm.ign.com/t/ign_ap/tv/a/anime/anime_ejbs.600.jpg"
//     }
//   ];

//   return (
//     <div className="flex h-screen bg-black text-white overflow-hidden">
//       {/* Left Sidebar */}
//       <LeftSidebar />

//       {/* Middle Content */}
//       <div className="flex-1 bg-black overflow-y-auto">
//         {/* Reels Feed */}
//         <div className="p-4 space-y-20">
//           {reels.map((reel, index) => (
//             <div key={index} className="flex justify-center">
//               <div className="flex flex-col items-center w-full max-w-xl">
//                 {/* User Info above video - Shifted left with ml-4 */}
//                 <div className="flex items-center gap-3 mb-4 w-full max-w-md ml-20">
//                   <div className="w-10 h-10 rounded-full bg-zinc-700"></div>
//                   <span className="font-medium">{reel.username}</span>
//                 </div>

//                 {/* Video + Icons Row */}
//                 <div className="relative flex items-center justify-center">
//                   {/* Reel Video with actual image */}
//                   <div className="aspect-[9/16] w-[280px] sm:w-[320px] md:w-[360px] rounded-lg overflow-hidden">
//                     <img 
//                       src={reel.image} 
//                       alt={`Reel by ${reel.username}`} 
//                       className="w-full h-full object-cover"
//                     />
//                   </div>

//                   {/* Vertical Icons Stack with three-dot */}
//                   <div className="absolute right-[-60px] top-4 flex flex-col items-center gap-6">
//                     <button className="flex flex-col items-center">
//                       <Heart className="h-6 w-6" />
//                       <span className="text-xs">{reel.likes}</span>
//                     </button>
//                     <button className="flex flex-col items-center">
//                       <MessageCircle className="h-6 w-6" />
//                       <span className="text-xs">{reel.comments}</span>
//                     </button>
//                     <button className="flex flex-col items-center">
//                       <Bookmark className="h-6 w-6" />
//                     </button>
//                     <button className="flex flex-col items-center">
//                       <div className="text-xl">↗</div>
//                     </button>
//                     {/* Three-dot icon moved here below share */}
//                     <button className="flex flex-col items-center">
//                       <MoreHorizontal className="h-5 w-5 text-zinc-400" />
//                     </button>
//                   </div>
//                 </div>

//                 {/* Caption below video */}
//                 <div className="mt-4 text-sm text-center px-4 max-w-md">
//                   <span className="font-medium mr-2">{reel.username}</span>
//                   {reel.caption}
//                 </div>
//               </div>
//             </div>
//           ))}

//           {/* More Reels Indicator */}
//           <div className="flex justify-center items-center gap-2 text-zinc-400 mt-12 text-sm">
//             <span>Tiredds</span>
//             <span>•</span>
//             <button className="text-blue-400">More</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReelsPage;