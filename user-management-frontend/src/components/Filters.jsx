export default function Filters({
  setSearch,
  setRoleFilter,
  setStatusFilter
}) {
  return (
    <div style={{ marginBottom: "15px" }}>
      <input
        placeholder="Search"
        onChange={(e) => setSearch(e.target.value)}
      />

      <select onChange={(e) => setRoleFilter(e.target.value)}>
        <option value="">All Roles</option>
        <option value="admin">Admin</option>
        <option value="manager">Manager</option>
        <option value="user">User</option>
      </select>

      <select onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  );
}