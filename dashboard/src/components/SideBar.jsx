import React from "react";
import { BookPlus, Pencil, UsersRound, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SideBar = ({ isAdmin, pendingUsersCount = 0, onLogout }) => {
  const navigate = useNavigate();
  return (
    <nav className="flex flex-col gap-3 p-6 h-full">
      <button
        onClick={() => navigate("/dashboard")}
        className="flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg hover:bg-[#f1f5f9] hover:text-[#1c2541] transition"
      >
        <BookPlus className="w-5 h-5" />
        Dashboard
      </button>

      <button
        onClick={() => navigate("/posts")}
        className="flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg hover:bg-[#f1f5f9] hover:text-[#1c2541] transition"
      >
        <BookPlus className="w-5 h-5" />
        Posts
      </button>

      <button
        onClick={() => navigate("/create-post")}
        className="flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg hover:bg-[#f1f5f9] hover:text-[#1c2541] transition"
      >
        <Pencil className="w-5 h-5" />
        Create Post
      </button>

      {isAdmin && (
        <button
          onClick={() => navigate("/users")}
          className="flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg hover:bg-[#f1f5f9] hover:text-[#1c2541] transition relative"
        >
          <UsersRound className="w-5 h-5" />
          Users
          {pendingUsersCount > 0 && (
            <span className="absolute top-0 right-0 mt-1 mr-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
              {pendingUsersCount}
            </span>
          )}
        </button>
      )}

      <button
        onClick={onLogout}
        className="flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg hover:bg-[#f1f5f9] hover:text-[#1c2541] transition mt-auto"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </nav>
  );
};

export default SideBar;
