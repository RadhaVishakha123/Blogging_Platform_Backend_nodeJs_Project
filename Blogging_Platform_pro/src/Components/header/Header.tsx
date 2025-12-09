import { NavLink } from "react-router-dom";
import {
  HomeOutlined,
  SearchOutlined,
  PlusCircleOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { Drawer, Input, Button } from "antd";
import { LoginOutlined } from "@ant-design/icons";
import PostModal from "../post/modal/PostModal";
import { useNavigate } from "react-router-dom";
import Default_User from "../../assets/Default_User.jpg";
import { useEffect, useMemo } from "react";
import type { UserProfile, User } from "../../Helper/Type";
import SearchUserRow from "../search/SearchUserRow";
import {
  unfollowUser,
  followUser,
  checkIsFollowing,
} from "../../Helper/utility";
import useUser from "../../hooks/useUser";
import { useDebounce } from "use-debounce";

import { useState } from "react";

export default function Header() {
  const { setCurrentLoggedInUserData } = useUser();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSlideOpen, setIsSlideOpen] = useState<boolean>(false);
  const { currentLoggedInUserData } = useUser();
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery] = useDebounce(query, 500);
  const navigate = useNavigate();
  const isMobile = window.innerWidth < 768;
  const [isHumburgerMenuOpen, setHumburgerMenuOpen] = useState<boolean>(false);
  const [results, setResults] = useState<any[]>([]);
  const [refreshFollow, setRefreshFollow] = useState<boolean>(false);
  //for follow. unfollow
  const [isFollowingState, setIsFollowingState] = useState(false);
  const [loading, setLoading] = useState(false);

  const accessToken = currentLoggedInUserData?.accessToken ?? "";
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
    const res = await fetch("http://localhost:8000/api/auth/logout", {
      method: "DELETE",
      credentials: "include",
    });
    document.cookie = "refreshToken=; Path=/; Max-Age=0";
  }

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    async function fetchSearch() {
      const res = await searchUser(debouncedQuery); // this returns API data
      setResults(res); // set the array into state
    }

    fetchSearch();
  }, [debouncedQuery]);
  async function searchUser(searchText: string) {
    if (!searchText.trim()) return [];

    const lowerQuery = searchText.toLowerCase();
    const mergedUsers = await fetch(
      `http://localhost:8000/api/search?query=${lowerQuery}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${currentLoggedInUserData?.accessToken}`,
        },
      }
    );
    const result = await mergedUsers.json();
    return result.filtered;
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
          <NavLink
            to="/"
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}
          >
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
            {results.length === 0 ? (
              <p className="text-gray-500 text-center">No users found.</p>
            ) : (
              results.map((user: any) => (
                <SearchUserRow
                key={user.userId}
    user={user}
    currentUserId={currentLoggedInUserData?.user.id}
    accessToken={accessToken}
    onClose={() => {
      setIsSlideOpen(false);
      setQuery("");
    }}></SearchUserRow>
              ))
            )}
          </div>
        )}
      </Drawer>

      <PostModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </>
  );
}
