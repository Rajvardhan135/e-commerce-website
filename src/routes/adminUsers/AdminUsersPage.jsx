'use client';

import React, { useState, useEffect } from "react";
import { db } from "../../utils/firebase/firebase.utils";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import "./AdminUsers.styles.css";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [saving, setSaving] = useState(false);
  const [newUser, setNewUser] = useState({ displayName: "", email: "", photoURL: "" });
  const [confirmModal, setConfirmModal] = useState({ show: false, userId: null });

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersCol = collection(db, "users");
      const usersSnap = await getDocs(usersCol);
      const usersList = usersSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle edit changes
  const handleChange = (e) => {
    setEditingData({ ...editingData, [e.target.name]: e.target.value });
  };

  // Save user edits
  const handleSave = async (userId) => {
    setSaving(true);
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, editingData);
      setEditingUserId(null);
      setEditingData({});
      await fetchUsers();
    } catch (err) {
      console.error("Error saving user:", err);
    } finally {
      setSaving(false);
    }
  };

  // Block/Unblock user
  const handleBlockToggle = async (user) => {
    try {
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, { blocked: !user.blocked });
      await fetchUsers();
    } catch (err) {
      console.error("Error toggling block:", err);
    }
  };

  // Add a new user
  const handleAddUser = async () => {
    if (!newUser.displayName || !newUser.email) {
      alert("Name and Email are required!");
      return;
    }
    try {
      const usersCol = collection(db, "users");
      await addDoc(usersCol, {
        displayName: newUser.displayName,
        email: newUser.email,
        photoURL: newUser.photoURL || "",
        blocked: false,
        createdAt: new Date(),
      });
      setNewUser({ displayName: "", email: "", photoURL: "" });
      await fetchUsers();
    } catch (err) {
      console.error("Error adding user:", err);
    }
  };

  // Delete user (with custom modal)
  const handleDeleteUser = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      await deleteDoc(userRef);
      setConfirmModal({ show: false, userId: null });
      await fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  if (loading) return <div className="loader">Loading users...</div>;

  return (
    <div className="admin-container">
      <h2>Admin - Manage Users</h2>

      {/* Add New User Section */}
      <div className="add-user-form">
        <input
          type="text"
          placeholder="Name"
          value={newUser.displayName}
          onChange={(e) => setNewUser({ ...newUser, displayName: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Photo URL"
          value={newUser.photoURL}
          onChange={(e) => setNewUser({ ...newUser, photoURL: e.target.value })}
        />
        <button onClick={handleAddUser} className="add-btn">
          Add User
        </button>
      </div>

      {/* Users Table */}
      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Photo URL</th>
            <th>Blocked</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className={user.blocked ? "blocked-user" : ""}>
              <td>
                {editingUserId === user.id ? (
                  <input
                    type="text"
                    name="displayName"
                    value={editingData.displayName}
                    onChange={handleChange}
                  />
                ) : (
                  user.displayName
                )}
              </td>
              <td>{user.email}</td>
              <td>
                {editingUserId === user.id ? (
                  <input
                    type="text"
                    name="photoURL"
                    value={editingData.photoURL}
                    onChange={handleChange}
                  />
                ) : user.photoURL ? (
                  <a href={user.photoURL} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                ) : (
                  "N/A"
                )}
              </td>
              <td>{user.blocked ? "Yes" : "No"}</td>
              <td>
                {editingUserId === user.id ? (
                  <>
                    <button
                      className="save-btn"
                      onClick={() => handleSave(user.id)}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => setEditingUserId(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="edit-btn"
                      onClick={() => {
                        setEditingUserId(user.id);
                        setEditingData({
                          displayName: user.displayName,
                          photoURL: user.photoURL,
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="block-btn"
                      onClick={() => handleBlockToggle(user)}
                    >
                      {user.blocked ? "Unblock" : "Block"}
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() =>
                        setConfirmModal({ show: true, userId: user.id })
                      }
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {confirmModal.show && (
        <div className="confirm-modal">
          <div className="modal-content">
            <p>Are you sure you want to delete this user?</p>
            <div className="modal-actions">
              <button
                className="confirm-btn"
                onClick={() => handleDeleteUser(confirmModal.userId)}
              >
                Yes, Delete
              </button>
              <button
                className="cancel-btn"
                onClick={() => setConfirmModal({ show: false, userId: null })}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
