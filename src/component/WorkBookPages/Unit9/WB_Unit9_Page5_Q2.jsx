import React, { useEffect, useRef, useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";

import CatSvg from "../../../assets/U1 WB/U9/U9P55EXEK-01 1.svg";
import HorseSvg from "../../../assets/U1 WB/U9/U9P55EXEK-02 1.svg";
import DogSvg from "../../../assets/U1 WB/U9/U9P55EXEK-03.svg";

import "./WB_Unit9_Page5_Q2.css";
import ExerciseHeader from "../../ExerciseHeader";
import useUnit9Audio from "./useUnit9Audio";
import Unit9PlayingAudioIcon from "./Unit9PlayingAudioIcon";
import horseAudio from "../../../assets/U1 WB/U9/audio/page55- K/Item_001_horse.mp3";
import cowAudio from "../../../assets/U1 WB/U9/audio/page55- K/Item_004_cow.mp3";
import chickenAudio from "../../../assets/U1 WB/U9/audio/page55- K/Item_005_chicken.mp3";
import goatAudio from "../../../assets/U1 WB/U9/audio/page55- K/Item_007_goat.mp3";
import catAudio from "../../../assets/U1 WB/U9/audio/page55- K/Item_008_cat.mp3";
import dogAudio from "../../../assets/U1 WB/U9/audio/page56- A/Item_006_dog.mp3";

const WB_Unit9_Page5_Q2 = () => {
  const items = [
    {
      Svg: CatSvg,
      options: ["cat", "cow"],
      correct: "cat",
      position: "top-left",
    },
    {
      Svg: HorseSvg,
      options: ["horse", "chicken"],
      correct: "horse",
      position: "right",
    },
    {
      Svg: DogSvg,
      options: ["goat", "dog"],
      correct: "dog",
      position: "bottom-left",
    },
  ];

  const [selected, setSelected] = useState(Array(items.length).fill(""));
  const [lockedItems, setLockedItems] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [wrongChoices, setWrongChoices] = useState([]);

  const paletteColors = ["brown", "rgb(255, 187, 0)", "blue", "red"];

  const [activePaletteIndex, setActivePaletteIndex] = useState(null);
  const [selectedColors, setSelectedColors] = useState(items.map(() => null));
  const [svgContent, setSvgContent] = useState({});
  const paletteRefs = useRef({});
  const itemRefs = useRef({});
  const { activeAudioKey, playAudio } = useUnit9Audio();
  const optionAudios = { horse: horseAudio, cow: cowAudio, chicken: chickenAudio, goat: goatAudio, cat: catAudio, dog: dogAudio };
  useEffect(() => {
    const loadSvgs = async () => {
      const files = [CatSvg, HorseSvg, DogSvg];

      const contents = await Promise.all(
        files.map((file) =>
          fetch(file)
            .then((r) => r.text())
            .then((text) =>
              text
                .replaceAll('fill="none"', 'fill="currentColor"')
                .replaceAll(/stroke="[^"]*"/g, 'stroke="currentColor"'),
            ),
        ),
      );

      setSvgContent(contents);
    };

    loadSvgs();
  }, []);

  /* ================= COLOR ================= */

  const openPalette = (index) => {
    if (showAnswer || lockedItems.includes(index)) return;
    setActivePaletteIndex(index);
    requestAnimationFrame(() => paletteRefs.current[index]?.[0]?.focus());
  };

  const closePalette = (index) => {
    setActivePaletteIndex(null);
    requestAnimationFrame(() => itemRefs.current[index]?.focus());
  };

  const handlePaletteKeyDown = (event, itemIndex, colorIndex) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closePalette(itemIndex);
      return;
    }
    if (event.key === "Tab") {
      event.preventDefault();
      const direction = event.shiftKey ? -1 : 1;
      const nextIndex = (colorIndex + direction + paletteColors.length) % paletteColors.length;
      paletteRefs.current[itemIndex]?.[nextIndex]?.focus();
    }
  };

  /* ================= CIRCLE ================= */

  const handleSelect = (value, index) => {
    if (showAnswer || lockedItems.includes(index)) return;
    const newSel = [...selected];
    newSel[index] = value;
    setSelected(newSel);
    setWrongChoices((current) => current.filter((itemIndex) => itemIndex !== index));
  };

  /* ================= CHECK ================= */

  const checkAnswers = () => {
    if (showAnswer || lockedItems.length === items.length) return;

    if (selected.some((s) => s === "")) {
      ValidationAlert.info("Please circle the correct word!");
      return;
    }

    let score = 0;
    let wrongs = [];

    items.forEach((item, i) => {
      if (selected[i] === item.correct) {
        score++;
      } else {
        wrongs.push(i); // ❌ هذا الاختيار غلط
      }
    });

    setWrongChoices(wrongs);
    setLockedItems(items.map((_, index) => index).filter((index) => !wrongs.includes(index)));

    const total = items.length;
    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const scoreMessage = `
    <div style="font-size:20px;text-align:center;">
      <b style="color:${color}">Score: ${score} / ${total}</b>
    </div>
  `;

    if (score === total) {
      ValidationAlert.success(scoreMessage);
    } else if (score === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* ================= SHOW ANSWER ================= */

  const showAnswers = () => {
    setSelected(items.map((item) => item.correct));
    setSelectedColors(items.map(() => "#FFD54F"));
    setWrongChoices([]);
    setLockedItems(items.map((_, index) => index));
    setShowAnswer(true);
  };

  /* ================= RESET ================= */

  const resetAll = () => {
    setSelected(Array(items.length).fill(""));
    setWrongChoices([]);
    setLockedItems([]);
    setShowAnswer(false);
    // 🔁 إعادة الصور للون الأسود
    setSelectedColors(items.map(() => null));
    setActivePaletteIndex(null);
  };

  /* ================= JSX ================= */

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <div
        className="div-forall"
        style={
          {
            // gap: "30px",
          }
        }
      >
        <div className="w-full">
        <ExerciseHeader sectionLetter="K" title="Color and circle." subTitle="Name each animal, tap the correct word, then color the picture." />
        <span style={{ fontSize: "14px", color: "gray" }}>
          Hint: Double Click to Color Word
        </span></div>
        <div className="wb-unit9-qk-layout">
          {items.map((item, i) => {
            const SvgComponent = item.Svg;

            return (
              <div key={i} className={`wb-unit9-qk-item ${item.position}`}>
                <div
                  className="wb-unit9-qk-svg-wrapper"
                  onClick={() => openPalette(i)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openPalette(i);
                    }
                  }}
                  ref={(element) => { itemRefs.current[i] = element; }}
                  role="button"
                  tabIndex={showAnswer || lockedItems.includes(i) ? -1 : 0}
                  aria-label={`Color the ${item.correct}`}
                >
                  {/* <SvgComponent
                    className="wb-unit9-qk-svg"
                    style={{ fill: colors[i] }}
                  /> */}
                  {svgContent[i] ? (
                    <div
                      className="svg-wrapper wb-svg-colorable"
                      style={{ color: selectedColors[i] || "#ffffffff" }}
                      dangerouslySetInnerHTML={{ __html: svgContent[i] }}
                    />
                  ) : (
                    <div className="svg-placeholder">Loading...</div>
                  )}
                </div>
                {activePaletteIndex === i && (
                  <div className="color-palette-wb-unit4-p1-q2 ">
                    {paletteColors.map((color, colorIndex) => (
                      <button
                        key={color}
                        ref={(element) => {
                          if (!paletteRefs.current[i]) paletteRefs.current[i] = [];
                          paletteRefs.current[i][colorIndex] = element;
                        }}
                        className="color-circle"
                        style={{ backgroundColor: color }}
                        aria-label={`Color ${item.correct} ${color}`}
                        onClick={() => {
                          const copy = [...selectedColors];
                          copy[i] = color;
                          setSelectedColors(copy);
                          setActivePaletteIndex(null); // سكّر الباليت
                        }}
                        onKeyDown={(event) => handlePaletteKeyDown(event, i, colorIndex)}
                      />
                    ))}
                  </div>
                )}

                <div className="wb-unit9-qk-options">
                  {item.options.map((opt, idx) => (
                    <div
                      key={idx}
                      className={`wb-unit9-qk-option wb-unit9-audio-control ${
                        selected[i] === opt ? "active" : ""
                      }`}
                      onClick={() => {
                        playAudio(`option-${i}-${opt}`, optionAudios[opt]);
                        handleSelect(opt, i);
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`${item.correct} picture: ${opt}`}
                      aria-pressed={selected[i] === opt}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          playAudio(`option-${i}-${opt}`, optionAudios[opt]);
                          handleSelect(opt, i);
                        }
                      }}
                      style={{ position: "relative" }}
                    >
                      {activeAudioKey === `option-${i}-${opt}` && <Unit9PlayingAudioIcon />}
                      {opt}

                      {wrongChoices.includes(i) &&
                        selected[i] === opt && (
                          <div className="wb-unit9-qk-wrong-mark">✕</div>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="action-buttons-container">
        <button onClick={resetAll} className="try-again-button">
          Start Again ↻
        </button>

        <button onClick={showAnswers} className="show-answer-btn swal-continue">
          Show Answer
        </button>

        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default WB_Unit9_Page5_Q2;
