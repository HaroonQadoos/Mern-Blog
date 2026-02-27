import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `btn nav-btn ${isActive ? "nav-btn-active" : ""}`;

  return (
    <>
      {/* Main Navbar */}
      <div
        className="navbar w-full lg:max-w-[1100px] justify-between lg:mx-auto sm:px-6 px-4"
        style={{
          backgroundColor: "var(--bg-color)",
          color: "var(--text-color)",
        }}
      >
        {/* Navbar start */}
        <div className="navbar-start flex items-center space-x-4">
          {/* Hamburger for small screens */}
          <button
            className="btn btn-ghost lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="btn btn-ghost ml-2
             hover:bg-transparent hover:border-transparent hover:shadow-none
             focus:outline-none focus:ring-0 focus:shadow-none focus:border-transparent
             active:bg-transparent active:shadow-none active:border-transparent"
          >
            <h1
              className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight"
              style={{
                backgroundColor: "var(--bg-color)",
                color: "var(--text-color)",
              }}
            >
              Explore.
            </h1>
          </Link>
        </div>

        {/* Navbar end for large screens */}
        <div className="navbar-end hidden lg:flex space-x-1">
          <ul className="menu menu-horizontal px-1 space-x-2">
            <li>
              <NavLink to="/" className={navLinkClass}>
                Blog
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={navLinkClass}>
                About
              </NavLink>
            </li>
          </ul>
        </div>
      </div>

      {/* Sidebar overlay for small screens */}
      <div
        className={`fixed inset-0 z-50 bg-[#1c2541] bg-opacity-50 transition-opacity ${
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar panel */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white  z-50 transform transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-[#1c2541]">Menu</h2>
          <button
            className="btn btn-ghost text-[#1c2541]"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>{" "}
        <ul className="menu p-4 space-y-2">
          {" "}
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `btn nav-btn w-full text-left ${
                  isActive ? "nav-btn-active" : ""
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              Blog
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `btn nav-btn w-full text-left ${
                  isActive ? "nav-btn-active" : ""
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              About
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
