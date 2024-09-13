import { useState } from "react";
// import { login } from "../Services/Register";
import "../Styles/MyApp.css";
import { useNavigate } from "react-router-dom";
import {login} from "../Services/Services"

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
    console.log(name, value)
    setFormData({
      ...formData,
      [name]: value,
    });
    formData.email;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    console.log(name, value);
    // navigate("/blogs")
    try {
      const response = await login(formData);
      console.log("Login Successful:", response);
      setSuccess("Login Successful!");
      
      setTimeout(() => {
        navigate("/blogs");
      }, 1000);
    } catch (error) {
      console.error("Error during Login:", error);
      // Check if the error response contains a 'detail' or 'description' field
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.description ||
        "Failed to Login. Please check your credentials.";
      setError(errorMessage);
      setTimeout(() => {
        setError(null);
      }, 3000); // Display the error for 3 seconds
    }
  };

  return (
    <section className="h-[100vh] gradient-custom flex justify-center items-center">
      <div className="flex justify-center items-center flex-col">
        <div
          className="shadow-2xl rounded-xl flex flex-col bg-gray-900 text-white
         justify-center items-center p-5 text-center h-[600px] w-[500px] gap-5"
        >
          <h2 className="font-bold text-4xl">
            Welcome To Kolkata Escort 24 Admin Panel !
          </h2>
          <p className="mb-5 text-xl">Please Enter Your Admin Credentials !</p>
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
            className="w-[100%] flex flex-col justify-center items-center gap-3"
          >
            <input
              type="text"
              id="typeEmailX"
              className="focus:outline-none w-[70%] 
              text-black font-semibold py-2 px-2 rounded-2xl"
              name="text"
              value={formData.text}
              onChange={handleChange}
              placeholder="Enter text Here"
              required
            />
            <input
              type={showPassword ? "text" : "password"}
              id="typePasswordX"
              className="focus:outline-none w-[70%] 
              text-black font-semibold py-2 px-2 rounded-2xl"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Password"
              required
            />
            <button
              className="btn btn-outline-light btn-lg"
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
              className="font-bold py-2 px-8 border-[2px] rounded-xl text-xl"
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
