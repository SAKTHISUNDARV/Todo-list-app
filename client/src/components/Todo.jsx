import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "./Alert";
import Header from "./Header";
import Dashboard from "./Dashboard";
import Filters from "./Filters";
import TaskList from "./TaskList";
import AddTask from "./AddTask";
import api from "../api";

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [alert, setAlert] = useState({ message: "", type: "success" });
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const navigate = useNavigate();
  const inputRef = useRef(null);
  const profileRef = useRef(null);

  // Authentication check function
  const checkAuth = useCallback(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    
    if (!token || !user) {
      showAlert("Session expired. Please login again.", "error");
      setTimeout(() => navigate("/signin"), 2000);
      return false;
    }
    
    try {
      // Check if token is expired
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      
      if (isExpired) {
        showAlert("Session expired. Please login again.", "error");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setTimeout(() => navigate("/signin"), 2000);
        return false;
      }
      return true;
    } catch (error) {
      showAlert("Invalid session. Please login again.", "error");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setTimeout(() => navigate("/signin"), 2000);
      return false;
    }
  }, [navigate]);

  const showAlert = useCallback((message, type = "success") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "success" }), 5000);
  }, []);

  // Check authentication on component mount
  useEffect(() => {
    const isAuthenticated = checkAuth();
    if (isAuthenticated) {
      setAuthChecked(true);
    }
  }, [checkAuth]);

  // Fetch tasks
  useEffect(() => {
    if (!authChecked) return;
    
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await api.get("/tasks");
        setTasks(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          showAlert("Session expired. Please login again.", "error");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setTimeout(() => navigate("/signin"), 2000);
        } else {
          showAlert(err.response?.data?.error || "Failed to fetch tasks!", "error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [authChecked, navigate, showAlert]);

  // Add task
  const addTask = useCallback(async () => {
    if (!newTask.trim()) return;
    
    if (!checkAuth()) return;
    
    try {
      const res = await api.post("/tasks", { taskname: newTask });
      setTasks(prevTasks => [res.data, ...prevTasks]);
      setNewTask("");
      setShowAdd(false);
      showAlert("Task added successfully!", "success");
    } catch (error) {
      console.error("Error adding task:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        showAlert("Session expired. Please login again.", "error");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setTimeout(() => navigate("/signin"), 2000);
      } else {
        showAlert(error.response?.data?.error || "Failed to add task!", "error");
      }
    }
  }, [newTask, showAlert, navigate, checkAuth]);

  // Toggle task status
  const toggleTaskStatus = useCallback(async (id) => {
    if (!checkAuth()) return;
    
    try {
      const res = await api.put(`/tasks/${id}/status`);
      setTasks(prev => prev.map((t) => (t.id === id ? { ...t, status: res.data.status } : t)));
      showAlert("Task status updated!", "blue");
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        showAlert("Session expired. Please login again.", "error");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setTimeout(() => navigate("/signin"), 2000);
      } else {
        showAlert(error.response?.data?.error || "Failed to update status!", "error");
      }
    }
  }, [showAlert, navigate, checkAuth]);

  // Update task name
  const updateTask = useCallback(async (id, taskname) => {
    if (!checkAuth()) return;
    
    try {
      await api.put(`/tasks/${id}`, { taskname });
      setTasks(prev => prev.map((t) => (t.id === id ? { ...t, taskname } : t)));
      showAlert("Task updated successfully!", "success");
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        showAlert("Session expired. Please login again.", "error");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setTimeout(() => navigate("/signin"), 2000);
      } else {
        showAlert(error.response?.data?.error || "Failed to update task!", "error");
      }
    }
  }, [showAlert, navigate, checkAuth]);

  // Delete task
  const deleteTask = useCallback(async (id) => {
    if (!checkAuth()) return;
    
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter((t) => t.id !== id));
      showAlert("Task deleted!", "success");
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        showAlert("Session expired. Please login again.", "error");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setTimeout(() => navigate("/signin"), 2000);
      } else {
        showAlert(error.response?.data?.error || "Failed to delete task!", "error");
      }
    }
  }, [showAlert, navigate, checkAuth]);

  // Clear all tasks
  const clearAllTasks = useCallback(async () => {
    if (!checkAuth()) return;
    
    if (!window.confirm("Are you sure you want to clear all tasks?")) return;
    try {
      await api.delete("/clearalltasks");
      setTasks([]);
      showAlert("All tasks cleared!", "success");
    } catch (error) {
      console.error("Error clearing tasks:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        showAlert("Session expired. Please login again.", "error");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setTimeout(() => navigate("/signin"), 2000);
      } else {
        showAlert(error.response?.data?.error || "Failed to clear tasks!", "error");
      }
    }
  }, [showAlert, navigate, checkAuth]);

  // Filter tasks based on current filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.status === 1;
    if (filter === "pending") return task.status === 0;
    return true;
  });

  // Calculate stats
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 1).length;
  const pending = total - completed;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin"); 
  };

  // Show loading while checking authentication
  if (!authChecked) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 pt-4 px-5 overflow-auto flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 pt-4 px-5 overflow-auto">
      <Alert
        message={alert.message}
        type={alert.type}
        onClose={() => setAlert({ message: "", type: "success" })}
      />
      
      {user && <Header user={user} handleLogout={handleLogout} profileRef={profileRef} />}

      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="flex flex-col lg:flex-row gap-4 mb-5">
              <Dashboard total={total} completed={completed} pending={pending} progress={progress} />
              <Filters filter={filter} setFilter={setFilter} total={total} completed={completed} pending={pending} />
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <AddTask
                showAdd={showAdd}
                setShowAdd={setShowAdd}
                newTask={newTask}
                setNewTask={setNewTask}
                addTask={addTask}
                inputRef={inputRef}
                clearAllTasks={clearAllTasks}
              />

              <TaskList
                tasks={filteredTasks}
                toggleTaskStatus={toggleTaskStatus}
                deleteTask={deleteTask}
                updateTask={updateTask}
                filter={filter}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Todo;