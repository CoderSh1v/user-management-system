import { useEffect, useState } from "react";
import API from "../services/api";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    API.get("/user/me").then(res => setUser(res.data.user));
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <p>{user.role}</p>
    </div>
  );
}