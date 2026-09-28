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
  zoomOut,
  resetZoom,
  toggleFullScreen,
  goToPage,
  isMobile,
  viewMode,
  setViewMode,
  icons,
  activeTab,
  teacherPdf,

  menuButtonRef,
  iconKeyButtonRef,
}) {
  const [pageInput, setPageInput] = useState("");

  useEffect(() => {
    setPageInput("");
  }, [pageIndex]);

  const accessibilityButton =
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#430f68] focus-visible:ring-offset-2 rounded";
  return (
    <footer
      className="w-full bg-white border-t shadow 
  flex items-center justify-center gap-2 
  py-1 fixed bottom-0 left-0 z-[9999] h-[40px]"
    >
      {/* MENU */}
      <button
        ref={menuButtonRef}
        type="button"
        onClick={icons.openSidebar}
        aria-label="Open menu"
        className={`absolute left-3 ${accessibilityButton}`}
      >
        <img
          src={icons.menu}
          alt=""
          aria-hidden="true"
          style={{ height: "25px", width: "25px" }}
        />
      </button>

      {/* HOME */}
      {pageIndex > 1 &&
        activeTab !== "flash" &&
        activeTab !== "poster" &&
        activeTab !== "posterVocab" && (
          <button
            type="button"
            onClick={goToIndex}
            aria-label="Go to home"
            className={`absolute left-12 ${accessibilityButton}`}
          >
            <img
              src={icons.home}
              alt=""
              aria-hidden="true"
              style={{ height: "25px", width: "25px" }}
            />
          </button>
        )}

      {/* ZOOM IN */}
      <button
        type="button"
        onClick={zoomIn}
        aria-label="Zoom in"
        className={accessibilityButton}
      >
        <img
          src={icons.zoomIn}
          alt=""
          aria-hidden="true"
          style={{ height: "25px", width: "25px" }}
        />
      </button>

      {/* RESET ZOOM */}
      <button
        type="button"
        onClick={resetZoom}
        aria-label="Reset zoom"
        className={accessibilityButton}
      >
        <img
          src={icons.zoomOut}
          alt=""
          aria-hidden="true"
          style={{ height: "25px", width: "25px" }}
        />
      </button>

      {/* FULLSCREEN */}
      <button
        type="button"
        onClick={toggleFullScreen}
        aria-label="Toggle fullscreen"
        className={accessibilityButton}
      >
        <img
          src={icons.fullScreen}
          alt=""
          aria-hidden="true"
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
          <button onClick={() => setViewMode("single")}>
            <img
              style={{ height: "25px", width: "25px" }}
              src={icons.onePage}
              className={`h-1 w-1 ${
                viewMode === "single" ? "opacity-100" : "opacity-40"
              }`}
            />
          </button>

          <button onClick={() => setViewMode("spread")}>
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
            className={`cursor-pointer p-1 rounded-lg hover:bg-purple-100 transition ${accessibilityButton}`}
            onClick={() => {
              const link = document.createElement("a");
              link.href = teacherPdf;
              link.download = "Right-1-Teacher-Book.pdf";
              link.click();
            }}
          >
            <svg width="35" height="35" viewBox="0 0 90 90" aria-hidden="true">
              <image href={downloadIcon} x="0" y="0" width="90" height="90" />
            </svg>
          </button>

          <span className="tooltip-text">Download Teacher PDF</span>
        </div>
      )}

      {/* RIGHT SIDEBAR */}
      {/* RIGHT SIDEBAR */}
      <button
        ref={iconKeyButtonRef}
        type="button"
        aria-label="Open icon key"
        className={`absolute right-3 ${accessibilityButton}`}
        onClick={icons.openRightSidebar}
        style={{
          color: "#430f68",
          display: "flex",
          gap: "5px",
        }}
      >
        {!isMobile && <span>Icon Key</span>}

        <icons.keyIcon size={24} color="#430f68" aria-hidden="true" />
      </button>
    </footer>
  );
}
