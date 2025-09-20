import React from "react";
import { MdOutlineCalendarToday } from "react-icons/md";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";

const Dashboard = ({ total, completed, pending, progress }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md flex-1">
      <h2 className="font-semibold text-blue-600 text-xl mb-5">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total */}
        <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex rounded-full w-12 h-12 bg-blue-100 p-2 items-center justify-center">
            <MdOutlineCalendarToday className="text-blue-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Tasks</p>
            <p className="font-bold text-gray-800 text-xl">{total}</p>
          </div>
        </div>

        {/* Completed */}
        <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
          <div className="flex rounded-full w-12 h-12 bg-green-100 p-2 items-center justify-center">
            <FaCheckCircle className="text-green-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Completed</p>
            <p className="font-bold text-gray-800 text-xl">{completed}</p>
          </div>
        </div>

        {/* Pending */}
        <div className="flex items-center gap-4 p-3 bg-amber-50 rounded-lg">
          <div className="flex rounded-full w-12 h-12 bg-amber-100 p-2 items-center justify-center">
            <FaRegCircle className="text-amber-600 text-xl" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Pending</p>
            <p className="font-bold text-gray-800 text-xl">{pending}</p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Completion Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
