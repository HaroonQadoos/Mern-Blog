import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <>
      <div
        className="w-full sm:max-w-[1440px] mx-auto p-6 "
        style={{
          backgroundColor: "var(--bg-color)",
          color: "var(--text-color)",
        }}
      >
        <Navbar />
        <Outlet />
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
