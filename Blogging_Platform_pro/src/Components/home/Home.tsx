import { useEffect, useState } from "react";
import useUser from "../../hooks/useUser";
import { Avatar, Card, Button, Spin, Input, Modal } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";

import { App } from "antd";
import { postLikeCount ,getUserDetails,addComment,toggleLike,isPostLike} from "../../Helper/utility";
import PostCard from "../post/PostCard";
import CommentModal from "../comment/CommentModal";
import type {
  UserPost,
  UserPostComment,
  UserPostLike,
} from "../../Helper/Type";

export default function Home() {
  const { currentLoggedInUserData } = useUser();
  if (!currentLoggedInUserData) return;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [selectedPost, setselectedPost] = useState<any>(null);
  const message = App.useApp().message;
  function commentHandler(post: any) {
   
    setIsModalOpen(true);
    setselectedPost(post);
    setCommentText("");
  }
  const loggedInUserId = currentLoggedInUserData?.user._id ?? "";
  const [refreshLikes, setRefreshLikes] = useState(false);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [visiblePosts, setVisiblePosts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const userProfileData =
    JSON.parse(localStorage.getItem("userProfileData") ?? "[]") || [];
  const userPostData =
    JSON.parse(localStorage.getItem("userPostData") ?? "[]") || [];
  const [userPostCommentData, setUserPostCommentData] = useState<
    UserPostComment[]
  >(() => {
    return (
      JSON.parse(localStorage.getItem("userPostCommentData") ?? "[]") || []
    );
  });
  const [userPostLikeData, setUserPostLikeData] = useState<UserPostLike[]>(
    () => {
      return JSON.parse(localStorage.getItem("userPostLikeData") ?? "[]") || [];
    }
  );
  useEffect(() => {
    // Merge post with its user details
    if (userPostData === undefined) return;
    const merged: any = userPostData
      .map((post: UserPost) => {
        const user: any = userProfileData.find(
          (u: any) => u.userId === post.userId
        );
        if (!user) return null;
        return {
          ...post,
          fullName: user.fullName || "Unknown User",
          profilePic: user.profilePic || null,
          accountType: user.accountType || "public",
        };
      })
      .filter(Boolean);

    // Only public accounts posts visible
    const publicPosts = merged.filter((p: any) => p.accountType === "public");

    // Sort by latest post
    publicPosts.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setHasMore(true);
    setAllPosts(publicPosts);
    setVisiblePosts(publicPosts.slice(0, 5)); // Show first 5
  }, []);
  const loadMore = () => {
    if (visiblePosts.length >= allPosts.length) {
      setHasMore(false);
      return;
    }
    setVisiblePosts((prev) => [
      ...prev,
      ...allPosts.slice(prev.length, prev.length + 5),
    ]);
  };
  
  function commandAddHandler() {
    if (!commentText.trim()) {
      message.warning("Comment cannot be empty");
      return;
    }
    const updateData=addComment(selectedPost.postId, commentText,loggedInUserId,userPostCommentData);
    setUserPostCommentData(updateData)
    
    setIsModalOpen(false);
  }
  
  

  useEffect(() => {
    localStorage.setItem(
      "userPostCommentData",
      JSON.stringify(userPostCommentData)
    );
  }, [userPostCommentData]);
  useEffect(() => {
    localStorage.setItem("userPostLikeData", JSON.stringify(userPostLikeData));
  }, [userPostLikeData]);
  return (
    <>
      <div className="min-h-screen bg-black text-white px-4 py-8 mt-10 lg:ml-25 md:ml-25">
        <h1 className="text-3xl font-bold mb-6">ShareMind Feed</h1>

        {/* Infinite Scroll Section */}
        <InfiniteScroll
          dataLength={visiblePosts.length}
          next={loadMore}
          hasMore={hasMore}
          loader={
            <div className="text-center py-4">
              <Spin />
            </div>
          }
          endMessage={
            <p className="text-center text-gray-500 py-4">
              No more posts to show
            </p>
          }
        >
          {/* <AllPosts visiblePosts={visiblePosts} onCommentClick={commentHandler}/> */}
          <div className="flex flex-col gap-6 lg:w-100 md:w-100 mx-auto">
            {visiblePosts.map((post: any) => (
              <PostCard
    key={post.postId}
    post={post}
    onCommentClick={commentHandler}
  />
            ))}
          </div>
        </InfiniteScroll>
      </div>
     <CommentModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSubmit={commandAddHandler}
  commentText={commentText}
  setCommentText={setCommentText}
  selectedPost={selectedPost}
  commentData={userPostCommentData}
/>

    </>
  );
}
