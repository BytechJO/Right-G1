import { useState } from "react";

export default function LeftSidebar({ isOpen, close, units, goToPage }) {
  const [openUnit, setOpenUnit] = useState(null);

  const toggleUnit = (unitId) => {
    setOpenUnit(openUnit === unitId ? null : unitId);
  };

  return (
    <>
      <div
        className={`fixed left-0 bottom-0 w-64 h-full bg-white shadow-xl rounded-tr-2xl 
        transition-transform duration-300 z-[99999]
        ${isOpen ? "translate-y-0" : "translate-y-full"}`}
      >
        {/* HEADER */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl text-[#430f68] font-semibold">Menu</h2>
          <button onClick={close} className="text-2xl">✕</button>
        </div>

        {/* CONTENT WITH SCROLL */}
        <div className="h-[calc(100%-70px)] overflow-y-auto px-3 py-2">
          {/* TITLE */}
          <h3 className="text-lg font-semibold text-[#430f68] mt-4 mb-2">
            Units 📘
          </h3>

          {/* UNITS LIST */}
          <ul className="space-y-2">
            {units.map((u) => (
              <li key={u.id}>
                {/* UNIT BUTTON */}
                <div
                  onClick={() => toggleUnit(u.id)}
                  className={`p-3 rounded-lg cursor-pointer transition 
                    ${
                      openUnit === u.id
                        ? "bg-[#eedeff] text-[#430f68]"
                        : "bg-purple-100 hover:bg-purple-200"
                    }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{u.label}</span>
                    <span>{openUnit === u.id ? "−" : "+"}</span>
                  </div>
                </div>

                {/* PAGES */}
                {openUnit === u.id && (
                  <ul className="ml-4 mt-2 space-y-1">
                    {Array.from({ length: u.pages }).map((_, i) => {
                      const pageNumber = u.start + i;

                      return (
                        <li
                          key={pageNumber}
                          className="p-2 bg-purple-50 rounded hover:bg-purple-200 cursor-pointer"
                          onClick={() => {
                            goToPage(pageNumber);
                            close();
                          }}
                        >
                          Page {pageNumber}
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

      {/* OVERLAY */}
      {isOpen && (
        <div
          onClick={close}
          className="fixed inset-0 bg-black/40 z-[99998]"
        />
      )}
    </>
  );
}
