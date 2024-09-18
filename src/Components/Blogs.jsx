import { useState, useEffect } from "react";
import { TbBrandBlogger } from "react-icons/tb";
import { FaRegComment } from "react-icons/fa6";
import { FaImage } from "react-icons/fa";
import { ImBin } from "react-icons/im";
import MyBlogs from "../Styles/MyBlogs.module.css";
import Comments from "../Components/Comments";
import { useNavigate } from "react-router-dom";
import {
  deleteBlogs,
  getAllBlogs,
  getAllLocation,
  submitBlogs,
  getBlogsForEdit,
  updateBlogs,
} from "../Services/Services";

import Logo from "../../public/KolkatEscort24.png";

function Blogs() {
  const navigate = useNavigate();
  const [isBlogsOpen, setIsBlogsOpen] = useState(true);
  const [isImgExist, setIsImgExist] = useState(null);
  const [error, setError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [formData, setFormData] = useState({
    blogId: "",
    description: "",
    title: "",
    images: "",
    locationName: "",
    locationId: "",
    locationList: [],
    bloglist: [],
    url: "",
    isEdit: false,
  });

  //Checking whether the user is logged in or not
  useEffect(() => {
    const loginTime = localStorage.getItem("loginTime");
    if (!loginTime) {
      navigate("/");
    } else {
      // Check time expiration (e.g., 24 hours)
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - loginTime;
      const maxSessionTime = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
      if (timeDiff > maxSessionTime) {
        localStorage.removeItem("loginTime"); // clear localStorage
        navigate("/"); // redirect to login page
      }
    }
  }, []);

  //Getting all the Blogs in there;
  useEffect(() => {
    const getBlogs = async () => {
      try {
        const response = await getAllBlogs();
        setFormData((prevData) => ({
          ...prevData,
          bloglist: response,
        }));
      } catch (error) {
        console.log("error:" + error);
      }
    };
    getBlogs();
  }, []);

  const blogsPerPage = 15;

  let indexOfLastBlog = currentPage * blogsPerPage;
  let indexofFirstBlog = indexOfLastBlog - blogsPerPage;
  const blogsToDisplay =
    filteredBlogs.length > 0 ? filteredBlogs : formData.bloglist;
  const currentBlogs = blogsToDisplay.slice(indexofFirstBlog, indexOfLastBlog);
  let totalPages = Math.ceil(blogsToDisplay.length / blogsPerPage) || 1;

  useEffect(() => {
    totalPages = Math.ceil(
      (filteredBlogs.length > 0
        ? filteredBlogs.length
        : formData.bloglist.length) / blogsPerPage
    );
  }, [filteredBlogs, formData.bloglist]);

  const handleFilter = (e) => {
    e.preventDefault();
    const { value } = e.target;
    const filteredData = formData.bloglist.filter(
      (item) => item.locationName === value
    );
    setFilteredBlogs(filteredData);
  };

  //Getting all the location in there;

  useEffect(() => {
    const locationList = async () => {
      try {
        const response = await getAllLocation();
        setFormData((prevData) => ({
          ...prevData,
          locationList: response,
        }));
      } catch (error) {
        console.log("error:" + error);
      }
    };
    locationList();
  }, []);

  // Handling form data changes
  const handleChange = (e) => {
    const { value, name, files } = e.target;

    if (name === "title") {
      if (value.split(" ").length > 5000) {
        return setTitleError("Title should not exceed 5000 characters");
      } else {
        setTitleError("");
      }
    }

    if (name === "description") {
      if (value.split(" ").length > 10000) {
        return setDescriptionError(
          "Description should not exceed 10000 characters"
        );
      } else {
        setDescriptionError("");
      }
    }

    if (name === "images") {
      if (files.length > 0) {
        const file = files[0];
        const imgUrl = URL.createObjectURL(file);
        setIsImgExist(imgUrl);
        setError("");
        setFormData((prevData) => ({
          ...prevData,
          images: file,
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handling form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.images === "") {
      return setError("Choose One Image");
    }

    if (formData.isEdit) {
      const updatedForm = {
        title: formData.title,
        id: formData.blogId,
        content: formData.description,
        locationName: formData.locationName,
        visitNowLink: formData.url,
      };
      try {
        const response = await updateBlogs(formData.blogId, updatedForm);
        console.log(response);
        window.location.reload();
      } catch (error) {
        console.log("Error Occurred", error);
      }
    } else {
      const updatedForm = {
        title: formData.title,
        content: formData.description,
        locationId: formData.locationId,
        image: formData.images,
        visitNowLink: formData.url,
      };
      try {
        const response = await submitBlogs(updatedForm);
        console.log(response);
        window.location.reload();
      } catch (error) {
        console.log("Error Occurred", error);
      }
    }
  };

  // Handling image removal
  const handleImageRemove = () => {
    setIsImgExist(null);
    setFormData((prevData) => ({
      ...prevData,
      images: "",
    }));
    document.getElementById("image").value = ""; // Clear the file input field
  };

  // Handling blog deletion (dummy function)
  const handleDelete = () => {
    setIsImgExist(null);
    setFormData({
      description: "",
      title: "",
      images: "",
      location: "",
      url: "",
    });
    window.location.reload();
  };

  //for Logging Out
  const handleLogout = () => {
    localStorage.removeItem("loginTime"); // clear localStorage
    navigate("/"); // redirect to login page
  };

  const handleBlogDelete = async (id) => {
    try {
      await deleteBlogs(id);
      window.location.reload();
    } catch (error) {
      console.log("error is here", error);
    }
  };

  //filter Html Content
  const filterHtmlContent = (htmlContent) => {
    return htmlContent
      .replace(/<p><br\s*\/?><\/p>/g, "")
      .replace(/<p>&nbsp;<\/p>/g, "");
  };

  // handleing Blogs Edit Section

  const handleBlogLike = async (id) => {
    try {
      const response = await getBlogsForEdit(id); // Ensure that this returns the correct response structure
      if (response) {
        setIsImgExist(response.imgUrl);
        setFormData((prevState) => ({
          ...prevState, // Spread the previous form data to retain existing values
          title: response.title || "", // Provide fallback values in case of undefined data
          description: response.content || "",
          locationName: response.locationName || "",
          images: response.imageUrl || [],
          url: response.visitNowLink || "",
          blogId: response.id || "",
          isEdit: true,
        }));
      } else {
        console.log("Invalid response data");
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  return (
    <div className="w-[100vw] flex flex-row min-h-[100vh] relative">
      {/* Exit Button */}
      <button
        className={`${MyBlogs.Btn} absolute top-2 right-10`}
        onClick={handleLogout}
      >
        <div className={`${MyBlogs.sign}`}>
          <svg viewBox="0 0 512 512">
            <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
          </svg>
        </div>

        <div className={`${MyBlogs.text}`}>Logout</div>
      </button>

      {/* Sidebar */}
      <div className="basis-[20%] flex items-center flex-col">
        <div
          style={{
            borderBottomRightRadius: "69px",
            borderTopLeftRadius: "69px",
          }}
          className="pt-3 text-xl font-bold py-[1.6rem] px-2 w-[100%] text-center bg-slate-100 rounded-xl"
        >
          <span className="text-[#6F7EFF] pe-3 flex justify-center items-center">
            <img src={Logo} alt="" className="h-[50px] w-[50px]" />
            KolKataEscort24 Admin
          </span>
        </div>

        <div className="flex flex-col justify-center items-center w-[100%]">
          <h2
            className={`flex rounded-xl flex-row justify-center items-center text-2xl py-4 w-[100%] font-bold hover:text-[#6F7EFF] cursor-pointer`}
            onClick={() => setIsBlogsOpen(true)}
          >
            <TbBrandBlogger className="text-3xl me-[2.2rem]" />
            <span className="pe-10">Blogs</span>
          </h2>
          <h2
            className={`flex rounded-xl flex-row justify-center items-center text-2xl py-4 w-[100%] font-bold hover:text-[#6F7EFF] gap-4 cursor-pointer`}
            onClick={() => setIsBlogsOpen(false)}
          >
            <FaRegComment className="text-3xl" />
            <span>Comments</span>
          </h2>
        </div>
      </div>
      {/* Main Content */}
      <div className="basis-3/4 flex-grow-[2] flex items-center flex-col gap-3">
        <div
          style={{
            borderBottomRightRadius: "46px",
            borderBottomLeftRadius: "46px",
          }}
          className="bg-[#6F7EFF] pt-3 text-2xl uppercase font-bold py-5 px-2 w-[100%] text-center text-white"
        >
          {isBlogsOpen ? "Blogs." : "Comments"}
        </div>

        <div className="h-[95vh] w-[90%] py-3 px-3">
          {isBlogsOpen ? (
            <>
              {/* Form */}
              <form
                className="h-[fit] w-[100%] shadow-2xl rounded-2xl flex flex-row py-4 px-4"
                onSubmit={handleSubmit}
              >
                {/* Image Upload */}
                <label
                  className={`basis-[30%] flex flex-col 
                  justify-center items-center ${
                    formData.isEdit ? "h-[300px]" : "h-[fit]"
                  }
                  rounded-2xl shadow-md cursor-pointer`}
                  htmlFor="image"
                >
                  {isImgExist ? (
                    <>
                      <div className="relative">
                        <img
                          className="h-[100%] 
                          rounded-xl"
                          src={isImgExist}
                          alt="Selected"
                        />
                        <div
                          className="absolute top-[-5px] right-[-10px] flex items-center 
                        px-2 bg-red-700 text-white cursor-pointer rounded-full"
                          onClick={handleImageRemove}
                        >
                          X
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {formData.images.length > 0 ? (
                        <img
                          className="w-[auto] h-[100%] rounded-xl py-2"
                          src={formData.images}
                          alt="Selected"
                        />
                      ) : (
                        <>
                          <FaImage className="text-5xl" />
                          <h2 className="text-xl mt-4">Add Image</h2>
                        </>
                      )}

                      <p className="text-red-500">{error}</p>
                      <input
                        type="file"
                        id="image"
                        name="images"
                        accept=".jpg, .png, .jpeg"
                        onChange={handleChange}
                        hidden
                        disabled={formData.isEdit} //Disabled during Edit
                      />
                    </>
                  )}
                </label>

                {/* Text Fields */}
                <div
                  className="h-[fit] basis-[70%] flex-grow-2 flex flex-col 
                justify-center items-center rounded-2xl px-3 py-2"
                >
                  <input
                    className="w-[100%] h-[30%] ps-3 focus:outline-none focus:font-bold"
                    type="text"
                    name="title"
                    id="title"
                    placeholder={
                      titleError ? "Error: " + titleError : "Add title Here..."
                    }
                    onChange={handleChange}
                    value={formData.title}
                    required
                  />
                  <textarea
                    className="w-[100%] h-[60%] ps-3 py-3 text-sm focus:outline-none focus:font-medium"
                    name="description"
                    id="description"
                    rows={8}
                    placeholder={
                      descriptionError
                        ? "Error: " + descriptionError
                        : "Add Content here..."
                    }
                    onChange={handleChange}
                    value={formData.description}
                    required
                  ></textarea>

                  {/* Additional Fields */}
                  <div className="w-[100%] h-[20%] flex flex-row justify-between items-center gap-2">
                    {/* Location Selection Tags */}
                    <select
                      className="py-1 px-4 rounded-full border border-spacing-1"
                      name="locationId"
                      id="locationId"
                      onChange={handleChange}
                      value={formData.locationId}
                      required
                      disabled={
                        formData.locationList.length === 0 || formData.isEdit
                      }
                    >
                      {formData.isEdit ? (
                        <option value="" disabled>
                          {formData.locationName}
                        </option>
                      ) : (
                        <option value="" disabled>
                          {formData.locationList.length === 0
                            ? "Loading locations..."
                            : "Select a location"}
                        </option>
                      )}
                      {formData?.locationList?.map((location) => {
                        return (
                          <option key={location.id} value={location.id}>
                            {location.name}
                          </option>
                        );
                      })}
                    </select>

                    <input
                      className="flex-grow-2 border px-3 w-[50%] py-2 rounded-full"
                      placeholder="Add Your Url"
                      type="text"
                      name="url"
                      id="url"
                      value={formData.url}
                      onChange={handleChange}
                      required
                    />
                    <div className="flex flex-row items-center gap-3">
                      <button
                        className="mt-3 px-4 py-1 rounded-full hover:scale-105 bg-red-500 text-white font-bold shadow-xl"
                        onClick={handleDelete}
                      >
                        Clear
                      </button>
                      <button
                        type="submit"
                        className="mt-3 px-4 py-1 rounded-full hover:scale-105 bg-blue-500 text-white font-bold shadow-xl"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </form>

              <div className="flex flex-col gap-1 mt-4 h-[50vh] w-[100%] px-3">
                {/* Blog List (Placeholder) */}
                <div
                  className="flex flex-col flex-nowrap items-center py-2
                gap-2 h-fit overflow-scroll w-[100%] mt-4 bg-transparent pb-12"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {formData.bloglist ? (
                    <>
                      {currentBlogs.map((blog) => (
                        <div
                          key={blog.id}
                          className="min-h-[20vh] w-[100%] shadow-md 
                            rounded-2xl flex flex-row py-4 px-4"
                        >
                          <div className="basis-[30%] w-[100%] flex flex-col justify-center items-center">
                            <div className="w-[70%] h-[100%] rounded-xl">
                              <img
                                className="w-[100%] h-[100%] object-contain"
                                src={blog.imageUrl}
                                alt="Blog Image"
                              />
                            </div>
                          </div>
                          <div
                            className="basis-[70%] w-[100%] flex flex-col gap-1
                            justify-start items-start relative"
                          >
                            <h2
                              className="text-[1rem] font-bold
                            min-h-[1.5rem] max-h-[3rem] w-[100%] overflow-hidden"
                            >
                              {blog?.title}
                            </h2>
                            <div className="text-[0.8rem] min-h-[5rem] max-h-[5rem] overflow-hidden">
                              <p
                                dangerouslySetInnerHTML={{
                                  __html: filterHtmlContent(blog?.content),
                                }}
                              />
                              ...
                            </div>
                            <div className="w-[100%] flex justify-between items-center absolute bottom-0">
                              <div
                                className="mt-3 px-2 py-1 rounded-full border 
                              border-dotted border-gray-600 font-semibold text-[0.8rem]"
                              >
                                {blog.locationName}
                              </div>
                              <a
                                className="text-[0.6rem] mt-3 font-bold py-2 px-2 
                              rounded-md bg-blue-500 text-white cursor-pointer"
                                href={`${blog.visitNowLink}`}
                              >
                                {blog.visitNowLink}
                              </a>

                              <div className="flex gap-2 w-[fit-content]">
                                <button
                                  className={`${MyBlogs.Icons}`}
                                  onClick={() => handleBlogLike(blog.id)}
                                >
                                  <svg
                                    className="svg-icon"
                                    fill="none"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g
                                      stroke="#a649da"
                                      strokeLinecap="round"
                                      strokeWidth="2"
                                    >
                                      <path d="m20 20h-16"></path>
                                      <path
                                        clipRule="evenodd"
                                        d="m14.5858 4.41422c.781-.78105 2.0474-.78105 2.8284 0 .7811.78105.7811 2.04738 0 2.82843l-8.28322 8.28325-3.03046.202.20203-3.0304z"
                                        fillRule="evenodd"
                                      ></path>
                                    </g>
                                  </svg>
                                  <span className={`${MyBlogs.label}`}>
                                    Edit
                                  </span>
                                </button>
                                <button
                                  onClick={() => handleBlogDelete(blog.id)}
                                  className=" mt-5 px-2 py-2 rounded-full bg-red-600
                                text-white shadow-xl hover:scale-125"
                                >
                                  <ImBin classNameName="text-sm" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    [...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="min-h-[15vh] w-[100%] shadow-md 
                      rounded-2xl flex flex-row py-4 px-4"
                        style={{ boxShadow: "0px 0px 22px #0000001a" }}
                      ></div>
                    ))
                  )}
                </div>

                {/* Pagination */}
                <div
                  className="container h-[fit-content] flex 
                flex-wrap items-center fixed bottom-0 right-0 py-3
                justify-center gap-1 my-3 bg-white w-[100%]"
                >
                  <ul className="list-none flex space-x-2">
                    {currentPage === 1 ? (
                      ""
                    ) : (
                      <li
                        className={`px-[10px] py-[10px] cursor-pointer border border-[#ddd] text-bold bg-[#007bff]
                      text-white hover:bg-[#f0f0f0] hover:text-black rounded-lg`}
                        onClick={() => setCurrentPage(currentPage - 1)}
                      >
                        Prev
                      </li>
                    )}
                    <li
                      className={`px-[20px] py-[10px] cursor-pointer border border-[#ddd] font-bold
                      active:bg-[#007bff] active:text-white hover:bg-[#f0f0f0] rounded-lg`}
                    >
                      {currentPage}
                    </li>
                    {currentPage >= totalPages ? (
                      ""
                    ) : (
                      <li
                        className={`px-[10px] py-[10px] cursor-pointer border border-[#ddd] text-bold bg-[#007bff]
                        text-white hover:bg-[#f0f0f0] hover:text-black rounded-lg`}
                        onClick={() => setCurrentPage(currentPage + 1)}
                      >
                        Next
                      </li>
                    )}
                    <li
                      className={`px-[10px] py-[10px] cursor-pointer border border-[#ddd] text-bold bg-[#007bff]
                      text-white hover:bg-[#f0f0f0] hover:text-black rounded-lg font-extrabold`}
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </li>
                    <li
                      className={`px-[10px] py-[10px] cursor-pointer border border-[#ddd] text-bold bg-[#007bff]
                      text-white hover:bg-[#f0f0f0] hover:text-black rounded-lg font-extrabold`}
                      onClick={() => setCurrentPage(1)}
                    >
                      001
                    </li>
                  </ul>

                  {/* Fitlering Locations Posts */}
                  <select
                    className="py-1 px-8 rounded-lg border-gray-500
                    border-spacing-1 border-[2px] ms-7"
                    name="locationId"
                    id="locationId"
                    onChange={handleFilter}
                    required
                    disabled={formData.locationList.length === 0}
                  >
                    <option value="" className="font-extrabold">
                      {formData.locationList.length === 0
                        ? "Loading locations..."
                        : "All Locations"}
                    </option>
                    {formData?.locationList?.map((location) => {
                      return (
                        <option key={location.id} value={location.name}>
                          {location.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </>
          ) : (
            <Comments />
          )}
        </div>
      </div>
    </div>
  );
}

export default Blogs;
