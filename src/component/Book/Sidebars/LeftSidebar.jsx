import { useState, useRef } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import useSidebarFocus from "../hooks/useSidebarFocus"; // عدّلي المسار

export default function LeftSidebar({ isOpen, close, units, goToPage, book }) {
  const [openUnit, setOpenUnit] = useState(null);
  const panelRef = useRef(null);

  useSidebarFocus(isOpen, close, panelRef);

  const toggleUnit = (unitId) => {
    setOpenUnit(openUnit === unitId ? null : unitId);
  };

  return (
    <>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Table of Contents"
        aria-hidden={!isOpen}
        tabIndex={-1}
        className={`fixed left-0 bottom-0 w-70 h-full bg-white shadow-xl 
  rounded-tr-2xl transition-transform duration-300 z-[99999]
  flex flex-col focus:outline-none
  ${isOpen ? "translate-y-0" : "translate-y-full"}`}
        // visibility بيشيل عناصر الـ sidebar المسكّر من الـ Tab، وبيستنى انتهاء الأنيميشن
        style={{
          visibility: isOpen ? "visible" : "hidden",
          transition: `transform 300ms, visibility 0s linear ${
            isOpen ? "0s" : "300ms"
          }`,
        }}
      >
        {/* HEADER */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl text-[#430f68] font-semibold">
            Table of Contents
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close table of contents"
            className="text-2xl focus-visible:outline-2 focus-visible:outline-[#430f68]"
          >
            ✕
          </button>
        </div>

        {book && (
          <div
            className={`bookInfo-div  ${
              book.title === "Right 1 Grammar Poster" ? "grammar-info" : ""
            } text-center mb-4`}
          >
            {book.cover && (
              <img
                src={book.cover}
                alt=""
                className="w-28 mx-auto rounded shadow"
                style={{ height: "118px", width: "auto" }}
              />
            )}

            <div className="mt-2 text-center">
              <h3 className="text-lg font-semibold text-[#430f68] text-center">
                {book.title}
              </h3>
              <p className="text-sm text-gray-500">{book.pages} pages</p>
            </div>

            <div className="border-b border-gray-200 my-3"></div>
          </div>
        )}

        {/* CONTENT WITH SCROLL */}
        <div className="h-[calc(100%-70px)] overflow-y-auto px-2 py-0">
          <ul className="space-y-1">
            {units.map((u) => {
              const isUnitOpen = openUnit === u.id;

              return (
                <li
                  key={u.id}
                  className="border-b border-gray-300 last:border-none"
                >
                  {/* UNIT BUTTON */}
                  <button
                    type="button"
                    onClick={() => toggleUnit(u.id)}
                    aria-expanded={isUnitOpen}
                    aria-controls={`unit-pages-${u.id}`}
                    className="w-full flex justify-between items-center py-3 px-2 text-left select-none focus-visible:outline-2 focus-visible:outline-[#430f68]"
                  >
                    <span className="text-gray-700 font-medium">{u.label}</span>

                    {isUnitOpen ? (
                      <IoChevronUp
                        size={20}
                        className="text-blue-500"
                        aria-hidden="true"
                      />
                    ) : (
                      <IoChevronDown
                        size={20}
                        className="text-gray-500"
                        aria-hidden="true"
                      />
                    )}
                  </button>

                  {/* DROPDOWN PAGES */}
                  {isUnitOpen && (
                    <ul
                      id={`unit-pages-${u.id}`}
                      className="ml-4 mb-2 space-y-1"
                    >
                      {Array.from({ length: u.pages }).map((_, i) => {
                        const pageNumber = u.start + i;

                        return (
                          <li key={pageNumber}>
                            <button
                              type="button"
                              className="w-full text-left py-1 px-2 text-gray-600 hover:text-blue-600 transition focus-visible:outline-2 focus-visible:outline-[#430f68]"
                              onClick={() => {
                                goToPage(pageNumber);
                                close();
                              }}
                            >
                              Page {pageNumber}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {isOpen && (
        <div
          onClick={close}
          aria-hidden="true"
          className="fixed inset-0 bg-black/40 z-[99998]"
        />
      )}
    </>
  );
}
