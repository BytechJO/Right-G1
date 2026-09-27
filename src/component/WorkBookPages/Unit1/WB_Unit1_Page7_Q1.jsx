import React, { useRef, useState } from "react";
import "./WB_Unit1_Page7_Q1.css";
import goodEveningAudio from "../../../assets/U1 WB/U1/page_7/Item_001_Good_evening!.mp3";
import goodMorningAudio from "../../../assets/U1 WB/U1/page_7/Item_002_Good_morning!.mp3";
import goodAfternoonAudio from "../../../assets/U1 WB/U1/page_7/Item_003_Good_afternoon!.mp3";
import goodbyeAudio from "../../../assets/U1 WB/U1/page_7/Item_004_Goodbye!.mp3";
import howAreYouAudio from "../../../assets/U1 WB/U1/page_7/Item_005_How_are_you.mp3";
const words = [
  {
    text: "Good evening!",
    audio: goodEveningAudio,
  },
  {
    text: "Good morning!",
    audio: goodMorningAudio,
  },
  {
    text: "Good afternoon!",
    audio: goodAfternoonAudio,
  },
  {
    text: "Goodbye!",
    audio: goodbyeAudio,
  },
  {
    text: "How are you?",
    audio: howAreYouAudio,
  },
];

const colors = [
  { name: "Red", value: "red" },
  { name: "Blue", value: "blue" },
  { name: "Green", value: "green" },
  { name: "Orange", value: "orange" },
  { name: "Purple", value: "purple" },
  { name: "Yellow", value: "yellow" },
];

export default function WB_Unit1_Page7_Q1() {
  const [selectedColor, setSelectedColor] = useState(null);

  const [wordColors, setWordColors] = useState(Array(words.length).fill(null));

  const [history, setHistory] = useState([]);

  const [announcement, setAnnouncement] = useState("");
  const audioRef = useRef(null);
  const [playingWord, setPlayingWord] = useState(null);

  const stopAudio = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current = null;

    setPlayingWord(null);
  };

  const playWordAudio = (word, index) => {
    if (!word.audio) return;

    stopAudio();

    const audio = new Audio(word.audio);

    audioRef.current = audio;
    setPlayingWord(index);

    audio.play().catch(() => {
      setPlayingWord(null);
    });

    audio.onended = () => {
      setPlayingWord(null);
      audioRef.current = null;
    };
  };
  // ======================================================
  // SELECT COLOR
  // ======================================================

  const selectColor = (color) => {
    setSelectedColor(color);

    setAnnouncement(
      `${color.name} selected. Choose a greeting to apply the color.`,
    );
  };

  // ======================================================
  // APPLY COLOR
  // ======================================================

  const applyColorToWord = (index) => {
    if (!selectedColor) {
      setAnnouncement("Choose a color first.");
      return;
    }

    // حفظ الحالة السابقة للـUndo
    setHistory((prev) => [...prev, [...wordColors]]);

    setWordColors((prev) => {
      const updated = [...prev];

      updated[index] = selectedColor.value;

      return updated;
    });

    setAnnouncement(`${selectedColor.name} applied to ${words[index]}.`);
  };

  // ======================================================
  // ERASER
  // ======================================================

  const eraseWord = (index) => {
    setHistory((prev) => [...prev, [...wordColors]]);

    setWordColors((prev) => {
      const updated = [...prev];

      updated[index] = null;

      return updated;
    });

    setAnnouncement(`Color removed from ${words[index]}.`);
  };

  // ======================================================
  // WORD ACTION
  // ======================================================

  const handleWordAction = (index) => {
    const word = words[index];

    // الصوت يشتغل دائمًا عند الضغط على الكلمة
    playWordAudio(word, index);

    if (!selectedColor) {
      setAnnouncement(`${word.text}. Choose a color first.`);
      return;
    }

    if (selectedColor.value === "eraser") {
      eraseWord(index);
      return;
    }

    applyColorToWord(index);
  };
  // ======================================================
  // UNDO
  // ======================================================

  const undo = () => {
    if (history.length === 0) {
      setAnnouncement("Nothing to undo.");
      return;
    }

    const previousState = history[history.length - 1];

    setWordColors(previousState);

    setHistory((prev) => prev.slice(0, -1));

    setAnnouncement("Last coloring action undone.");
  };

  // ======================================================
  // RESET
  // ======================================================

  const reset = () => {
    setWordColors(Array(words.length).fill(null));

    setSelectedColor(null);

    setHistory([]);

    setAnnouncement("Activity reset.");
  };

  return (
    <div className="wb-u1-p7-q1-wrapper">
      {/* SCREEN READER STATUS */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>

      <div
        className="div-forall"
        style={{
          gap: "20px",
        }}
      >
        {/* =================================================
            TITLE
        ================================================= */}

        <div className="w-full flex flex-col gap-1">
          <h4 className="header-title-page8">
            <span className="ex-A">I</span>
            Tap or click to color and say the words.
          </h4>
        </div>

        {/* =================================================
            TOOLBAR
        ================================================= */}

        <div className="color-toolbar-wb-u1-p7-q1" aria-label="Color palette">
          {/* COLORS */}

          <div className="color-palette-wb-u1-p7-q1">
            {colors.map((color) => {
              const isSelected = selectedColor?.value === color.value;

              return (
                <button
                  key={color.value}
                  type="button"
                  className={`color-circle-wb-u1-p7-q1 ${
                    isSelected ? "selected-color-wb-u1-p7-q1" : ""
                  }`}
                  style={{
                    backgroundColor: color.value,
                  }}
                  onClick={() => selectColor(color)}
                  aria-label={`Select ${color.name}`}
                  aria-pressed={isSelected}
                  title={color.name}
                />
              );
            })}
          </div>

          {/* ERASER */}

          <button
            type="button"
            className={`tool-button-wb-u1-p7-q1 ${
              selectedColor?.value === "eraser"
                ? "selected-tool-wb-u1-p7-q1"
                : ""
            }`}
            onClick={() =>
              setSelectedColor({
                name: "Eraser",
                value: "eraser",
              })
            }
            aria-pressed={selectedColor?.value === "eraser"}
          >
            Eraser
          </button>

          {/* UNDO */}

          <button
            type="button"
            className="tool-button-wb-u1-p7-q1"
            onClick={undo}
            disabled={history.length === 0}
          >
            Undo
          </button>
        </div>

        {/* SELECTED COLOR TEXT */}

        <div className="selected-color-text-wb-u1-p7-q1" aria-hidden="true">
          {selectedColor ? `Selected: ${selectedColor.name}` : "Choose a color"}
        </div>

        {/* =================================================
            WORDS
        ================================================= */}

        <div className="container3-wb-u1-p7-q1">
          <div className="word-section1-wb-u1-p7-q1">
            {words.map((word, index) => {
              const appliedColor = wordColors[index];
              const isPlaying = playingWord === index;

              return (
                <button
                  key={word.text}
                  type="button"
                  className={`word-color-target-wb-u1-p7-q1 ${
                    appliedColor
                      ? "word-colored-wb-u1-p7-q1"
                      : "word-outline-wb-u1-p7-q1"
                  }`}
                  style={{
                    color: appliedColor || "transparent",
                  }}
                  onClick={() => handleWordAction(index)}
                  aria-label={`${word.text}. ${
                    appliedColor ? `Colored ${appliedColor}.` : "Not colored."
                  } ${
                    selectedColor
                      ? `Press Enter or Space to apply ${selectedColor.name} and hear the greeting.`
                      : "Press Enter or Space to hear the greeting. Choose a color to color it."
                  }`}
                >
                  <span>{word.text}</span>

                  {isPlaying && (
                    <span
                      className="playing-word-wb-u1-p7-q1"
                      aria-hidden="true"
                    >
                      🔊
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* =================================================
          RESET
      ================================================= */}

      <div className="action-buttons-container">
        <button onClick={reset} className="try-again-button">
          Start Again ↻
        </button>
      </div>
    </div>
  );
}
