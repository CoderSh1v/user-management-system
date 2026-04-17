import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function UserDetail() {
    const { id } = useParams();
    const currentUser = JSON.parse(localStorage.getItem("user"));

    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [editData, setEditData] = useState({
        name: "",
        email: "",
        role: ""
    });
    const toggleStatus = async () => {
        try {
            const newStatus = user.status === "active" ? "inactive" : "active";

            await API.patch(`/user/${id}`, { status: newStatus });

            setUser(prev => ({ ...prev, status: newStatus }));

        } catch (err) {
            alert(err.response?.data?.message || "Error");
        }
    };

    useEffect(() => {
        API.get(`/user/${id}`)
            .then(res => {
                setUser(res.data.user);

                setEditData({
                    name: res.data.user.name,
                    email: res.data.user.email,
                    role: res.data.user.role
                });
            })
            .catch(err => alert(err.response?.data?.message || "Error"));
    }, [id]);

    const updateUser = async () => {
        try {
            await API.patch(`/user/${id}`, editData);

            alert("Updated");

        } catch (err) {
            alert(err.response?.data?.message || "Error");
        }
    };

    if (!user) return <div>Loading...</div>;

    const canEdit =
        currentUser &&
        (
            currentUser.role === "admin" ||
            (currentUser.role === "manager" && user.role !== "admin")
        );

    return (
        <div style={{ padding: "20px" }}>
            <button onClick={() => navigate(-1)}>
                ← Back
            </button>
            <h2>User Detail</h2>

            <p><b>Name:</b></p>
            <input
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                disabled={!canEdit}
            />

            <p><b>Email:</b></p>
            <input
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                disabled={!canEdit}
            />

            <p><b>Role:</b></p>
            <select
                value={editData.role}
                onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                disabled={!canEdit}
            >
                <option value="user">User</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
            </select>

            <br /><br />
            <p>
                <b>Status:</b>{" "}
                <span style={{
                    color: user.status === "active" ? "green" : "red",
                    fontWeight: "bold"
                }}>
                    {user.status === "active" ? "Active" : "Inactive"}
                </span>
            </p>

            {canEdit && (
                <button onClick={toggleStatus}>
                    {user.status === "active" ? "Deactivate" : "Activate"}
                </button>
            )}
            {canEdit && (
                <button onClick={updateUser}>
                    Save Changes
                </button>
            )}
        </div>
    );
}