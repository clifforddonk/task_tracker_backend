import React from "react";
import { FaSpinner } from "react-icons/fa";

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center bg-gray-50 justify-center">
      <div className="text-center">
        <FaSpinner className="text-4xl text-indigo-600  animate-spin mb-4 mx-auto" />
        <p className="text-lg text-gray-600">Loading</p>
      </div>
    </div>
  );
};

export default Loading;
