const MAX_USERS = 2000;
//const MAX_USERS = 20;
// Generate an array of user objects
export const users = Array.from({ length: MAX_USERS }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  followers: generateRandomArray(MAX_USERS),
  following: generateRandomArray(MAX_USERS),
  followersCount: 0,
  followingCount: 0,
}));

// Update followersCount and followingCount properties for each user
users.forEach((user) => {
  user.followersCount = user.followers.length;
  user.followingCount = user.following.length;
});

// Helper function to generate a random array of user IDs
function generateRandomArray(max) {
  const count = Math.floor(Math.random() * (max - 50)) + 50;
  const arr = Array.from(
    { length: count },
    () => Math.floor(Math.random() * max) + 1
  );
  return [...new Set(arr)]; // Remove duplicates
}
