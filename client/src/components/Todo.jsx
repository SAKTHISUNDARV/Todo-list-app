import React, { useEffect, useState, useRef } from "react";
import { FaPlus } from "react-icons/fa";
import Dashboard from "./Dashboard";
import Filters from "./Filters";
import TaskList from "./TaskList";

// Alert Component
const Alert = ({ message, type = "success", onClose }) => {
  if (!message) return null;

  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
      ? "bg-red-500"
      : "bg-blue-500";

  return (
    <div
      className={`fixed top-5 right-5 text-white px-4 py-3 rounded shadow-md ${bgColor} flex justify-between items-center w-80`}
    >
      <span>{message}</span>
      <button className="ml-4 font-bold" onClick={onClose}>
        ×
      </button>
    </div>
  );
};

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [alert, setAlert] = useState({ message: "", type: "success" });

  const inputRef = useRef(null);

  // Focus input when Add Task opens
  useEffect(() => {
    if (showAdd && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showAdd]);

  const showAlert = (message, type = "success") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "success" }), 3000);
  };

  // Fetch tasks once on mount
  useEffect(() => {
    fetch("http://localhost:5000/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => {
        console.error("Error fetching tasks:", err);
        showAlert("Failed to fetch tasks!", "error");
      });
  }, []);

  // Add Task
  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const res = await fetch("http://localhost:5000/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskname: newTask }),
      });
      const data = await res.json();
      setTasks([{ id: data.id, taskname: newTask, status: 0 }, ...tasks]);
      setNewTask("");
      showAlert("Task added successfully!", "success");
    } catch (error) {
      console.error("Error adding task:", error);
      showAlert("Failed to add task!", "error");
    }
  };

  // Toggle Task Status
  const toggleTaskStatus = async (id) => {
    try {
      await fetch("http://localhost:5000/updatestatus", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.id === id) {
            const newStatus = task.status ? 0 : 1;
            showAlert(
              newStatus ? "Marked as completed!" : "Marked as pending",
              "blue"
            );
            return { ...task, status: newStatus };
          }
          return task;
        })
      );
    } catch (error) {
      console.error("Error toggling status:", error);
      showAlert("Failed to update status!", "error");
    }
  };

  // Update Task
  const updateTask = async (id, taskname) => {
    try {
      const res = await fetch("http://localhost:5000/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, taskname }),
      });
      const data = await res.json();
      if (data.affectedRows > 0) {
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === id ? { ...task, taskname } : task))
        );
        showAlert("Task updated successfully!", "success");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      showAlert("Failed to update task!", "error");
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    try {
      await fetch("http://localhost:5000/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      showAlert("Task deleted!", "success");
    } catch (error) {
      console.error("Error deleting task:", error);
      showAlert("Failed to delete task!", "error");
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.status;
    if (filter === "pending") return !task.status;
    return true;
  });

  // Dashboard stats
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status).length;
  const pending = total - completed;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 pt-8 px-5 pb-10 overflow-auto">
      {/* Alert */}
      <Alert
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ message: "", type: "success" })}
      />

      {/* Header */}
      <div className="flex flex-col justify-center items-center gap-2 mb-8">
        <h1 className="text-blue-600 font-bold text-3xl">Todo List App</h1>
        <p className="text-gray-600">Focus on what matters today</p>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Dashboard + Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <Dashboard
            total={total}
            completed={completed}
            pending={pending}
            progress={progress}
          />
          <Filters
            filter={filter}
            setFilter={setFilter}
            total={total}
            completed={completed}
            pending={pending}
          />
        </div>

        {/* Tasks Section */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 md:gap-0">
            <h2 className="font-semibold text-blue-600 text-xl">
              Today's Tasks
            </h2>
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
            <div className="flex flex-col sm:flex-row gap-2 mb-6">
              <input
                ref={inputRef}
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-100 focus:outline-none"
                placeholder="Enter a new task"
                onKeyPress={(e) => e.key === "Enter" && addTask()}
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
          <TaskList
            tasks={filteredTasks}
            toggleTaskStatus={toggleTaskStatus}
            deleteTask={deleteTask}
            updateTask={updateTask}
            filter={filter}
          />
        </div>
      </div>
    </div>
  );
};

export default Todo;
