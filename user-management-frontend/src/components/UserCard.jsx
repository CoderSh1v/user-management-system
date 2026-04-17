import { useNavigate } from "react-router-dom";

export default function UserCard({ u, currentUser }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/user/${u._id}`)}
            style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "8px",
                cursor: "pointer"
            }}
        >

            <p style={{ margin: "4px 0" }}><b>Name:</b> {u.name}</p>
            <p style={{ margin: "4px 0" }}><b>Email:</b> {u.email}</p>
            <p style={{ margin: "4px 0" }}><b>Role:</b> {u.role}</p>

            <p style={{ margin: "4px 0" }}>
                <b>Status:</b>{" "}
                <span style={{ color: u.status === "active" ? "green" : "red" }}>
                    {u.status}
                </span>
            </p>
 

            {u._id === currentUser?._id && (
                <p style={{ color: "gray" }}>You</p>
            )}
        </div>
    );
}