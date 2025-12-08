import { useState, useEffect, useRef } from "react";

// === LAYOUT ===
import TopNavbar from "./Book/Navbar/TopNavbar";
import BottomBar from "./Book/Navbar/BottomBar";
import LeftSidebar from "./Book/Sidebars/LeftSidebar";
import RightSidebar from "./Book/Sidebars/RightSidebar";

// === VIEWERS ===
import FlashCardViewer from "./FlashCardPages/FlashCardPages";
import PosterViewer from "./PosterGrammerPages/PosterGrammerPages";

// === POPUP ===
import Popup from "./Popup/Popup";
import LessonNavigator from "./StudentPages/LessonNavigator";

// === ASSETS ===
import logo from "../assets/unit1/imgs/Page 01/PMAAlogo.svg";
import menu from "../assets/unit1/imgs/Page 01/menu.svg";
import next from "../assets/unit1/imgs/Page 01/next btn.svg";
import back from "../assets/unit1/imgs/Page 01/back btn.svg";
import home from "../assets/unit1/imgs/Page 01/home.svg";
import fullScreen from "../assets/unit1/imgs/Page 01/fullscreen.svg";
import zoomIn from "../assets/unit1/imgs/Page 01/zoom in.svg";
import zoomOut from "../assets/unit1/imgs/Page 01/zoom out.svg";
import onePage from "../assets/unit1/imgs/Page 01/one page.svg";
import openBook from "../assets/unit1/imgs/Page 01/open-book.svg";
import { FaKey } from "react-icons/fa";
import audioBtn from "../assets/unit1/imgs/Page 01/Audio btn.svg";
import arrowBtn from "../assets/unit1/imgs/Page 01/Arrow.svg";
import pauseBtn from "../assets/unit1/imgs/Right Video Button.svg";
// === PAGES DATA ===
import {
  studentPages,
  workbookPages,
  teacherPages,
  flashPages,
  posterPages,
} from "./BookData";
import WorkBookNavigator from "./WorkBookPages/WorkBookNavigator";

export default function Book() {
  // ===========================================================
  //                 📌 STATE
  // ===========================================================
  const [pageIndex, setPageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "student";
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1200);

  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState("spread");

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const [leftBarOpen, setLeftBarOpen] = useState(false);
  const [rightBarOpen, setRightBarOpen] = useState(false);

  // Popup
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState(null);
  const [mobileTabsOpen, setMobileTabsOpen] = useState(false);
  // ===========================================================
  //                 📌 PAGE LIST SELECTOR
  // ===========================================================
  const pages = {
    student: studentPages(openPopup, goToUnit),
    work: workbookPages(openPopup, goToUnit),
    teacher: teacherPages,
    flash: flashPages,
    poster: posterPages.map((p) => (
      <PosterViewer poster={p} openPopup={openPopup} />
    )),
  }[activeTab];

  // ===========================================================
  //                 📌 POPUP HANDLERS
  // ===========================================================
  function openPopup(type, data) {
    setPopupContent({ type, data, tab: activeTab });
    setPopupOpen(true);
  }
  function closePopup() {
    setPopupOpen(false);
  }

  // ===========================================================
  //                 📌 RESIZE LISTENER
  // ===========================================================
  useEffect(() => {
    const resize = () => {
      const mobile = window.innerWidth <= 1200;
      setIsMobile(mobile);

      if (mobile) {
        setViewMode("single"); // 🔥 إجبار الموبايل على single mode
      }
    };

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    setPageIndex(0);
    setOffset({ x: 0, y: 0 });
    setZoom(1);
    localStorage.setItem("activeTab", activeTab);
    localStorage.setItem("pageIndex", pageIndex);
    if (activeTab === "poster" || activeTab === "flash") {
      setViewMode("single"); // بوستر = صفحة واحدة دائمًا
    } else {
      if (!isMobile) {
        setViewMode("spread"); // لو الشاشة كبيرة → رجّع صفحتين
      } else {
        setViewMode("single"); // لو شاشة صغيرة → صفحة واحدة دائمًا
      }
    }
  }, [activeTab, isMobile]);

  // ===========================================================
  //                 📌 PAGE NAVIGATION
  // ===========================================================
  function goToUnit(index) {
    setPageIndex(index - 1);
    // ===========================
    // ❌ التحقق من إدخال غير صحيح
    // ===========================
    if (isNaN(index) || index < 1 || index > pages.length) {
      // رجّعه للفهرس (الصفحة الثانية لأن الأولى سينجل)
      setPageIndex(1);
      return;
    }
  }

  const goToPage = (pageNumber) => {
    const num = Number(pageNumber);

    // ===========================
    // ❌ التحقق من إدخال غير صحيح
    // ===========================
    if (isNaN(num) || num < 1 || num > pages.length) {
      setPageIndex(1); // رجّعه للصفحة الثانية دائماً
      return;
    }

    // ===========================
    // 📘 Special Logic for WORKBOOK Spread (reverse pages)
    // ===========================
    if (activeTab === "work" && !isMobile && viewMode === "spread") {
      // الصفحة 1 تكون سينجل دائماً
      if (num === 1) {
        setPageIndex(0);
        return;
      }

      // الصفحة 2 تكون سينجل دائماً
      if (num === 2) {
        setPageIndex(1);
        return;
      }

      // بعد الصفحة الثانية: left page يجب أن تكون فردية دائماً
      let leftPage = num % 2 === 0 ? num - 1 : num;
      let targetIndex = leftPage - 1;

      // لا تسمح أن يقل عن الصفحة الثالثة
      if (targetIndex < 2) targetIndex = 2;

      setPageIndex(targetIndex);
      return;
    }

    // ===========================
    // 📱 Mobile OR single mode
    // ===========================
    if (isMobile || viewMode === "single") {
      setPageIndex(num - 1);
      return;
    }

    // ===========================
    // 📘 Spread Mode (لجميع التابات الأخرى)
    // ===========================
    if (num === 1) {
      setPageIndex(0);
      return;
    }

    // لو فردية → اعرض السابقة
    if (num % 2 === 1) {
      setPageIndex(num - 2);
      return;
    }

    // لو زوجية → اعرضها مع التالية
    setPageIndex(num - 1);
  };

  const nextPage = () => {
 
    // =============== Posters → always single ===============
    if (activeTab === "poster" || activeTab === "flash") {
      if (pageIndex < pages.length - 1) {
        setPageIndex(pageIndex + 1);
      }
      return;
    }

    // =============== WORKBOOK LOGIC ===============
    if (activeTab === "work" && !isMobile && viewMode === "spread") {
      // الصفحة 1 → single
      if (pageIndex === 0) {
        setPageIndex(1);
        return;
      }

      // الصفحة 2 → single
      if (pageIndex === 1) {
        setPageIndex(2); // الآن start spread (show page 3–4)
        return;
      }

      // من الآن spread → زيادة 2
      if (pageIndex + 2 < pages.length) {
        setPageIndex(pageIndex + 2);
        return;
      }

      return;
    }

    // =============== DEFAULT LOGIC FOR OTHER TABS ===============
    if (isMobile || viewMode === "single") {
      if (pageIndex < pages.length - 1) {
        setPageIndex(pageIndex + 1);
      }
    } else {
      if (pageIndex === 0) {
        setPageIndex(1);
      } else if (pageIndex < pages.length - 2) {
        setPageIndex(pageIndex + 2);
      }
    }
  };

  const prevPage = () => {
    
    // Posters → always one page
    if (activeTab === "poster" || activeTab === "flash") {
      if (pageIndex > 0) setPageIndex(pageIndex - 1);
      return;
    }
    // Normal logic
    if (isMobile || viewMode === "single") {
      if (pageIndex > 0) setPageIndex(pageIndex - 1);
    } else {
      if (pageIndex === 1) setPageIndex(0);
      else if (pageIndex > 1) setPageIndex(pageIndex - 2);
    }
  };

  function goHome() {
    setPageIndex(1);
  }

  // ===========================================================
  //                 📌 FULLSCREEN
  // ===========================================================
  function toggleFullScreen() {
    const el = document.documentElement;
    if (!document.fullscreenElement) el.requestFullscreen();
    else document.exitFullscreen();
  }

  // ===========================================================
  //                 📌 ZOOM & PANNING
  // ===========================================================
  function resetZoom() {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }

  function handleMouseDown(e) {
    if (zoom === 1) return;
    setIsDragging(true);
    start.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  }

  function handleMouseMove(e) {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - start.current.x,
      y: e.clientY - start.current.y,
    });
  }

  function handleMouseUp() {
    setIsDragging(false);
  }

  const start = useRef({ x: 0, y: 0 });

  // ===========================================================
  //                 📌 UNITS LIST
  // ===========================================================
  const units = [
    { id: 1, label: "Unit 1", start: 4, pages: 6 },
    { id: 2, label: "Unit 2", start: 10, pages: 12 },
    { id: 3, label: "Unit 3", start: 22, pages: 9 },
    { id: 4, label: "Unit 4", start: 30, pages: 10 },
    { id: 5, label: "Unit 5", start: 40, pages: 10 },
    { id: 6, label: "Unit 6", start: 50, pages: 10 },
  ];

  // ===========================================================
  //                 📌 PAGE RENDERER
  // ===========================================================
  function renderPage(content) {
    if (activeTab === "flash") {
      return <FlashCardViewer card={content} openPopup={openPopup} />;
    }
    if (typeof content === "string") {
      return <img src={content} className="w-full h-full object-contain" />;
    }
    return content;
  }

  // ===========================================================
  //                 📌 TABS DEFINITION
  // ===========================================================
  const tabs = [
    { id: "student", label: "Student’s Book" },
    { id: "work", label: "Workbook" },
    { id: "teacher", label: "Teacher’s Book" },
    { id: "flash", label: "Flashcards" },
    { id: "poster", label: "Posters" },
  ];

  // ===========================================================
  //                 📌 RENDER
  // ===========================================================
  return (
    <>
      {/* ===================== TOP NAV ===================== */}
      <TopNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        logo={logo}
        menuIcon={menu}
        tabs={tabs}
        mobileTabsOpen={mobileTabsOpen}
        setMobileTabsOpen={setMobileTabsOpen}
        isMobile={isMobile}
      />

      {/* ===================== MAIN PAGE VIEW ===================== */}
      <div
        className="content-wrapper overflow-auto lg:overflow-hidden w-full h-[88vh] flex items-center justify-center relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* ==== NAVIGATION ARROWS (Next / Prev) ==== */}
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

        {pageIndex < pages.length - 1 && (
          <svg
            width="30"
            height="30"
            viewBox="0 0 90 90"
            onClick={nextPage}
            className="nav-btn absolute right-10 w-14 h-14 rounded-full  flex items-center justify-center z-[99999999] transition"
          >
            <image href={next} x="0" y="0" width="90" height="90" />
          </svg>
        )}

        {/* POSTERS ALWAYS SINGLE PAGE */}
        {isMobile ||
        activeTab === "poster" ||
        activeTab === "flash" ||
        viewMode === "single" ||
        pageIndex === 0 ||
        (activeTab === "work" && pageIndex <= 1) ? (
          <div
            className="bg-white rounded-2xl shadow-2xl border flex items-center justify-center overflow-hidden"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
              cursor: zoom === 1 ? "default" : isDragging ? "grabbing" : "grab",
            }}
          >
            {renderPage(pages[pageIndex])}
          </div>
        ) : (
          // Spread Mode

          <div
            className="bg-white rounded-2xl shadow-2xl border grid grid-cols-2 overflow-hidden"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
              cursor: zoom === 1 ? "default" : isDragging ? "grabbing" : "grab",
            }}
          >
            {/* WORKBOOK → منقلب (الزوجي على اليمين، الفردي على اليسار) */}
            {activeTab === "work" ? (
              <>
                <div className="flex items-center justify-center border-r">
                  {renderPage(pages[pageIndex])} {/* RIGHT PAGE */}
                </div>
                <div className="flex items-center justify-center border-l">
                  {renderPage(pages[pageIndex + 1])} {/* LEFT PAGE */}
                </div>
              </>
            ) : (
              /* باقي التابات → طبيعي */
              <>
                <div className="flex items-center justify-center border-r">
                  {renderPage(pages[pageIndex])}
                </div>
                <div className="flex items-center justify-center border-l">
                  {renderPage(pages[pageIndex + 1])}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ===================== BOTTOM BAR ===================== */}
      <BottomBar
        pageIndex={pageIndex}
        totalPages={pages.length}
        goToIndex={goHome}
        zoomIn={() => setZoom((z) => z + 0.2)}
        zoomOut={() => setZoom((z) => z - 0.2)}
        resetZoom={resetZoom}
        toggleFullScreen={toggleFullScreen}
        goToPage={goToPage}
        isMobile={isMobile}
        viewMode={viewMode}
        activeTab={activeTab}
        setViewMode={setViewMode}
        icons={{
          menu,
          home,
          zoomIn,
          zoomOut,
          fullScreen,
          onePage,
          openBook,
          openSidebar: () => setLeftBarOpen(true),
          openRightSidebar: () => setRightBarOpen(true),
          keyIcon: FaKey,
        }}
      />

      {/* ===================== LEFT SIDEBAR ===================== */}
      <LeftSidebar
        isOpen={leftBarOpen}
        close={() => setLeftBarOpen(false)}
        units={units}
        goToPage={goToPage}
      />

      {/* ===================== RIGHT SIDEBAR ===================== */}
      <RightSidebar
        isOpen={rightBarOpen}
        close={() => setRightBarOpen(false)}
        menu={[
          { key: "audio", label: "Audio Button", icon: audioBtn },
          { key: "video", label: "Video Button", icon: pauseBtn },
          { key: "arrow", label: "Arrow Button", icon: arrowBtn },
          { key: "prev", label: "Prev Button", icon: back },
          { key: "next", label: "Next Button", icon: next },
        ]}
      />
      {mobileTabsOpen && (
        <div className="lg:hidden bg-white shadow-md border-b px-4 py-3 absolute w-full z-[9999]">
          {tabs.map((tab) => (
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
          }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
      {/* ===================== POPUP ===================== */}
      <Popup isOpen={popupOpen} onClose={closePopup} type={popupContent?.type}>
        {/* لو المستخدم داخل Workbook */}
        {popupContent?.tab === "work" && popupContent?.type === "exercise" && (
          <>
            {/* محتوى خاص للورك بوك */}

            <WorkBookNavigator
              startIndex={popupContent.data.startIndex}
              mode="workbook"
            />
          </>
        )}

        {/* لو كان تبويب غير Workbook */}
        {popupContent?.tab !== "work" && popupContent?.type === "exercise" && (
          <LessonNavigator startIndex={popupContent.data.startIndex} />
        )}

        {/* باقي الأنواع */}
        {popupContent?.type !== "exercise" && popupContent?.data}
      </Popup>
    </>
  );
}
