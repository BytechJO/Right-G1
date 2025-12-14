import page_5 from "../../../assets/unit10/imgs/Right G1- Class Book_00086.jpg";
import audioBtn from "../../../assets/unit1/imgs/Page 01/Audio btn.svg";
import arrowBtn from "../../../assets/unit1/imgs/Page 01/Arrow.svg";
import pauseBtn from "../../../assets/unit1/imgs/Right Video Button.svg";
import "./Unit10_Page5.css";

const Unit10_Page5 = ({ openPopup }) => {
  return (
    <div
      className="page1-img-wrapper"
      // onClick={handleImageClick}
      style={{ backgroundImage: `url(${page_5})` }}
    >
      {/* <img src={page_5} /> */}
      <div
        className="click-icon-unit10-page5-1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 60 60"
           style={{ overflow: "visible" }}
          onClick={() => openPopup("exercise", { startIndex: 104 })}
        >
          <image href={arrowBtn} x="0" y="0" width="60" height="60" />
        </svg>
      </div>

      <div
        className="click-icon-unit10-page5-2  hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 60 60"
           style={{ overflow: "visible" }}
          onClick={() => openPopup("exercise", { startIndex: 105 })}
        >
          <image href={arrowBtn} x="0" y="0" width="60" height="60" />
        </svg>
      </div>

      <div
        className="click-icon-unit10-page5-3 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 60 60"
           style={{ overflow: "visible" }}
          onClick={() => openPopup("exercise", { startIndex: 106 })}
        >
          <image href={arrowBtn} x="0" y="0" width="60" height="60" />
        </svg>
      </div>

      <div
        className="click-icon-unit10-page5-4 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 60 60"
           style={{ overflow: "visible" }}
          onClick={() => openPopup("exercise", { startIndex: 107 })}
        >
          <image href={arrowBtn} x="0" y="0" width="60" height="60" />
        </svg>
      </div>
    </div>
  );
};

export default Unit10_Page5;
