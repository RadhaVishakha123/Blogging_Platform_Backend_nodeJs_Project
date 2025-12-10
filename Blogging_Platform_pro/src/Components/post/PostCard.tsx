import { Avatar, Card } from "antd";
import { HeartOutlined, HeartFilled, CommentOutlined } from "@ant-design/icons";
import Default_User from "../../assets/Default_User.jpg";
import {
  postLikeCount,
  formatPostDate,
  toggleLike,
  isPostLike,
} from "../../Helper/utility";
import useUser from "../../hooks/useUser";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";
export default function PostCard({ post, onCommentClick }: any) {
  const { currentLoggedInUserData } = useUser();
  const loggedInUserId = currentLoggedInUserData?.user.id;
  const accessToken=currentLoggedInUserData?.accessToken ?? "";
  const [isLiked, setIsLiked] = useState<boolean>(false);
const [likeCount, setLikeCount] = useState<number>(0);
  // --------------------------
  // SAFE DEFAULTS
  // --------------------------
  let profilePic:any;
  if(post.profilePic == null){
     profilePic=Default_User;
  }
  else{
   profilePic =`${API_BASE_URL}${post?.profilePic }`;
  }
  const postImage = `${API_BASE_URL}${post.postImage}`;
  const fullName = post?.fullName ?? "Unknown User";
  const content = post?.content ?? "";
  const postId = post?._id ?? "";
  const createdAt = post?.createdAt ?? new Date().toISOString();
  if (!post) return null; // <- Safety guard
const clickbtn = async()=>{
  const liked = await toggleLike(postId,currentLoggedInUserData?.user.id as string,accessToken);
  setIsLiked(liked);
 const count = await postLikeCount(postId, accessToken);
  setLikeCount(count); // update count
 
}
useEffect(()=>{
  async function fetchLikeInfo() {
  const likeUpdate:boolean =await isPostLike(postId, loggedInUserId as string,accessToken);
  console.log("likeUpdate:",likeUpdate);
    setIsLiked(likeUpdate);
    const countUpdate=await postLikeCount(postId, accessToken);
    setLikeCount(countUpdate)
   }
    fetchLikeInfo();
  }
,[postId,loggedInUserId])
  return (
    <Card className="bg-[#111] border border-gray-800 text-white">
      {/* User Info */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar src={profilePic} size={48} />
        <h3 className="text-lg font-semibold">{fullName}</h3>
      </div>

      {/* Post Image */}
      { postImage && (
        <img
          src={postImage}
          alt="Post"
          className="rounded-lg w-full max-h-[450px] object-cover mb-4"
        />
      )}

      {/* Content */}
      <p className="text-gray-400 mb-4">{content}</p>

      {/* Like + Comment */}
      <div className="flex justify-between mt-4">
        <div className="flex gap-6">
          {/* LIKE */}
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={clickbtn}
          >
            {isLiked? (
              <HeartFilled className="text-2xl" style={{ color: "red" }} />
            ) : (
              <HeartOutlined className="text-2xl" />
            )}

            <span className="text-sm mt-1 text-gray-400">
              {likeCount}
            </span>
          </div>

          {/* COMMENT */}
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => onCommentClick(post)}
          >
            <CommentOutlined className="text-2xl text-white" />
          </div>
        </div>

        <p className="text-gray-600 text-[10px]">{formatPostDate(createdAt)}</p>
      </div>
    </Card>
  );
}
