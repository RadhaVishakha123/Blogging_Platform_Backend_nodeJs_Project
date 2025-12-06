import { useEffect, useState } from "react";
import useUser from "../../hooks/useUser";
import { Avatar, Card, Button, Spin, Input, Modal } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { useRecoilValue } from "recoil";
import { postRefreshAtom } from "../../recoil/atoms/postRefreshAtom";
import { App } from "antd";
import {
  postLikeCount,
  getUserDetails,
  addComment,
  fetchComments,
  toggleLike,
  isPostLike,
} from "../../Helper/utility";
import PostCard from "../post/PostCard";
import CommentModal from "../comment/CommentModal";
import type {
  UserPost,
  UserPostComment,
  UserPostLike,
} from "../../Helper/Type";

export default function Home() {
  const { currentLoggedInUserData } = useUser();
  if(!currentLoggedInUserData) return null;
  const accessToken=currentLoggedInUserData.accessToken;
  const [commentData, setCommentData] = useState<UserPostComment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const postRefresh=useRecoilValue(postRefreshAtom);
  const [selectedPost, setselectedPost] = useState<any>(null);
  const message = App.useApp().message;

  async function commentHandler(post: any) {
    setIsModalOpen(true);
    setselectedPost(post);
    console.log("post data:",post);
    const comments = await fetchComments(post._id,accessToken); // fetch comments for this post
     setCommentData(comments); // save to state
     console.log("home page comment data after the 2 :",commentData);
    setCommentText("");
    console.log()
  }
  const loggedInUserId = currentLoggedInUserData?.user.id ?? "";
  console.log("home page current user id:", loggedInUserId);
  const [refreshLikes, setRefreshLikes] = useState(false);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [visiblePosts, setVisiblePosts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  
  const [userPostLikeData, setUserPostLikeData] = useState<UserPostLike[]>(
    () => {
      return JSON.parse(localStorage.getItem("userPostLikeData") ?? "[]") || [];
    }
  );
 
  useEffect(() => {
    
  
  (async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/userpost/allpost",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${currentLoggedInUserData?.accessToken}`,
          },
        }
      );

      const result = await response.json();

      // API returns { message, data: posts }
      const merged = result.data || [];
console.log("post data:",merged);
      // Only public account posts
      const publicPosts = merged.filter(
        (p: any) => p.accountType === "public"
      );

      // Sort latest first
      publicPosts.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setAllPosts(publicPosts);
      setVisiblePosts(publicPosts.slice(0, 5));
      setHasMore(true);
    } catch (err) {
      console.log("Error fetching posts:", err);
    }
  })();
}, [postRefresh]);
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

  async function commandAddHandler() {
   
    if (!commentText.trim()) {
      message.warning("Comment cannot be empty");
      return;
    }
    const updateData = await addComment(
      selectedPost._id,
      commentText,
      loggedInUserId,
      accessToken
    );
    console.log("selected post id:",selectedPost.postId)
    const comments = await fetchComments(selectedPost._id,accessToken); // fetch comments for this post
      setCommentData(comments); // save to state
      console.log("home page comment data after the ",commentData);
    setIsModalOpen(false);
  }

  
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
                key={post._id}
                post={post}
                onCommentClick={()=>commentHandler(post)}
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
        commentData={commentData}
      />
    </>
  );
}


