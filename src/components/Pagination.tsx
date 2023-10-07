import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
};

type PageNumbers = number | "...";

export const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems }: PaginationProps) => {
  const pageNumbers: PageNumbers[] = [];
  const maxVisiblePages = 3;

  const generatePageNumbers = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      let start = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
      const end = Math.min(start + maxVisiblePages - 1, totalPages);

      if (end === totalPages) {
        start = Math.max(end - maxVisiblePages + 1, 1);
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      if (start > 1) {
        pageNumbers.unshift("...");
      }
      if (end < totalPages) {
        pageNumbers.push("...");
      }
    }

    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      {/* ... (Previous button) */}
      {/* ... (Next button) */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{currentPage * itemsPerPage - itemsPerPage + 1}</span> to <span className="font-medium">{currentPage * itemsPerPage}</span> of{" "}
            <span className="font-medium">{totalItems}</span> results
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            {/* Previous and next buttons */}
            <a
              href="#"
              className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }`}
              onClick={() => onPageChange(currentPage - 1)}>
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </a>
            {generatePageNumbers().map((page, i) =>
              page === "..." ? (
                <span key={i} className="relative inline-flex cursor-default items-center border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-700">
                  ...
                </span>
              ) : (
                <a
                  key={i}
                  href="#"
                  aria-current={page === currentPage ? "page" : undefined}
                  className={`relative ${page === currentPage
                      ? "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                    } inline-flex items-center px-4 py-2 text-sm font-semibold`}
                  onClick={() => onPageChange(page)}>
                  {page}
                </a>
              ),
            )}
            <a
              href="#"
              className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${currentPage === totalPages ? "pointer-events-none opacity-50" : ""
                }`}
              onClick={() => onPageChange(currentPage + 1)}>
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
};
