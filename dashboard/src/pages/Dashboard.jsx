import React, { useEffect, useState } from "react";
import {
  BookOpen,
  BookPlus,
  Eraser,
  House,
  LogOut,
  Pencil,
  SquarePen,
  Trash2,
  UserRoundPen,
  UsersRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import BlogStatsGraph from "../components/BlogStatsGraph";
import PostPieGraph from "../components/PostPieGrapgh";
import UserLineGraph from "../components/UserLineGraph";
import { useAppContext } from "../context/AppContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser, pendingUsersCount, loading } = useAppContext();
  const [stats, setStats] = useState([]);
  const [posts, setPosts] = useState([]);
  const [userGraphData, setUserGraphData] = useState([]);
  useEffect(() => {
    if (!currentUser) return;

    const fetchDashboardData = async () => {
      const isAdmin = currentUser.role === "admin";

      const postsRes = isAdmin
        ? await api.get("/posts/admin/all")
        : await api.get("/posts");

      const filteredPosts = isAdmin
        ? postsRes.data
        : postsRes.data.filter(
            (post) =>
              (post.author?._id || post.author) === String(currentUser._id)
          );

      setPosts(filteredPosts.slice(0, isAdmin ? filteredPosts.length : 5));

      if (isAdmin) {
        const usersRes = await api.get("/auth");

        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        const graph = months.map((month, i) => ({
          month,
          users: usersRes.data.filter((u) => {
            if (!u.createdAt) return false;
            return new Date(u.createdAt).getMonth() === i;
          }).length,
        }));

        setUserGraphData(graph);
      }
    };

    fetchDashboardData();
  }, [currentUser]);

  const togglePublish = async (id) => {
    try {
      await api.put(`/posts/${id}/publish`);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === id
            ? {
                ...p,
                status: p.status === "published" ? "draft" : "published",
              }
            : p
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-lg font-semibold "
        style={{
          backgroundColor: "var(--bg-color)",
          color: "var(--text-color)",
        }}
      >
        Loading dashboard...
      </div>
    );
  }

  const isAdmin = currentUser?.role === "admin";
  const blogGraphData = [
    { name: "Total Blogs", count: posts.length },
    {
      name: "Active Blogs",
      count: posts.filter((p) => p.status === "published").length,
    },
  ];

  return (
    // <div
    //   className="min-h-screen flex "
    //   style={{
    //     backgroundColor: "var(--bg-color)",
    //     color: "var(--text-color)",
    //   }}
    // >
    //   {/* Sidebar */}
    //   <aside
    //     className="mt-10 w-64 p-6 hidden md:flex flex-col rounded-2xl  "
    //     style={{
    //       backgroundColor: "var(--navy)",
    //       color: "var(--bg-navy)",
    //     }}
    //   >
    //     <nav className="flex md:flex-col justify-around md:justify-start gap-2 md:gap-3">
    //       <button
    //         onClick={() => navigate("/")}
    //         className="flex  items-center gap-2 md:gap-3 px-4 py-2 md:py-3 cursor-pointer rounded-lg hover:bg-[#f1f5f9] hover:text-[#1c2541] transition"
    //       >
    //         <House className="w-5 h-5" />
    //         <span className="hidden md:inline">Home</span>
    //       </button>

    //       {isAdmin && (
    //         <button
    //           onClick={() => navigate("/users")}
    //           className="flex  items-center gap-2 md:gap-3 px-4 py-2 md:py-3 cursor-pointer rounded-lg hover:bg-[#f1f5f9] hover:text-[#1c2541] transition"
    //         >
    //           <UsersRound className="w-5 h-5" />
    //           <span className="hidden md:inline">Users</span>
    //           {pendingUsersCount > 0 && (
    //             <span className=" top-0 right-0 -mt-1 -mr-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
    //               {pendingUsersCount}
    //             </span>
    //           )}
    //         </button>
    //       )}

    //       <button
    //         onClick={handleLogout}
    //         className="flex items-center gap-2 md:gap-3 px-4 py-2 md:py-3 cursor-pointer rounded-lg hover:bg-[#f1f5f9] hover:text-[#1c2541] transition"
    //       >
    //         <LogOut className="w-5 h-5" />
    //         Logout
    //       </button>
    //     </nav>
    //   </aside>

    //   {/* Main */}
    //   <main
    //     className="flex-1 p-4 sm:p-6 md:p-8"
    //     style={{
    //       backgroundColor: "var(--bg-color)",
    //       color: "var(--text-color)",
    //     }}
    //   >
    //     {" "}
    //     <h2
    //       className="text-3xl font-bold mb-8  "
    //       style={{
    //         backgroundColor: "var(--bg-color)",
    //         color: "var(--text-color)",
    //       }}
    //     >
    //       Dashboard
    //     </h2>
    //     <h1
    //       className="text-3xl font-bold mb-6 "
    //       style={{
    //         backgroundColor: "var(--bg-color)",
    //         color: "var(--text-color)",
    //       }}
    //     >
    //       Welcome back,{" "}
    //       <span className="text-purple-700">{currentUser?.username}</span> 👋
    //     </h1>
    //     {/* Stats Cards */}
    //     <div
    //       className={`w-full grid grid-cols-1 sm:grid-cols-2 ${
    //         isAdmin ? "lg:grid-cols-3" : "lg:grid-cols-2"
    //       } gap-6 mb-8`}
    //       style={{
    //         backgroundColor: "var(--bg-color)",
    //         color: "var(--text-color)",
    //       }}
    //     >
    //       {isAdmin && (
    //         <div
    //           className="bg-white p-4 sm:p-6 rounded-xl shadow hover:scale-105 transition-transform duration-200"
    //           style={{
    //             backgroundColor: "var(--bg-navy)",
    //             color: "var(--text-color)",
    //           }}
    //         >
    //           <h3 className="text-xl font-bold mb-4">Users Overview</h3>
    //           {userGraphData.length > 0 && (
    //             <UserLineGraph data={userGraphData} />
    //           )}
    //         </div>
    //       )}

    //       <div
    //         className="bg-white p-4 sm:p-6 rounded-xl shadow hover:scale-105 transition-transform duration-200"
    //         style={{
    //           backgroundColor: "var(--bg-navy)",
    //           color: "var(--text-color)",
    //         }}
    //       >
    //         <h3 className="text-xl font-bold mb-4">Posts Analysis </h3>
    //         <PostPieGraph
    //           published={posts.filter((p) => p.status === "published").length}
    //           draft={posts.filter((p) => p.status !== "published").length}
    //         />
    //       </div>
    //       <div
    //         className="bg-white p-4 sm:p-6 rounded-xl shadow hover:scale-105 transition-transform duration-200"
    //         style={{
    //           backgroundColor: "var(--bg-navy)",
    //           color: "var(--text-color)",
    //         }}
    //       >
    //         <h3 className="text-xl font-bold mb-4">Blog Overview</h3>

    //         <BlogStatsGraph data={blogGraphData} />
    //       </div>
    //     </div>
    //     {/* Posts Table */}
    //     <div
    //       className=" p-6 rounded-xl shadow-sm"
    //       style={{
    //         backgroundColor: "var(--bg-navy)",
    //         color: "var(--text-color)",
    //       }}
    //     >
    //       <h3 className="text-xl font-bold mb-4 text-gray-800">Recent Posts</h3>
    //       <div
    //         className="max-h-[570px] overflow-y-auto rounded-xl"
    //         style={{
    //           backgroundColor: "var(--bg-color)",
    //           color: "var(--text-color)",
    //         }}
    //       >
    //         <div className="overflow-x-auto rounded-xl">
    //           {" "}
    //           <table className="w-full max-w-[600px] table-auto border-collapse text-gray-700 ">
    //             <thead className="sticky top-0 bg-gray-100 z-10">
    //               <tr
    //                 className=" text-left "
    //                 style={{
    //                   backgroundColor: "var(--bg-color)",
    //                   color: "var(--text-color)",
    //                 }}
    //               >
    //                 <th className="p-3">Title</th>
    //                 <th className="p-3">Author</th>
    //                 <th className="p-3">Date</th>
    //                 <th className="p-3">Status</th>
    //               </tr>
    //             </thead>
    //             <tbody>
    //               {posts.map((post) => (
    //                 <tr
    //                   key={post._id}
    //                   className="border-b hover:bg-[#f1f5f9] transition"
    //                 >
    //                   <td className="p-3">
    //                     {post.title}
    //                     {(isAdmin || currentUser?._id === post.author?._id) && (
    //                       <div className="flex justify-end text-xs">
    //                         <Link
    //                           to={`/edit-post/${post._id}`}
    //                           className="ml-3 text-gray-600 underline italic hover:text-gray-950 text-xs"
    //                         >
    //                           <Pencil size={15} strokeWidth={1.5} />
    //                         </Link>
    //                         <Link
    //                           to={`/delete-post/${post._id}`}
    //                           className="ml-3  text-gray-600 underline italic hover:text-gray-950"
    //                         >
    //                           <Eraser size={15} strokeWidth={1.5} />
    //                         </Link>
    //                       </div>
    //                     )}
    //                   </td>
    //                   <td className="p-3">{post.author?.username}</td>
    //                   <td className="p-3">
    //                     {new Date(post.createdAt).toLocaleDateString()}
    //                   </td>
    //                   <td className="p-3">
    //                     <span
    //                       className={`px-2 py-1 rounded-full text-white text-sm ${
    //                         post.status === "published"
    //                           ? "bg-green-500"
    //                           : "bg-gray-400"
    //                       }`}
    //                     >
    //                       {post.status}
    //                     </span>
    //                     {isAdmin && (
    //                       <button
    //                         onClick={() => togglePublish(post._id)}
    //                         className={`ml-2 text-sm underline italic cursor-pointer ${
    //                           post.status === "published"
    //                             ? "text-red-600 hover:text-red-400"
    //                             : "text-green-600 hover:text-green-400"
    //                         }`}
    //                       >
    //                         {post.status === "published"
    //                           ? "Unpublish"
    //                           : "Publish"}
    //                       </button>
    //                     )}
    //                   </td>
    //                 </tr>
    //               ))}
    //             </tbody>
    //           </table>
    //         </div>
    //       </div>
    //     </div>
    //   </main>
    // </div>
    <div
      className="min-h-screen flex flex-col md:flex-row" // Stack on mobile, row on desktop
      style={{
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
      }}
    >
      {/* Sidebar / Top Nav */}
      <aside
        className="mt-10 w-64 p-6 hidden md:flex flex-col rounded-2xl"
        style={{
          backgroundColor: "var(--navy)",
          color: "var(--bg-navy)",
        }}
      >
        <nav className="flex md:flex-col justify-around md:justify-start gap-2 md:gap-3 w-full">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 md:gap-3 px-4 py-2 md:py-3 cursor-pointer rounded-lg hover:bg-[#f1f5f9] hover:text-[#1c2541] transition w-full md:w-auto"
          >
            <House className="w-5 h-5" />
            <span className="hidden md:inline">Home</span>
          </button>
          {isAdmin && (
            <button
              onClick={() => navigate("/users")}
              className="flex items-center gap-2 md:gap-3 px-4 py-2 md:py-3 cursor-pointer rounded-lg hover:bg-[#f1f5f9] hover:text-[#1c2541] transition w-full md:w-auto"
            >
              <UsersRound className="w-5 h-5" />
              <span className="hidden md:inline">Users</span>
              {pendingUsersCount > 0 && (
                <span className=" top-0 right-0 -mt-1 -mr-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  {pendingUsersCount}
                </span>
              )}
            </button>
          )}{" "}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 md:gap-3 px-4 py-2 md:py-3 cursor-pointer rounded-lg hover:bg-[#f1f5f9] hover:text-[#1c2541] transition w-full md:w-auto"
          >
            <BookOpen className="w-5 h-5" />
            <span className="hidden md:inline">About</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 md:gap-3 px-4 py-2 md:py-3 cursor-pointer rounded-lg hover:bg-[#f1f5f9] hover:text-[#1c2541] transition w-full md:w-auto"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className="flex-1 p-4 sm:p-6 md:p-8"
        style={{
          backgroundColor: "var(--bg-color)",
          color: "var(--text-color)",
        }}
      >
        <h2 className="text-3xl font-bold mb-8">Dashboard</h2>
        <h1 className="text-3xl font-bold mb-6">
          Welcome back,{" "}
          <span className="text-purple-700">{currentUser?.username}</span> 👋
        </h1>

        {/* Stats Cards */}
        <div
          className={`w-full grid grid-cols-1 sm:grid-cols-2 ${
            isAdmin ? "lg:grid-cols-3" : "lg:grid-cols-2"
          } gap-4 sm:gap-6 mb-8`}
        >
          {isAdmin && (
            <div
              className="p-4 sm:p-6 rounded-xl shadow hover:scale-105 transition-transform duration-200"
              style={{
                backgroundColor: "var(--bg-navy)",
                color: "var(--text-color)",
              }}
            >
              <h3 className="text-xl font-bold mb-4">Users Overview</h3>
              {userGraphData.length > 0 && (
                <UserLineGraph data={userGraphData} />
              )}
            </div>
          )}

          <div
            className=" p-4 sm:p-6 rounded-xl shadow hover:scale-105 transition-transform duration-200"
            style={{
              backgroundColor: "var(--bg-navy)",
              color: "var(--text-color)",
            }}
          >
            <h3 className="text-xl font-bold mb-4">Posts Analysis </h3>
            <PostPieGraph
              published={posts.filter((p) => p.status === "published").length}
              draft={posts.filter((p) => p.status !== "published").length}
            />
          </div>
          <div
            className=" p-4 sm:p-6 rounded-xl shadow hover:scale-105 transition-transform duration-200"
            style={{
              backgroundColor: "var(--bg-navy)",
              color: "var(--text-color)",
            }}
          >
            <h3 className="text-xl font-bold mb-4">Blog Overview</h3>
            <BlogStatsGraph data={blogGraphData} />
          </div>
        </div>

        {/* Posts Table */}
        <div
          className="p-6 rounded-xl shadow-sm"
          style={{
            backgroundColor: "var(--bg-navy)",
            color: "var(--text-color)",
          }}
        >
          <h3 className="text-xl font-bold mb-4 text-gray-800">Recent Posts</h3>
          <div className="max-h-[570px] overflow-y-auto rounded-xl">
            <div className="overflow-x-auto rounded-2xl">
              <table
                className="w-full min-w-[600px] table-auto border-collapse text-gray-700"
                style={{
                  backgroundColor: "var(--bg-color)",
                  color: "var(--text-color)",
                }}
              >
                <thead className="sticky top-0 bg-gray-100 z-10">
                  <tr className="text-left">
                    <th className="p-3">Title</th>
                    <th className="p-3">Author</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr
                      key={post._id}
                      className="border-b hover:bg-[#f1f5f9] transition"
                    >
                      <td className="p-3">
                        {post.title}
                        {(isAdmin || currentUser?._id === post.author?._id) && (
                          <div className="flex justify-end text-xs">
                            <Link
                              to={`/edit-post/${post._id}`}
                              className="ml-3 text-gray-600 underline italic hover:text-gray-950 text-xs"
                            >
                              <Pencil size={15} strokeWidth={1.5} />
                            </Link>
                            <Link
                              to={`/delete-post/${post._id}`}
                              className="ml-3 text-gray-600 underline italic hover:text-gray-950"
                            >
                              <Eraser size={15} strokeWidth={1.5} />
                            </Link>
                          </div>
                        )}
                      </td>
                      <td className="p-3">{post.author?.username}</td>
                      <td className="p-3">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-white text-sm ${
                            post.status === "published"
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }`}
                        >
                          {post.status}
                        </span>
                        {isAdmin && (
                          <button
                            onClick={() => togglePublish(post._id)}
                            className={`ml-2 text-sm underline italic cursor-pointer ${
                              post.status === "published"
                                ? "text-red-600 hover:text-red-400"
                                : "text-green-600 hover:text-green-400"
                            }`}
                          >
                            {post.status === "published"
                              ? "Unpublish"
                              : "Publish"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
