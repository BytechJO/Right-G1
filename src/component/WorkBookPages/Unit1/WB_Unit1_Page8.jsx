import page_4 from "../../../assets/U1 WB/U1/Right Int WB G1 U18.png";
import arrowBtn from "../../../assets/unit1/imgs/Page 01/Arrow.svg";
import "./WB_Unit1_Page8.css";
const WB_Unit1_Page8 = ({ openPopup }) => {
  return (
    <div
      className="page1-img-wrapper"
      style={{ backgroundImage: `url(${page_4})` }}
    >
      {/* <img src={page_4} /> */}
      <div
        className="wb-unit1-p8-q1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          tabIndex={0}
          role="button"
          aria-label="Open exercise 10"
          onClick={() => openPopup("exercise", { startIndex: 9 })}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPopup("exercise", { startIndex: 9 });
            }
          }}
          style={{ overflow: "visible" }}
        >
          <image className="svg-img"
            href={arrowBtn}
            x="0"
            y="0"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
          />
        </svg>
      </div>

      <div
        className="wb-unit1-p8-q2 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          tabIndex={0}
          role="button"
          aria-label="Open exercise 11"
          onClick={() => openPopup("exercise", { startIndex: 10 })}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPopup("exercise", { startIndex: 10 });
            }
          }}
          style={{ overflow: "visible" }}
        >
          <image className="svg-img"
            href={arrowBtn}
            x="0"
            y="0"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
          />
        </svg>
      </div>
      <div
        className="wb-unit1-p8-q3 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          tabIndex={0}
          role="button"
          aria-label="Open exercise 12"
          onClick={() => openPopup("exercise", { startIndex: 11 })}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPopup("exercise", { startIndex: 11 });
            }
          }}
          style={{ overflow: "visible" }}
        >
          <image className="svg-img"
            href={arrowBtn}
            x="0"
            y="0"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
          />
        </svg>
      </div>
    </div>
  );
};

export default WB_Unit1_Page8;
