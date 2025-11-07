import { useState, useEffect, useCallback } from "react";

const API_URL =  "https://stock-control-dike.onrender.com/api"; 

export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchUser, setSearchUser] = useState("");
  const [error, setError] = useState(null);

  // 🔄 Fetch all users
  const fetchUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const res = await fetch(`${API_URL}/users`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch users");
      setUsers(data);
    } catch (err) {
      console.error("❌ fetchUsers error:", err);
      setError(err.message);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  // ➕ Create new user
  const handleCreateUser = async (userId, name, role, password) => {
    if (!userId || !name || !role || !password) {
      alert("All fields are required");
      return;
    }

    try {
      setLoadingUsers(true);
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          name,
          role,
          password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert("✅ User created successfully!");
      await fetchUsers();
    } catch (err) {
      alert("❌ Error: " + err.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  // 🗑️ Delete user
  const handleDeleteUser = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/users/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert("🗑️ User deleted");
      fetchUsers();
    } catch (err) {
      alert("❌ Error deleting user: " + err.message);
    }
  };

  // ✏️ Update user
  const handleUserUpdate = async (updatedUser) => {
    try {
      const res = await fetch(`${API_URL}/users/${updatedUser.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: updatedUser.name,
          role: updatedUser.role,
          password: updatedUser.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert("✅ User updated successfully!");
      fetchUsers();
    } catch (err) {
      alert("❌ Error updating user: " + err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    fetchUsers,
    handleCreateUser,
    handleDeleteUser,
    handleUserUpdate,
    searchUser,
    setSearchUser,
    loadingUsers,
    error,
  };
}
