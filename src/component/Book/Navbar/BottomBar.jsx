import { useState, useEffect } from "react";
import downloadIcon from "../../../assets/unit1/imgs/Page 01/Download pdf.svg";
// import { ALL_ASSETS } from "../../../audioList"; // عدّلي المسار حسب مشروعك
// import { MdOutlineWifiOff } from "react-icons/md";
// import { MdOutlineWifi } from "react-icons/md";

export default function BottomBar({
  pageIndex,
  totalPages,
  goToIndex,
  zoomIn,
  resetZoom,
  toggleFullScreen,
  goToPage,
  isMobile,
  viewMode,
  setViewMode,
  icons,
  activeTab,
  teacherPdf,
}) {
  const [pageInput, setPageInput] = useState("");

  useEffect(() => {
    setPageInput("");
  }, [pageIndex]);

  return (
    <footer
      className="w-full bg-white border-t shadow 
  flex items-center justify-center gap-2 
  py-1 fixed bottom-0 left-0 z-[9999] h-[40px]"
    >
      {/* MENU */}
      <button
        type="button"
        onClick={icons.openSidebar}
        aria-label="Open table of contents"
        aria-haspopup="dialog"
        className="absolute left-3"
      >
        <img
          src={icons.menu}
          alt=""
          style={{ height: "25px", width: "25px" }}
        />
      </button>

      {/* HOME */}
      {/* HOME */}
      {pageIndex > 1 &&
        activeTab !== "flash" &&
        activeTab !== "poster" &&
        activeTab !== "posterVocab" && (
          <button
            type="button"
            onClick={goToIndex}
            aria-label="Go to index"
            className="absolute left-12"
          >
            <img
              src={icons.home}
              alt=""
              style={{ height: "25px", width: "25px" }}
            />
          </button>
        )}

      {/* ZOOM IN */}
      {/* ZOOM IN */}
      <button type="button" onClick={zoomIn} aria-label="Zoom in">
        <img
          src={icons.zoomIn}
          alt=""
          style={{ height: "25px", width: "25px" }}
        />
      </button>

      {/* RESET ZOOM */}
      {/* RESET ZOOM */}
      <button type="button" onClick={resetZoom} aria-label="Zoom out">
        <img
          src={icons.zoomOut}
          alt=""
          style={{ height: "25px", width: "25px" }}
        />
      </button>

      {/* FULLSCREEN */}
      {/* FULLSCREEN */}
      <button
        type="button"
        onClick={toggleFullScreen}
        aria-label="Toggle full screen"
      >
        <img
          src={icons.fullScreen}
          alt=""
          style={{ height: "25px", width: "25px" }}
        />
      </button>

      {/* PAGE INPUT */}

      <div className="flex items-center gap-1 px-2 py-0.5 border-2 border-[#430f68] rounded text-sm">
        {pageIndex === 0 || pageIndex + 1 === totalPages ? (
          <>
            {" "}
            <input
              type="text"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  goToPage(pageInput);
                }
              }}
              className="w-10 text-center outline-none text-[#430f68] text-sm"
              placeholder={`${pageIndex + 1}`}
            />
            <span className="text-[#430f68] text-sm">| {totalPages}</span>
          </>
        ) : (
          <>
            {viewMode === "single" ? (
              <>
                <input
                  type="text"
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      goToPage(pageInput);
                    }
                  }}
                  className="w-10 text-center outline-none text-[#430f68] text-sm"
                  placeholder={`${pageIndex + 1}`}
                />
                <span className="text-[#430f68] text-sm">| {totalPages}</span>
              </>
            ) : (
              <>
                {activeTab === "teacher" ? (
                  <>
                    <input
                      type="text"
                      value={pageInput}
                      onChange={(e) => setPageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          goToPage(pageInput);
                        }
                      }}
                      className="w-14 text-center outline-none text-[#430f68] text-sm"
                      placeholder={`${pageIndex + 1}-${pageIndex + 2}`}
                    />
                    <span className="text-[#430f68] text-sm">
                      | {totalPages}
                    </span>
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      value={pageInput}
                      onChange={(e) => setPageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          goToPage(pageInput);
                        }
                      }}
                      className="w-10 text-center outline-none text-[#430f68] text-sm"
                      placeholder={`${pageIndex + 1}-${pageIndex + 2}`}
                    />
                    <span className="text-[#430f68] text-sm">
                      | {totalPages}
                    </span>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* VIEW MODES */}
      {!isMobile && activeTab !== "flash" && activeTab !== "posterVocab" && (
        <>
          <button
            type="button"
            onClick={() => setViewMode("single")}
            aria-label="Single page view"
            aria-pressed={viewMode === "single"}
          >
            <img
              style={{ height: "25px", width: "25px" }}
              src={icons.onePage}
              className={`h-1 w-1 ${
                viewMode === "single" ? "opacity-100" : "opacity-40"
              }`}
            />
          </button>

          <button
            type="button"
            onClick={() => setViewMode("spread")}
            aria-label="Two page view"
            aria-pressed={viewMode === "spread"}
          >
            <img
              style={{ height: "25px", width: "25px" }}
              src={icons.openBook}
              className={`h-1 w-1 ${
                viewMode === "spread" ? "opacity-100" : "opacity-40"
              }`}
            />
          </button>
        </>
      )}
      {/* ✅ DOWNLOAD PDF — Teacher Only */}
      {activeTab === "teacher" && (
        <div className="tooltip-wrapper">
          <button
            type="button"
            aria-label="Download Teacher PDF"
            onClick={() => {
              const link = document.createElement("a");
              link.href = teacherPdf;
              link.download = "Right-G2-Teacher-Book.pdf";
              link.click();
            }}
            className="cursor-pointer p-1 rounded-lg hover:bg-purple-100 transition"
          >
            <svg width="35" height="35" viewBox="0 0 90 90" aria-hidden="true">
              <image href={downloadIcon} x="0" y="0" width="90" height="90" />
            </svg>
          </button>

          <span className="tooltip-text">Download Teacher PDF</span>
        </div>
      )}

      {/* RIGHT SIDEBAR */}
      <button
        type="button"
        className="absolute right-3"
        onClick={icons.openRightSidebar}
        aria-haspopup="dialog"
        aria-label="Icon Key"
        style={{ color: "#430f68", display: "flex", gap: "5px" }}
      >
        {!isMobile && <span aria-hidden="true">Icon Key</span>}
        <icons.keyIcon size={24} color="#430f68" aria-hidden="true" />
      </button>
    </footer>
  );
}
