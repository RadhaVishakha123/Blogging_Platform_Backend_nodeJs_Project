import type{ UserFollower, UserFollowing, UserPostLike,UserPostComment, User } from "./Type";
import { API_BASE_URL } from "../config";
import moment from "moment";
const userFollowingData=JSON.parse(localStorage.getItem("userFollowingData")??"[]")||[]
const userFollowerData=JSON.parse(localStorage.getItem("userFollowerData")??"[]")||[]
const userProfileData=JSON.parse(localStorage.getItem("userProfileData")??"[]")||[]
// const userPostLikeData=JSON.parse(localStorage.getItem("userPostLikeData")??"[]")||[]
const userPostCommentData=JSON.parse(localStorage.getItem("userPostCommentData")??"[]")||[]
export async function checkIsFollowing(currentUserId: string,targetUserId: string,accessToken:string):Promise<boolean> {
    const response=await fetch(`${API_BASE_URL}/api/follow?currentUserId=${currentUserId}&targetUserId=${targetUserId}`,
      {method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },})
      const result=await response.json()
      return result.isfollowing;
    
  }
export async function followUser(currentLoggedInUserId: string, targetUserId: string,accessToken:string) {
  const response = await fetch(
      `${API_BASE_URL}/api/follow/followuser`,
      {
         method: "POST",
        headers: { "Content-Type": "application/json" ,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      currentUserId:currentLoggedInUserId,
      targetUserId :targetUserId
    }),
      }
    );
    const result = await response.json();
    return result.followed
  }
  


export async function unfollowUser(currentLoggedInUserId: string, profileUserId: string,accessToken:string) {
  const response = await fetch(
      `${API_BASE_URL}/api/follow/unfollowuser`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" ,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      currentUserId:currentLoggedInUserId,
      targetUserId :profileUserId
    }),
      }
    );
    const result = await response.json();
    return result.followed;
}

export async function getUserDetails(userId: string,accessToken:string) {
  const response = await fetch(
      `${API_BASE_URL}/api/userprofile/fetch?userId=${userId}`,
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
  
  const response = await fetch(`${API_BASE_URL}/api/comment`, {
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
  const response = await fetch(`${API_BASE_URL}/api/comment/?postId=${postId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const result = await response.json();
  return result.data || []; // assuming API returns { data: [...] }
}

export async function toggleLike(postId: string, currentUserId: string,accessToken:string) {
  const res = await fetch(`${API_BASE_URL}/api/like/toggle`, {
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
    const res = await fetch(`${API_BASE_URL}/api/like/isliked?postId=${postId}&userId=${currentUserId}`, {
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
   const res = await fetch(`${API_BASE_URL}/api/like/count?postId=${postId}`, {
    method: "get",
    headers: {  
      Authorization: `Bearer ${accessToken}`,
    }
  });
   const data = await res.json();
   return data.count;
  
}