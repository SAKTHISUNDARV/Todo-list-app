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

  const navigate = useNavigate();
  const inputRef = useRef(null);
  const profileRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user")) || null;

  const showAlert = useCallback((message, type = "success") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "success" }), 3000);
  }, []);

  // Fetch tasks - CORRECTED
  useEffect(() => {
    if (!user) return;
    
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await api.get("/tasks");
        setTasks(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        // Handle error without causing infinite loops
        setAlert({ message: "Failed to fetch tasks!", type: "error" });
        setTimeout(() => setAlert({ message: "", type: "success" }), 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []); // ← Only user as dependency

  // Add task - CORRECTED
  const addTask = useCallback(async () => {
    if (!newTask.trim()) return;
    try {
      const res = await api.post("/tasks", { taskname: newTask });
      setTasks(prevTasks => [res.data, ...prevTasks]);
      setNewTask("");
      setShowAdd(false); // ← Close the add form
      showAlert("Task added successfully!", "success");
    } catch (error) {
      console.error("Error adding task:", error);
      showAlert("Failed to add task!", "error");
    }
  }, [newTask, showAlert]);

  // Toggle task status
  const toggleTaskStatus = useCallback(async (id) => {
    try {
      const res = await api.put(`/tasks/${id}/status`);
      setTasks(prev => prev.map((t) => (t.id === id ? { ...t, status: res.data.status } : t)));
      showAlert("Task status updated!", "blue");
    } catch (error) {
      console.error(error);
      showAlert("Failed to update status!", "error");
    }
  }, [showAlert]);

  // Update task name
  const updateTask = useCallback(async (id, taskname) => {
    try {
      await api.put(`/tasks/${id}`, { taskname });
      setTasks(prev => prev.map((t) => (t.id === id ? { ...t, taskname } : t)));
      showAlert("Task updated successfully!", "success");
    } catch (error) {
      console.error(error);
      showAlert("Failed to update task!", "error");
    }
  }, [showAlert]);

  // Delete task
  const deleteTask = useCallback(async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter((t) => t.id !== id));
      showAlert("Task deleted!", "success");
    } catch (error) {
      console.error(error);
      showAlert("Failed to delete task!", "error");
    }
  }, [showAlert]);

  // Clear all tasks
  const clearAllTasks = useCallback(async () => {
    if (!window.confirm("Are you sure you want to clear all tasks?")) return;
    try {
      await api.delete("/clearalltasks");
      setTasks([]);
      showAlert("All tasks cleared!", "success");
    } catch (error) {
      console.error("Error clearing tasks:", error);
      showAlert("Failed to clear tasks!", "error");
    }
  }, [showAlert]);

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
