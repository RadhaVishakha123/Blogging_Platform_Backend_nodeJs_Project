import { useState, useEffect } from "react";
import { Button } from "antd";
import Default_User from "../../assets/Default_User.jpg";
import { followUser, unfollowUser, checkIsFollowing } from "../../Helper/utility";
import { useNavigate } from "react-router-dom";
import { followRefreshAtom } from "../../recoil/atoms/followRefreshAtom";
import { useRecoilValue } from "recoil";
import { useSetRecoilState } from "recoil";
export default function SearchUserRow({ user, currentUserId, accessToken, onClose }:any) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const followRefresh=useRecoilValue( followRefreshAtom );
const setfollowRefresh=useSetRecoilState(followRefreshAtom)
  useEffect(() => {
    async function loadFollow() {
      const status = await checkIsFollowing(currentUserId, user.userId, accessToken);
      setIsFollowing(status);
      console.log("checkIsFollowing:",status);
    }
    loadFollow();
  }, [user.userId,followRefresh]);

  async function handleFollowToggle() {
    setLoading(true);
    setfollowRefresh(p=>!p)
    if (isFollowing) {
      await unfollowUser(currentUserId, user.userId, accessToken);
      setIsFollowing(false);
    } else {
      await followUser(currentUserId, user.userId, accessToken);
      setIsFollowing(true);
    }
    setLoading(false);
  }

  return (
    <div
      key={user.userId}
      className="flex items-center justify-between p-3 bg-black rounded-lg hover:bg-gray-800 cursor-pointer"
    >
      {/* LEFT SIDE */}
      <div
        className="flex items-center gap-3"
        onClick={() => {
          onClose();
          navigate("/UserProfile", {
            state: { from: "search", userId: user.userId, username: user.username },
          });
        }}
      >
        <img
          src={user.profilePic ? `http://localhost:8000${user.profilePic}` : Default_User}
          className="w-12 h-12 rounded-full object-cover border border-gray-600"
        />
        <div className="text-white">
          <p className="font-semibold text-base">{user.username}</p>
          <p className="text-gray-400 text-sm">{user.fullName}</p>
        </div>
      </div>

      {/* RIGHT SIDE BUTTON */}
      {currentUserId !== user.userId && (
        <Button
          loading={loading}
          type={isFollowing ? "default" : "primary"}
          className={
            isFollowing
              ? "bg-gray-800 text-white border-gray-700"
              : "bg-blue-600 hover:bg-blue-700 border-none"
          }
          onClick={(e) => {
            e.stopPropagation();
            handleFollowToggle();
          }}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>
      )}
    </div>
  );
}
