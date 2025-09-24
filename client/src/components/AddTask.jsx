import React from "react";
import { FaPlus } from "react-icons/fa";
import PropTypes from 'prop-types';

const AddTask = ({ 
  showAdd, 
  setShowAdd, 
  newTask, 
  setNewTask, 
  addTask, 
  inputRef,
  clearAllTasks,
  isAdding = false
}) => {
  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h2 className="font-semibold text-blue-600 text-lg sm:text-xl">
          Your Task's
        </h2>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            className="flex items-center gap-1 sm:gap-2 bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition text-sm sm:text-base flex-1 sm:flex-none justify-center"
            onClick={() => setShowAdd(!showAdd)}
            aria-expanded={showAdd}
            aria-label={showAdd ? "Hide add task form" : "Show add task form"}
          >
            <FaPlus className="text-xs sm:text-sm" />
            <span>Add Task</span>
          </button>
          <button
            onClick={clearAllTasks}
            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm sm:text-base flex-1 sm:flex-none"
            title="Clear all tasks (this cannot be undone)"
            aria-label="Clear all tasks"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Add Task Input */}
      {showAdd && (
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            ref={inputRef}
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="Enter a new task"
            onKeyPress={(e) => e.key === "Enter" && addTask()}
            aria-label="New task input"
          />
          <button
            className={`bg-blue-600 text-white px-3 py-2 rounded-lg transition text-sm sm:text-base ${
              !newTask.trim() || isAdding ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
            onClick={addTask}
            disabled={!newTask.trim() || isAdding}
          >
            {isAdding ? 'Adding...' : 'Add'}
          </button>
        </div>
      )}
    </>
  );
};

AddTask.propTypes = {
  showAdd: PropTypes.bool.isRequired,
  setShowAdd: PropTypes.func.isRequired,
  newTask: PropTypes.string.isRequired,
  setNewTask: PropTypes.func.isRequired,
  addTask: PropTypes.func.isRequired,
  inputRef: PropTypes.oneOfType([
    PropTypes.func, 
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  clearAllTasks: PropTypes.func.isRequired,
  isAdding: PropTypes.bool,
};

export default AddTask;
