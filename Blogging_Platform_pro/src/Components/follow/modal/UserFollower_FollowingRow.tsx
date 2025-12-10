import {
  followUser,
  unfollowUser,
  checkIsFollowing,
} from "../../../Helper/utility";
import { followRefreshAtom } from "../../../recoil/atoms/followRefreshAtom";
import { useRecoilValue } from "recoil";
import { useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "antd";
import Default_User from "../../../assets/Default_User.jpg";
import {Avatar} from "antd";
export default function UserFollower_FollowingRow({item, currentUserId, accessToken, onClose }:any) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const followRefresh = useRecoilValue(followRefreshAtom);
  const setfollowRefresh = useSetRecoilState(followRefreshAtom);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    async function loadFollow() {
      const status = await checkIsFollowing(
        currentUserId,
        item.userId,
        accessToken
      );
      setIsFollowing(status);
      console.log("checkIsFollowing:", status);
    }
    loadFollow();
  }, [item.userId, followRefresh]);

  async function handleFollowToggle() {
    setLoading(true);
    setfollowRefresh((p) => !p);
    if (isFollowing) {
      await unfollowUser(currentUserId, item.userId, accessToken);
      setIsFollowing(false);
    } else {
      await followUser(currentUserId, item.userId, accessToken);
      setIsFollowing(true);
    }
    setLoading(false);
  }
  console.log("userfolllower&following row data:",item)

  return (
    <>
      <div key={item._id} className="flex justify-between items-center gap-3 mb-4">
        <div className=" flex ">
          <Avatar src={`${API_BASE_URL}${item.profilePic}` || Default_User} />
          <div className=" mt-1 ml-3">
            <p className="text-gray-400 text-sm">{item.fullName || "unKnow"}</p>
          </div>
        </div>
        <div>{ item.userId!==currentUserId &&
            <Button
              type={isFollowing ? "default" : "primary"}
              className={`${
                isFollowing
                  ? "bg-gray-800 text-white border-gray-700"
                  : "bg-blue-600 hover:bg-blue-700 border-none"
              }`}
              onClick={(e: any) => {
                e.stopPropagation();
              handleFollowToggle();}}

              
            >
              {isFollowing ? "Unfollow" : "Follow"}
          </Button>}
        </div>
      </div>
    </>
  );
}
