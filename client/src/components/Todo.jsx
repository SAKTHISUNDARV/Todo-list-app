import React, { useState } from "react";
import { MdOutlineCalendarToday, MdDeleteOutline } from "react-icons/md";
import { FaCheckCircle, FaRegCircle, FaPlus } from "react-icons/fa";
import { CiCircleList } from "react-icons/ci";
import { IoMdCheckmark } from "react-icons/io";

const Todo = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Finish React Dashboard", completed: false },
    { id: 2, text: "Prepare Meeting Notes", completed: true },
    { id: 3, text: "Update Resume", completed: false },
    { id: 4, text: "Buy groceries", completed: false },
    { id: 5, text: "Call client for feedback", completed: true },
  ]);

  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");

  const addTask = () => {
    if (newTask.trim() === "") return;
    const task = { id: Date.now(), text: newTask, completed: false };
    setTasks([task, ...tasks]);
    setNewTask("");
    setShowAdd(false);
  };

  const toggleTaskStatus = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Filter tasks based on selected filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  // Stats
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 pt-8 px-5 pb-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col justify-center items-center gap-2 mb-8">
          <h1 className="text-blue-600 font-bold text-3xl">Todo List App</h1>
          <p className="text-gray-600">Focus on what matters today</p>
        </div>

        {/* Top Section: Dashboard and Filters in one row */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Dashboard Card */}
          <div className="bg-white rounded-xl p-6 shadow-md flex-1">
            <h2 className="font-semibold text-blue-600 text-xl mb-5">Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex rounded-full w-12 h-12 bg-blue-100 p-2 items-center justify-center">
                  <MdOutlineCalendarToday className="text-blue-600 text-xl" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Tasks</p>
                  <p className="font-bold text-gray-800 text-xl">{total}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                <div className="flex rounded-full w-12 h-12 bg-green-100 p-2 items-center justify-center">
                  <FaCheckCircle className="text-green-600 text-xl" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Completed</p>
                  <p className="font-bold text-gray-800 text-xl">{completed}</p>
                </div>
              </div>
              
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

          {/* Filters Card */}
          <div className="bg-white rounded-xl p-6 shadow-md lg:w-80">
            <h2 className="font-semibold text-blue-600 text-xl mb-5">Filters</h2>
            <div className="space-y-3">
              <div 
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition ${filter === "all" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                onClick={() => setFilter("all")}
              >
                <div className="flex items-center gap-2">
                  <CiCircleList className="text-lg" />
                  <span>All Tasks</span>
                </div>
                <span className="bg-gray-300 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs">{total}</span>
              </div>
              
              <div 
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition ${filter === "completed" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                onClick={() => setFilter("completed")}
              >
                <div className="flex items-center gap-2">
                  <IoMdCheckmark className="text-lg" />
                  <span>Completed</span>
                </div>
                <span className="bg-gray-300 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs">{completed}</span>
              </div>
              
              <div 
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition ${filter === "pending" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                onClick={() => setFilter("pending")}
              >
                <div className="flex items-center gap-2">
                  <FaRegCircle className="text-lg" />
                  <span>Pending</span>
                </div>
                <span className="bg-gray-300 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs">{pending}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold text-blue-600 text-xl">Today's Tasks</h2>
            <button
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={() => setShowAdd(!showAdd)}
            >
              <FaPlus />
              <span>Add Task</span>
            </button>
          </div>

          {/* Add Task Input */}
          {showAdd && (
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a new task"
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
              />
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                onClick={addTask}
              >
                Add
              </button>
            </div>
          )}

          {/* Task List */}
          <div className="space-y-3">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <div key={task.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                  {/* Left side - Task info and status */}
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full ${task.completed ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"}`}>
                      {task.completed ? <FaCheckCircle /> : <FaRegCircle />}
                    </div>
                    <span className={`${task.completed ? "line-through text-gray-400" : "text-gray-800"}`}>
                      {task.text}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${task.completed ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                      {task.completed ? "Complete" : "Pending"}
                    </span>
                  </div>
                  
                  {/* Right side - Action buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`px-3 py-1 rounded-lg text-sm ${task.completed ? "bg-amber-100 text-amber-700 hover:bg-amber-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}
                    >
                      {task.completed ? "Mark Pending" : "Mark Complete"}
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition text-sm"
                    >
                      <MdDeleteOutline />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-100 rounded-lg">
                No tasks found. {filter !== "all" && "Try changing your filter."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Todo;