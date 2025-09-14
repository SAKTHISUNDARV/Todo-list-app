import React from "react";

const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full max-w-xl  shadow-md">
      {/* Top row */}
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-500">Task Progress</span>
        <span className="text-sm font-medium text-gray-500">{progress}%</span>
      </div>

      {/* Progress line */}
      <div className="w-full bg-gray-300 rounded-full h-3">
        <div
          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
