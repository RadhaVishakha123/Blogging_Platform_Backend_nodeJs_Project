import { Avatar, Modal, Button, Form, Input, Checkbox, Upload } from "antd";
import { EditOutlined, LockOutlined, CameraOutlined } from "@ant-design/icons";
import useUser from "../../hooks/useUser";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Default_User from "../../assets/Default_User.jpg";
import { useRecoilValue } from "recoil";
import { postRefreshAtom } from "../../recoil/atoms/postRefreshAtom";
import CommentModal from "../comment/CommentModal";
import { addComment, fetchComments } from "../../Helper/utility";
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
  const message = App.useApp().message;
  const [commentData, setCommentData] = useState<UserPostComment[]>([]);
  const { currentLoggedInUserData } = useUser();
  if (!currentLoggedInUserData)
    return <div className="text-white text-center p-5">Loading...</div>;
  const [isProfileModelOpen, setIsProfileModelOpen] = useState<boolean>(false);
  const userPostLikeData =
    JSON.parse(localStorage.getItem("userPostLikeData") ?? "[]") || [];
  const [userProfileData, setUserProfileData] = useState<UserProfile[]>(() => {
    return JSON.parse(localStorage.getItem("userProfileData") ?? "[]") || [];
  });
  const loggedInUserId = currentLoggedInUserData?.user.id ?? "";
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

  const accessToken = currentLoggedInUserData?.accessToken ?? "";

  const [userFollowerData, setUserFollowerData] = useState<UserFollower[]>(() =>
    JSON.parse(localStorage.getItem("userFollowerData") ?? "[]")
  );
  const postRefresh = useRecoilValue(postRefreshAtom);
  const location = useLocation();
  const state = location.state as {
    from?: string;
    userId?: string;
    username?: string;
  };
  const profileUserId = state?.userId ?? currentLoggedInUserData?.user.id; // Use clicked user or current user
  const profileUsername =
    state?.username || currentLoggedInUserData?.user.username;
  console.log("usernmae:", profileUsername);
  const [isFollowing, setIsFollowing] = useState<boolean>(
    checkIsFollowing(
      currentLoggedInUserData?.user.id || "",
      profileUserId || ""
    )
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
  async function addUserProfile(
    data: Omit<UserProfile, "userId">
  ): Promise<boolean> {
    const userId = currentLoggedInUserData?.user.id;
    if (!userId) return false;

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("fullName", data.fullName);
    formData.append("bio", data.bio);
    formData.append("accountType", data.accountType);
    formData.append("profilePic", data.profilePic);
    const response = await fetch("http://localhost:8000/api/userprofile/add", {
      method: "post",
      headers: {
        Authorization: `Bearer ${currentLoggedInUserData?.accessToken}`,
      },
      body: formData,
    });
    const result = await response.json();
    if (result.message !== "Success") return false;
    return true;
  }

  // ---------------------------
  // FETCH PROFILE
  // ---------------------------
  async function fetchUserProflile(userId: string): Promise<UserProfile> {
    const response = await fetch(
      `http://localhost:8000/api/userprofile/fetch?userId=${userId}`,
      {
        method: "get",
        headers: {
          Authorization: `Bearer ${currentLoggedInUserData?.accessToken}`,
        },
      }
    );
    const result = await response.json();
    return result.profile;
    // const user = userProfileData.find((u) => u.userId === userId);

    // if (!user) {
    //   return {
    //     userId,
    //     fullName: "",
    //     bio: "",
    //     profilePic: "",
    //     accountType: "public",
    //   };
    // }
    // return user;q
  }

  async function fetchPostData(profileUserId: string) {
    const response = await fetch(
      `http://localhost:8000/api/userpost/profilepost?userId=${profileUserId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${currentLoggedInUserData?.accessToken}`,
        },
      }
    );

    const result = await response.json();
    console.log("user profile post data:", result);

    // API returns { message, data: posts }
    const merged = result.data || [];
    return merged;
    // const postData: UserPost[] =
    //   JSON.parse(localStorage.getItem("userPostData") ?? "[]") || [];

    // //  use state variable, not reloaded storage variable
    // const user = userProfileData.find((u: any) => u.userId === profileUserId);

    // return postData
    //   .filter((post) => post.userId === profileUserId)
    //   .map((post) => ({
    //     ...post,
    //     fullName: user?.fullName || "Unknown User",
    //     profilePic: user?.profilePic || null,
    //     accountType: user?.accountType || "public",
    //   }));
  }

  if (!currentLoggedInUserData)
    return <div className="text-white text-center mt-10">Please login.</div>;
  //   if (!userDetails) return null;

  const isPrivate = userDetails?.accountType === "private";
  const isOwner = currentLoggedInUserData?.user.id === profileUserId;

  // TEMP DATA (for input editing)
  const [tempData, setTempData] = useState<Omit<UserProfile, "userId">>({
    fullName: "",
    bio: "",
    profilePic: "",
    accountType: "public",
  });
  const openFollowerModal = async () => {
    const followerData =
      userFollowerData?.find((f) => f.userId === profileUserId)?.follower || [];

    const mergedList = await Promise.all(
      followerData.map(async (id: string) => {
        const profile = await getUserDetails(id, accessToken);
        return {
          userId: id,
          fullName: profile?.fullName || "Unknown User",
          profilePic: profile?.profilePic || "",
        };
      })
    );

    setFollowModalTitle("Followers");
    setFollowList(mergedList);
    setIsFollowModalOpen(true);
  };

  const openFollowingModal = async () => {
    const followingData =
      userFollowingData?.find((f) => f.userId === profileUserId)?.following ||
      [];

    const mergedList = await Promise.all(
      followingData.map(async (id: string) => {
        const profile = await getUserDetails(id, accessToken);
        return {
          userId: id,
          fullName: profile?.fullName || "",
          profilePic: profile?.profilePic || "",
        };
      })
    );

    setFollowModalTitle("Following");
    setFollowList(mergedList);
    setIsFollowModalOpen(true);
  };
  async function commentHandler(post: any) {
    console.log("data post", post);

    setselectedPost(post);
    setCommentText("");
    const comments = await fetchComments(post._id, accessToken); // fetch comments for this post
    setCommentData(comments); // save to state
    setIsModalOpen(true);
  }
  async function commandAddHandler() {
    if (!commentText.trim()) {
      message.warning("Comment cannot be empty");
      return;
    }
    console.log("userid from home:", selectedPost);
    await addComment(
      selectedPost.postId,
      commentText,
      loggedInUserId,
      accessToken
    );
    // Refresh comments
    const updatedComments = await fetchComments(selectedPost._id, accessToken);
    setCommentData(updatedComments);

    setIsModalOpen(false);
  }

  useEffect(() => {
    (async () => {
      if (isProfileModelOpen && currentLoggedInUserData) {
        console.log(
          "userId (send in fetch function):",
          currentLoggedInUserData?.user.id
        );
        const profile = await fetchUserProflile(
          currentLoggedInUserData?.user.id
        );
        setTempData({
          fullName: profile.fullName,
          bio: profile.bio,
          profilePic: profile.profilePic,
          accountType: profile.accountType,
        });
      }
    })();
  }, [isProfileModelOpen]);
  useEffect(() => {
    if (!imageFile || profileUserId !== currentLoggedInUserData?.user.id)
      return;
    (async () => {
      addUserProfile({
        fullName: userDetails?.fullName || "",
        bio: userDetails?.bio || "",
        profilePic: imageFile,
        accountType: userDetails?.accountType || "public",
      });
      const updatedProfile = await fetchUserProflile(profileUserId);
      //  Update UI immediately
      setUserDetails(updatedProfile);
      console.log("this is runing1 , ...:",imageFile);
      console.log("this is runing 2, ...:",updatedProfile);
    })();
  }, [imageFile]);
  useEffect(() => {
    if (!profileUserId) return;
    (async () => {
      const profile = await fetchUserProflile(profileUserId);
      setUserDetails(profile);

      const posts = await fetchPostData(profileUserId);
      console.log("userdataaaa:", posts);
      setUserPosts(posts);
    })();
  }, [profileUserId]);

  useEffect(() => {
    setIsFollowing(
      checkIsFollowing(
        currentLoggedInUserData?.user.id || "",
        profileUserId || ""
      )
    );
  }, [refreshFollow, profileUserId]);

  // SAVE CHANGES
  async function saveChanges() {
    if (!currentLoggedInUserData) return;

    await addUserProfile({
      fullName: tempData.fullName,
      bio: tempData.bio,
      profilePic: imageFile || tempData.profilePic,
      accountType: tempData.accountType,
    });
    const updatedProfile = await fetchUserProflile(profileUserId);
    //  Update UI immediately
    setUserDetails(updatedProfile);
    setIsProfileModelOpen(false);
  }
  if (!userDetails) {
    return <div className="text-white text-center p-5">Loading profile...</div>;
  }
  if (!profileUserId) {
    return <div className="text-white text-center p-5">User not found</div>;
  }

  return (
    <div className="min-h-screen w-full overflow-hidden bg-black text-white px-4 py-8 mt-10 lg:ml-22 md:ml-22 xl:ml-22 ">
      {/* TOP SECTION */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <Avatar
            size={110}
            src={
              userDetails.profilePic
                ? `http://localhost:8000${
                    userDetails.profilePic
                  }?t=${Date.now()}`
                : Default_User
            }
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
                  currentLoggedInUserData?.user.id,
                  profileUserId!
                );
                setUserFollowerData(result.userFollowerData);
                setUserFollowingData(result.userFollowingData);
                setRefreshFollow((prev) => !prev);
              } else {
                const result = followUser(
                  currentLoggedInUserData?.user.id,
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
                key={post._id}
                post={post}
                onCommentClick={() => commentHandler(post)}
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
                      checkIsFollowing(
                        currentLoggedInUserData?.user.id,
                        item.userId
                      )
                        ? "default"
                        : "primary"
                    }
                    className={`${
                      checkIsFollowing(
                        currentLoggedInUserData?.user.id,
                        item.userId
                      )
                        ? "bg-gray-800 text-white border-gray-700"
                        : "bg-blue-600 hover:bg-blue-700 border-none"
                    }`}
                    onClick={async () => {
                      let result;

                      if (
                        checkIsFollowing(
                          currentLoggedInUserData?.user.id,
                          item.userId
                        )
                      ) {
                        result = unfollowUser(
                          currentLoggedInUserData?.user.id,
                          item.userId
                        );
                      } else {
                        result = followUser(
                          currentLoggedInUserData?.user.id,
                          item.userId
                        );
                      }

                      setUserFollowerData(result.userFollowerData);
                      setUserFollowingData(result.userFollowingData);

                      // -----------------------------
                      // Update FOLLOWERS modal list
                      // -----------------------------
                      if (followModalTitle === "Followers") {
                        const followerIds =
                          result.userFollowerData.find(
                            (f: any) => f.userId === profileUserId
                          )?.follower || [];

                        const mergedFollowers = await Promise.all(
                          followerIds.map(async (id: any) => {
                            const profile = await getUserDetails(
                              id,
                              accessToken
                            );
                            return {
                              userId: id,
                              fullName: profile?.fullName || "",
                              profilePic: profile?.profilePic || "",
                            };
                          })
                        );

                        setFollowList(mergedFollowers);
                      }

                      // -----------------------------
                      // Update FOLLOWING modal list
                      // -----------------------------
                      if (followModalTitle === "Following") {
                        const followingIds =
                          result.userFollowingData.find(
                            (f: any) => f.userId === profileUserId
                          )?.following || [];

                        const mergedFollowing = await Promise.all(
                          followingIds.map(async (id: string) => {
                            const profile = await getUserDetails(
                              id,
                              accessToken
                            );
                            return {
                              userId: id,
                              fullName: profile?.fullName || "",
                              profilePic: profile?.profilePic || "",
                            };
                          })
                        );

                        setFollowList(mergedFollowing);
                      }

                      setRefreshFollow((prev) => !prev);
                    }}
                  >
                    {checkIsFollowing(
                      currentLoggedInUserData?.user.id,
                      item.userId
                    )
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
        commentData={commentData}
      />
    </div>
  );
}
