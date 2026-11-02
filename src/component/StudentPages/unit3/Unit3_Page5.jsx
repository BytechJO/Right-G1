import page_5 from "../../../assets/unit3/imgs3/right1-unit3-page5.jpg";
import arrowBtn from "../../../assets/unit1/imgs/Page 01/Arrow.svg";
import "./Unit3_Page5.css";

const Unit3_Page5 = ({ openPopup }) => {
  const handleKeyDown = (e, startIndex) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPopup("exercise", { startIndex });
    }
  };

  return (
    <div
      className="page1-img-wrapper"
      style={{ backgroundImage: `url(${page_5})` }}
    >
      {/* Exercise 1 */}
      <div
        className="click-icon-unit3-page5-1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          tabIndex={0}
          role="button"
          aria-label="Open exercise 1"
          onClick={() =>
            openPopup("exercise", {
              startIndex: 25,
            })
          }
          onKeyDown={(e) => handleKeyDown(e, 25)}
          style={{ overflow: "visible" }}
        >
          <image
            href={arrowBtn}
            x="0"
            y="0"
            width="90"
            height="90"
            className="svg-img"
          />
        </svg>
      </div>

      {/* Exercise 2 */}
      <div
        className="click-icon-unit3-page5-2 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          tabIndex={0}
          role="button"
          aria-label="Open exercise 2"
          onClick={() =>
            openPopup("exercise", {
              startIndex: 26,
            })
          }
          onKeyDown={(e) => handleKeyDown(e, 26)}
          style={{ overflow: "visible" }}
        >
          <image
            href={arrowBtn}
            x="0"
            y="0"
            width="90"
            height="90"
            className="svg-img"
          />
        </svg>
      </div>

      {/* Exercise 3 */}
      <div
        className="click-icon-unit3-page5-3 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          tabIndex={0}
          role="button"
          aria-label="Open exercise 3"
          onClick={() =>
            openPopup("exercise", {
              startIndex: 27,
            })
          }
          onKeyDown={(e) => handleKeyDown(e, 27)}
          style={{ overflow: "visible" }}
        >
          <image
            href={arrowBtn}
            x="0"
            y="0"
            width="90"
            height="90"
            className="svg-img"
          />
        </svg>
      </div>

      {/* Exercise 4 */}
      <div
        className="click-icon-unit3-page5-4 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          tabIndex={0}
          role="button"
          aria-label="Open exercise 4"
          onClick={() =>
            openPopup("exercise", {
              startIndex: 28,
            })
          }
          onKeyDown={(e) => handleKeyDown(e, 28)}
          style={{ overflow: "visible" }}
        >
          <image
            href={arrowBtn}
            x="0"
            y="0"
            width="90"
            height="90"
            className="svg-img"
          />
        </svg>
      </div>
    </div>
  );
};

export default Unit3_Page5;
