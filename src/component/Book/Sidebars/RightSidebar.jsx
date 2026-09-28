import { useEffect, useRef } from "react";

export default function RightSidebar({ isOpen, close, menu }) {
  const sidebarRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

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

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
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
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-[99998]" onClick={close} />
      )}

      <div
        ref={sidebarRef}
        role="dialog"
        aria-modal="true"
        aria-label="Icon Key"
        className={`fixed right-0 bottom-0 w-64 h-full bg-white shadow-xl rounded-tl-2xl 
        transition-transform duration-300 z-[9999999999999]
        ${isOpen ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="p-4 border-b flex justify-between">
          <h2 className="text-xl text-[#430f68] font-semibold">Icon Key</h2>

          <button
            ref={closeButtonRef}
            onClick={close}
            aria-label="Close icon key"
            className="
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

        <ul className="p-3 space-y-3">
          {menu.map((item) => (
            <li key={item.key}>
              <button
                type="button"
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  p-3
                  bg-purple-100
                  rounded-lg
                  hover:bg-purple-300
                  cursor-pointer
                  text-left
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#430f68]
                "
              >
                <img
                  src={item.icon}
                  alt=""
                  aria-hidden="true"
                  className="h-12"
                  style={{
                    height: "35px",
                    width: "35px",
                  }}
                />

                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
