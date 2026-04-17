import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
    const [users, setUsers] = useState([]);
    const [totalPages, setTotalPages] = useState(1);

    const currentUser = JSON.parse(localStorage.getItem("user"));

    const [page, setPage] = useState(1);
    const [roleFilter, setRoleFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        API.get("/user", {
            params: {
                page,
                role: roleFilter,
                status: statusFilter,
                search
            }
        })
            .then(res => {
                setUsers(res.data.users);
                setTotalPages(res.data.totalPages);
            })
            .catch(err => alert(err.response?.data?.message || "Error"));
    }, [page, roleFilter, statusFilter, search]);

    const toggleStatus = async (user) => {
        try {
            const newStatus = user.status === "active" ? "inactive" : "active";

            await API.patch(`/user/${user._id}`, {
                status: newStatus
            });

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
            <h2>Users</h2>

            {/* Filters */}
            <input
                placeholder="Search"
                onChange={(e) => setSearch(e.target.value)}
            />

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

            {/* Users */}
            {users.map(u => (
                <div key={u._id} style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    marginBottom: "10px"
                }}>

                    {/* Top Row */}
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div>
                            <p><b>Name:</b> {u.name}</p>
                            <p><b>Email:</b> {u.email}</p>
                            <p><b>Role:</b> {u.role}</p>
                        </div>

                        {/* Button */}
                        {(currentUser?.role === "admin" || currentUser?.role === "manager")
                            && u._id !== currentUser._id
                            && !(currentUser.role === "manager" && u.role === "admin") && (
                                <button
                                    style={{
                                        padding: "5px 10px",
                                        fontSize: "12px",
                                        height: "fit-content",
                                        cursor: "pointer"
                                    }}
                                    onClick={() => toggleStatus(u)}
                                >
                                    {u.status === "active" ? "Deactivate" : "Activate"}
                                </button>
                            )}
                    </div>

                    {/* Status */}
                    <p>
                        <b>Status:</b>{" "}
                        <span style={{ color: u.status === "active" ? "green" : "red" }}>
                            {u.status}
                        </span>
                    </p>

                    {/* Audit */}
                    {u.createdBy && (
                        <p><b>Created By:</b> {u.createdBy.name}</p>
                    )}

                    {u.updatedBy && (
                        <p><b>Updated By:</b> {u.updatedBy.name}</p>
                    )}

                    <p><b>Created At:</b> {new Date(u.createdAt).toLocaleDateString()}</p>

                    {u._id === currentUser?._id && (
                        <p style={{ color: "gray" }}>You</p>
                    )}
                </div>
            ))}

            {/* Pagination */}
            <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(p - 1, 1))}
            >
                Prev
            </button>

            <span> Page {page} of {totalPages} </span>

            <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
            >
                Next
            </button>
        </div>
    );
}