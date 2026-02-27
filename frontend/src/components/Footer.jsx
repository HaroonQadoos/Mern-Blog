import React from "react";
import ThemeToggle from "./Themetoggle";

const Footer = () => {
  return (
    <>
      <footer
        className="footer footer-horizontal footer-center rounded p-10  "
        style={{
          backgroundColor: "var(--bg-color)",
          color: "var(--text-color)",
        }}
      >
        <nav>
          <div className="grid grid-flow-col gap-4">
            <ThemeToggle />
          </div>
        </nav>
        <aside>
          <div className="text-sm text-muted-foreground text-gray-500">
            © Haroon Qadoos {new Date().getFullYear()}
          </div>
        </aside>
      </footer>
    </>
  );
};

export default Footer;
