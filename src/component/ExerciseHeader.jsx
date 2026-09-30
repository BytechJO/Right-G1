import React, { useEffect, useState } from "react";
import SquirrelGif from "../assets/Squirrel_GIF/Squirrel_1164_1433px.gif";

const ExerciseHeader = ({
  sectionLetter,
  questionNumber,
  title,
  subTitle,
  showSquirrel = true,
}) => {
  const [gifSrc, setGifSrc] = useState(SquirrelGif);

  useEffect(() => {
    setGifSrc(`${SquirrelGif}?restart=${Date.now()}`);
  }, [sectionLetter, questionNumber, title, subTitle]);

  return (
    <div
      className="header-title-page8"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
      }}
    >
      {showSquirrel && (
        <img
          src={gifSrc}
          alt="An animated squirrel"
          style={{
            height: "100px",
            width: "auto",
            objectFit: "contain",
            flexShrink: 0,
          }}
        />
      )}

      <div
        className="header-title-page8"
        style={{
          display: "grid",
          gridTemplateColumns: `
            ${sectionLetter ? "auto" : ""}
            ${questionNumber ? "auto" : ""}
            1fr
          `,
          columnGap: "8px",
          rowGap: "8px",
          alignItems: "center",
        }}
      >
        {sectionLetter && <span className="ex-A">{sectionLetter}</span>}

        {questionNumber && (
          <span className="number-of-q">{questionNumber}</span>
        )}

        <header className="header-title-page8" style={{ margin: 0 }}>
          {title}
        </header>

        {subTitle && (
          <p
            className="sub-header"
            style={{
              gridColumn: "-2 / -1",
              margin: 0,
            }}
          >
            {subTitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default ExerciseHeader;
