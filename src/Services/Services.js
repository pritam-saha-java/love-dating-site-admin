import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const login = async (formData) => {
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

const getAllLocation = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/admin/locations`);
    return response.data;
  } catch (error) {
    console.error("Error during getting locations!", error);
    throw error;
  }
};

const submitBlogs = async (formData) => {
  try {
    // Make sure to pass FormData directly to axios without setting Content-Type header
    // Axios automatically sets the right headers for FormData
    const response = await axios.post(
      `${BASE_URL}/admin/blog-create`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Ensures that files are handled correctly
        },
      }
    );
    console.log(response);
  } catch (error) {
    console.log("Error during submitting", error);
    throw error;
  }
};

const getAllBlogs = async () =>{
    try{
        const response = await axios.get(`${BASE_URL}/admin/blogs`);
        return response.data;
    }catch(error){
        console.error("Error during getting blogs!", error);
        throw error;
    }
}


const deleteBlogs = async (id) =>{
    console.log(id);
    try{
        const response = await axios.delete(`${BASE_URL}/admin/blog/${id}`);
        console.log(response.data);
        // return response.data;
    }catch(error){
        console.log("Error during getting blogs!", error);
        throw error;
    }
}

export { login, getAllLocation, submitBlogs, getAllBlogs, deleteBlogs };
