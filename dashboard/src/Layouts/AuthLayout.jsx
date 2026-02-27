import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div
      className=""
      style={{
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
      }}
    >
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
