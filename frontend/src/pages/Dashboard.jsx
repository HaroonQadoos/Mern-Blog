import React, { useEffect, useState } from "react";
import { BookPlus, LogOut, UserRoundPen, UsersRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userRes = await api.get("/auth/me");
        const user = userRes?.data;
        if (!user) {
          navigate("/login");
          return;
        }
        setCurrentUser(user);
        const isAdmin = user.role === "admin";

        const postsRes = isAdmin
          ? await api.get("/posts/admin/all")
          : await api.get("/posts");

        const filteredPosts = isAdmin
          ? postsRes.data
          : postsRes.data.filter(
              (post) => (post.author?._id || post.author) === user._id
            );

        const sortedPosts = filteredPosts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPosts(isAdmin ? sortedPosts : sortedPosts.slice(0, 5));

        const usersRes = isAdmin ? await api.get("/auth") : null;

        const allStats = [
          {
            label: "Total Users",
            value: usersRes?.data?.length || 0,
            icon: <UsersRound className="w-6 h-6 text-white" />,
            color: "bg-blue-500",
            adminOnly: true,
          },
          {
            label: "Total Posts",
            value: filteredPosts.length,
            icon: <BookPlus className="w-6 h-6 text-white" />,
            color: "bg-purple-500",
          },
          {
            label: "Active Blogs",
            value: filteredPosts.filter((p) => p.status === "published").length,
            icon: <UserRoundPen className="w-6 h-6 text-white" />,
            color: "bg-green-500",
          },
        ];

        setStats(isAdmin ? allStats : allStats.filter((s) => !s.adminOnly));
      } catch (err) {
        if (err.response?.status === 403) {
          alert("Your account is not approved yet.");
          navigate("/login");
        }
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

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
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg font-semibold">
        Loading dashboard...
      </div>
    );
  }

  const isAdmin = currentUser?.role === "admin";

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-6 hidden md:flex flex-col border-r border-gray-200">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">
          Das<span className="text-purple-700">hb</span>oard
        </h2>

        <nav className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg hover:bg-purple-50 hover:text-purple-600 transition"
          >
            <BookPlus className="w-5 h-5" />
            Posts
          </button>

          {isAdmin && (
            <button
              onClick={() => navigate("/users")}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg hover:bg-purple-50 hover:text-purple-600 transition"
            >
              <UsersRound className="w-5 h-5" />
              Users
            </button>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg hover:bg-red-50 hover:text-red-600 transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Welcome back,{" "}
          <span className="text-purple-700">{currentUser?.username}</span> 👋
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-full ${stat.color}`}
                >
                  {stat.icon}
                </div>
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Posts Table */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Recent Posts</h3>
          <div className="max-h-[500px] overflow-y-auto">
            <table className="w-full table-auto border-collapse text-gray-700">
              <thead className="sticky top-0 bg-gray-100 z-10">
                <tr className="bg-gray-100 text-left">
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
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3">
                      {post.title}
                      {(isAdmin || currentUser?._id === post.author?._id) && (
                        <>
                          <Link
                            to={`/edit-post/${post._id}`}
                            className="ml-3 text-purple-700 underline italic hover:text-purple-500"
                          >
                            Edit
                          </Link>
                          <Link
                            to={`/delete-post/${post._id}`}
                            className="ml-3 text-red-600 underline italic hover:text-red-400"
                          >
                            Delete
                          </Link>
                        </>
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
      </main>
    </div>
  );
};

export default Dashboard;
