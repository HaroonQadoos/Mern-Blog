import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import { Pencil, Eraser } from "lucide-react";

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currUser, setCurrUser] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
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
        const res = await api.get("/auth/me");
        setCurrUser(res.data);
      } catch {
        setCurrUser(null);
      }
    };

    fetchPost();
    fetchUser();
  }, [id]);

  if (loading)
    return (
      <div
        className="text-center py-20 min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: "var(--bg-color)",
          color: "var(--text-color)",
        }}
      >
        Loading...
      </div>
    );

  if (!post)
    return (
      <div
        className="text-center py-20 min-h-screen flex items-center justify-center"
        style={{
          backgroundColor: "var(--bg-color)",
          color: "var(--text-color)",
        }}
      >
        Post not found
      </div>
    );

  const canEditOrDelete =
    currUser &&
    (currUser.role === "admin" || currUser._id === post.author?._id);

  return (
    <div
      style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
    >
      <div className="max-w-[900px] mx-auto px-4 py-16 space-y-10">
        {/* Title */}
        <h1 className="text-4xl font-bold">{post.title}</h1>

        {/* Image */}
        {post.image && (
          <img
            src={
              post.image?.startsWith("http")
                ? post.image
                : `http://localhost:4000${post.image}`
            }
            alt={post.title}
            className="w-full h-[420px] object-cover "
            style={{ backgroundColor: "var(--card-bg)" }}
          />
        )}

        {/* Edit/Delete buttons */}
        {canEditOrDelete && (
          <div className="flex gap-4 mt-4">
            <Link
              className="underline  text-gray-600 italic hover:text-gray-950"
              to={`/edit-post/${post._id}`}
            >
              <Pencil size={15} strokeWidth={1.5} />
            </Link>
            <Link
              className="underline  text-gray-600 italic hover:text-gray-950"
              to={`/delete-post/${post._id}`}
            >
              <Eraser size={15} strokeWidth={1.5} />
            </Link>
          </div>
        )}

        {/* Content */}
        <div
          className="post-body prose max-w-none"
          style={{ color: "var(--text-color)" }}
          dangerouslySetInnerHTML={{
            __html: post.htmlBody,
          }}
        />
      </div>
    </div>
  );
};

export default PostPage;
