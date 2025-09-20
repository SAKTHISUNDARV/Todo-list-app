import React from "react";
import { CiCircleList } from "react-icons/ci";
import { IoMdCheckmark } from "react-icons/io";
import { FaRegCircle } from "react-icons/fa";

const Filters = ({ filter, setFilter, total, completed, pending }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md lg:w-80">
      <h2 className="font-semibold text-blue-600 text-xl mb-5">Filters</h2>
      <div className="space-y-3">
        {/* All */}
        <div
          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition ${
            filter === "all"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setFilter("all")}
        >
          <div className="flex items-center gap-2">
            <CiCircleList className="text-lg" />
            <span>All Tasks</span>
          </div>
          <span className="bg-gray-300 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs">
            {total}
          </span>
        </div>

        {/* Completed */}
        <div
          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition ${
            filter === "completed"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setFilter("completed")}
        >
          <div className="flex items-center gap-2">
            <IoMdCheckmark className="text-lg" />
            <span>Completed</span>
          </div>
          <span className="bg-gray-300 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs">
            {completed}
          </span>
        </div>

        {/* Pending */}
        <div
          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition ${
            filter === "pending"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setFilter("pending")}
        >
          <div className="flex items-center gap-2">
            <FaRegCircle className="text-lg" />
            <span>Pending</span>
          </div>
          <span className="bg-gray-300 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs">
            {pending}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Filters;
