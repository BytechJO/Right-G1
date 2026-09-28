import { useState, useEffect, useRef } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

export default function LeftSidebar({ isOpen, close, units, goToPage, book }) {
  const [openUnit, setOpenUnit] = useState(null);

  const sidebarRef = useRef(null);
  const closeButtonRef = useRef(null);

  const toggleUnit = (unitId) => {
    setOpenUnit(openUnit === unitId ? null : unitId);
  };

  useEffect(() => {
    if (!isOpen) return;

    // أول ما يفتح السايدبار يدخل الفوكس لجواه
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 0);

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        close();
        return;
      }

      if (e.key !== "Tab") return;

      const focusableElements = sidebarRef.current?.querySelectorAll(
        `
        button,
        [href],
        input,
        select,
        textarea,
        [tabindex]:not([tabindex="-1"])
        `,
      );

      if (!focusableElements?.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Shift + Tab من أول عنصر → يروح لآخر عنصر
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }

      // Tab من آخر عنصر → يرجع لأول عنصر
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, close]);

  return (
    <>
      <div
        ref={sidebarRef}
        role="dialog"
        aria-modal="true"
        aria-label="Table of Contents"
        className={`fixed left-0 bottom-0 w-70 h-full bg-white shadow-xl
        rounded-tr-2xl transition-transform duration-300 z-[99999]
        flex flex-col
        ${isOpen ? "translate-y-0" : "translate-y-full"}`}
      >
        {/* HEADER */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl text-[#430f68] font-semibold">
            Table of Contents
          </h2>

          <button
            ref={closeButtonRef}
            onClick={close}
            aria-label="Close table of contents"
            className="
              text-2xl
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#430f68]
              focus-visible:ring-offset-2
              rounded
            "
          >
            ✕
          </button>
        </div>

        {book && (
          <div
            className={`bookInfo-div ${
              book.title === "Right 1 Grammar Poster" ? "grammar-info" : ""
            } text-center mb-4`}
          >
            {book.cover && (
              <img
                src={book.cover}
                alt={`${book.title} cover`}
                className="w-28 mx-auto rounded shadow"
                style={{
                  height: "118px",
                  width: "auto",
                }}
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

        {/* CONTENT */}
        <div className="h-[calc(100%-70px)] overflow-y-auto px-2 py-0">
          <ul className="space-y-1">
            {units.map((u) => (
              <li
                key={u.id}
                className="border-b border-gray-300 last:border-none"
              >
                {/* UNIT BUTTON */}
                <button
                  type="button"
                  onClick={() => toggleUnit(u.id)}
                  aria-expanded={openUnit === u.id}
                  className="
                    w-full
                    flex
                    justify-between
                    items-center
                    py-3
                    px-2
                    select-none
                    text-left
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#430f68]
                    rounded
                  "
                >
                  <span className="text-gray-700 font-medium">{u.label}</span>

                  {openUnit === u.id ? (
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
                {openUnit === u.id && (
                  <ul className="ml-4 mb-2 space-y-1">
                    {Array.from({ length: u.pages }).map((_, i) => {
                      const pageNumber = u.start + i;

                      return (
                        <li key={pageNumber}>
                          <button
                            type="button"
                            onClick={() => {
                              goToPage(pageNumber);
                              close();
                            }}
                            className="
                                w-full
                                text-left
                                py-1
                                px-2
                                text-gray-600
                                hover:text-blue-600
                                transition
                                focus:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-[#430f68]
                                rounded
                              "
                          >
                            Page {pageNumber}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isOpen && (
        <div onClick={close} className="fixed inset-0 bg-black/40 z-[99998]" />
      )}
    </>
  );
}
