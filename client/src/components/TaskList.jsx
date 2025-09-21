import React, { useState } from "react";
import { MdDeleteOutline, MdModeEditOutline } from "react-icons/md";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";

const TaskList = ({ tasks, toggleTaskStatus, deleteTask, updateTask }) => {
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const handleEdit = (task) => {
    setEditId(task.id);
    setEditText(task.taskname);
  };

  const handleSave = (id) => {
    if (!editText.trim()) return;
    updateTask(id, editText);
    setEditId(null);
    setEditText("");
  };

  return (
    <div className="space-y-3">
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <div
            key={task.id}
            className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            {/* Task Info */}
            <div className="flex items-center gap-3 w-full md:w-auto mb-3 md:mb-0">
              <div
                className={`flex items-center justify-center w-8 h-8 md:w-6 md:h-6 rounded-full cursor-pointer ${
                  task.status
                    ? "bg-green-100 text-green-600"
                    : "bg-amber-100 text-amber-600"
                }`}
                onClick={() => toggleTaskStatus(task.id)}
              >
                {task.status ? <FaCheckCircle /> : <FaRegCircle />}
              </div>

              {editId === task.id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSave(task.id)}
                  className="w-full md:max-w-2xl px-2 py-1 rounded-lg bg-gray-100 focus:outline-none"
                  placeholder="Edit your task..."
                  autoFocus
                />
              ) : (
                <span
                  className={`block w-full md:max-w-2xl break-words px-2 py-1 rounded-lg cursor-pointer transition ${
                    task.status
                      ? "line-through text-gray-400 bg-gray-100"
                      : "text-gray-800 hover:bg-gray-50"
                  }`}
                  title={task.taskname}
                  onClick={() => toggleTaskStatus(task.id)}
                >
                  {task.taskname}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 w-full md:w-auto justify-end md:justify-start">
              {!task.status && (
                <button
                  onClick={() => toggleTaskStatus(task.id)}
                  className="flex items-center justify-center w-10 h-10 md:w-auto md:px-3 md:py-1 rounded-lg text-sm bg-green-100 text-green-700 hover:bg-green-200 transition"
                  title="Mark Complete"
                >
                  <FaCheckCircle className="md:hidden" />
                  <span className="hidden md:inline">Mark Complete</span>
                </button>
              )}

              {editId === task.id ? (
                <button
                  onClick={() => handleSave(task.id)}
                  className="flex items-center justify-center w-10 h-10 md:w-auto md:px-3 md:py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm"
                  title="Save"
                >
                  <span className="hidden md:inline">Save</span>
                  <svg className="w-5 h-5 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(task)}
                  className="flex items-center justify-center w-10 h-10 md:w-auto md:px-3 md:py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm"
                  title="Edit"
                >
                  <MdModeEditOutline className="md:hidden" />
                  <span className="hidden md:inline">Edit</span>
                </button>
              )}

              <button
                onClick={() => deleteTask(task.id)}
                className="flex items-center justify-center w-10 h-10 md:w-auto md:px-3 md:py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm"
                title="Remove"
              >
                <MdDeleteOutline className="md:hidden" />
                <span className="hidden md:inline">Remove</span>
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500 bg-gray-100 rounded-lg">
          No tasks found.
        </div>
      )}
    </div>
  );
};

export default TaskList;