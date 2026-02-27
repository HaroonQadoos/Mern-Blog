import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import { Eraser, Pencil } from "lucide-react";

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currUser, setCurrUser] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Fetch post
        const res = await api.get(`/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error("Error fetching post:", err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me"); // optional, will fail if not logged in
        setCurrUser(res.data);
      } catch {
        setCurrUser(null); // guest user
      }
    };

    fetchPost();
    fetchUser();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!post) return <div className="text-center py-20">Post not found</div>;

  // Check if current user can edit/delete
  const canEditOrDelete =
    currUser &&
    (currUser.role === "admin" || currUser._id === post.author?._id);

  return (
    <div
      className=""
      style={{
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
      }}
    >
      <div className="max-w-[900px] mx-auto px-4 py-16 space-y-10">
        {/* Title */}
        <h1 className="text-4xl font-bold">{post.title}</h1>

        {/* Image */}
        {post.image && (
          <img
            src={
              post.image.startsWith("http")
                ? post.image
                : `http://localhost:4000${post.image}`
            }
            alt={post.title}
            className="w-full h-[420px] object-cover"
          />
        )}

        {/* Edit/Delete buttons - only visible for admin or post author */}
        {canEditOrDelete && (
          <div className="flex gap-4 mt-4">
            <Link
              className="underline text-gray-600 hover:text-black"
              to={`/edit-post/${post._id}`}
            >
              <Pencil />
            </Link>
            <Link
              className="underline text-gray-600 hover:text-purple-400"
              to={`/delete-post/${post._id}`}
            >
              <Eraser />
            </Link>
          </div>
        )}

        {/* Content */}
        <p className="text-[#a1a1aa] prose lg:prose-lg leading-relaxed md:text-lg ">
          <div
            className=""
            dangerouslySetInnerHTML={{ __html: post.htmlBody }}
          />
        </p>
      </div>
    </div>
  );
};

export default PostPage;
