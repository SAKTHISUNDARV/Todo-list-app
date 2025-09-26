import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom"; 
import Todo from "./components/Todo";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Todo />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/todo" 
          element={
            <ProtectedRoute>
              <Todo />
            </ProtectedRoute>
          } 
        />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;