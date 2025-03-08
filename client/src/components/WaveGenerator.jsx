import React, { useState, useEffect } from "react";

const WaveMask = ({
  amplitude = 50,
  frequency = 0.1,
  height = 200,
  speed = 0.05,
  unmaskedBg = "white",
  leftGradient = "grey",
  rightGradient = "black",
  is_rotated = 0,
}) => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prevOffset) => prevOffset + speed);
    }, 16);
    return () => clearInterval(interval);
  }, [speed]);

  const generateWavePath = () => {
    let path = `M 0 ${height / 2}`;
    for (let x = 0; x <= width; x++) {
      const y = height / 2 + amplitude * Math.sin(frequency * x + offset);
      path += ` L ${x} ${y}`;
    }
    path += ` L ${width} ${height} L 0 ${height} Z`;
    return path;
  };

  // Generate unique IDs for each instance
  const uniqueId = Math.random().toString(36).substr(2, 9);
  const gradientId = `gradient-${uniqueId}`;
  const maskId = `mask-${uniqueId}`;

  // Gradient coordinates based on is_rotated
  const x1 = is_rotated === 1 ? "100%" : "0%";
  const y1 = is_rotated === 1 ? "0%" : "0%";
  const x2 = is_rotated === 1 ? "0%" : "100%";
  const y2 = is_rotated === 1 ? "100%" : "100%";

  return (
    <div
      style={{ position: "relative", width: "100%", height: `${height * 2}px` }}
    >
      <svg
        style={{ position: "absolute", width: "100%", height: "100%" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradientId} x1={x1} y1={y1} x2={x2} y2={y2}>
            <stop offset="0%" stopColor={leftGradient} />
            <stop offset="100%" stopColor={rightGradient} />
          </linearGradient>
          <mask id={maskId}>
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <path
              d={generateWavePath()}
              fill="black"
              transform="translate(0, 1)"
            />
          </mask>
        </defs>

        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill={`url(#${gradientId})`}
        />
        <rect
          x="0"
          y="0"
          width="100%"
          height={height}
          fill={unmaskedBg}
          mask={`url(#${maskId})`}
        />
        <rect
          x="0"
          y={height / 2}
          width="100%"
          height={height / 2}
          fill={unmaskedBg}
          mask={`url(#${maskId})`}
        />
      </svg>
    </div>
  );
};

export default WaveMask;
