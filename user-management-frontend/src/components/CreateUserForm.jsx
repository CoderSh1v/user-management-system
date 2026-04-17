import { useState } from "react";
import API from "../services/api";

export default function CreateUserForm({ refreshUsers }) {
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        password: "",
        role: "user"
    });

    const [generatedPassword, setGeneratedPassword] = useState("");

    const generatePassword = () => {
        const pass = Math.random().toString(36).slice(-8);
        setGeneratedPassword(pass);

        setNewUser(prev => ({
            ...prev,
            password: pass
        }));
    };

    const createUser = async () => {
        try {
            if (!newUser.password) {
                alert("Please generate password first");
                return;
            }

            await API.post("/auth/register", newUser);

            alert("User created");

            setNewUser({
                name: "",
                email: "",
                password: "",
                role: "user"
            });

            setGeneratedPassword("");

            refreshUsers();

        } catch (err) {
            alert(err.response?.data?.message || "Error");
        }
    };

    return (
        <div style={{
            border: "1px solid #ccc",
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "8px"
        }}>
            <h3>Create User</h3>

            <input
                placeholder="Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />

            <br />

            <input
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />

            <br />

            <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
                <option value="user">User</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
            </select>

            <br /><br />

            <button onClick={generatePassword}>
                Generate Password
            </button>


            {generatedPassword && (
                <p>
                    <b>Password:</b> {generatedPassword}
                    <button onClick={() => navigator.clipboard.writeText(generatedPassword)}>
                        Copy Password
                    </button>
                </p>
            )}

            <br />

            <button onClick={createUser}>
                Create User
            </button>
        </div>
    );
}