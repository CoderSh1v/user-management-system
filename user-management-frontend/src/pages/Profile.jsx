import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  useEffect(() => {
    API.get("/user/me")
      .then(res => setUser(res.data.user))
      .catch(err => alert(err.response?.data?.message || "Error"));
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>

      {/* Top Bar */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={() => navigate(-1)}>← Back</button>
        <button onClick={logout}>Logout</button>
      </div>

      <h2>My Profile</h2>

      <p><b>Name:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Role:</b> {user.role}</p>

      <p>
        <b>Status:</b>{" "}
        <span style={{
          color: user.status === "active" ? "green" : "red",
          fontWeight: "bold"
        }}>
          {user.status === "active" ? "Active" : "Inactive"}
        </span>
      </p>

    </div>
  );
}