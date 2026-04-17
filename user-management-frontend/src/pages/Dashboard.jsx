import { useEffect, useState } from "react";
import API from "../services/api";
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
                setTotalPages(res.data.totalPages);
            })
            .catch(err => alert(err.response?.data?.message || "Error"));
    };

    useEffect(() => {
        fetchUsers();
    }, [page, roleFilter, statusFilter, search]);

    const toggleStatus = async (user) => {
        try {
            const newStatus = user.status === "active" ? "inactive" : "active";

            await API.patch(`/user/${user._id}`, { status: newStatus });

            setUsers(prev =>
                prev.map(u =>
                    u._id === user._id ? { ...u, status: newStatus } : u
                )
            );

        } catch (err) {
            alert(err.response?.data?.message || "Error");
        }
    };

    return (
        <div style={{ padding: "20px" }}>

            {currentUser?.role === "admin" && (
                <CreateUserForm refreshUsers={fetchUsers} />
            )}

            <h2>Users</h2>

            <input placeholder="Search" onChange={(e) => setSearch(e.target.value)} />

            <select onChange={(e) => setRoleFilter(e.target.value)}>
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="user">User</option>
            </select>

            <select onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
            </select>

            {users.map(u => (
                <UserCard 
                    key={u._id}
                    u={u}
                    currentUser={currentUser}
                    toggleStatus={toggleStatus}
                />
            ))}

            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
            <span> Page {page} of {totalPages} </span>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
    );
}