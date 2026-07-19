"use client";
import React from "react";

export default function PhosphorBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100dvh",
        background: "#030014", // Deep void dark background matching the nebula
        overflow: "hidden",
        zIndex: -20,
        pointerEvents: "auto" // Crucial for allowing iframe mouse interaction
      }}
    >
      <iframe
        src="https://my.spline.design/particlenebula-eKX6ufG1cWEM7T2SEsjuNo9h/"
        frameBorder="0"
        width="100%"
        height="100%"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          outline: "none",
          background: "transparent",
          opacity: 0.78, // Slightly higher opacity for a more vibrant background
          filter: "brightness(0.68) saturate(0.9) contrast(1.15)", // Enhanced brightness & saturation for extra stellar luminosity
        }}
        title="Interactive Particle Nebula"
        allow="autoplay; fullscreen"
      />
      {/* Dark radial overlay to vignette the background, focusing attention on the center text */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at center, rgba(3, 0, 20, 0.15) 20%, rgba(3, 0, 20, 0.72) 80%)",
          pointerEvents: "none", // Ensure mouse clicks pass through to the iframe
          zIndex: -19,
        }}
      />
    </div>
  );
}
