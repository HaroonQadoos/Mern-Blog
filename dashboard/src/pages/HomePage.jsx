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
  const getExcerpt = (text, words = 25) => {
    if (!text) return "";
    return text.split(" ").slice(0, words).join(" ") + "...";
  };

  //formatDate
  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  // Pagination logic
  const offset = currentPage * postsPerPage;
  const currentPosts = posts.slice(offset, offset + postsPerPage);
  const pageCount = Math.ceil(posts.length / postsPerPage);

  const handlePageClick = (selected) => {
    setCurrentPage(selected.selected);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-xl">Loading posts...</span>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen "
      style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
    >
      <div className="max-w-[1100px] mx-auto px-4 py-16 space-y-12">
        {/* Posts Grid */}
        <section className="space-y-10">
          <div className="grid sm:grid-cols-2 gap-8">
            {currentPosts.map((post) => (
              <Link
                key={post._id}
                to={`/post/${post._id}`}
                className="group block"
              >
                <div
                  className="overflow-hidden aspect-[16/9] relative "
                  style={{ backgroundColor: "var(--card-bg)" }}
                >
                  <img
                    src={
                      post.image?.startsWith("http")
                        ? post.image
                        : post.image
                        ? `http://localhost:4000${post.image}`
                        : "/placeholder.png"
                    }
                    alt={post.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="mt-4 space-y-2">
                  <h3 className="text-xl font-bold ">{post.title}</h3>{" "}
                  <div className="italic text-[#a1a1aa] text-xl ">
                    {formatDate(post.createdAt)}
                  </div>
                  <p className="text-[#a1a1aa] prose lg:prose-lg leading-relaxed md:text-lg line-clamp-4 text-muted-foreground">
                    {post.excerpt || getExcerpt(post.body)}
                  </p>
                  <div>By {post.author?.username || "Unknown"}</div>
                </div>{" "}
                <div className="italic text-[#a1a1aa] text-xl "></div>
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
                pageClassName="px-3 py-1 border-none rounded cursor-pointer"
                activeClassName="font-bold"
                disabledClassName="opacity-50 cursor-not-allowed"
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
