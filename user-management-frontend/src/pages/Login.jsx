import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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
        <div>
            <h2>Login</h2>
            <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}