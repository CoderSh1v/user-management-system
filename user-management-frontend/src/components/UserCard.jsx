export default function UserCard({ u, currentUser, toggleStatus }) {

  const canModify =
    currentUser &&
    u._id !== currentUser._id &&
    (
      currentUser.role === "admin" ||
      (currentUser.role === "manager" && u.role !== "admin")
    );

  return (
    <div style={{
      border: "1px solid #ccc",
      padding: "10px",
      marginBottom: "10px",
      borderRadius: "8px"
    }}>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <p style={{ margin: "4px 0" }}><b>Name:</b> {u.name}</p>
          <p style={{ margin: "4px 0" }}><b>Email:</b> {u.email}</p>
          <p style={{ margin: "4px 0" }}><b>Role:</b> {u.role}</p>
        </div>

        {canModify && (
          <button
            style={{
              padding: "5px 10px",
              fontSize: "12px",
              height: "fit-content"
            }}
            onClick={() => toggleStatus(u)}
          >
            {u.status === "active" ? "Deactivate" : "Activate"}
          </button>
        )}
      </div>

      <p style={{ margin: "4px 0" }}>
        <b>Status:</b>{" "}
        <span style={{ color: u.status === "active" ? "green" : "red" }}>
          {u.status}
        </span>
      </p>

      {u.createdBy && (
        <p><b>Created By:</b> {u.createdBy.name}</p>
      )}

      {u.updatedBy && (
        <p><b>Updated By:</b> {u.updatedBy.name}</p>
      )}

      <p><b>Created At:</b> {new Date(u.createdAt).toLocaleDateString()}</p>

      {u._id === currentUser?._id && (
        <p style={{ color: "gray" }}>You</p>
      )}
    </div>
  );
}