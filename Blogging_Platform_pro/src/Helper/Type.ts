import type React from "react";

//User registration and authentication types
export interface User {
  accessToken:string
  user:any
}
export interface UserContextInterface {
  currentLoggedInUserData: User|null;
  setCurrentLoggedInUserData: React.Dispatch<React.SetStateAction<User|null>>
  loading:boolean,
  setLoading:React.Dispatch<React.SetStateAction<boolean>>
  
}
export type PostPopupProps = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

//user profile types
export interface UserProfile {
  userId: string;
  fullName: string;
  bio: string;
  profilePic: string;
  accountType: "public" | "private";
}
export interface UserPost {
  postId: string;
  userId: string;
  content: string;
  imageUrl?: string;
  createdAt: Date;
}
export interface UserPostLike {
  userId: string;
  likes:{postId: string; userId: string;}[] // Array of userIds who liked the post
}
export interface UserPostComment {
  userId: string;
  comments: {postId: string; userId: string; comment: string; createdAt: Date; }[];
}
export interface UserFollowing{
  userId: string;
  following: string[]; // Array of userIds whom this user follows
}
export interface UserFollower{
  userId:string;
  follower:string[];
}

//search types
export interface SearchResult {
  userId: string;
  username: string;
  fullName: string;
  profilePic: string;
  bio: string;
  accountType: "public" | "private";
}
export interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  loggedInUserId: string;
}