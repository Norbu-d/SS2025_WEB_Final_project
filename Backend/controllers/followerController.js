// const prisma = require('../prismaClient');


// exports.followUser = async (req, res) => {
//   try {
//     const followingId = parseInt(req.params.userId);
//     const followerId = req.user.id;

//     // Verify both users exist
//     const [follower, following] = await Promise.all([
//       prisma.user.findUnique({ where: { id: followerId } }),
//       prisma.user.findUnique({ where: { id: followingId } })
//     ]);

//     if (!follower || !following) {
//       return res.status(404).json({
//         success: false,
//         message: "One or both users not found"
//       });
//     }

//     if (followerId === followingId) {
//       return res.status(400).json({
//         success: false,
//         message: "You cannot follow yourself"
//       });
//     }

//     // Check if follow relationship already exists
//     const existingFollow = await prisma.follow.findFirst({
//       where: {
//         follower_id: followerId,
//         following_id: followingId
//       }
//     });

//     if (existingFollow) {
//       return res.status(400).json({
//         success: false,
//         message: "You are already following this user"
//       });
//     }

//     // Create the follow relationship
//     const follow = await prisma.follow.create({
//       data: {
//         follower_id: followerId,
//         following_id: followingId
//       },
//       include: {
//         following: {
//           select: {
//             id: true,
//             username: true,
//             profile_picture: true
//           }
//         }
//       }
//     });

//     res.status(201).json({
//       success: true,
//       message: "Successfully followed user",
//       data: follow
//     });

//   } catch (error) {
//     console.error("Follow error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to follow user",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

// // Unfollow a user (unchanged but now matches follow endpoint structure)
// exports.unfollowUser = async (req, res) => {
//   try {
//     const followingId = parseInt(req.params.userId);
//     const followerId = req.user.id;

//     const follow = await prisma.follow.findFirst({
//       where: {
//         follower_id: followerId,
//         following_id: followingId
//       }
//     });

//     if (!follow) {
//       return res.status(404).json({
//         success: false,
//         message: "Follow relationship not found"
//       });
//     }

//     await prisma.follow.delete({
//       where: { id: follow.id }
//     });

//     res.json({
//       success: true,
//       message: "Successfully unfollowed user"
//     });
//   } catch (error) {
//     console.error("Unfollow error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to unfollow user",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

// // ... (getFollowers and getFollowing remain unchanged) ...
// // Get a user's followers
// exports.getFollowers = async (req, res) => {
//   try {
//     const userId = parseInt(req.params.userId);

//     const followers = await prisma.follow.findMany({
//       where: { following_id: userId },
//       include: {
//         follower: {
//           select: {
//             id: true,
//             username: true,
//             full_name: true,
//             profile_picture: true,
//             bio: true
//           }
//         }
//       },
//       orderBy: {
//         id: 'desc' // Changed from created_at to id
//       }
//     });

//     res.json({
//       success: true,
//       count: followers.length,
//       data: followers.map(f => f.follower) // Simplified response
//     });
//   } catch (error) {
//     console.error("Get followers error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to get followers",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

// // Get who a user is following
// exports.getFollowing = async (req, res) => {
//   try {
//     const userId = parseInt(req.params.userId);

//     const following = await prisma.follow.findMany({
//       where: { follower_id: userId },
//       include: {
//         following: {
//           select: {
//             id: true,
//             username: true,
//             full_name: true,
//             profile_picture: true,
//             bio: true
//           }
//         }
//       },
//       orderBy: {
//         id: 'desc' // Changed from created_at to id
//       }
//     });

//     res.json({
//       success: true,
//       count: following.length,
//       data: following.map(f => f.following) // Simplified response
//     });
//   } catch (error) {
//     console.error("Get following error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to get following list",
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };