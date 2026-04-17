import { useNavigate } from "react-router-dom";
import { logout } from "./logout";

export default function TopBar() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "20px"
    }}>
      <button onClick={() => navigate("/profile")}>
        My Profile
      </button>

      <button onClick={logout}>
        Logout
      </button>
    </div>
  );
}