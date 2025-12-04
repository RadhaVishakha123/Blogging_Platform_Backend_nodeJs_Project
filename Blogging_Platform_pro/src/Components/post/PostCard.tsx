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
import type { UserPostLike } from "../../Helper/Type";

export default function PostCard({ post, onCommentClick }: any) {
  const { currentLoggedInUserData } = useUser();
  const loggedInUserId = currentLoggedInUserData?.user._id;

  const [userPostLikeData, setUserPostLikeData] = useState<UserPostLike[]>(() => {
    return JSON.parse(localStorage.getItem("userPostLikeData") ?? "[]") || [];
  });


  useEffect(() => {
    localStorage.setItem("userPostLikeData", JSON.stringify(userPostLikeData));
  }, [userPostLikeData]);

  // --------------------------
  // SAFE DEFAULTS
  // --------------------------
  const profilePic = post?.profilePic ?? Default_User;
  const imageUrl = post?.imageUrl ?? null;
  const fullName = post?.fullName ?? "Unknown User";
  const content = post?.content ?? "";
  const postId = post?.postId ?? "";
  const createdAt = post?.createdAt ?? new Date().toISOString();

  if (!post) return null; // <- Safety guard
const clickbtn = ()=>{
  const updated_data = toggleLike(postId,currentLoggedInUserData?.user._id as string,userPostLikeData)
  setUserPostLikeData(updated_data)
}

  return (
    <Card className="bg-[#111] border border-gray-800 text-white">
      {/* User Info */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar src={profilePic} size={48} />
        <h3 className="text-lg font-semibold">{fullName}</h3>
      </div>

      {/* Post Image */}
      {imageUrl && (
        <img
          src={imageUrl}
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
            {isPostLike(postId, loggedInUserId as string,userPostLikeData) ? (
              <HeartFilled className="text-2xl" style={{ color: "red" }} />
            ) : (
              <HeartOutlined className="text-2xl" />
            )}

            <span className="text-sm mt-1 text-gray-400">
              {postLikeCount(postId, userPostLikeData)}
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
