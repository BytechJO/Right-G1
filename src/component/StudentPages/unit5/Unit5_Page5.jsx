import page_5 from "../../../assets/unit5/imgs/Right 1 Unit 05 Welcome to My Class5.jpg";
import arrowBtn from "../../../assets/unit1/imgs/Page 01/Arrow.svg";
import "./Unit5_Page5.css";

const Unit5_Page5 = ({ openPopup }) => {
  return (
    <div
      className="page1-img-wrapper"
      style={{ backgroundImage: `url(${page_5})` }}
    >
      {/* Exercise 1 */}
      <div
        className="click-icon-unit5-page5-1 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          tabIndex={0}
          role="button"
          aria-label="Open exercise 1"
          onClick={() => openPopup("exercise", { startIndex: 50 })}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPopup("exercise", { startIndex: 50 });
            }
          }}
          style={{
            overflow: "visible",
            cursor: "pointer",
          }}
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
        className="click-icon-unit5-page5-2 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          tabIndex={0}
          role="button"
          aria-label="Open exercise 2"
          onClick={() => openPopup("exercise", { startIndex: 51 })}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPopup("exercise", { startIndex: 51 });
            }
          }}
          style={{
            overflow: "visible",
            cursor: "pointer",
          }}
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
        className="click-icon-unit5-page5-3 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          tabIndex={0}
          role="button"
          aria-label="Open exercise 3"
          onClick={() => openPopup("exercise", { startIndex: 52 })}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPopup("exercise", { startIndex: 52 });
            }
          }}
          style={{
            overflow: "visible",
            cursor: "pointer",
          }}
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
        className="click-icon-unit5-page5-4 hover:scale-110 transition"
        style={{ overflow: "visible" }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 90 90"
          tabIndex={0}
          role="button"
          aria-label="Open exercise 4"
          onClick={() => openPopup("exercise", { startIndex: 53 })}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPopup("exercise", { startIndex: 53 });
            }
          }}
          style={{
            overflow: "visible",
            cursor: "pointer",
          }}
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

export default Unit5_Page5;
