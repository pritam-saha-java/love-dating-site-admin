import axios from "axios";

// Set the base URL from environment variables
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const login = async (formData) => {
  const { password, text } = formData;
  try {
    const response = await axios.post(
      `${BASE_URL}/admin/login?username=${text}&password=${password}`
    );
    const loginTime = new Date().getTime(); // current time in milliseconds
    localStorage.setItem("loginTime", loginTime);
    return response.data;
  } catch (error) {
    console.error("Error during login!", error);
    throw error;
  }
};

// API for User Management
export const getAllUsers = async () => {
  return axios.get(`${BASE_URL}/admin/get-all-users`);
};

export const createUser = async (userData) => {
  return axios.post(`${BASE_URL}/admin/create-user`, userData);
};

export const updateUser = async (username, userData) => {
  return axios.put(`${BASE_URL}/admin/update-user/${username}`, userData);
};

export const deleteUser = async (username) => {
  return axios.delete(`${BASE_URL}/admin/delete-user/${username}`);
};

export const getUserByUsername = async (username) => {
  return axios.get(`${BASE_URL}/admin/get-user/${username}`);
};
