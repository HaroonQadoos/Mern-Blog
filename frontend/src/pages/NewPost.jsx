import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { toast } from "react-toastify";

const NewPost = () => {
  const [editor, setEditor] = useState(null);
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const quillRef = useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    body: "",
    tags: "",
  });

  // Initialize Quill editor
  useEffect(() => {
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
    setEditor(quill);

    quill.on("text-change", () => {
      setFormData((prev) => ({ ...prev, body: quill.root.innerHTML }));
      const plaintext = quill.getText().trim();
      setContent(plaintext);
    });
  }, []);

  // Handle normal inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [status, setStatus] = useState("draft");
  const handleSubmit = async (statusType) => {
    if (!formData.title || !content.trim()) {
      toast.error("Title and content cannot be empty");
      return;
    }

    try {
      await api.post("/posts", {
        title: formData.title,
        body: content, // or formData.body for HTML
        image: formData.image,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
        status: statusType,
      });
      toast.success(
        statusType === "published"
          ? "Post published successfully"
          : "Draft saved successfully"
      );
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post");
    }
  };

  return (
    <div className="min-h-screen bg-base-100 px-4 py-12">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Create<span className="text-purple-700"> New </span>Post
          </h1>
          <p className="text-gray-500">Write and publish your blog post</p>
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
              placeholder="Enter post title"
              className="input input-bordered w-full rounded-lg focus:outline-none"
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
              placeholder="https://image-url.com"
              className="input input-bordered w-full rounded-lg focus:outline-none"
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
              placeholder="mern, react, backend"
              className="input input-bordered w-full rounded-lg focus:outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              Separate tags with commas
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <Link to="/" className="btn btn-ghost rounded-3xl">
              Cancel
            </Link>
            <button
              type="button"
              onClick={() => handleSubmit("draft")}
              className="btn btn-outline rounded-3xl"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={() => handleSubmit("published")}
              className="btn rounded-3xl bg-black text-white transition-colors duration-300 hover:bg-white hover:text-black "
            >
              Publish Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPost;
