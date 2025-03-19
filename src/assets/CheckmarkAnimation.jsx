import React from "react";

const CheckmarkAnimation = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width="100"
      height="100"
    >
      {/* Checkmark */}
      <path
        fill="none"
        stroke="#08d79c"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 32 l8 8 l16 -16"
      >
        <animate
          attributeName="stroke-dasharray"
          from="0, 50"
          to="50, 0"
          dur="2.5s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
};

export default CheckmarkAnimation;
