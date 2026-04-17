import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
    const [users, setUsers] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        API.get("/user")
            .then(res => setUsers(res.data.users))
            .catch(err => alert(err.response?.data?.message || "Something went wrong"));
    }, []);

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

            {users.map(u => (
                <div key={u._id} style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    marginBottom: "10px"
                }}>
                    <p><b>Name:</b> {u.name}</p>
                    <p><b>Email:</b> {u.email}</p>
                    <p><b>Role:</b> {u.role}</p>

                    <p>
                        <b>Status:</b>{" "}
                        <span style={{ color: u.status === "active" ? "green" : "red" }}>
                            {u.status}
                        </span>
                    </p>

                    {currentUser?.role === "admin" && u._id !== currentUser._id && (
                        <button onClick={() => toggleStatus(u)}>
                            {u.status === "active" ? "Deactivate" : "Activate"}
                        </button>
                    )}

                    {u._id === currentUser?._id && (
                        <p style={{ color: "gray" }}>You</p>
                    )}
                </div>
            ))}
        </div>
    );
}