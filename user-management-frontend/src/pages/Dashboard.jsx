import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
    const [users, setUsers] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        API.get("/user")
            .then(res => setUsers(res.data.users))
            .catch(err => console.log(err));
    }, []);

    const deleteUser = (id) => {
        if (!window.confirm("Are you sure?")) return;

        API.delete(`/user/${id}`)
            .then(() => {
                setUsers(prev => prev.filter(u => u._id !== id));
            })
            .catch(err => console.log(err));
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
                    <p><b>Role:</b> {u.role}</p>

                    {currentUser?.role === "admin" && (
                        <button onClick={() => deleteUser(u._id)}>
                            Delete
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}