import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import logo from "../../assets/logo.png";
import { Eye, EyeClosed } from "lucide-react";

const SignUp = () => {
  const [role, setRole] = useState("author");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
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
    setErrors({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const togglePasswordVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  const validateEmail = (email) =>
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);

  const validatePassword = (password) =>
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    );

  //const validatePassword = (password) => password.length >= 6;

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Common validations for both login and signup
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (!validatePassword(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters with a number and special character";
      isValid = false;
    }

    // Signup specific validations
    if (!isLogin && role === "author") {
      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
        isValid = false;
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Processing your request...");

    try {
      const endpoint = isLogin ? "login" : "register";
      let dataToSend;
      let config = {};

      if (isLogin) {
        dataToSend = {
          email: formData.email.trim(),
          password: formData.password.trim(),
          role: role,
        };
        config = {
          headers: { "Content-Type": "application/json" },
        };
      } else {
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

      // Role mismatch validation
      if (role === "author" && res.data.role !== "author") {
        throw new Error("Invalid credentials for selected role.");
      }

      if (role === "admin" && res.data.role !== "admin") {
        throw new Error("Invalid credentials for selected role.");
      }

      // Store user data in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userRole", res.data.role);
      localStorage.setItem("userId", res.data._id);
      localStorage.setItem("userName", res.data.name);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("bio", res.data.bio);
      localStorage.setItem("profilePhoto", res.data.profilePhoto);
      localStorage.setItem("articles", JSON.stringify(res.data.articles));

      // Show success toast
      toast.dismiss(loadingToast);
      toast.success(
        isLogin
          ? `Logged in as ${res.data.role} successfully!`
          : "Account created successfully!",
        { duration: 3000 }
      );

      // Redirect based on role
      setTimeout(() => {
        if (res.data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/author-page");
        }
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "An error occurred. Please try again.";

      toast.dismiss(loadingToast);
      toast.error(errorMessage, { duration: 4000 });
      setServerError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Additional validation for specific fields
    if (name === "email" && value && !validateEmail(value)) {
      setErrors((prev) => ({
        ...prev,
        email: "Invalid email format",
      }));
    }

    if (name === "password" && value && !validatePassword(value)) {
      setErrors((prev) => ({
        ...prev,
        password:
          "Weak password! Use at least 8 characters, a number, and a special character.",
      }));
    }

    if (name === "confirmPassword" && value && value !== formData.password) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match.",
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.match("image.*")) {
        toast.error("Please select an image file");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        toast.error("Image size should be less than 2MB");
        return;
      }

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
          <a
            href="/"
            className="transition-opacity duration-300 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            <img
              src={logo}
              alt="Logo"
              className="h-9 md:h-14 w-auto transition-transform hover:scale-105 duration-300"
            />
          </a>
        </div>
      </nav>

      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-custom-dark">
        <div className="flex items-center justify-center flex-grow px-4 py-8">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg dark:bg-custom-dark border border-gray-200 dark:border-gray-700">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
              {isLogin
                ? `${role.charAt(0).toUpperCase() + role.slice(1)} Login`
                : "Author Sign Up"}
            </h2>

            {serverError && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded text-sm text-center">
                {serverError}
              </div>
            )}

            {!(role === "author" && !isLogin) && (
              <div className="mb-6 text-center">
                <label className="text-gray-700 dark:text-gray-100 font-semibold mr-4">
                  Login as:
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="border rounded px-4 py-2 text-black dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="author">Author</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Registration specific fields */}
              {!isLogin && role === "author" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-100">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-black dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your full name"
                      required
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-100">
                      Short Bio (Optional)
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-black dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
                      placeholder="Write a short bio"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-100">
                      Profile Picture (Optional)
                    </label>
                    <div className="flex items-center space-x-4">
                      <label className="cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 transition">
                        <span className="text-sm">Choose Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                      {previewImage && (
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-600 shadow"
                        />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Max 2MB. JPG, PNG, or GIF.
                    </p>
                  </div>
                </>
              )}

              {/* Common fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-100">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-black dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your email"
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-100">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type={isVisible ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-black dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-8 text-gray-500 dark:text-gray-400 focus:outline-none"
                >
                  {isVisible ? (
                    <Eye className="h-5 w-5" strokeWidth={1.5} />
                  ) : (
                    <EyeClosed className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Confirm Password for sign up */}
              {!isLogin && role === "author" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-100">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-black dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Confirm your password"
                    required
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-lg transition ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : isLogin ? (
                  "Login"
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            {role === "author" && (
              <p className="text-center text-sm mt-4 text-gray-600 dark:text-gray-300">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={toggleAuthMode}
                  className="text-blue-500 hover:underline font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                >
                  {isLogin ? "Sign Up" : "Login"}
                </button>
              </p>
            )}
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
