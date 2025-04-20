<<<<<<< HEAD
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Link } from "react-router-dom";

// export function RightSidebar() {
//   const suggestions = [
//     { username: "lv.hee_", followedBy: "sonamdorji237" },
//     { username: "tasheey2020" },
//     { username: "instagram", verified: true, followedBy: "aup_dorji" },
//     { username: "tenzyn_jamtsho", followedBy: "loopybird_k" },
//     { username: "memory_in_brushstrokes", followedBy: "7racwuzhere" },
//   ];
//   return (
//     <div className="w-[500px] pl-37 pr-15 py-6"> 
//       <div className="flex items-center gap-4 mb-6 ml-2"> 
//         <Avatar className="h-14 w-14">
//           <AvatarImage src="/placeholder.svg" alt="Profile" />
//           <AvatarFallback>ND</AvatarFallback>
//         </Avatar>
//         <div>
//           <div className="font-semibold">andy_505dends</div>
//           <div className="text-zinc-400 text-sm">Norbu Dendup</div>
//         </div>
//         <Button variant="link" className="ml-auto text-blue-500 font-medium">
//           Switch
//         </Button>
//       </div>
//       <div className="mb-4 ml-2"> 
//         <div className="flex justify-between items-center mb-4">
//           <span className="text-zinc-400 font-medium text-sm">Suggested for you</span>
//           <Button variant="link" className="text-xs font-medium text-white">
//             See All
//           </Button>
//         </div>
//         <div className="space-y-3">
//           {suggestions.map((s, i) => (
//             <div key={i} className="flex items-center">
//               <Avatar className="h-9 w-9 mr-3">
//                 <AvatarImage src="/placeholder.svg" alt={s.username} />
//                 <AvatarFallback>{s.username.substring(0, 2)}</AvatarFallback>
//               </Avatar>
//               <div className="flex-1">
//                 <div className="flex items-center">
//                   <span className="text-sm font-medium">{s.username}</span>
//                   {s.verified && <span className="ml-1 text-blue-500 text-xs">•</span>}
//                 </div>
//                 <p className="text-xs text-zinc-400">
//                   {s.followedBy ? `Followed by ${s.followedBy}` : "Suggested for you"}
//                 </p>
//               </div>
//               <Button variant="link" className="text-xs font-medium text-blue-500">
//                 Follow
//               </Button>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div className="mt-8 text-xs text-zinc-500 ml-2"> 
//         <div className="flex flex-wrap gap-x-1 mb-4">
//           {[
//             "About",
//             "Help",
//             "Press",
//             "API",
//             "Jobs",
//             "Privacy",
//             "Terms",
//             "Locations",
//             "Language",
//             "Meta Verified",
//           ].map((item, i) => (
//             <Link key={i} to="#" className="hover:underline">
//               {item}
//             </Link>
//           ))}
//         </div>
//         <div>© 2025 INSTAGRAM FROM META</div>
//       </div>
//     </div>
//   );
// }
=======
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function RightSidebar() {
  const suggestions = [
    { username: "lv.hee_", followedBy: "sonamdorji237" },
    { username: "tasheey2020" },
    { username: "instagram", verified: true, followedBy: "aup_dorji" },
    { username: "tenzyn_jamtsho", followedBy: "loopybird_k" },
    { username: "memory_in_brushstrokes", followedBy: "7racwuzhere" },
  ];
  return (
    <div className="w-[500px] pl-37 pr-15 py-6"> 
      <div className="flex items-center gap-4 mb-6 ml-2"> 
        <Avatar className="h-14 w-14">
          <AvatarImage src="/placeholder.svg" alt="Profile" />
          <AvatarFallback>ND</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold">andy_505dends</div>
          <div className="text-zinc-400 text-sm">Norbu Dendup</div>
        </div>
        <Button variant="link" className="ml-auto text-blue-500 font-medium">
          Switch
        </Button>
      </div>
      <div className="mb-4 ml-2"> 
        <div className="flex justify-between items-center mb-4">
          <span className="text-zinc-400 font-medium text-sm">Suggested for you</span>
          <Button variant="link" className="text-xs font-medium text-white">
            See All
          </Button>
        </div>
        <div className="space-y-3">
          {suggestions.map((s, i) => (
            <div key={i} className="flex items-center">
              <Avatar className="h-9 w-9 mr-3">
                <AvatarImage src="/placeholder.svg" alt={s.username} />
                <AvatarFallback>{s.username.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="text-sm font-medium">{s.username}</span>
                  {s.verified && <span className="ml-1 text-blue-500 text-xs">•</span>}
                </div>
                <p className="text-xs text-zinc-400">
                {s.followedBy ? `Followed by ${s.followedBy}` : "Suggested"}
                </p>
              </div>
              <Button variant="link" className="text-xs font-medium text-blue-500">
                Follow
              </Button>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 text-xs text-zinc-500 ml-2"> 
        <div className="flex flex-wrap gap-x-1 mb-4">
          {[
            "About",
            "Help",
            "Press",
            "API",
            "Jobs",
            "Privacy",
            "Terms",
            "Locations",
            "Language",
            "Meta Verified",
          ].map((item, i) => (
            <Link key={i} to="#" className="hover:underline">
              {item}
            </Link>
          ))}
        </div>
        <div>© 2025 INSTAGRAM FROM META</div>
      </div>
    </div>
  );
}
>>>>>>> ff678ebe110a12db3bf2e860efe21720099fba15
