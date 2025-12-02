
const Pagination = ({ currentPage, onPageChange, itemsPerPage, data }) => {

  if (!data || data.length === 0) {
    return null;
  }

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleJumpBackward = () => {
    const newPage = Math.max(1, currentPage - 5);
    onPageChange(newPage);
  };

  const handleJumpForward = () => {
    const newPage = Math.min(totalPages, currentPage + 5);
    onPageChange(newPage);
  };

  return (
    <div className="relative flex gap-3 items-center text-[12px] text-gray-500">
      <span className="relative right-5">1 a {data.length <= itemsPerPage ? data.length : itemsPerPage} de {data.length}</span>


      <button
        onClick={handleJumpBackward}
        disabled={currentPage === 1}
        className={`${currentPage === 1 ? 'cursor-not-allowed': 'cursor-pointer '}`}
      >
        {"|<"}
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${currentPage === 1 ? 'cursor-not-allowed': 'cursor-pointer '}`}
      >
        {"<"}
      </button>

      <span>Página {currentPage} de {totalPages}</span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${currentPage === totalPages ? 'cursor-not-allowed': 'cursor-pointer '}`}
      >
       {">"}
      </button>
      <button
        onClick={handleJumpForward}
        disabled={currentPage === totalPages}
        className={`${currentPage === totalPages ? 'cursor-not-allowed': 'cursor-pointer '}`}
      >
       {">|"}
      </button>
    </div>
  );
};

export default Pagination;
