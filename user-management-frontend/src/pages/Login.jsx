import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await API.post("/auth/login", { email, password });

            localStorage.setItem("token", res.data.token);

            const profile = await API.get("/user/me");
            localStorage.setItem("user", JSON.stringify(profile.data.user));

            const user = profile.data.user;

            if (user.role === "admin" || user.role === "manager") {
                navigate("/dashboard");
            } else {
                navigate("/profile");
            }
        } catch (err) {
            alert("Login failed");
        }
    };

    return (
        <div style={{
            maxWidth: "350px",
            margin: "80px auto",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "8px"
        }}>
            <h2>Login</h2>

            <div style={{ marginBottom: "10px" }}>
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: "100%", padding: "6px" }}
                />
            </div>

            <div style={{ marginBottom: "10px", position: "relative" }}>
                <label>Password</label>

                <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                        width: "78%",
                        padding: "6px"
                    }}
                />

                <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    style={{
                        position: "absolute",
                        right: "5px",
                        top: "22px",
                        padding: "2px 6px",
                        fontSize: "12px",
                        cursor: "pointer"
                    }}
                >
                    {showPassword ? "Hide" : "Show"}
                </button>
            </div>

            <button
                onClick={handleLogin}
                style={{
                    width: "100%",
                    padding: "8px",
                    cursor: "pointer"
                }}
            >
                Login
            </button>
        </div>
    );
}