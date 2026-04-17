import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Profile() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [editData, setEditData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const logout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    useEffect(() => {
        API.get("/user/me")
            .then(res => {
                setUser(res.data.user);

                setEditData({
                    name: res.data.user.name,
                    email: res.data.user.email,
                    password: ""
                });
            })
            .catch(err => alert(err.response?.data?.message || "Error"));
    }, []);;
    const updateProfile = async () => {
        try {
            await API.patch("/user/me", editData);
            alert("Profile updated");
        } catch (err) {
            alert(err.response?.data?.message || "Error");
        }
    };
    if (!user) return <div>Loading...</div>;

    return (
        <div style={{ padding: "20px" }}>

            {/* Top Bar */}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button onClick={() => navigate(-1)}>← Back</button>
                <button onClick={logout}>Logout</button>
            </div>

            <p><b>Name:</b></p>
            <input
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            />

            <p><b>Email:</b></p>
            <input
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
            />

            <p><b>Password:</b></p>
            <input
                type="password"
                placeholder="New password (optional)"
                onChange={(e) => setEditData({ ...editData, password: e.target.value })}
            />

            <br /><br />

            <button onClick={updateProfile}>
                Save Changes
            </button>

        </div>
    );
}