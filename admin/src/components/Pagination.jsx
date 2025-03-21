import React from "react";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  function convertToPersianDigits(input) {
    if (!input) return null;
    // Convert the input to a string to ensure replace works
    const inputStr = input.toString();
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return inputStr.replace(/\d/g, (digit) => persianDigits[digit]);
  }

  const getPaginationRange = () => {
    const range = [];
    const delta = 2; // تعداد صفحات اطراف صفحه فعلی

    if (totalPages <= 7) {
      // نمایش تمام صفحات اگر تعداد کم باشد
      for (let i = 1; i <= totalPages; i++) range.push(i);
    } else {
      // صفحه اول و آخر همیشه نمایش داده شوند
      range.push(1);
      if (currentPage > delta + 2) range.push("...");

      for (
        let i = Math.max(2, currentPage - delta);
        i <= Math.min(totalPages - 1, currentPage + delta);
        i++
      ) {
        range.push(i);
      }

      if (currentPage < totalPages - delta - 1) range.push("...");
      range.push(totalPages);
    }

    return range;
  };

  const paginationRange = getPaginationRange();

  return (
    <div
      style={{ display: totalPages <= 1 ? "none" : "flex" }}
      className="justify-center"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-1 sm:px-4 py-1 mx-1 mt-5 border border-gray-300 rounded-md cursor-pointer bg-[#f3f4f6] text-[#15224c]"
      >
        &lt;
      </button>
      {paginationRange.map((page, index) =>
        page === "..." ? (
          <span key={index} className="sm:px-4 py-1 mx-1 mt-5 text-[#15224c]">
            ...
          </span>
        ) : (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            style={{
              backgroundColor: currentPage === page ? "#f01b87" : "#f3f4f6",
              color: currentPage === page ? "#fff" : "#15224c",
            }}
            className="px-2 sm:px-4 py-1 mx-1 mt-5 border border-gray-300 rounded-md cursor-pointer"
          >
            {convertToPersianDigits(page)}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-1 sm:px-4 py-1 mx-1 mt-5 border border-gray-300 rounded-md cursor-pointer bg-[#f3f4f6] text-[#15224c]"
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
