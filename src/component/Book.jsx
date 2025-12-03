import { useState, useEffect, useRef } from "react";
import next from "../assets/unit1/imgs/Page 01/next btn.svg";
import back from "../assets/unit1/imgs/Page 01/back btn.svg";
import home from "../assets/unit1/imgs/Page 01/home.svg";
import fullScreen from "../assets/unit1/imgs/Page 01/fullscreen.svg";
import menu from "../assets/unit1/imgs/Page 01/menu.svg";
import onePage from "../assets/unit1/imgs/Page 01/one page.svg";
import openBook from "../assets/unit1/imgs/Page 01/open-book.svg";
import zoomIn from "../assets/unit1/imgs/Page 01/zoom in.svg";
import zoomOut from "../assets/unit1/imgs/Page 01/zoom out.svg";
import Popup from "./Popup/Popup";
import logo from "../assets/unit1/imgs/Page 01/PMAAlogo.svg";

import {
  studentPages,
  workbookPages,
  teacherPages,
  flashPages,
  posterPages,
} from "./BookData/index";

export default function Book() {
  const [pageIndex, setPageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1100);
  const [activeTab, setActiveTab] = useState("student");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // ZOOM + VIEW MODE
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState("spread"); // spread | single
  const [mobileTabsOpen, setMobileTabsOpen] = useState(false);

  // ==== PANNING ====
  const [isPanning, setIsPanning] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1100);
    };
    if (isMobile || viewMode === "single") {
      setDisplayedPage(`${pageIndex + 1}`);
    } else {
      // spread mode
      const left = pageIndex + 1;
      const right = pageIndex + 2;
      setDisplayedPage(`${left}-${right}`);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [pageIndex, isMobile, viewMode]);
  // ======================= POPUP CONTROL ========================
  const [globalPopupOpen, setGlobalPopupOpen] = useState(false);
  const [globalPopupContent, setGlobalPopupContent] = useState(null);
  const [globalPopupAudio, setGlobalPopupAudio] = useState(false);
  const [globalPopupVideo, setGlobalPopupVideo] = useState(false);
  const [globalPopupClose, setGlobalPopupClose] = useState(true);
  const openPopup = (content, isAudio = false, isVideo = false) => {
    setGlobalPopupContent(content);
    setGlobalPopupAudio(isAudio);
    setGlobalPopupOpen(true);
    setGlobalPopupClose(false);
    setGlobalPopupVideo(isVideo);
  };

  const closePopup = () => {
    setGlobalPopupClose(true);
    setGlobalPopupOpen(false);
    setGlobalPopupContent(null);
  };
  // ==============================================================

  const toggleFullScreen = () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) elem.requestFullscreen();
    else document.exitFullscreen();
  };

  const goToIndex = () => setPageIndex(1);

  const goToUnit = (unitStartIndex) => {
    if (!isMobile) {
      const leftPage =
        unitStartIndex % 2 === 1 ? unitStartIndex : unitStartIndex - 1;
      setPageIndex(leftPage);
    } else {
      setPageIndex(unitStartIndex);
    }
  };
  const pages = {
    student: studentPages(openPopup, goToUnit),
    work: workbookPages(openPopup, goToUnit),
    teacher: teacherPages(openPopup, goToUnit),
    flash: flashPages(openPopup, goToUnit),
    poster: posterPages(openPopup, goToUnit),
  }[activeTab];
  const goToPage = (pageNumber) => {
    // حوّل القيمة لرقم
    const num = Number(pageNumber);

    // ===========================
    // ❌ التحقق من إدخال غير صحيح
    // ===========================
    if (isNaN(num) || num < 1 || num > pages.length) {
      // رجّعه للفهرس (الصفحة الثانية لأن الأولى سينجل)
      setPageIndex(1);
      return;
    }

    const index = num - 1;

    // ===========================
    // 📱 Mobile OR single mode
    // ===========================
    if (isMobile || viewMode === "single") {
      setPageIndex(index);
      return;
    }

    // ===========================
    // 📘 Spread Mode (صفحتين)
    // ===========================

    // الصفحة الأولى دائماً سينجل
    if (num === 1) {
      setPageIndex(0);
      return;
    }

    // لو كانت الصفحة فردية → اعرض السابقة معها
    if (num % 2 === 1) {
      // مثال: 3 → (2–3)
      setPageIndex(index - 1);
      return;
    }

    // لو كانت زوجية → اعرضها مع التالية
    setPageIndex(index);
  };

  const totalPages = pages.length;
  const leftPage = pageIndex + 1;
  const rightPage = !isMobile && viewMode === "spread" ? pageIndex + 2 : null;
  const [goToPageInput, setGoToPageInput] = useState("");
  const [displayedPage, setDisplayedPage] = useState("1");
  const [isEditingPage, setIsEditingPage] = useState(false);

  const units = [
    { id: 1, label: "Unit 1", start: 3 },
    { id: 2, label: "Unit 2", start: 10 },
    { id: 3, label: "Unit 3", start: 21 },
    { id: 4, label: "Unit 4", start: 30 },
    { id: 5, label: "Unit 5", start: 40 },
    { id: 6, label: "Unit 6", start: 50 },
    // ... أكمل حسب فهرس صفحاتك
  ];

  const hideArrows = zoom > 1;
  const [isDragging, setIsDragging] = useState(false);
  const startPosition = useRef({ x: 0, y: 0 });
  const handleMouseDown = (e) => {
    if (zoom === 1) return;

    setIsDragging(true);

    startPosition.current = {
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    setOffset({
      x: e.clientX - startPosition.current.x,
      y: e.clientY - startPosition.current.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const nextPage = () => {
    if (isMobile || viewMode === "single") {
      if (pageIndex < pages.length - 1) setPageIndex(pageIndex + 1);
    } else {
      if (pageIndex === 0) setPageIndex(1);
      else if (pageIndex < pages.length - 2) setPageIndex(pageIndex + 2);
    }
  };

  const prevPage = () => {
    if (isMobile || viewMode === "single") {
      if (pageIndex > 0) setPageIndex(pageIndex - 1);
    } else {
      if (pageIndex === 1) setPageIndex(0);
      else if (pageIndex > 1) setPageIndex(pageIndex - 2);
    }
  };

  return (
    <>
      <div
        className="w-full flex flex-col pb-20"
        style={{ overflowX: "hidden", overflowY: "auto" }}
      >
        <nav className="w-full bg-white border-b shadow px-2 py-2 flex items-center justify-between">
          {/* LEFT SECTION */}
          <div className="flex items-center gap-10">
            {/* LOGO */}
            <img
              src={logo}
              alt="J1 Logo"
              style={{ height: "40px", width: "100px" }}
            />

            {/* DESKTOP TABS */}
            <div className="hidden lg:flex items-center gap-3">
              {[
                { id: "student", label: "Student’s Book" },
                { id: "work", label: "Workbook" },
                { id: "teacher", label: "Teacher’s Book" },
                { id: "flash", label: "Flashcards" },
                { id: "poster", label: "Posters" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
            px-4 py-1 rounded-xl border font-medium transition-all duration-200 text-[15px]
            ${
              activeTab === tab.id
                ? "border-[#430f68] text-[#430f68] bg-[#f6f0ff]"
                : "border-[#b99cfa] text-[#430f68] hover:bg-purple-50"
            }
          `}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-4">
            <span className="cursor-pointer text-[#430f68] hover:opacity-75 hidden lg:block">
              Student Edition
            </span>

            {/* MOBILE MENU BUTTON */}
            <button
              className="lg:hidden border px-3 py-1 rounded-lg text-[#430f68]"
              onClick={() => setMobileTabsOpen(!mobileTabsOpen)}
            >
              Menu
            </button>
          </div>
        </nav>

        {/* MOBILE TABS DROPDOWN */}
        {mobileTabsOpen && (
          <div className="lg:hidden bg-white shadow-md border-b px-4 py-3 absolute w-full z-[9999]">
            {[
              { id: "student", label: "Student’s Book" },
              { id: "work", label: "Workbook" },
              { id: "teacher", label: "Teacher’s Book" },
              { id: "flash", label: "Flashcards" },
              { id: "poster", label: "Posters" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileTabsOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 rounded-lg mb-1
          ${
            activeTab === tab.id
              ? "bg-[#f6f0ff] text-[#430f68]"
              : "text-[#430f68] hover:bg-purple-50"
          }
        `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* MAIN CONTENT */}
        <div className="content-wrapper overflow-auto lg:overflow-hidden">
          <div
            className="w-full  h-[88vh] flex items-center justify-center relative"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* MOBILE VIEW */}
            {isMobile ? (
              <>
                {!hideArrows && (
                  <>
                    {/* Back Button — يظهر فقط إذا الصفحة > 0 */}
                    {pageIndex > 0 && (
                      <svg
                        width="30"
                        height="30"
                        viewBox="0 0 90 90"
                        onClick={prevPage}
                        className="nav-btn absolute left-10 w-14 h-14 rounded-full flex items-center justify-center z-[9999]  transition"
                      >
                        <image href={back} x="0" y="0" width="90" height="90" />
                      </svg>
                    )}
                  </>
                )}

                <div
                  className="bg-white sm:w-auto h-[85vh] rounded-2xl shadow-2xl border flex items-center justify-center overflow-hidden"
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: "center top",
                  }}
                >
                  {pages[pageIndex]}
                </div>
                {!hideArrows && (
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 90 90"
                    onClick={nextPage}
                    className="nav-btn absolute right-10 w-14 h-14 rounded-full  flex items-center justify-center transition"
                  >
                    <image href={next} x="0" y="0" width="90" height="90" />
                  </svg>
                )}
              </>
            ) : (
              <>
                {/* DESKTOP */}
                {pageIndex === 0 || viewMode === "single" ? (
                  // SINGLE PAGE
                  <>
                    {!hideArrows && (
                      <>
                        {/* Back Button — يظهر فقط إذا الصفحة > 0 */}
                        {pageIndex > 0 && (
                          <svg
                            width="30"
                            height="30"
                            viewBox="0 0 90 90"
                            onClick={prevPage}
                            className="nav-btn absolute left-10 w-14 h-14 rounded-full flex items-center justify-center z-[9999]  transition"
                          >
                            <image
                              href={back}
                              x="0"
                              y="0"
                              width="90"
                              height="90"
                            />
                          </svg>
                        )}
                      </>
                    )}

                    {/* PANNING WRAPPER */}
                    <div
                      className="bg-white sm:w-auto h-[85vh] rounded-2xl shadow-2xl border flex items-center justify-center overflow-hidden"
                      style={{
                        transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                        transformOrigin: "center top",
                        cursor:
                          zoom === 1
                            ? "default"
                            : isDragging
                            ? "grabbing"
                            : "grab",
                      }}
                    >
                      <div className="max-w-full max-h-full flex justify-center items-center">
                        {pages[pageIndex]}
                      </div>
                    </div>
                    {!hideArrows && (
                      <svg
                        width="30"
                        height="30"
                        viewBox="0 0 90 90"
                        onClick={nextPage}
                        className="nav-btn absolute right-10 w-14 h-14 rounded-full  flex items-center justify-center transition"
                      >
                        <image href={next} x="0" y="0" width="90" height="90" />
                      </svg>
                    )}
                  </>
                ) : (
                  // SPREAD 2 PAGES
                  <>
                    {!hideArrows && (
                      <>
                        {/* Back Button — يظهر فقط إذا الصفحة > 0 */}
                        {pageIndex > 0 && (
                          <svg
                            width="30"
                            height="30"
                            viewBox="0 0 90 90"
                            onClick={prevPage}
                            className="nav-btn absolute left-10 w-14 h-14 rounded-full flex items-center justify-center z-[9999]  transition"
                          >
                            <image
                              href={back}
                              x="0"
                              y="0"
                              width="90"
                              height="90"
                            />
                          </svg>
                        )}
                      </>
                    )}

                    {/* PANNING WRAPPER */}
                    <div
                      className="bg-white sm:w-auto h-[85vh] rounded-2xl shadow-2xl border grid grid-cols-2 overflow-hidden"
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      style={{
                        transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                        transformOrigin: "center top",
                        cursor:
                          zoom === 1
                            ? "default"
                            : isDragging
                            ? "grabbing"
                            : "grab",
                      }}
                    >
                      <div className="flex justify-center items-center border-r">
                        {pages[pageIndex]}
                      </div>

                      <div className="flex justify-center items-center border-l">
                        {pages[pageIndex + 1]}
                      </div>
                    </div>
                    {!hideArrows && (
                      <svg
                        width="30"
                        height="30"
                        viewBox="0 0 90 90"
                        onClick={nextPage}
                        className="nav-btn absolute right-10 w-14 h-14 rounded-full  flex items-center justify-center  transition"
                      >
                        <image href={next} x="0" y="0" width="90" height="90" />
                      </svg>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
        {/* FOOTER */}
        <footer
          className="w-full bg-white border-t border-gray-300 shadow
             flex items-center justify-center gap-3 
             py-0 fixed bottom-0 left-0 z-[9999]"
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 90 90"
            onClick={() => setIsSidebarOpen(true)}
            className="absolute left-3 text-white p-0.5 rounded-lg shadow hover:bg-[#bc90ff] transition"
          >
            <image href={menu} x="0" y="0" width="90" height="90" />
          </svg>
          {/* HOME BUTTON */}
          {pageIndex !== 1 && pageIndex !== 2 && (
            <svg
              width="30"
              height="30"
              viewBox="0 0 90 90"
              onClick={goToIndex}
              className="absolute left-12 text-white rounded-lg p-0.5 shadow hover:bg-[#bc90ff] transition"
            >
              <image href={home} x="0" y="0" width="90" height="90" />
            </svg>
          )}
          <svg
            width="30"
            height="30"
            viewBox="0 0 90 90"
            onClick={() => setZoom((z) => z + 0.2)}
            className="text-white rounded-lg p-0.5 shadow hover:bg-[#bc90ff] transition"
          >
            <image href={zoomIn} x="0" y="0" width="90" height="90" />
          </svg>
          <svg
            width="30"
            height="30"
            viewBox="0 0 90 90"
            onClick={() => {
              setZoom(1); // يرجع الحجم الأصلي
              setOffset({ x: 0, y: 0 }); // يرجع المكان الأصلي
              setIsPanning(false); // يوقف السحب
            }}
            className="text-white rounded-lg p-0.5 shadow hover:bg-[#bc90ff] transition"
          >
            <image href={zoomOut} x="0" y="0" width="90" height="90" />
          </svg>
          <svg
            width="30"
            height="30"
            viewBox="0 0 90 90"
            onClick={toggleFullScreen}
            className="text-white rounded-lg p-0.5 shadow hover:bg-[#bc90ff] transition"
          >
            <image href={fullScreen} x="0" y="0" width="90" height="90" />
          </svg>{" "}
          <div className="flex items-center gap-2 px-1 py-1 pr-4 border-2 border-[#430f68] rounded text-[#430f68] text-center">
            {/* input للذهاب لصفحة */}
            <input
              type="text"
              value={isEditingPage ? goToPageInput : displayedPage}
              onFocus={() => {
                setIsEditingPage(true);
                setGoToPageInput(""); // يفرغ فقط عند بداية الكتابة
              }}
              onChange={(e) => setGoToPageInput(e.target.value)}
              onBlur={() => {
                setIsEditingPage(false); // رجوع لعرض displayedPage عند الخروج
                setGoToPageInput("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  goToPage(Number(goToPageInput));
                  setIsEditingPage(false); // رجوع لوضع العرض
                  setGoToPageInput("");
                }
              }}
              className="w-10 text-center border-none focus:outline-none text-[#430f68] font-medium"
            />

            {/* total pages */}
            <span className="text-[#430f68] font-medium">| {totalPages}</span>
          </div>
          {!isMobile && (
            <>
              <svg
                width="30"
                height="30"
                viewBox="0 0 90 90"
                onClick={() => setViewMode("single")}
                className={`rounded-lg p-0.5 shadow hover:bg-[#bc90ff] transition ${
                  viewMode === "single"
                    ? "text-white bg-[#bc90ff]"
                    : " text-gray-900"
                }`}
              >
                <image href={onePage} x="0" y="0" width="90" height="90" />
              </svg>
              <svg
                width="30"
                height="30"
                viewBox="0 0 90 90"
                onClick={() => setViewMode("spread")}
                className={`rounded-lg p-0.5 shadow hover:bg-[#bc90ff] transition ${
                  viewMode === "spread"
                    ? " text-white bg-[#bc90ff]"
                    : " text-gray-900"
                }`}
              >
                <image href={openBook} x="0" y="0" width="90" height="90" />
              </svg>
            </>
          )}
          {/* Sidebar */}
          {/* Bottom-Left Sidebar */}
          <div
            className={`fixed left-0 bottom-0 w-64 h-[100%] bg-white shadow-2xl z-[99999] rounded-tr-2xl transform transition-transform duration-300 ${
              isSidebarOpen ? "translate-y-0" : "translate-y-full"
            } `}
          >
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl text-[#430f68]  font-semibold">Menu</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-[#430f68] text-xl"
              >
                ✕
              </button>
            </div>

            {/* MENU LIST */}

            <h3 className="text-lg font-semibold text-[#430f68]  mt-6 mb-2 px-3">
              Units 📘
            </h3>

            <ul className="p-3 space-y-2">
              {units.map((unit) => (
                <li
                  key={unit.id}
                  onClick={() => {
                    goToUnit(unit.start);
                    setIsSidebarOpen(false); // يغلق الـ sidebar بعد الضغط
                  }}
                  className="flex items-center gap-3 text-[#430f68] p-3 rounded-lg cursor-pointer bg-purple-100 hover:bg-[#6B40C8] hover:text-white transition"
                >
                  <span className="text-base font-medium">{unit.label}</span>
                </li>
              ))}
            </ul>
          </div>
          {isSidebarOpen && (
            <div
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 z-[99998]"
            ></div>
          )}
        </footer>
      </div>

      <Popup
        isOpen={globalPopupOpen}
        onClose={closePopup}
        isAudio={globalPopupAudio}
        isVideo={globalPopupVideo}
      >
        {globalPopupContent}
      </Popup>
    </>
  );
}
