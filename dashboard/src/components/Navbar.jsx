import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";
import { CircleUserRound, UserRoundPen, UsersRound } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const [currUser, setCurrUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, pendingUsersCount } = useAppContext();

  const isAdmin = currentUser?.role === "admin";
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setCurrUser(null);
        return;
      }

      try {
        const res = await api.get("/auth/me");
        setCurrUser(res.data);
      } catch (error) {
        setCurrUser(null);
      }
    };
    setSidebarOpen(false);
    fetchUser();
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setCurrUser(null);
    toast.success("user logout successfully");
    navigate("/login");
  };
  const handleToggleNavigation = (path) => {
    if (location.pathname === path) {
      navigate("/"); // if already on page, go home
    } else {
      navigate(path); // else go to target page
    }
  };
  const navLinkClass = ({ isActive }) =>
    `btn nav-btn ${isActive ? "nav-btn-active" : ""}`;

  return (
    <div
      className="navbar w-full lg:max-w-[1100px] justify-between lg:mx-auto px-4 sm:px-6"
      style={{
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
      }}
    >
      {/* Navbar start */}
      <div className="navbar-start flex items-center space-x-4">
        {/* Hamburger for small screens */}
        <button
          className="btn btn-ghost lg:hidden p-2"
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

        <Link to="/">
          <h1
            className=" text-4xl md:text-6xl font-bold tracking-tighter leading-tight"
            style={{
              backgroundColor: "var(--bg-color)",
              color: "var(--text-color)",
            }}
          >
            Explore.
          </h1>
        </Link>
      </div>

      {/* Navbar end for large */}

      {currUser ? (
        <>
          <div className="navbar-end hidden lg:flex space-x-1">
            <ul className="hidden lg:flex space-x-4">
              <li>
                <NavLink to="/new" className={navLinkClass}>
                  Create
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard" className={navLinkClass}>
                  Dashboard
                </NavLink>
              </li>
            </ul>
          </div>{" "}
          {/* Sidebar overlay for small screens */}
          <div
            className={`fixed inset-0 z-50 bg-[#1c2541] bg-opacity-50 transition-opacity ${
              sidebarOpen
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setSidebarOpen(false)}
          ></div>{" "}
          {/* Sidebar panel */}
          <div
            className={`fixed top-0 left-0 h-full w-64 bg-white text-[#1c2541] z-50 transform transition-transform ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h2 className="text-2xl font-bold text-[#1c2541]">Menu</h2>
              <button
                className="btn btn-ghost text-[#1c2541] "
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
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `btn nav-btn w-full text-left ${
                      isActive ? "nav-btn-active" : ""
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  dashboard
                </NavLink>
              </li>
              <li>
                {" "}
                {isAdmin && (
                  <NavLink
                    to="/users"
                    className={({ isActive }) =>
                      `btn nav-btn w-full text-left ${
                        isActive ? "nav-btn-active" : ""
                      }`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    Users
                    {pendingUsersCount > 0 && (
                      <span className=" top-0 right-0 -mt-1 -mr-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                        {pendingUsersCount}
                      </span>
                    )}
                  </NavLink>
                )}
              </li>
              <li>
                <NavLink
                  to="/new"
                  className={({ isActive }) =>
                    `btn nav-btn w-full text-left ${
                      isActive ? "nav-btn-active" : ""
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  Create
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
          </div>{" "}
          <div className="flex items-center space-x-4">
            {" "}
            <div className="dropdown dropdown-end text-7xl">
              <div
                tabIndex={0}
                role="button"
                className=" text-8xl cursor-pointer rounded-field hover:bg-white focus:outline-none border-none shadow-none ml-2"
              >
                <CircleUserRound size={40} strokeWidth={1.5} />
              </div>
              <ul
                tabIndex="-1"
                className="menu dropdown-content bg-base-200 rounded-box z-1 mt-4 w-52 p-2 shadow-sm"
              >
                <div className="bg-base-300 rounded-box mt-4 mx-auto h-full w-full shadow-sm">
                  {" "}
                  <CircleUserRound
                    size={60}
                    strokeWidth={1.5}
                    className="mx-auto"
                  />
                  <p className=" mx-8 font-semibold">
                    <span className="text-purple-700 font-semibold">
                      {currUser.username}
                    </span>
                    .Your Profile
                  </p>
                </div>

                <li>
                  <button
                    onClick={handleLogout}
                    className="btn mt-5 border-none rounded-4xl bg-black text-white transition-colors duration-300 hover:text-black hover:bg-white"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center space-x-4">
            {" "}
            <NavLink to="/signup" className={navLinkClass}>
              SignUp
            </NavLink>{" "}
            <NavLink to="/login" className={navLinkClass}>
              Login
            </NavLink>
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;
