// In a dto/post.dto.js
export const transformPostData = (post) => ({
  id: post.id,
  imageUrl: post.image_url,
  caption: post.caption,
  user: { username: post.user.username },
  likes: post._count?.likes,
});