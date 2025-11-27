import { useState, useEffect, useRef } from "react";
import { GrLinkNext } from "react-icons/gr";
import { IoMdArrowBack } from "react-icons/io";
import next from "../assets/unit1/imgs/next btn.svg";
import back from "../assets/unit1/imgs/back btn.svg";
import { FaHome } from "react-icons/fa";
import { MdOutlineZoomIn } from "react-icons/md";
import { MdOutlineZoomOut } from "react-icons/md";
import { LuFullscreen } from "react-icons/lu";
import { RiBookOpenLine } from "react-icons/ri";
import { AiOutlineBook } from "react-icons/ai";
import { IoMdMenu } from "react-icons/io";
import Popup from "./Popup/Popup";
import logo from "../assets/unit1/imgs/PreissMurphy Logo-BGSDEhSA (1).svg";
//===================== unit 1 pages
import Page1 from "./unit1/Page1";
import Page2 from "./unit1/Page2";
import Page3 from "./unit1/Page3";
import Page4 from "./unit1/Page4";
import Page5 from "./unit1/Page5";
import Page6 from "./unit1/Page6";
import Page7 from "./unit1/Page7";
import Page8 from "./unit1/Page8";
import Page9 from "./unit1/Page9";

//==================== unit 2 pages
import Unit2_Page1 from "./unit2/Unit2_Page1";
import Unit2_Page2 from "./unit2/Unit2_Page2";
import Unit2_Page3 from "./unit2/Unit2_Page3";
import Unit2_Page4 from "./unit2/Unit2_Page4";
import Unit2_Page5 from "./unit2/Unit2_Page5";
import Unit2_Page6 from "./unit2/Unit2_Page6";
import Unit2_Page7 from "./unit2/Unit2_Page7";
import Unit2_Page8 from "./unit2/Unit2_Page8";
import Unit2_Page9 from "./unit2/Unit2_Page9";
import Unit2_Page10 from "./unit2/Unit2_Page10";
import Unit2_Page11 from "./unit2/Unit2_Page11";
import Unit2_Page12 from "./unit2/Unit2_Page12";

// ==================== unit 3 pages
import Unit3_Page1 from "./unit3/Unit3_Page1";
import Unit3_Page2 from "./unit3/Unit3_Page2";
import Unit3_Page3 from "./unit3/Unit3_Page3";
import Unit3_Page4 from "./unit3/Unit3_Page4";
import Unit3_Page5 from "./unit3/Unit3_Page5";
import Unit3_Page6 from "./unit3/Unit3_Page6";

//==================== unit 4 pages
import Unit4_Page1 from "./unit4/Unit4_Page1";
import Unit4_Page2 from "./unit4/Unit4_Page2";
import Unit4_Page3 from "./unit4/Unit4_Page3";
import Unit4_Page4 from "./unit4/Unit4_Page4";
import Unit4_Page5 from "./unit4/Unit4_Page5";
import Unit4_Page6 from "./unit4/Unit4_Page6";

//=================== Review3,4
import Review3_Page1 from "./Review_Unit3,4/Review3_Page1";
import Review3_Page2 from "./Review_Unit3,4/Review3_Page2 ";
import Review4_Page1 from "./Review_Unit3,4/Review4_Page1";
import Review4_Page2 from "./Review_Unit3,4/Review4_Page2";
import Unit4_Reading_P1 from "./unit4/Unit4_Reading_P1";
import Unit4_Reading_P2 from "./unit4/Unit4_Reading_P2";

//================== unit 5 pages
import Unit5_Page1 from "./unit5/Unit5_Page1";
import Unit5_Page2 from "./unit5/Unit5_Page2";
import Unit5_Page3 from "./unit5/Unit5_Page3";
import Unit5_Page4 from "./unit5/Unit5_Page4";
import Unit5_Page5 from "./unit5/Unit5_Page5";
import Unit5_Page6 from "./unit5/Unit5_Page6";

//================== unit 6 pages
import Unit6_Page1 from "./unit6/Unit6_Page1";
import Unit6_Page2 from "./unit6/Unit6_Page2";
import Unit6_Page3 from "./unit6/Unit6_Page3";
import Unit6_Page4 from "./unit6/Unit6_Page4";
import Unit6_Page5 from "./unit6/Unit6_Page5";
import Unit6_Page6 from "./unit6/Unit6_Page6";

// ==================Review5,6
import Review5_Page1 from "./Review_Unit5,6/Review5_Page1";
import Review5_Page2 from "./Review_Unit5,6/Review5_Page2 ";
import Review6_Page1 from "./Review_Unit5,6/Review6_Page1";
import Review6_Page2 from "./Review_Unit5,6/Review6_Page2";
import Unit6_Reading_P1 from "./unit6/Unit6_Reading_P1";
import Unit6_Reading_P2 from "./unit6/Unit6_Reading_P2";

//================ Unit7
import Unit7_Page1 from "./unit7/Unit7_Page1";
import Unit7_Page2 from "./unit7/Unit7_Page2";
import Unit7_Page3 from "./unit7/Unit7_Page3";
import Unit7_Page4 from "./unit7/Unit7_Page4";
import Unit7_Page5 from "./unit7/Unit7_Page5";
import Unit7_Page6 from "./unit7/Unit7_Page6";

//=============== unit8
import Unit8_Page1 from "./unit8/Unit8_Page1";
import Unit8_Page2 from "./unit8/Unit8_Page2";
import Unit8_Page3 from "./unit8/Unit8_Page3";
import Unit8_Page4 from "./unit8/Unit8_Page4";
import Unit8_Page5 from "./unit8/Unit8_Page5";
import Unit8_Page6 from "./unit8/Unit8_Page6";

//================== Unit 9
import Unit9_Page1 from "./unit9/Unit9_Page1";
import Unit9_Page2 from "./unit9/Unit9_Page2";
import Unit9_Page3 from "./unit9/Unit9_Page3";
import Unit9_Page4 from "./unit9/Unit9_Page4";
import Unit9_Page5 from "./unit9/Unit9_Page5";
import Unit9_Page6 from "./unit9/Unit9_Page6";

//================= Unit10
import Unit10_Page1 from "./unit10/Unit10_Page1";
import Unit10_Page2 from "./unit10/Unit10_Page2";
import Unit10_Page3 from "./unit10/Unit10_Page3";
import Unit10_Page4 from "./unit10/Unit10_Page4";
import Unit10_Page5 from "./unit10/Unit10_Page5";
import Unit10_Page6 from "./unit10/Unit10_Page6";

export default function Book() {
  const [pageIndex, setPageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1100);
  const [activeTab, setActiveTab] = useState("student");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // ZOOM + VIEW MODE
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState("spread"); // spread | single

  // ==== PANNING ====
  const [isPanning, setIsPanning] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const menuItems = [
    { id: 1, label: "Home", icon: "🏠" },
    { id: 2, label: "Units", icon: "📘" },
  ];
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1100);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
  const [globalPopupOpen, setGlobalPopupOpen] = useState(false);
  const [globalPopupContent, setGlobalPopupContent] = useState(null);
  const [globalPopupAudio, setGlobalPopupAudio] = useState(false);

  const openPopup = (content, isAudio = false) => {
    setGlobalPopupContent(content);
    setGlobalPopupAudio(isAudio);
    setGlobalPopupOpen(true);
  };

  const closePopup = () => {
    setGlobalPopupOpen(false);
    setGlobalPopupContent(null);
  };
  const pages = [
    <Page1 />,
    <Page2 goToUnit={goToUnit} />,
    <Page3 goToUnit={goToUnit} />,
    <Page4 openPopup={openPopup} />,
    <Page5 openPopup={openPopup} />,
    <Page6 openPopup={openPopup} />,
    <Page7 openPopup={openPopup} />,
    <Page8 openPopup={openPopup} />,
    <Page9 openPopup={openPopup} />,
    <Unit2_Page1 openPopup={openPopup} />,
    <Unit2_Page2 openPopup={openPopup} />,
    <Unit2_Page3 openPopup={openPopup} />,
    <Unit2_Page4 openPopup={openPopup} />,
    <Unit2_Page5 openPopup={openPopup} />,
    <Unit2_Page6 openPopup={openPopup} />,
    <Unit2_Page7 openPopup={openPopup} />,
    <Unit2_Page8 openPopup={openPopup} />,
    <Unit2_Page9 openPopup={openPopup} />,
    <Unit2_Page10 openPopup={openPopup} />,
    <Unit2_Page11 openPopup={openPopup} />,
    <Unit2_Page12 openPopup={openPopup} />,
    <Unit3_Page1 openPopup={openPopup} />,
    <Unit3_Page2 openPopup={openPopup} />,
    <Unit3_Page3 openPopup={openPopup} />,
    <Unit3_Page4 openPopup={openPopup} />,
    <Unit3_Page5 openPopup={openPopup} />,
    <Unit3_Page6 openPopup={openPopup} />,
    <Unit4_Page1 openPopup={openPopup} />,
    <Unit4_Page2 openPopup={openPopup} />,
    <Unit4_Page3 openPopup={openPopup} />,
    <Unit4_Page4 openPopup={openPopup} />,
    <Unit4_Page5 openPopup={openPopup} />,
    <Unit4_Page6 openPopup={openPopup} />,
    <Review3_Page1 openPopup={openPopup} />,
    <Review3_Page2 openPopup={openPopup} />,
    <Review4_Page1 openPopup={openPopup} />,
    <Review4_Page2 openPopup={openPopup} />,
    <Unit4_Reading_P1 openPopup={openPopup} />,
    <Unit4_Reading_P2 openPopup={openPopup} />,
    <Unit5_Page1 openPopup={openPopup} />,
    <Unit5_Page2 openPopup={openPopup} />,
    <Unit5_Page3 openPopup={openPopup} />,
    <Unit5_Page4 openPopup={openPopup} />,
    <Unit5_Page5 openPopup={openPopup} />,
    <Unit5_Page6 openPopup={openPopup} />,
    <Unit6_Page1 openPopup={openPopup} />,
    <Unit6_Page2 openPopup={openPopup} />,
    <Unit6_Page3 openPopup={openPopup} />,
    <Unit6_Page4 openPopup={openPopup} />,
    <Unit6_Page5 openPopup={openPopup} />,
    <Unit6_Page6 openPopup={openPopup} />,
    <Review5_Page1 openPopup={openPopup} />,
    <Review5_Page2 openPopup={openPopup} />,
    <Review6_Page1 openPopup={openPopup} />,
    <Review6_Page2 openPopup={openPopup} />,
    <Unit6_Reading_P1 openPopup={openPopup} />,
    <Unit6_Reading_P2 openPopup={openPopup} />,
    <Unit7_Page1 openPopup={openPopup} />,
    <Unit7_Page2 openPopup={openPopup} />,
    <Unit7_Page3 openPopup={openPopup} />,
    <Unit7_Page4 openPopup={openPopup} />,
    <Unit7_Page5 openPopup={openPopup} />,
    <Unit7_Page6 openPopup={openPopup} />,
    // <Unit8_Page1 openPopup={openPopup} />,
    // <Unit8_Page2 openPopup={openPopup} />,
    // <Unit8_Page3 openPopup={openPopup} />,
    // <Unit8_Page4 openPopup={openPopup} />,
    // <Unit8_Page5 openPopup={openPopup} />,
    // <Unit8_Page6 openPopup={openPopup} />,
    // // should chang to review for unit 7+8
    // <Review5_Page1 openPopup={openPopup} />,
    // <Review5_Page2 openPopup={openPopup} />,
    // <Review6_Page1 openPopup={openPopup} />,
    // <Review6_Page2 openPopup={openPopup} />,
    // <Unit6_Reading_P1 openPopup={openPopup} />,
    // <Unit6_Reading_P2 openPopup={openPopup} />,
    // <Unit9_Page1 openPopup={openPopup} />,
    // <Unit9_Page2 openPopup={openPopup} />,
    // <Unit9_Page3 openPopup={openPopup} />,
    // <Unit9_Page4 openPopup={openPopup} />,
    // <Unit9_Page5 openPopup={openPopup} />,
    // <Unit9_Page6 openPopup={openPopup} />,
    //    <Unit10_Page1 openPopup={openPopup} />,
    // <Unit10_Page2 openPopup={openPopup} />,
    // <Unit10_Page3 openPopup={openPopup} />,
    // <Unit10_Page4 openPopup={openPopup} />,
    // <Unit10_Page5 openPopup={openPopup} />,
    // <Unit10_Page6 openPopup={openPopup} />,
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
  const handleMenuClick = (id) => {
    if (id === 1) goToHome();
    if (id === 2) goToIndex();
  };
  return (
    <>
      <div
        className="w-full flex flex-col pb-20"
        style={{ overflowX: "hidden", overflowY: "auto" }}
      >
        {/* NAVBAR */}
        <nav className="w-full bg-[#2c5287] text-white border-b shadow px-6 py-2 flex items-center justify-between">
          {/* LEFT SECTION: LOGO + TABS */}
          <div className="flex items-center gap-10">
            {/* 🔵 LOGO بدل النص */}
            <img
              src={logo}
              alt="J1 Logo"
              style={{ height: "40px", width: "100px" }}
            />

            {/* TABS */}
            <div className="flex items-center gap-3">
              {[
                { id: "student", label: "Student’s Book" },
                { id: "work", label: "Workbook" },
                { id: "teacher", label: "Teacher’s Book" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
            px-2 rounded-lg font-medium transition-all duration-300
            ${
              activeTab === tab.id
                ? "bg-white text-[#2c5287] shadow-md scale-95 border-b-4 border-yellow-400"
                : "bg-transparent text-gray-200 hover:text-white hover:bg-white/10"
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
            <span className="cursor-pointer hover:text-gray-300">
              Student Edition
            </span>
          </div>
        </nav>

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
             py-1.5 fixed bottom-0 left-0 z-[9999]"
        >
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute left-3 bg-[#2c5287] text-white p-0.5 rounded-lg shadow hover:bg-[#426ca7] transition"
          >
            <IoMdMenu size={18} />
          </button>
          {/* HOME BUTTON */}
          {pageIndex !== 1 && pageIndex !== 2 && (
            <button
              onClick={goToIndex}
              className="bg-[#2c5287] text-white rounded-lg p-0.5 shadow hover:bg-[#426ca7] transition"
            >
              <FaHome size={18} />
            </button>
          )}
          <button
            onClick={() => setZoom((z) => z + 0.2)}
            className="bg-[#2c5287] text-white rounded-lg p-0.5 shadow hover:bg-[#426ca7] transition"
          >
            <MdOutlineZoomIn size={18} />
          </button>

          <button
            onClick={() => {
              setZoom(1); // يرجع الحجم الأصلي
              setOffset({ x: 0, y: 0 }); // يرجع المكان الأصلي
              setIsPanning(false); // يوقف السحب
            }}
            className="bg-[#2c5287] text-white rounded-lg p-0.5 shadow hover:bg-[#426ca7] transition"
          >
            <MdOutlineZoomOut size={18} />
          </button>

          <button
            onClick={toggleFullScreen}
            className="bg-[#2c5287] text-white rounded-lg p-0.5 shadow hover:bg-[#426ca7] transition"
          >
            <LuFullscreen size={18} />
          </button>
          {!isMobile && (
            <>
              <button
                onClick={() => setViewMode("single")}
                className={`rounded-lg p-0.5 shadow hover:bg-[#426ca7] transition ${
                  viewMode === "single"
                    ? "bg-[#2c5287] text-white"
                    : "bg-gray-300 text-gray-900"
                }`}
              >
                <AiOutlineBook size={18} />
              </button>

              <button
                onClick={() => setViewMode("spread")}
                className={`rounded-lg p-0.5 shadow hover:bg-[#426ca7] transition ${
                  viewMode === "spread"
                    ? "bg-[#2c5287] text-white"
                    : "bg-gray-300 text-gray-900"
                }`}
              >
                <RiBookOpenLine size={18} />
              </button>
            </>
          )}

          {/* Sidebar */}

          {/* Bottom-Left Sidebar */}
          <div
            className={`
    fixed left-0 bottom-0 
    w-64 h-[100%] 
    bg-white shadow-2xl z-[99999] 
    rounded-tr-2xl
    transform transition-transform duration-300
    ${isSidebarOpen ? "translate-y-0" : "translate-y-full"}
  `}
          >
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl text-[#2c5287] font-semibold">Menu</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-yellow-500 text-xl"
              >
                ✕
              </button>
            </div>

            {/* MENU LIST */}
            <ul className="p-3 space-y-2">
              {menuItems.map((item) => (
                <li
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className="
          flex items-center gap-3 text-[#2c5287]
          p-3 rounded-lg cursor-pointer
          bg-gray-100 hover:bg-[#2c5287] hover:text-white 
          transition
        "
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-base font-medium">{item.label}</span>
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
      >
        {globalPopupContent}
      </Popup>
    </>
  );
}
