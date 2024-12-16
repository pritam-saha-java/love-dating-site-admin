import React, { useState, useEffect } from "react";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../Services/UserService";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    balance: 0,
  });
  const [editing, setEditing] = useState(false);

  // Fetch all users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateUser(formData.id, formData);
      } else {
        await createUser(formData);
      }
      setFormData({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        balance: 0,
      });
      setEditing(false);
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleEdit = (user) => {
    setFormData(user);
    setEditing(true);
  };

  const handleDelete = async (username) => {
    try {
      await deleteUser(username);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <>
<nav className="navbar">
  <ul>
    <li>
      <a href="/user-management" target="_blank" rel="noopener noreferrer">User Management</a>
    </li>
    <li>
      <a href="/qr-code-management" target="_blank" rel="noopener noreferrer">QR Code Management</a>
    </li>
  </ul>
</nav>
    <div className="container mt-5">
      <h2 className="text-center mb-4">User Management</h2>
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          {editing ? "Edit User" : "Create New User"}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <input
                  type="text"
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <input
                  type="number"
                  name="balance"
                  className="form-control"
                  placeholder="Balance"
                  value={formData.balance}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-12 text-end">
                <button type="submit" className="btn btn-success">
                  {editing ? "Update User" : "Create User"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header bg-secondary text-white">User List</div>
        <div className="card-body">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Username</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Balance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.username}>
                  <td>{user.username}</td>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>₹{user.balance.toFixed(2)}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(user.username)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
};

export default UserManagement;
