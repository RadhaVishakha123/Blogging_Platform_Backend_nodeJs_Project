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

export async function getUserDetails(userId: string,accessToken:string) {
  const response = await fetch(
      `http://localhost:8000/api/userprofile/fetch?userId=${userId}`,
      {
        method: "get",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const result = await response.json();
    return result.profile;
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
export async function addComment(postId: string, comment: string, currentUserId: string,accessToken:string) {
  
  const response = await fetch("http://localhost:8000/api/comment", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
      postId,
      userId: currentUserId,
      comment
    }),
    });
    const result = await response.json();
return result.data;
  
}
export async function fetchComments(postId: string,accessToken:string) {
  const response = await fetch(`http://localhost:8000/api/comment/?postId=${postId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const result = await response.json();
  return result.data || []; // assuming API returns { data: [...] }
}

export async function toggleLike(postId: string, currentUserId: string,accessToken:string) {
  const res = await fetch("http://localhost:8000/api/like/toggle", {
    method: "POST",
    headers: { "Content-Type": "application/json" ,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      postId,
      userId: currentUserId,
    }),
  });
   const data = await res.json();
   return data.liked;


}

  export async function isPostLike(postId: string ,currentUserId:string,accessToken:string): Promise<boolean> {
    const res = await fetch(`http://localhost:8000/api/like/isliked?postId=${postId}&userId=${currentUserId}`, {
    method: "get",
    headers: {  
      Authorization: `Bearer ${accessToken}`,
    }
  });
   const data = await res.json();
   return data.liked;
    
  }
export async function postLikeCount(
  postId: string,
  accessToken:string
) {
   const res = await fetch(`http://localhost:8000/api/like/count?postId=${postId}`, {
    method: "get",
    headers: {  
      Authorization: `Bearer ${accessToken}`,
    }
  });
   const data = await res.json();
   return data.count;
  
}