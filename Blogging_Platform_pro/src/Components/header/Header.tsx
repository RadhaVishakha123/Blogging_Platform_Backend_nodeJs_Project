import { NavLink } from "react-router-dom";
import {
  HomeOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { Drawer, Input,Button } from "antd";
import { LoginOutlined } from "@ant-design/icons";
import PostModal from "../post/modal/PostModal";
import { useNavigate } from "react-router-dom";
import Default_User from "../../assets/Default_User.jpg";
import { useEffect, useMemo } from "react";
import type { UserProfile, User } from "../../Helper/Type";
import { unfollowUser,followUser,checkIsFollowing } from "../../Helper/utility";
import useUser from "../../hooks/useUser";
import { useDebounce } from "use-debounce";

import { useState } from "react";

export default function Header() {
  const { setCurrentLoggedInUserData } = useUser();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSlideOpen, setIsSlideOpen] = useState<boolean>(false);
 const {currentLoggedInUserData}=useUser();
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery]=useDebounce(query,500)
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 768;
  const [isHumburgerMenuOpen, setHumburgerMenuOpen] = useState<boolean>(false);
  const [refreshFollow, setRefreshFollow] = useState<boolean>(false);
  const userRegisterData =
    JSON.parse(localStorage.getItem("userRegisterData") ?? "[]") || [];
  const userProfileData =
    JSON.parse(localStorage.getItem("userProfileData") ?? "[]") || [];
  const MenuItems = [
    { name: "Home", icon: <HomeOutlined />, path: "/Home" },
    {
      name: "Search",
      icon: <SearchOutlined />,
      action: () => {
        setIsSlideOpen(true);
      },
    },
    {
      name: "Create",
      icon: <PlusCircleOutlined />,
      action: () => {
        setIsModalOpen(true);
      },
    },
  ];
  async function handleLogout() {
    setCurrentLoggedInUserData(null);
    navigate("/");
    const res=await fetch("http://localhost:8000/api/auth/logout",{
      method:"DELETE",
      credentials: "include"
    });
    document.cookie = "refreshToken=; Path=/; Max-Age=0";
    //return res.json();
    console.log("delete api :",res);
  }
  const mergedUsers = useMemo(() => {
    return userRegisterData.map((user: any) => {
      const profile: UserProfile | undefined = userProfileData.find(
        (p: UserProfile) => p.userId === user.id
      );
      return {
        userId: user.id,
        username: user.username,
        fullName: profile?.fullName || "",
        profilePic: profile?.profilePic || "",
        bio: profile?.bio || "",
        accountType: profile?.accountType || "public",
      };
    });
  }, [userRegisterData, userProfileData]);

  function searchUser(searchText: string) {
    if (!searchText.trim()) return [];

    const lowerQuery = searchText.toLowerCase();

    return mergedUsers.filter((user: any) =>
      user.username.toLowerCase().includes(lowerQuery)
    );
  }

  return (
    <>
      <header className="w-full bg-black top-0 fixed text-white flex items-center justify-between z-50 px-4 py-3 shadow-md">
        <button
          className="md:hidden text-white text-7xl"
          onClick={() => setHumburgerMenuOpen(true)}
        >
          {/* Use unfold icon when menu is closed */}
          {!isHumburgerMenuOpen ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
        <h2
          className="text-sm font-extrabold text-white tracking-wide text-center  "
          style={{ fontFamily: "'Pacifico', cursive" }}
        >
          ShareMind
        </h2>

        <div className=" flex ">
          <NavLink to="/UserProfile">
            <div
              className={`
                  w-12 h-12 flex items-center justify-center rounded-xl
                   hover:bg-gray-800 transition text-white
                `}
            >
              <UserOutlined />
            </div>
          </NavLink>
          <NavLink to="/" onClick={(e) =>{e.preventDefault();  handleLogout()}}>
            <div
              className={`
                  w-12 h-12 flex items-center justify-center rounded-xl
                   hover:bg-gray-800 transition text-white
                `}
            >
              <LoginOutlined />
            </div>
          </NavLink>
        </div>
      </header>
      {/* DESKTOP LEFT MENU */}
      <div className="hidden md:flex flex-col w-25 h-screen fixed left-0 top-0 mt-18 bg-black text-white border-r border-gray-700 p-4 space-y-8">
        <div className="space-y-4">
          {MenuItems.map((item) =>
            item.path ? (
              <NavLink
                key={item.name}
                to={item.path}
                className="flex justify-center"
              >
                <div
                  className={`
                    w-12 h-12 flex items-center justify-center rounded-xl text-xl
                    text-white
                    hover:bg-gray-800 transition
                  `}
                >
                  {item.icon}
                </div>
              </NavLink>
            ) : (
              <div
                key={item.name}
                onClick={() => {
                  item.action?.();
                }}
                className="flex justify-center cursor-pointer"
              >
                <div
                  className={`
                    w-12 h-12 flex items-center justify-center rounded-xl text-xl
                    text-white
                    hover:bg-gray-800 transition
                  `}
                >
                  {item.icon}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <Drawer
        open={isHumburgerMenuOpen}
        placement="left"
        title={null}
        width={100}
        className=" !bg-black top-6 !md:hidden !mt-10"
        onClose={() => setHumburgerMenuOpen(false)}
        closable={false}
        headerStyle={{ display: "none", margin: 0, padding: 0 }}
      >
        <div className=" flex flex-col gap-3 p-4 text-white   bg-black border-t border-gray-700  justify-around py-3 z-50">
          {MenuItems.map((item) =>
            item.path ? (
              <NavLink
                key={item.name}
                to={item.path}
                className="flex flex-col items-center"
              >
                <div
                  className={`
                  w-12 h-12 flex items-center justify-center rounded-xl
                  text-white
                   hover:bg-gray-800 transition
                `}
                >
                  {item.icon}
                </div>
              </NavLink>
            ) : (
              <div
                key={item.name}
                onClick={() => {
                  item.action?.();
                }}
                className="flex flex-col items-center cursor-pointer"
              >
                <div
                  className={`
                  w-12 h-12 flex items-center justify-center rounded-xl
                  text-white
                   hover:bg-gray-800 transition
                `}
                >
                  {item.icon}
                </div>
              </div>
            )
          )}
        </div>
      </Drawer>

      {/* SEARCH DRAWER */}
      <Drawer
        title="Search"
        open={isSlideOpen}
        placement={isMobile ? "top" : "left"}
        height={isMobile ? "40vh" : undefined}
        width={isMobile ? "100%" : 350}
        onClose={() => {
          setIsSlideOpen(false);
          setQuery("");
        }}
      >
        <Input.Search
          prefix={<SearchOutlined />}
          placeholder="Search users..."
          size="large"
          allowClear
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mb-4"
        />

        {/* Search results */}
        {query.trim() !== "" && (
          <div className="space-y-3">
            {searchUser(debouncedQuery).length === 0 ? (
              <p className="text-gray-500 text-center">No users found.</p>
            ) : (
              searchUser(debouncedQuery).map((user: any) => (
                <div
  key={user.userId}
  className="flex items-center justify-between p-3 bg-black rounded-lg hover:bg-gray-800 cursor-pointer"
>
  {/* LEFT SIDE — IMAGE + TEXT */}
  <div
    className="flex items-center gap-3"
    onClick={() => {
      setIsSlideOpen(false);
      setQuery("");

      navigate(`/UserProfile`, {
        state: {
          from: "search",
          userId: user.userId,
          username: user.username,
        },
      });
    }}
  >
    <img
      src={user.profilePic ? user.profilePic : Default_User}
      alt={user.fullName}
      className="w-12 h-12 rounded-full object-cover border border-gray-600"
    />

    <div className="text-white">
      <p className="font-semibold text-base">{user.username}</p>
      <p className="text-gray-400 text-sm">{user.fullName}</p>
    </div>
  </div>

  {/* RIGHT SIDE — BUTTON */}
  {currentLoggedInUserData && user.userId !== currentLoggedInUserData?.user._id && (
    <Button
      type={
        checkIsFollowing(currentLoggedInUserData?.user._id, user.userId)
          ? "default"
          : "primary"
      }
      className={`${
        checkIsFollowing(currentLoggedInUserData?.user._id, user.userId)
          ? "bg-gray-800 text-white border-gray-700"
          : "bg-blue-600 hover:bg-blue-700 border-none"
      }`}
      onClick={() => {
        if (checkIsFollowing(currentLoggedInUserData?.user._id, user.userId)) {
          unfollowUser(currentLoggedInUserData?.user._id, user.userId);
        } else {
          followUser(currentLoggedInUserData?.user._id, user.userId);
        }
        setRefreshFollow((prev) => !prev);
      }}
    >
      {checkIsFollowing(currentLoggedInUserData?.user._id, user.userId)
        ? "Unfollow"
        : "Follow"}
    </Button>
  )}
</div>

              ))
            )}
          </div>
        )}
      </Drawer>

      <PostModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </>
  );
}
