import { useState } from "react";
import axios from "axios";

const SignUp = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(""); // For error messages
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const toggleAuthMode = () => {
    setIsLogin((prev) => !prev);
    setServerError(""); // Clear error when switching modes
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(""); // Reset error on new attempt
    setLoading(true);

    // Trim input values
    const trimmedData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      confirmPassword: formData.confirmPassword.trim(),
    };

    // Validation before sending request
    if (!validateEmail(trimmedData.email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      setLoading(false);
      return;
    }

    if (!validatePassword(trimmedData.password)) {
      setErrors((prev) => ({
        ...prev,
        password:
          "Password must be at least 8 characters, include a number, and a special character.",
      }));
      setLoading(false);
      return;
    }

    if (!isLogin && trimmedData.password !== trimmedData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      setLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? "login" : "register";
      const res = await axios.post(
        `http://localhost:5000/api/admin/${endpoint}`,
        trimmedData
      );
      console.log(res.data);
      alert(isLogin ? "User Logged In" : "User Registered");
    } catch (error) {
      if (error.response && error.response.data) {
        setServerError(error.response.data.message || "Something went wrong");
      } else {
        setServerError("Server is unreachable. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(value) ? "" : "Please enter a valid email.",
      }));
    }

    if (name === "password") {
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(value)
          ? ""
          : "Password must be at least 8 characters, include a number, and a special character.",
      }));
    }

    if (name === "confirmPassword") {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          value === formData.password ? "" : "Passwords do not match.",
      }));
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white dark:bg-custom-dark shadow-md dark:shadow-sm dark:shadow-black p-4">
        <div className="mx-auto flex justify-center items-center">
          <img
            src="/logo2.png"
            alt="Logo"
            className="h-8 md:h-12 w-auto transition-transform hover:scale-105"
          />
        </div>
      </nav>
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-custom-dark">
        <div className="flex items-center justify-center flex-grow px-4 py-8">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg dark:bg-custom-dark">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
              {isLogin ? "Admin Login" : "Admin Sign Up"}
            </h2>

            {/* Server Error Message */}
            {serverError && (
              <p className="text-red-500 text-sm text-center mb-4">
                {serverError}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-100">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300 text-black"
                    placeholder="Enter your full name"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-100">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300 text-black"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-100">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300 text-black"
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-100">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300 text-black"
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}
              <button
                type="submit"
                className={`w-full py-2 rounded-lg text-white transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
                disabled={loading}
              >
                {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
              </button>
            </form>
            <p className="mt-4 text-sm text-center text-gray-600">
              {isLogin
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <button
                onClick={toggleAuthMode}
                className="text-blue-500 hover:underline"
              >
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
          </div>
        </div>
        <footer className="bg-white dark:bg-custom-dark py-4">
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Grey Matter. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
};

export default SignUp;
