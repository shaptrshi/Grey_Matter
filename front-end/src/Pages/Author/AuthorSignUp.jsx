import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthorSignUp = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    bio: "",
    profilePhoto: null,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const toggleAuthMode = () => {
    setIsLogin((prev) => !prev);
    setServerError("");
    setPreviewImage(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      bio: "",
      profilePhoto: null,
    });
  };

  const validateEmail = (email) =>
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);

  const validatePassword = (password) =>
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setLoading(true);

    // Basic validation - check if required fields are empty
    if (!formData.email || !formData.password) {
      setServerError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? "login" : "register";
      let dataToSend;
      let config = {};

      if (isLogin) {
        // For login, send as regular JSON
        dataToSend = {
          email: formData.email.trim(),
          password: formData.password.trim(),
        };
        config = {
          headers: { "Content-Type": "application/json" },
        };
      } else {
        // For signup, use FormData
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name.trim());
        formDataToSend.append("email", formData.email.trim());
        formDataToSend.append("password", formData.password.trim());
        formDataToSend.append(
          "confirmPassword",
          formData.confirmPassword.trim()
        );
        formDataToSend.append("bio", formData.bio.trim() || "");
        if (formData.profilePhoto) {
          formDataToSend.append("profilePhoto", formData.profilePhoto);
        }

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: "Passwords do not match",
          }));
          setLoading(false);
          return;
        }

        dataToSend = formDataToSend;
        config = {
          headers: { "Content-Type": "multipart/form-data" },
        };
      }

      const res = await axios.post(
        `http://localhost:5000/api/users/${endpoint}`,
        dataToSend,
        config
      );

      console.log("Response:", res.data);

      // Store user data including role
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userRole", res.data.role);
      localStorage.setItem("userId", res.data._id);
      localStorage.setItem("userName", res.data.name);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("bio", res.data.bio);
      localStorage.setItem("profilePhoto", res.data.profilePhoto);
      localStorage.setItem("articles", JSON.stringify(res.data.articles));

      // Redirect based on role
      if (res.data.role === "admin") {
        navigate("/admin/dashboard");
        alert("Admin logged in successfully");
      } else {
        navigate("/author-page");
        alert(
          isLogin
            ? "Author logged in successfully"
            : "Author registered successfully"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Server error. Try again later.";
      setServerError(errorMessage);
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
        email: validateEmail(value) ? "" : "Invalid email format.",
      }));
    }

    if (name === "password") {
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(value)
          ? ""
          : "Weak password! Use at least 8 characters, a number, and a special character.",
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profilePhoto: file }));

      // Show image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
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
              {isLogin ? "Author Login" : "Author Sign Up"}
            </h2>

            {serverError && (
              <p className="text-red-500 text-sm text-center mb-4">
                {serverError}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Registration specific fields */}
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-100">
                      Name
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-100">
                      Short Bio (Optional)
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-300 text-black"
                      placeholder="Write a short bio"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-100">
                      Profile Picture (Optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full border-gray-300"
                    />
                    {previewImage && (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="mt-2 w-24 h-24 rounded-full object-cover"
                      />
                    )}
                  </div>
                </>
              )}

              {/* Common fields */}

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

              {/* Confirm Password for sign up */}
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
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                disabled={loading}
              >
                {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
              </button>
            </form>

            <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-200">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
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

export default AuthorSignUp;
