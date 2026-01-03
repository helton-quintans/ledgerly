"use client";

import React from "react";
import ReuleauxTriangle from "./ReuleauxTriangle";

type Props = {
  size?: number;
  color?: string;
  speed?: number; // seconds per revolution
};

export default function Spinner({ size = 40, color = "currentColor", speed = 1 }: Props) {
  const triangleSize = Math.round(size * 0.5);
  const orbit = size;

  const style: React.CSSProperties = {
    width: size,
    height: size,
    position: "relative",
  };

  const ringStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const rotatingStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: orbit,
    height: orbit,
    transformOrigin: "50% 50%",
    animation: `spin ${speed}s linear infinite`,
  };

  return (
    <div style={style}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
      `}</style>
      <div style={ringStyle} aria-hidden>
        <div style={rotatingStyle}>
          <div style={{ position: "absolute", top: 0, left: "50%", transform: `translateX(-50%)` }}>
            <ReuleauxTriangle radius={triangleSize} fill={color} />
          </div>
        </div>
      </div>
    </div>
  );
}
