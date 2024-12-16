import { useState } from "react";
import "../Styles/MyApp.css";
import { useNavigate } from "react-router-dom";
import { login } from "../Services/UserService";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    text: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      console.log("Login Successful:", response);
      setSuccess("Login Successful!");

      setTimeout(() => {
        navigate("/user-management");
      }, 1000);
    } catch (error) {
      console.error("Error during Login:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.description ||
        "Failed to Login. Please check your credentials.";
      setError(errorMessage);
      setTimeout(() => {
        setError(null);
      }, 3000); // Display the error for 3 seconds
    }
  };

  return (
    <section className="h-[100vh] bg-gradient-to-r from-yellow-400 via-red-500 to-orange-600 flex justify-center items-center">
      <div className="flex justify-center items-center flex-col">
        <div
          className="shadow-lg rounded-3xl flex flex-col bg-white bg-opacity-80 p-8 text-center h-[600px] w-[500px] gap-5"
        >
          <h2 className="font-bold text-3xl text-gray-900 mb-4">
            Welcome To Love Dating Site Admin Panel
          </h2>
          <p className="text-lg text-gray-600 mb-6">Please Enter Your Admin Credentials</p>
          
          {error && (
            <div className="text-red-600 mt-4" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="text-green-700 mt-4" role="alert">
              {success}
            </div>
          )}
          
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col justify-center items-center gap-5"
          >
            <input
              type="text"
              id="typeEmailX"
              className="focus:outline-none w-[80%] py-2 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 transition duration-300"
              name="text"
              value={formData.text}
              onChange={handleChange}
              placeholder="Enter Username"
              required
            />
            <input
              type={showPassword ? "text" : "password"}
              id="typePasswordX"
              className="focus:outline-none w-[80%] py-2 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-400 transition duration-300"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Password"
              required
            />
            
            <button
              className="text-gray-700 mt-2 hover:text-orange-500 transition duration-300"
              type="button"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <i className="fa-solid fa-eye-slash"></i>
              ) : (
                <i className="fa-solid fa-eye"></i>
              )}
            </button>

            <button
              className="bg-orange-500 text-white py-2 px-8 rounded-full font-bold hover:bg-orange-600 transition duration-300"
              type="submit"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;
