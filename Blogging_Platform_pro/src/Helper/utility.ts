import type{ UserFollower, UserFollowing, UserPostLike,UserPostComment, User } from "./Type";
import moment from "moment";
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
const userFollowingData=JSON.parse(localStorage.getItem("userFollowingData")??"[]")||[]
const userFollowerData=JSON.parse(localStorage.getItem("userFollowerData")??"[]")||[]
const userProfileData=JSON.parse(localStorage.getItem("userProfileData")??"[]")||[]
// const userPostLikeData=JSON.parse(localStorage.getItem("userPostLikeData")??"[]")||[]
const userPostCommentData=JSON.parse(localStorage.getItem("userPostCommentData")??"[]")||[]
export function checkIsFollowing(
    currentUserId: string,
    targetUserId: string
  ): boolean {
    const currentUserFollow = userFollowingData.find(
      (uf:UserFollowing) => uf.userId === currentUserId
    );
    return currentUserFollow
      ? currentUserFollow.following.includes(targetUserId)
      : false;
  }
export function followUser(currentLoggedInUserId: string, targetUserId: string) {
  
  // Get following data for current user
  let currentUserFollowing = userFollowingData.find((u:UserFollower) => u.userId === currentLoggedInUserId);
  if (!currentUserFollowing) {
    currentUserFollowing = { userId: currentLoggedInUserId, following: [] };
    userFollowingData.push(currentUserFollowing);
  }

  // Get follower data for the target user
  let targetUserFollowers = userFollowerData.find((u:UserFollower) => u.userId === targetUserId);
  if (!targetUserFollowers) {
    targetUserFollowers = { userId: targetUserId, follower: [] };
    userFollowerData.push(targetUserFollowers);
  }

  // Add to following list
  if (!currentUserFollowing.following.includes(targetUserId)) {
    currentUserFollowing.following.push(targetUserId);
  }

  // Add to follower list
  if (!targetUserFollowers.follower.includes(currentLoggedInUserId)) {
    targetUserFollowers.follower.push(currentLoggedInUserId);
  }

  // Save updates to LocalStorage
  localStorage.setItem("userFollowingData", JSON.stringify(userFollowingData));
  localStorage.setItem("userFollowerData", JSON.stringify(userFollowerData));
  return {userFollowingData, userFollowerData };
}

export function unfollowUser(currentLoggedInUserId: string, profileUserId: string) {
  // Find entries
  let currentUserFollowing = userFollowingData.find((u:UserFollowing) => u.userId === currentLoggedInUserId);
  let profileUserFollowers = userFollowerData.find((u:UserFollowing) => u.userId === profileUserId);

  // Remove target user from current user's following list
  if (currentUserFollowing) {
    currentUserFollowing.following = currentUserFollowing.following.filter(
      (id:string )=> id !== profileUserId
    );
  }

  // Remove current user from profile user's follower list
  if (profileUserFollowers) {
    profileUserFollowers.follower = profileUserFollowers.follower.filter(
      (id:string) => id !== currentLoggedInUserId
    );
  }

  // Save updated lists
  localStorage.setItem("userFollowingData", JSON.stringify(userFollowingData));
  localStorage.setItem("userFollowerData", JSON.stringify(userFollowerData));
  return {userFollowingData, userFollowerData };
}
export function postLikeCount(
  postId: string,
  allLikes: UserPostLike[]
) {
  return allLikes.reduce((count, userEntry) => {
    const likesForThisPost = userEntry.likes.filter(
      (l) => l.postId === postId
    ).length;

    return count + likesForThisPost;
  }, 0);
}
export function getUserDetails(userid: string) {
    return userProfileData.find((u: any) => u.userId == userid);
  }
 export function formatPostDate(date: string) {
  const postDate = moment(date);

  // If today → show "2 hours ago"
  if (moment().diff(postDate, "hours") < 24) {
    return postDate.fromNow();
  }

  // Else → "12 October 2015"
  return postDate.format("DD MMMM YYYY");
}
export function addComment(postId: string, comment: string, currentUserId: string,userPostCommentData:UserPostComment[]) {

  const loggedInUserId = currentUserId;

  const existingUser = userPostCommentData.find(
    (data:any) => data.userId === loggedInUserId
  );

  if (!existingUser) {
    // add new user comment data
    const newUserComment: UserPostComment = {
      userId: loggedInUserId,
      comments: [
        { postId, userId: loggedInUserId, comment,createdAt:new Date() }
      ]
    };

    userPostCommentData.push(newUserComment);
  } else {
    // update existing user comment list
    existingUser.comments.push({
      postId,
      userId: loggedInUserId,
      comment,
      createdAt:new Date() 
    });
  }

  // ✅ Save back to localStorage
  localStorage.setItem(
    "userPostCommentData",
    JSON.stringify(userPostCommentData)
  );
  return userPostCommentData;
}

export function toggleLike(postId: string, currentUserId: string,userPostLikeData:UserPostLike[]) {
  const loggedInUserId = currentUserId;

  const existingUser = userPostLikeData.find(
    (data: any) => data.userId === loggedInUserId
  );

  // CASE 1 → First time user likes anything
  if (!existingUser) {
    const newUserLike = {
      userId: loggedInUserId,
      likes: [{ postId, userId: loggedInUserId }],
    };

    const updatedData = [...userPostLikeData, newUserLike];
// setUserPostLikeData(updatedData)
    localStorage.setItem("userPostLikeData", JSON.stringify(updatedData));

    return updatedData; // VERY IMPORTANT
  }

  // CASE 2 → User exists → check if liked already
  const alreadyLiked = existingUser.likes.some(
    (l: any) => l.postId === postId && l.userId === loggedInUserId
  );

  let updatedLikes;

  if (alreadyLiked) {
    // REMOVE LIKE (unlike)
    updatedLikes = existingUser.likes.filter(
      (l: any) => !(l.postId === postId && l.userId === loggedInUserId)
    );
  } else {
    // ADD LIKE (like)
    updatedLikes = [
      ...existingUser.likes,
      { postId, userId: loggedInUserId },
    ];
  }

  const updatedData = userPostLikeData.map((data: any) =>
    data.userId === loggedInUserId ? { ...data, likes: updatedLikes } : data
  );
  //setUserPostLikeData(updatedData);

  localStorage.setItem("userPostLikeData", JSON.stringify(updatedData));

  return updatedData; // VERY IMPORTANT
}

  export function isPostLike(postId: string ,currentUserId:string,userPostLikeData:UserPostLike[]): Boolean {
    const existingUser = userPostLikeData.find(
      (data: any) => data.userId === currentUserId
    );

    return existingUser?.likes.some((l: any) => l.postId === postId) || false;
  }
