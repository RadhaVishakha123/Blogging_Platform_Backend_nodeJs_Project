import { Avatar, Modal, Button, Form, Input, Checkbox, Upload } from "antd";
import { EditOutlined, LockOutlined, CameraOutlined } from "@ant-design/icons";
import useUser from "../../hooks/useUser";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Default_User from "../../assets/Default_User.jpg";

import CommentModal from "../comment/CommentModal";
import { addComment } from "../../Helper/utility";
import { App } from "antd";
import type { UserPostComment, UserPostLike } from "../../Helper/Type";
import type {
  UserProfile,
  UserFollowing,
  UserFollower,
  UserPost,
} from "../../Helper/Type";
import {
  fileToBase64,
  followUser,
  unfollowUser,
  checkIsFollowing,
  postLikeCount,
  getUserDetails,
} from "../../Helper/utility";
import PostCard from "../post/PostCard";

export default function UserProfile() {
  const [userPostCommentData, setUserPostCommentData] = useState<
    UserPostComment[]
  >(() => {
    return (
      JSON.parse(localStorage.getItem("userPostCommentData") ?? "[]") || []
    );
  });
  const message = App.useApp().message;
  const { currentLoggedInUserData } = useUser();
  const [isProfileModelOpen, setIsProfileModelOpen] = useState<boolean>(false);
  const userPostLikeData =
    JSON.parse(localStorage.getItem("userPostLikeData") ?? "[]") || [];
  //   const {
  //     fetchPostData,
  //     followUser,
  //     unfollowUser,
  //     userFollowData,
  //     checkIsFollowing,
  //     setUserProfileData,
  //     userProfileData
  //   } = useUserProfile();
  const [userProfileData, setUserProfileData] = useState<UserProfile[]>(() => {
    return JSON.parse(localStorage.getItem("userProfileData") ?? "[]") || [];
  });
  const loggedInUserId = currentLoggedInUserData?.user._id ?? "";
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [refreshFollow, setRefreshFollow] = useState(false);
  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [followModalTitle, setFollowModalTitle] = useState("");
  const [followList, setFollowList] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [selectedPost, setselectedPost] = useState<any>(null);
  const [userFollowingData, setUserFollowingData] = useState<UserFollowing[]>(
    () => JSON.parse(localStorage.getItem("userFollowingData") ?? "[]")
  );

  const [userFollowerData, setUserFollowerData] = useState<UserFollower[]>(() =>
    JSON.parse(localStorage.getItem("userFollowerData") ?? "[]")
  );

  const location = useLocation();
  const state = location.state as {
    from?: string;
    userId?: string;
    username?: string;
  };
  const profileUserId = state?.userId ??currentLoggedInUserData?.user._id ; // Use clicked user or current user
  const profileUsername = state?.username || currentLoggedInUserData?.user.username;
  const [isFollowing, setIsFollowing] = useState<boolean>(
    checkIsFollowing(currentLoggedInUserData?.user._id  || "", profileUserId || "")
  );

  const FollowerCount =
    userFollowerData?.find(
      (follow: UserFollower) => follow.userId === profileUserId
    )?.follower.length || 0;
  const FollowingCount =
    userFollowingData?.find(
      (follow: UserFollowing) => follow.userId === profileUserId
    )?.following.length || 0;

  const uploadProps = {
    beforeUpload: (file: any) => {
      setImageFile(file);
      return false; // prevent auto upload
    },
    showUploadList: false,
    maxCount: 1,
    accept: "image/*",
  };
  // ---------------------------
  // ADD USER PROFILE
  // ---------------------------
  function addUserProfile(data: Omit<UserProfile, "userId">): boolean {
    const uid = currentLoggedInUserData?.user._id ;
    if (!uid) return false;
    const newUser: UserProfile = {
      userId: uid,
      fullName: data.fullName,
      bio: data.bio,
      profilePic: data.profilePic,
      accountType: data.accountType,
    };
    const exists = userProfileData.some((u) => u.userId === uid);
    if (exists) {
      // UPDATE EXISTING PROFILE
      setUserProfileData((prev) =>
        prev.map((u) => (u.userId === uid ? newUser : u))
      );
    } else {
      // ADD NEW USER PROFILE
      setUserProfileData((prev) => [...prev, newUser]);
    }
    return true;
  }

  // ---------------------------
  // FETCH PROFILE
  // ---------------------------
  function fetchUserProflile(userId: string): UserProfile {
    const user = userProfileData.find((u) => u.userId === userId);

    if (!user) {
      return {
        userId,
        fullName: "",
        bio: "",
        profilePic: "",
        accountType: "public",
      };
    }
    return user;
  }
  function fetchPostData(profileUserId: string) {
    const postData: UserPost[] =
      JSON.parse(localStorage.getItem("userPostData") ?? "[]") || [];

    //  use state variable, not reloaded storage variable
    const user = userProfileData.find((u: any) => u.userId === profileUserId);

    return postData
      .filter((post) => post.userId === profileUserId)
      .map((post) => ({
        ...post,
        fullName: user?.fullName || "Unknown User",
        profilePic: user?.profilePic || null,
        accountType: user?.accountType || "public",
      }));
  }

  if (!currentLoggedInUserData)
    return <div className="text-white text-center mt-10">Please login.</div>;
  //   if (!userDetails) return null;

  const isPrivate = userDetails?.accountType === "private";
  const isOwner = currentLoggedInUserData?.user._id  === profileUserId;

  // TEMP DATA (for input editing)
  const [tempData, setTempData] = useState<Omit<UserProfile, "userId">>({
    fullName: "",
    bio: "",
    profilePic: "",
    accountType: "public",
  });
  const openFollowerModal = () => {
    const followerData =
      userFollowerData?.find((f) => f.userId === profileUserId)?.follower || [];
    const mergedList = followerData.map((id: string) => {
      const profile = getUserDetails(id);
      return {
        userId: id,
        fullName: profile?.fullName || "Unknown User",
        profilePic: profile?.profilePic || "",
      };
    });
    setFollowModalTitle("Followers");
    setFollowList(mergedList);
    setIsFollowModalOpen(true);
  };
  const openFollowingModal = () => {
    const followingData =
      userFollowingData?.find((f) => f.userId === profileUserId)?.following ||
      [];

    const mergedList = followingData.map((id: string) => {
      const profile = getUserDetails(id);
      return {
        userId: id,
        fullName: profile?.fullName || "",
        profilePic: profile?.profilePic || "",
      };
    });

    setFollowModalTitle("Following");
    setFollowList(mergedList);
    setIsFollowModalOpen(true);
  };
  function commentHandler(post: any) {
    console.log("data post", post);
    setIsModalOpen(true);
    setselectedPost(post);
    setCommentText("");
  }
  function commandAddHandler() {
    if (!commentText.trim()) {
      message.warning("Comment cannot be empty");
      return;
    }
    console.log("userid from home:", selectedPost);
    const updateData = addComment(
      selectedPost.postId,
      commentText,
      loggedInUserId,
      userPostCommentData
    );
    setUserPostCommentData(updateData);
    setIsModalOpen(false);
  }

  useEffect(() => {
    if (isProfileModelOpen && currentLoggedInUserData) {
      const profile = fetchUserProflile(currentLoggedInUserData?.user._id );
      setTempData({
        fullName: profile.fullName,
        bio: profile.bio,
        profilePic: profile.profilePic,
        accountType: profile.accountType,
      });
    }
  }, [isProfileModelOpen]);
  useEffect(() => {
    if (!imageFile || profileUserId !==currentLoggedInUserData?.user._id ) return;

    (async () => {
      const imageUrl = await fileToBase64(imageFile);
      addUserProfile({
        fullName: userDetails?.fullName || "",
        bio: userDetails?.bio || "",
        profilePic: imageUrl,
        accountType: userDetails?.accountType || "public",
      });
    })();
  }, [imageFile]);
  useEffect(() => {
    if (!profileUserId) return;

    const profile = fetchUserProflile(profileUserId);
    setUserDetails(profile);

    const posts = fetchPostData(profileUserId);
    console.log("userdataaaa:", posts);
    setUserPosts(posts);
  }, [profileUserId, userProfileData]);

  useEffect(() => {
    localStorage.setItem("userProfileData", JSON.stringify(userProfileData));
  }, [userProfileData]);

  useEffect(() => {
    setIsFollowing(
      checkIsFollowing(currentLoggedInUserData?.user._id || "", profileUserId || "")
    );
  }, [refreshFollow, profileUserId]);

  // SAVE CHANGES
  function saveChanges() {
    if (!currentLoggedInUserData) return;

    addUserProfile({
      fullName: tempData.fullName,
      bio: tempData.bio,
      profilePic: tempData.profilePic,
      accountType: tempData.accountType,
    });

    setIsProfileModelOpen(false);
  }
  if (!userDetails) {
    return <div className="text-white text-center p-5">Loading profile...</div>;
  }
  if (!profileUserId) {
    return <div className="text-white text-center p-5">User not found</div>;
  }
  //   useEffect(() => {
  //   setUserFollowerData(JSON.parse(localStorage.getItem("userFollowerData")??"[]") || []);
  //   setUserFollowingData(JSON.parse(localStorage.getItem("userFollowingData")??"[]") || []);
  // }, [refreshFollow]);

  // useEffect(() => {
  //     localStorage.setItem(
  //       "userPostCommentData",
  //       JSON.stringify(userPostCommentData)
  //     );
  //   }, [userPostCommentData]);
  return (
    <div className="min-h-screen w-full overflow-hidden bg-black text-white px-4 py-8 mt-10 lg:ml-22 md:ml-22 xl:ml-22 ">
      {/* TOP SECTION */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <Avatar
            size={110}
            src={userDetails.profilePic ? userDetails.profilePic : Default_User}
            className="border-4 border-gray-700"
          />
          {isOwner && (
            <div className="text-center mt-3">
              <Upload {...uploadProps}>
                <Button
                  icon={<CameraOutlined />}
                  shape="circle"
                  className="text-white !p-0 !m-0 !border-0 !hover:bg-transparent"
                />
              </Upload>
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-semibold">{profileUsername}</h1>

          <p className="text-gray-400">{userDetails.fullName}</p>

          <div className="flex gap-6 max-w-1/3 mt-6 text-sm md:text-lg md:gap-8">
            <span>
              <b>{userPosts.length}</b> Posts
            </span>
            <span onClick={openFollowerModal} className="cursor-pointer">
              <b>{FollowerCount}</b> Followers
            </span>
            <span onClick={openFollowingModal} className="cursor-pointer">
              <b>{FollowingCount}</b> Following
            </span>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="flex gap-8 mt-6 text-lg">
        <p className="mt-2 text-gray-300">{userDetails.bio}</p>
      </div>

      {/* Edit / Follow Button */}
      <div className="flex gap-8 mt-6 text-lg">
        {isOwner ? (
          <Button
            type="default"
            className="mt-2 bg-gray-800 text-white border-gray-700"
            icon={<EditOutlined />}
            onClick={() => setIsProfileModelOpen(true)}
          >
            Edit Profile
          </Button>
        ) : (
          <Button
            type={isFollowing ? "default" : "primary"}
            className={`mt-2 ${
              isFollowing
                ? "bg-gray-800 text-white border-gray-700"
                : "bg-blue-600 hover:bg-blue-700 border-none"
            }`}
            onClick={() => {
              if (isFollowing) {
                const result = unfollowUser(
                  currentLoggedInUserData?.user._id ,
                  profileUserId!
                );
                setUserFollowerData(result.userFollowerData);
                setUserFollowingData(result.userFollowingData);
                setRefreshFollow((prev) => !prev);
              } else {
                const result = followUser(
                  currentLoggedInUserData?.user._id ,
                  profileUserId!
                );
                setUserFollowerData(result.userFollowerData);
                setUserFollowingData(result.userFollowingData);
                setRefreshFollow((prev) => !prev);
              }
            }}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </Button>
        )}
      </div>

      <hr className="border-gray-700 my-6" />

      {/* PRIVATE BLOCK */}
      {!isOwner && isPrivate ? (
        <div className="flex flex-col items-center mt-20">
          <LockOutlined className="text-5xl text-gray-600" />
          <h2 className="text-2xl mt-4">This Account is Private</h2>
          <p className="text-gray-400 mt-2">
            Follow to see their photos and videos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-[3px]  mt-4">
          {userPosts.length === 0 ? (
            <p className="text-gray-500 col-span-3 text-center">
              No posts yet.
            </p>
          ) : (
            userPosts.map((post: any) => (
              <PostCard
                key={post.postId}
                post={post}
                onCommentClick={commentHandler}
              />
            ))
            // <AllPosts visiblePosts={userPosts} onCommentClick={commentHandler} className="w-full flex-row"/>
          )}
        </div>
      )}

      {isOwner && (
        <>
          <Modal
            open={isProfileModelOpen}
            footer={null}
            centered
            onCancel={() => setIsProfileModelOpen(false)}
            rootClassName="custom-modal"
            modalRender={(content) => (
              <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                {content}
              </div>
            )}
          >
            <div className="text-white">
              <h2 className="text-xl mb-4">Edit Profile</h2>

              <Form layout="vertical">
                {/* Full Name */}
                <Form.Item
                  label={<span className="text-white">Full Name</span>}
                >
                  <Input
                    value={tempData.fullName}
                    onChange={(e) =>
                      setTempData({ ...tempData, fullName: e.target.value })
                    }
                    placeholder="Enter your name"
                  />
                </Form.Item>

                {/* Bio */}
                <Form.Item label={<span className="text-white">Bio</span>}>
                  <Input.TextArea
                    rows={3}
                    value={tempData.bio}
                    onChange={(e) =>
                      setTempData({ ...tempData, bio: e.target.value })
                    }
                    placeholder="Tell something about yourself..."
                  />
                </Form.Item>

                {/* Account Type */}
                <Form.Item label={<span className="text-white">Private</span>}>
                  <Checkbox
                    checked={tempData.accountType === "private"}
                    onChange={(e) =>
                      setTempData({
                        ...tempData,
                        accountType: e.target.checked ? "private" : "public",
                      })
                    }
                  >
                    Private Account
                  </Checkbox>
                </Form.Item>

                <Button
                  type="primary"
                  block
                  className="mt-4"
                  onClick={saveChanges}
                >
                  Save
                </Button>
              </Form>
            </div>
          </Modal>
        </>
      )}
      <Modal
        open={isFollowModalOpen}
        onCancel={() => {
          setIsFollowModalOpen(false);
          setFollowList([]);
        }}
        footer={null}
        title={followModalTitle}
      >
        <div className="text-white">
          {followList.length === 0 ? (
            <p>No {followModalTitle.toLowerCase()} yet.</p>
          ) : (
            followList.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center gap-3 mb-4"
              >
                <div className=" flex ">
                  <Avatar src={item.profilePic || Default_User} />
                  <div className=" mt-1 ml-3">
                    <p className="text-gray-400 text-sm">
                      {item.fullName || "unKnow"}
                    </p>
                  </div>
                </div>
                <div>
                  <Button
                    type={
                      checkIsFollowing(currentLoggedInUserData?.user._id , item.userId)
                        ? "default"
                        : "primary"
                    }
                    className={`${
                      checkIsFollowing(currentLoggedInUserData?.user._id , item.userId)
                        ? "bg-gray-800 text-white border-gray-700"
                        : "bg-blue-600 hover:bg-blue-700 border-none"
                    }`}
                    onClick={() => {
                      let result;
                      if (
                        checkIsFollowing(
                          currentLoggedInUserData?.user._id ,
                          item.userId
                        )
                      ) {
                        result = unfollowUser(
                          currentLoggedInUserData?.user._id ,
                          item.userId
                        );
                      } else {
                        result = followUser(
                          currentLoggedInUserData?.user._id ,
                          item.userId
                        );
                      }
                      setUserFollowerData(result.userFollowerData);
                      setUserFollowingData(result.userFollowingData);

                      if (followModalTitle === "Followers") {
                        const followerIds =
                          result.userFollowerData.find(
                            (f: any) => f.userId === profileUserId
                          )?.follower || [];

                        setFollowList(
                          followerIds.map((id: any) => {
                            const profile = getUserDetails(id);
                            return {
                              userId: id,
                              fullName: profile?.fullName || "",
                              profilePic: profile?.profilePic || "",
                            };
                          })
                        );
                      }

                      if (followModalTitle === "Following") {
                        const followingIds =
                          result.userFollowingData.find(
                            (f: any) => f.userId === profileUserId
                          )?.following || [];

                        setFollowList(
                          followingIds.map((id: string) => {
                            const profile = getUserDetails(id);
                            return {
                              userId: id,
                              fullName: profile?.fullName || "",
                              profilePic: profile?.profilePic || "",
                            };
                          })
                        );
                      }
                      setRefreshFollow((prev) => !prev);
                    }}
                  >
                    {checkIsFollowing(currentLoggedInUserData?.user._id , item.userId)
                      ? "Unfollow"
                      : "Follow"}
                  </Button>
          
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>
      <CommentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={commandAddHandler}
        commentText={commentText}
        setCommentText={setCommentText}
        selectedPost={selectedPost}
        commentData={userPostCommentData}
      />
    </div>
  );
}
