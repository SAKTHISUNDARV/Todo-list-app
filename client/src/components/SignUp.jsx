import React, { useState } from 'react';
import { MdEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const SignUp = () => {
  const [pass, setPass] = useState(true);
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/register', values);
      console.log(res.data);
      if (res.data.status === "success") {
        alert("Registration successful!");
        navigate("/signIn");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 flex justify-center items-center p-4">
      <div className="flex flex-col sm:flex-row w-full max-w-4xl rounded-xl shadow-lg overflow-hidden">

        {/* Left side (Form) */}
        <div className="bg-white flex-1 flex flex-col justify-center px-6 sm:px-12 py-10 gap-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-blue-600">Hello!</h1>
            <p className="text-gray-600 mt-2">Create your account to organize your tasks efficiently.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">

            {/* Username */}
            <div className="flex items-center gap-3 bg-blue-50 rounded-lg px-4 py-2 shadow-sm">
              <FaUser className="text-blue-600 text-xl flex-shrink-0" />
              <input
                type="text"
                className="flex-1 bg-transparent focus:outline-none text-gray-800"
                placeholder="Username"
                name="username"
                value={values.username}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div className="flex items-center gap-3 bg-blue-50 rounded-lg px-4 py-2 shadow-sm">
              <MdEmail className="text-blue-600 text-xl flex-shrink-0" />
              <input
                type="email"
                className="flex-1 bg-transparent focus:outline-none text-gray-800"
                placeholder="E-mail"
                name="email"
                value={values.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="flex items-center gap-3 bg-blue-50 rounded-lg px-4 py-2 shadow-sm relative">
              <RiLockPasswordLine className="text-blue-600 w-6 h-6 flex-shrink-0" />
              <input
                type={pass ? "password" : "text"}
                className="flex-1 bg-transparent focus:outline-none text-gray-800 placeholder-gray-400 pr-10"
                placeholder="Password"
                name="password"
                value={values.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setPass(!pass)}
                className="absolute right-3 text-gray-400 hover:text-blue-600 focus:outline-none"
              >
                {pass ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full mt-6 py-2 text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full hover:from-blue-600 hover:to-indigo-600 transition duration-200"
            >
              CREATE ACCOUNT
            </button>
          </form>

          {/* Sign in link */}
          <div className="flex justify-center gap-1 mt-4 text-sm text-gray-600">
            <p>Already have an account?</p>
            <button
              className="text-blue-600 underline cursor-pointer"
              type="button"
              onClick={() => navigate("/signIn")}
            >
              Sign in
            </button>
          </div>
        </div>

        {/* Right side (Info panel) */}
        <div className="bg-gradient-to-b from-blue-300 via-blue-500 to-indigo-500 flex-1 flex flex-col justify-center items-center p-10 text-center text-white">
          <h2 className="text-2xl font-semibold mb-2">Start Your Productivity Journey!</h2>
          <p className="text-sm mb-1">Sign up and begin organizing your tasks effectively.</p>
          <p className="text-sm mb-1">Stay focused, manage your day, and achieve more.</p>
          <p className="text-sm">
            Need help?{" "}
            <button className="underline text-white hover:text-gray-200 cursor-pointer" type="button">
              Contact support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
