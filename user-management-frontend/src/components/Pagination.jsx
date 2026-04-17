export default function Pagination({ page, totalPages, setPage }) {
  return (
    <div style={{ marginBottom: "15px" }}>
      <button
        disabled={page === 1}
        onClick={() => setPage(p => p - 1)}
      >
        Prev
      </button>

      <span> Page {page} of {totalPages} </span>

      <button
        disabled={page >= totalPages}
        onClick={() => setPage(p => p + 1)}
      >
        Next
      </button>
    </div>
  );
}