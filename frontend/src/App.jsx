import React from "react";
import { Routes, Route, Router } from "react-router-dom";

import HomePage from "./pages/HomePage";
import AuthLayout from "./Layouts/AuthLayout";
import MainLayout from "./Layouts/MainLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NewPost from "./pages/NewPost";
import ProtectedRoute from "./components/ProtectedRoute";
import PostPage from "./pages/PostPage";
import BlogsPage from "./pages/BlogPage";
import EditPost from "./pages/EditPost";
import DeletePost from "./pages/DeletePost";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UsersPage from "./pages/UsersPage";

const App = () => {
  return (
    <>
      <Routes>
        {/* Public/auth pages */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />{" "}
        </Route>

        {/* Main authenticated pages */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts" element={<BlogsPage />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route
            path="/new"
            element={
              <ProtectedRoute>
                <NewPost />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route
          path="/delete-post/:id"
          element={
            <ProtectedRoute>
              <DeletePost />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-post/:id"
          element={
            <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>
          }
        />
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
    </>
  );
};

export default App;
