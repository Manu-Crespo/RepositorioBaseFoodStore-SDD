/** Pagination component for navigating pages. */

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  maxButtons?: number;
}

export function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  maxButtons = 5,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('ellipsis');
      }

      // Show pages around current
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <nav className="flex items-center justify-center gap-1">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Anterior
      </button>

      {/* Page numbers */}
      {getPageNumbers().map((page, index) =>
        page === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1.5 text-sm border rounded ${
              currentPage === page
                ? 'bg-blue-600 text-white border-blue-600'
                : 'hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Siguiente
      </button>
    </nav>
  );
}