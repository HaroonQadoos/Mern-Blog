import React, { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { toast } from "react-toastify";
const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const quillRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hover, setHover] = useState(false);
  const quillInitialized = useRef(false);

  // Initialize Quill editor
  useEffect(() => {
    if (quillInitialized.current) return;
    if (!quillRef.current) return;
    const quill = new Quill(quillRef.current, {
      theme: "snow",
      placeholder: "Write your blog here...",
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
        ],
      },
    });

    quill.on("text-change", () => {
      setFormData((prev) => ({ ...prev, body: quill.root.innerHTML }));
    });
    quillInitialized.current = true;
  }, []);
  // Temporary static data (replace with API later)
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    body: "",
    tags: "",
  });

  useEffect(() => {
    // Simulate fetching post by ID
    const fetchPost = async () => {
      try {
        console.log("ID FROM useParams:", id);

        const { data } = await api.get(`/posts/${id}`);
        setFormData({
          title: data.title || "",
          image: data.image || "",
          body: data.body || "",
          tags: data.tags?.join(",") || "",
        });
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to Load this post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await api.put(
        `/posts/${id}`,
        {
          title: formData.title,
          body: formData.body,
          image: formData.image,
          tags: formData.tags.split(",").map((tag) => tag.trim()),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/");
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to Edit this Post");
    } finally {
      setLoading(false);
    }

    // TODO: API call (PUT /posts/:id)
    console.log("Updated Post:", formData);
  };

  return (
    <div
      className="min-h-screen  px-4 py-12"
      style={{
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
      }}
    >
      <div
        className="max-w-3xl mx-auto  rounded-xl shadow-md p-8"
        style={{
          backgroundColor: "var(--bg-color)",
          color: "var(--text-color)",
        }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Edit<span className="text-purple-700"> Post</span>
          </h1>
          <p className="text-gray-500">Update your blog content</p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Title */}
          <div>
            <label className="label font-semibold">Post Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input input-bordered w-full rounded-lg focus:outline-none"
              style={{
                backgroundColor: "var(--bg-color)",
                color: "var(--text-color)",
              }}
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className="label font-semibold">Cover Image URL</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="input input-bordered w-full rounded-lg focus:outline-none"
              style={{
                backgroundColor: "var(--bg-color)",
                color: "var(--text-color)",
              }}
            />
          </div>

          {/* Content */}
          <div>
            <label className="label font-semibold">Post Content</label>

            <div ref={quillRef} style={{ height: "300px" }} />
          </div>

          {/* Tags */}
          <div>
            <label className="label font-semibold">Tags</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="input input-bordered w-full rounded-lg focus:outline-none"
              style={{
                backgroundColor: "var(--bg-color)",
                color: "var(--text-color)",
              }}
            />
            <p className="text-xs text-gray-400 mt-1">
              Separate tags with commas
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={loading}
              className="btn btn-ghost rounded-3xl"
            >
              Cancel
            </button>

            <button
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              disabled={loading}
              type="submit"
              className="btn btn-neutral rounded-3xl"
              style={{
                backgroundColor: hover ? "var(--hover-bg)" : "var(--bg-color)",
                color: hover ? "var(--hover-text)" : "var(--text-color)",
              }}
            >
              {loading ? "Updating..." : "Update Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
