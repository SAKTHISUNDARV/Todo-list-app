import React, { useState } from "react";
import axios from "axios";
import Alert from "./Alert"; 
import { MdEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const navigate = useNavigate();
  const [pass, setPass] = useState(true);
  const [values, setValues] = useState({ email: "", password: "" });
  const [alert, setAlert] = useState({ message: "", type: "success" });

  const handleChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });
  const showAlert = (message, type = "success") => setAlert({ message, type });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", values);
      if (res.data.status === "success") {
        // Save token and user info
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        showAlert("Login successful!", "success");
        setTimeout(() => navigate("/todo"), 1000);
      }
    } catch (err) {
      console.error(err);
      showAlert(err.response?.data?.error || "Login failed", "error");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-4 bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100">
      <div className="flex flex-col sm:flex-row w-full max-w-4xl rounded-xl shadow-lg overflow-hidden">
        
        <div className="flex-1 flex flex-col justify-center px-8 py-16 sm:px-12 gap-6 bg-white">
          <Alert message={alert.message} type={alert.type} onClose={() => setAlert({ message: "", type: "success" })} />

          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-blue-600">Welcome Back!</h1>
            <p className="text-gray-600 mt-2">Sign in to access your tasks.</p>
            <p className="text-gray-600 mt-1">Let's stay productive and achieve your goals today!</p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex items-center gap-3 bg-blue-50 rounded-lg px-4 py-2 shadow-sm">
              <MdEmail className="text-blue-600 text-xl" />
              <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={values.email}
                onChange={handleChange}
                className="flex-1 bg-transparent focus:outline-none"
                required
              />
            </div>

            <div className="relative flex items-center gap-3 bg-blue-50 rounded-lg px-4 py-2 shadow-sm">
              <RiLockPasswordLine className="text-blue-600 w-6 h-6 sm:w-6 sm:h-6" />
              <input
                type={pass ? "password" : "text"}
                name="password"
                placeholder="Password"
                value={values.password}
                onChange={handleChange}
                className="flex-1 bg-transparent focus:outline-none pr-10"
                required
              />
              <button type="button" onClick={() => setPass(!pass)} className="absolute right-3 text-gray-500">
                {pass ? <FaEyeSlash className="w-5 h-5 sm:w-5 sm:h-5" /> : <FaEye className="w-5 h-5 sm:w-5 sm:h-5" />}
              </button>
            </div>

            <button className="w-full mt-6 py-2 text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full">
              SIGN IN
            </button>

            <div className="flex justify-center gap-1 mt-4 text-sm text-gray-600">
              <p>Don't have an account?</p>
              <button className="text-blue-600 underline cursor-pointer" onClick={() => navigate("/signup")}>
                Sign up
              </button>
            </div>
          </form>
        </div>

        <div className="bg-gradient-to-b from-blue-300 via-blue-500 to-indigo-500 flex-1 flex flex-col justify-center items-center p-10 text-center text-white">
          <h2 className="text-2xl font-semibold mb-2">Ready to Conquer Your Day?</h2>
          <p className="text-sm mb-1">Sign in and start organizing your tasks efficiently.</p>
          <p className="text-sm mb-1">Stay productive, focused, and ahead of your goals!</p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
