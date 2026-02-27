import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import DragAndDropInput from "../components/DragAndDropInput";

const NewPost = () => {
  const [image, setImage] = useState(null);
  const [editor, setEditor] = useState(null);
  const [content, setContent] = useState("");
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();
  const quillRef = useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    body: "",
    tags: "",
  });
  const quillInitialized = useRef(false);

  // Initialize Quill editor
  useEffect(() => {
    if (quillInitialized.current) return;
    if (!quillRef.current) return;

    // Clear previous content to prevent double toolbar
    quillRef.current.innerHTML = "";

    const quill = new Quill(quillRef.current, {
      theme: "snow",
      modules: {
        toolbar: {
          container: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            ["link", "image"],
          ],
          handlers: {
            image: () => {
              const input = document.createElement("input");
              input.setAttribute("type", "file");
              input.setAttribute("accept", "image/*");
              input.click();

              input.onchange = async () => {
                const file = input.files[0];
                if (!file) return;

                const formData = new FormData();
                formData.append("image", file);

                try {
                  const res = await api.post("/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                  });

                  const imageUrl = res.data.url;
                  console.log("Cloudinary URL:", imageUrl);

                  const range = quill.getSelection(true);
                  quill.insertEmbed(range.index, "image", imageUrl);
                  quill.setSelection(range.index + 1);
                } catch (err) {
                  console.error("Image upload error:", err);
                  toast.error("Failed to upload image");
                }
              };
            },
          },
        },
      },
    });

    quill.on("text-change", () => {
      const plaintext = quill.getText().trim();
      setFormData((prev) => ({
        ...prev,
        body: plaintext,
        htmlBody: quill.root.innerHTML,
      }));
      setContent(plaintext);
    });

    setEditor(quill);
    quillInitialized.current = true;
  }, []);

  // Handle normal inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // handleFile
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // get the first selected file
    if (file) {
      setImage(URL.createObjectURL(file)); // create a preview URL
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  //handle submit
  const handleSubmit = async (statusType) => {
    if (!formData.title || !content.trim()) {
      toast.error("Title and content cannot be empty");
      return;
    }

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("body", formData.body);
      data.append("htmlBody", formData.htmlBody);
      data.append("tags", formData.tags);
      data.append("status", statusType);

      // ✅ Upload image first if it's a File
      if (formData.image instanceof File) {
        const uploadData = new FormData();
        uploadData.append("image", formData.image);

        const uploadRes = await api.post("/upload", uploadData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        data.append("image", uploadRes.data.url); // <-- send URL to backend
      } else if (formData.image && typeof formData.image === "string") {
        data.append("image", formData.image); // already a URL
      }
      if (!formData.image) {
        toast.error("Please select a cover image");
        return;
      }

      await api.post("/posts", data);

      toast.success(
        statusType === "published"
          ? "Post published successfully"
          : "Draft saved successfully"
      );
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to post");
    }
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
        className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8"
        style={{
          backgroundColor: "var(--bg-color)",
          color: "var(--text-color)",
        }}
      >
        {/* Header */}
        <div
          className="mb-8"
          style={{
            backgroundColor: "var(--bg-color)",
            color: "var(--text-color)",
          }}
        >
          <h1 className="text-3xl font-bold">
            Create<span className="text-purple-700"> New </span>Post
          </h1>
          <p className="text-gray-500">Write and publish your blog post</p>
        </div>

        {/* Form */}
        <form
          className="space-y-6"
          style={{
            backgroundColor: "var(--bg-color)",
            color: "var(--text-color)",
          }}
        >
          {/* Title */}
          <div className="">
            <label className="label font-semibold">Post Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title"
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
              value={typeof formData.image === "string" ? formData.image : ""}
              onChange={handleChange}
              placeholder="https://image-url.com"
              className="input input-bordered w-full rounded-lg focus:outline-none"
              style={{
                backgroundColor: "var(--bg-color)",
                color: "var(--text-color)",
              }}
              disabled={formData.image instanceof File}
            />
            <DragAndDropInput
              file={formData.image}
              onSelect={(file) => {
                setImage(URL.createObjectURL(file));
                setFormData((prev) => ({ ...prev, image: file }));
              }}
              onRemove={() => {
                setImage(null);
                setFormData((prev) => ({ ...prev, image: "" }));
              }}
              disabled={
                typeof formData.image === "string" && formData.image.length > 0
              }
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
          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
            <Link to="/" className="btn btn-ghost rounded-3xl w-full sm:w-auto">
              Cancel
            </Link>
            <button
              type="button"
              onClick={() => handleSubmit("draft")}
              className="btn btn-outline rounded-3xl w-full sm:w-auto"
            >
              Save Draft
            </button>
            <button
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              type="button"
              onClick={() => handleSubmit("published")}
              className="btn rounded-3xl w-full sm:w-auto transition-colors duration-300"
              style={{
                backgroundColor: hover ? "var(--hover-bg)" : "var(--bg-color)",
                color: hover ? "var(--hover-text)" : "var(--text-color)",
              }}
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
