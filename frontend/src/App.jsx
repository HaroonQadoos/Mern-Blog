import React from "react";
import { Routes, Route, Router } from "react-router-dom";
import MainLayout from "./Layouts/MainLayout";
import PostPage from "./pages/PostPage";
import HomePage from "./pages/HomePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AboutPage from "./pages/AboutPage";

const App = () => {
  return (
    <>
      <div
        className="min-h-screen"
        style={{
          backgroundColor: "var(--bg-color)",
          color: "var(--text-color)",
        }}
      >
        {" "}
        <Routes>
          {/* Public Pages */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/post/:id" element={<PostPage />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />
      </div>
    </>
  );
};

export default App;
