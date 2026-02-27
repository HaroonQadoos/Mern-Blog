import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";

const DeletePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [post, setPost] = useState(null);
  const [fetching, setFetching] = useState(true);

  // Fetch post details
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        setError("Failed to load post details");
      } finally {
        setFetching(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError("");
      await api.delete(`/posts/${id}`);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete this post");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 dark:text-gray-300">
        Loading post details...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-red-600">Delete Post</h1>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            This action cannot be undone.
          </p>
        </div>

        {/* Post Details */}
        {post && (
          <div className="mb-6 p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 transition-colors">
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
              {post.title}
            </h2>
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover rounded mb-2"
              />
            )}
            <p className="text-gray-700 dark:text-gray-300">
              {post.description}
            </p>
          </div>
        )}

        {/* Warning Box */}
        <div className="p-4 mb-6 rounded-lg bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700">
          <p className="text-sm text-red-800 dark:text-red-200">
            Are you sure you want to permanently delete this post? Once deleted,
            it cannot be recovered.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 mb-4 text-center">
            {error}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            disabled={loading}
            onClick={() => navigate(-1)}
            className=" cursor-pointer px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleDelete}
            className="cursor-pointer px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePost;
