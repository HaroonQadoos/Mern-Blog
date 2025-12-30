import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import ReactPaginate from "react-paginate";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const postsPerPage = 10;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let user = null;

        // Try to get user (optional)
        try {
          const userRes = await api.get("/auth/me");
          user = userRes.data;
        } catch (err) {
          // user not logged in → ignore
          user = null;
        }

        let postsRes;

        if (user?.role === "admin") {
          // Admin → get all posts
          postsRes = await api.get("/posts/admin/all");
          setPosts(postsRes.data || []);
        } else {
          // Public / normal user → only published posts
          postsRes = await api.get("/posts");
          const publishedPosts = postsRes.data.filter(
            (post) => post.status === "published"
          );
          setPosts(publishedPosts);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Pagination logic
  const offset = currentPage * postsPerPage;
  const currentPosts = posts.slice(offset, offset + postsPerPage);
  const pageCount = Math.ceil(posts.length / postsPerPage);

  const handlePageClick = (selected) => {
    setCurrentPage(selected.selected);
  };
  //for removing repeating featuring Img
  // const featuredPost = posts[0];
  // const latestPosts = currentPosts.filter(
  //   (post) => post._id !== featuredPost?._id
  // );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-xl">Loading posts...</span>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-[1100px] mx-auto px-4 py-16 space-y-12">
        {/* Featured Post */}
        {posts[0] && (
          <section className="space-y-6">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-gray-900">
              {posts[0].title}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl">
              {posts[0].excerpt}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>✍️ {posts[0].author?.username || "Unknown"}</span>
              <span>•</span>
              <span>
                📅 {new Date(posts[0].createdAt).toLocaleDateString()}
              </span>
              <span>•</span>
              <span>⏱ {posts[0].readTime || "N/A"}</span>
            </div>
          </section>
        )}

        {/* Featured Image */}
        {posts[0] && (
          <section className="relative w-full h-[420px] overflow-hidden rounded-xl">
            <img
              src={
                posts[0].image ||
                "../../medium-shot-contemplative-man-seaside.jpg"
              }
              alt="Featured blog"
              className="w-full h-full object-cover"
            />
          </section>
        )}

        {/* Latest Blogs */}
        <section className="space-y-10">
          <h2 className="text-3xl font-bold text-gray-900">Latest Blogs</h2>
          <div className="grid sm:grid-cols-2 gap-8">
            {currentPosts.map((post) => (
              <Link
                key={post._id}
                to={`/post/${post._id}`}
                className="group block"
              >
                <div className="rounded-xl overflow-hidden bg-gray-50">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="mt-4 space-y-2">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-700">
                    {post.title}
                  </h3>
                  <p className="text-gray-600">{post.excerpt}</p>
                  <div className="text-sm text-gray-500">
                    {post.author?.username || "Unknown"} •{" "}
                    {post.readTime || "N/A"}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pageCount > 1 && (
            <div className="flex justify-center mt-8">
              <ReactPaginate
                previousLabel={"Prev"}
                nextLabel={"Next"}
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={1}
                onPageChange={handlePageClick}
                containerClassName={"flex gap-2"}
                pageClassName={
                  "px-3 py-1 border-none rounded hover:bg-black/50 hover:text-white cursor-pointer"
                }
                previousClassName={
                  "px-3 py-1 rounded hover:bg-gray-200 cursor-pointer"
                }
                nextClassName={
                  "px-3 py-1 rounded hover:bg-gray-200 cursor-pointer"
                }
                activeClassName={"bg-black text-white"}
                disabledClassName={"opacity-50 cursor-not-allowed"}
              />
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="bg-gray-100 rounded-xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              Read more insightful articles
            </h3>
            <p className="text-gray-600 mt-1">
              Discover tutorials, comparisons, and MERN-based blogging tips.
            </p>
          </div>
          <Link to="/posts" className="btn btn-neutral rounded-full px-8">
            Explore Blogs
          </Link>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
