import React from "react";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)" }}
    >
      <div className="max-w-[1100px] mx-auto px-4 py-16 space-y-20">
        {/* Hero Section */}
        <section className="space-y-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold">
            About This Blog
          </h1>
          <p className="text-lg max-w-3xl mx-auto">
            A modern MERN-based blog platform where ideas, tutorials, and
            real-world development experiences are shared to help developers
            grow.
          </p>
        </section>

        {/* Image Section */}
        <section
          className="relative w-full h-[420px] overflow-hidden rounded-xl"
          style={{ backgroundColor: "var(--card-bg)" }}
        >
          <img
            src="/5546630d-89aa-418b-bdc5-cf2a6bfc3f24.jfif"
            alt="About blog"
            className="w-full h-full object-cover"
          />
        </section>

        {/* About Content */}
        <section className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-5">
            <h2 className="text-3xl font-bold">Who I Am</h2>
            <p className="leading-relaxed">
              I'm a software engineer passionate about building scalable web
              applications using the MERN stack. This blog is a space where I
              document my learning journey, share practical tutorials, and
              publish insights from real projects.
            </p>
            <p className="leading-relaxed">
              Whether you're a beginner or an experienced developer, my goal is
              to provide clear, honest, and useful content that helps you grow
              with confidence.
            </p>
          </div>

          <div className="space-y-5">
            <h2 className="text-3xl font-bold">What You’ll Find Here</h2>
            <ul className="space-y-3 list-disc list-inside">
              <li>MERN Stack tutorials & best practices</li>
              <li>Real-world project breakdowns</li>
              <li>Backend & frontend performance tips</li>
              <li>Career and learning advice for developers</li>
            </ul>
          </div>
        </section>

        {/* Values Section */}
        <section className="grid sm:grid-cols-3 gap-8">
          <div
            className="p-6 rounded-xl text-center space-y-3"
            style={{ backgroundColor: "var(--card-bg)" }}
          >
            <h3 className="text-xl font-semibold">Quality</h3>
            <p>
              Every article is written with clarity, accuracy, and real
              experience in mind.
            </p>
          </div>
          <div
            className="p-6 rounded-xl text-center space-y-3"
            style={{ backgroundColor: "var(--card-bg)" }}
          >
            <h3 className="text-xl font-semibold">Consistency</h3>
            <p>
              Regular updates with practical and relevant content for
              developers.
            </p>
          </div>
          <div
            className="p-6 rounded-xl text-center space-y-3"
            style={{ backgroundColor: "var(--card-bg)" }}
          >
            <h3 className="text-xl font-semibold">Community</h3>
            <p>Built to help developers learn, share, and grow together.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
