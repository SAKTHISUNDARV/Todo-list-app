// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Todo from "./components/Todo";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

function App() {

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Todo/>}
        />
        <Route
          path="/signup"
          element={ <SignUp />}
        />
        <Route
          path="/signin"
          element={<SignIn/>}
        />
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
