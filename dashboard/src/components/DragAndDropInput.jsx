import React, { useEffect, useRef, useState } from "react";

const DragAndDropInput = ({ file, onSelect, onRemove, disabled }) => {
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!file) setPreview(null);
  }, [file]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    handleFile(file);
  };
  const handleFile = (file) => {
    setPreview(URL.createObjectURL(file));
    onSelect?.(file);
  };
  const handleRemovePreview = () => {
    setPreview(null);
    onRemove?.();
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        onChange={handleFileChange}
        accept="image/*"
        disabled={disabled}
      />

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-200 ${
          dragActive
            ? "border-purple-600 bg-purple-50"
            : "border-gray-300 bg-gray-50"
        }`}
        style={{
          backgroundColor: "var(--bg-color)",
          color: "var(--text-color)",
        }}
        onClick={() => inputRef.current.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="mx-auto max-h-60 object-contain rounded"
            />
            <button
              type="button"
              onClick={handleRemovePreview}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
            >
              ×
            </button>
          </div>
        ) : (
          <p className="text-gray-500">
            Drag & drop an image here, or click to select
          </p>
        )}
      </div>
    </>
  );
};

export default DragAndDropInput;
