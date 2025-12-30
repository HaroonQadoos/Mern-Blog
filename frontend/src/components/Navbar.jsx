import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/axios";

const Navbar = () => {
  const [currUser, setCurrUser] = useState(null);
  const navigate = useNavigate();

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

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setCurrUser(null);
    toast.success("user logout successfully");
    navigate("/login");
  };
  const navLinkClass = ({ isActive }) =>
    `rounded-4xl font-semibold transition-colors duration-300
   ${
     isActive
       ? "bg-black text-white"
       : "bg-white text-black hover:bg-black hover:text-white"
   }`;

  return (
    <div className="navbar bg-base-100">
      {/* Navbar start */}
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
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
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>

          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {currUser ? (
              currUser.status === "pending" &&
              currUser.role !== "admin" ? null : (
                <>
                  <li>
                    <NavLink
                      to="/new"
                      className={({ isActive }) =>
                        isActive ? "text-purple-600 font-semibold" : ""
                      }
                    >
                      Create Post
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/dashboard"
                      className={({ isActive }) =>
                        isActive ? "text-purple-600 font-semibold" : ""
                      }
                    >
                      Dashboard
                    </NavLink>
                  </li>
                </>
              )
            ) : (
              <>
                ``
                <li>
                  <Link to="/signup">Signup</Link>
                </li>
                <li>
                  <Link to="/login">Login</Link>
                </li>
              </>
            )}
          </ul>
        </div>

        <Link
          to="/"
          className="btn btn-ghost
             hover:bg-transparent hover:border-transparent hover:shadow-none
             focus:outline-none focus:ring-0 focus:shadow-none focus:border-transparent
             active:bg-transparent active:shadow-none active:border-transparent"
        >
          <img className="w-9" src="../../letter-h (1).png" />
          <span className="text-black font-bold font-serif text-2xl">
            Blogs
          </span>
        </Link>
      </div>

      {/* Navbar end */}
      <div className="navbar-end rounded-4xl space-x-1">
        {currUser ? (
          currUser.status === "pending" && currUser.role !== "admin" ? (
            <button
              className="btn rounded-4xl bg-gray-400 text-white cursor-not-allowed"
              disabled
            >
              Pending...
            </button>
          ) : (
            <>
              <div className="navbar-end hidden lg:flex">
                <ul className="menu menu-horizontal px-1 space-x-2">
                  <li>
                    <NavLink to="/new" className={navLinkClass}>
                      Create Post
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/dashboard" className={navLinkClass}>
                      Dashboard
                    </NavLink>
                  </li>
                </ul>

                <div>
                  Hi,
                  <span className="text-purple-500">{currUser.username}</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="btn rounded-4xl bg-black text-white transition-colors duration-300 hover:text-black hover:bg-white"
              >
                Logout
              </button>
            </>
          )
        ) : (
          <>
            <Link
              to="/signup"
              className="btn rounded-4xl bg-black text-white transition-colors duration-300 hover:text-black hover:bg-white"
            >
              SignUp
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
