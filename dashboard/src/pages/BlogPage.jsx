import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import ReactPaginate from "react-paginate";

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const postsPerPage = 12;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get("/posts");
        setBlogs(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Pagination
  const offset = currentPage * postsPerPage;
  const currentBlogs = blogs.slice(offset, offset + postsPerPage);
  const pageCount = Math.ceil(blogs.length / postsPerPage);

  const handlePageClick = (selected) => {
    setCurrentPage(selected.selected);
  };

  // Date formatter
  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: "var(--bg-color)",
          color: "var(--text-color)",
        }}
      >
        <span
          className="loading loading-spinner loading-lg"
          style={{
            backgroundColor: "var(--bg-color)",
            color: "var(--text-color)",
          }}
        ></span>
      </div>
    );
  }

  return (
    <div
      style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
    >
      <div className="max-w-[1200px] mx-auto px-4 py-16 space-y-12">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1
            className="text-4xl font-extrabold"
            style={{
              backgroundColor: "var(--bg-color)",
              color: "var(--text-color)",
            }}
          >
            Latest Blogs
          </h1>
          <p
            className="max-w-2xl mx-auto"
            style={{
              backgroundColor: "var(--bg-color)",
              color: "var(--text-color)",
            }}
          >
            Explore insights, tutorials, and experiences from the world of
            modern web development.
          </p>
        </div>

        {/* Blogs Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {currentBlogs.map((blog) => (
            <div
              key={blog._id}
              className="rounded-xl shadow hover:shadow-lg transition overflow-hidden"
              style={{ backgroundColor: "var(--card-bg)" }}
            >
              <img
                src={
                  blog.image?.startsWith("http")
                    ? blog.image
                    : blog.image
                    ? `http://localhost:4000${blog.image}`
                    : "/placeholder.jpg"
                }
                alt={blog.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-6 space-y-4">
                <h2
                  className="text-xl font-bold"
                  style={{ color: "var(--text-color)" }}
                >
                  {blog.title}
                </h2>

                <p className="text-sm" style={{ color: "var(--text-color)" }}>
                  {blog.body.substring(0, 120)}...
                </p>

                <div
                  className="text-xs flex justify-between"
                  style={{ color: "var(--text-color)" }}
                >
                  <span>✍️ {blog.author?.username || "unknown"}</span>
                  <span>{formatDate(blog.createdAt)}</span>
                </div>

                <Link
                  to={`/post/${blog._id}`}
                  className="inline-block font-semibold hover:underline"
                  style={{ color: "var(--text-color)" }}
                >
                  Read More →
                </Link>
              </div>
            </div>
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
      </div>
    </div>
  );
};

export default BlogsPage;
