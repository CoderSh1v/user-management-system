import { useEffect, useState } from "react";
import API from "../services/api";

import TopBar from "../components/TopBar";
import Filters from "../components/Filters";
import Pagination from "../components/Pagination";
import CreateUserForm from "../components/CreateUserForm";
import UserCard from "../components/UserCard";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  const fetchUsers = () => {
    API.get("/user", {
      params: { page, role: roleFilter, status: statusFilter, search }
    })
      .then(res => {
        setUsers(res.data.users);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch(err => alert(err.response?.data?.message || "Error"));
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter, statusFilter, search]);

  // reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [roleFilter, statusFilter, search]);

  return (
    <div style={{
      padding: "20px",
      maxWidth: "800px",
      margin: "auto"
    }}>

      <TopBar />

      {currentUser?.role === "admin" && (
        <CreateUserForm refreshUsers={fetchUsers} />
      )}

      <h2>Users</h2>

      <Filters
        setSearch={setSearch}
        setRoleFilter={setRoleFilter}
        setStatusFilter={setStatusFilter}
      />

      {users.length === 0 && (
        <p>No users found</p>
      )}

      {users.map(u => (
        <UserCard
          key={u._id}
          u={u}
          currentUser={currentUser}
        />
      ))}

      {users.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          setPage={setPage}
        />
      )}
    </div>
  );
}