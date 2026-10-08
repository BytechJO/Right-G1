import { useRef } from "react";
import useSidebarFocus from "../hooks/useSidebarFocus"; // عدّلي المسار

export default function RightSidebar({ isOpen, close, menu }) {
  const panelRef = useRef(null);

  useSidebarFocus(isOpen, close, panelRef);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[99998]"
          onClick={close}
          aria-hidden="true"
        />
      )}

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Icon Key"
        aria-hidden={!isOpen}
        tabIndex={-1}
        className={`fixed right-0 bottom-0 w-64 h-full bg-white shadow-xl rounded-tl-2xl 
        transition-transform duration-300 z-[9999999999999] focus:outline-none
        ${isOpen ? "translate-y-0" : "translate-y-full"}`}
        style={{
          visibility: isOpen ? "visible" : "hidden",
          transition: `transform 300ms, visibility 0s linear ${
            isOpen ? "0s" : "300ms"
          }`,
        }}
      >
        <div className="p-4 border-b flex justify-between">
          <h2 className="text-xl text-[#430f68] font-semibold">Icon Key</h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close icon key"
            className="focus-visible:outline-2 focus-visible:outline-[#430f68]"
          >
            ✕
          </button>
        </div>

        <ul className="p-3 space-y-3">
          {menu.map((item) => (
            <li
              key={item.key}
              className="flex items-center gap-3 p-3 bg-purple-100 rounded-lg"
            >
              <img
                src={item.icon}
                alt=""
                style={{ height: "35px", width: "35px" }}
              />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
