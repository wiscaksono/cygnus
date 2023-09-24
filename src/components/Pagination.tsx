import { useState, Fragment } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

interface IPagination {
  totalCount: number;
  itemsPerPage?: number;
}

export const Pagination = ({ totalCount, itemsPerPage = 10 }: IPagination) => {
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const pageNumbers = [];
  const maxPageButtons = 5;
  let startIndex = 0;

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  let endIndex = pageNumbers.length;

  if (totalPages > maxPageButtons) {
    const halfButtons = Math.floor(maxPageButtons / 2);

    if (currentPage <= halfButtons) {
      endIndex = maxPageButtons;
    } else if (currentPage >= totalPages - halfButtons) {
      startIndex = totalPages - maxPageButtons;
    } else {
      startIndex = currentPage - halfButtons - 1;
      endIndex = currentPage + halfButtons;
    }
  }

  const displayedPageNumbers = pageNumbers.slice(startIndex, endIndex);

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${currentPage === 1
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-gray-50"
            }`}
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 ${currentPage === totalPages
              ? "cursor-not-allowed opacity-50"
              : "hover:bg-gray-50"
            }`}
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Menampilkan <span className="font-medium">{startIndex + 1}</span> -{" "}
            <span className="font-medium">{endIndex}</span> dari{" "}
            <span className="font-medium">{totalCount}</span> hasil
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            {displayedPageNumbers.map((pageNumber, index) => (
              <Fragment key={pageNumber}>
                {index === 0 && pageNumber !== 1 && (
                  <a
                    href="#"
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    onClick={() => handlePageChange(currentPage - 5)}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </a>
                )}
                <a
                  href="#"
                  onClick={() => handlePageChange(pageNumber)}
                  className={`relative ${currentPage === pageNumber
                      ? "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                    } inline-flex items-center px-4 py-2 text-sm font-semibold`}
                >
                  {pageNumber}
                </a>
                {index === displayedPageNumbers.length - 1 &&
                  pageNumber !== totalPages && (
                    <a
                      href="#"
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                      onClick={() => handlePageChange(currentPage + 5)}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRightIcon
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                    </a>
                  )}
              </Fragment>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};
