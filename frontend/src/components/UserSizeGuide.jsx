import React from "react";
import Modal from "./Modal";

const UserSizeGuide = ({ sizeGuides, closeHandler, showUserSizeGuide }) => {
  return (
    <div
      style={{
        textAlign: "center",
        display: "block",
        padding: 30,
        margin: "auto",
        zIndex: "100",
      }}
    >
      <Modal isOpen={showUserSizeGuide} onClose={closeHandler}>
        <table className="flex flex-col">
          <h1 className="mb-2">راهنمای انتخاب سایز</h1>
          {sizeGuides.map((item, index) => (
            <tr
              className="border grid grid-cols-3 justify-items-start"
              style={{
                backgroundColor: index % 2 === 0 ? "gray" : "white",
                color: index % 2 === 0 ? "white" : "gray",
              }}
              key={index}
            >
              <td className="py-3 px-4 min-w-14">{item.size}</td>
              <td className="col-span-2 py-3 px-4 whitespace-pre-wrap text-right">
                {item.comment}
              </td>
            </tr>
          ))}
        </table>
        <div className="flex flex-col items-start">
          <h2 className="mt-2 text-sm">
            توجه: اندازه‌گیری‌ها ممکن است 2 الی 3 سانتی‌متر اختلاف داشته باشد
          </h2>
          <h2 className="mt-2 text-sm">
            توجه: تمامی اندازه‌‌ها بر اساس سانتی‌متر می‌باشد.
          </h2>
        </div>
        <div>
          <button className="px-5 py-1 mt-2 border rounded-sm bg-[#15224c] text-white">
            بستن
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default UserSizeGuide;
