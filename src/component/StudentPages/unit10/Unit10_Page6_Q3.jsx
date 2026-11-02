import { useState } from "react";
import milk from "../../../assets/unit10/imgs/U10P87EXEF-01.svg";
import bread from "../../../assets/unit10/imgs/U10P87EXEF-02.svg";
import apple from "../../../assets/unit10/imgs/U10P87EXEF-03.svg";
import iceCream from "../../../assets/unit10/imgs/U10P87EXEF-04.svg";
import chicken from "../../../assets/unit10/imgs/U10P87EXEF-05.svg";
import milkAudio from "../../../assets/unit10/sound/Page 87 - F/Milk.mp3";
import breadAudio from "../../../assets/unit10/sound/Page 87 - F/Bread.mp3";
import appleAudio from "../../../assets/unit10/sound/Page 87 - F/apple.mp3";
import iceCreamAudio from "../../../assets/unit10/sound/Page 87 - F/ice cream.mp3";
import chickenAudio from "../../../assets/unit10/sound/Page 87 - F/chicken.mp3";
import iWantAudio from "../../../assets/unit10/sound/Page 87 - F/I want..mp3";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import useUnit10Audio from "./useUnit10Audio";
import Unit10PlayingAudioIcon from "./Unit10PlayingAudioIcon";
import "./Unit10_Page6_Q3.css";

const ITEMS = [
  {
    img: milk,
    value: "milk",
    alt: "A pink carton of milk with a cow picture.",
    audio: milkAudio,
  },
  {
    img: bread,
    value: "bread",
    alt: "A loaf and slice of bread on a pink plate.",
    audio: breadAudio,
  },
  {
    img: apple,
    value: "apple",
    alt: "A red apple with a green leaf.",
    audio: appleAudio,
  },
  {
    img: iceCream,
    value: "ice cream",
    alt: "A glass of pink ice cream topped with a cherry.",
    audio: iceCreamAudio,
  },
  {
    img: chicken,
    value: "chicken",
    alt: "A roast chicken on a plate.",
    audio: chickenAudio,
  },
];

const Unit10_Page6_Q3 = () => {
  const [answer, setAnswer] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [wrong, setWrong] = useState(false);
  const [locked, setLocked] = useState(false);
  const [fullAudioReady, setFullAudioReady] = useState(false);
  const { activeAudioKey, playAudio, playAudioSequence, stopAudio } =
    useUnit10Audio();

  const normalize = (value) => value.toLowerCase().replace(/[-_]/g, " ").trim();
  const selectedItem = ITEMS.find((item) => item.value === selectedImage);

  const selectItem = (item) => {
    playAudio(`option-${item.value}`, item.audio);
    if (locked) return;
    setSelectedImage(item.value);
    setAnswer(item.value);
    setWrong(false);
    setFullAudioReady(false);
  };

  const checkAnswer = () => {
    if (locked) return;
    if (!selectedImage) {
      ValidationAlert.info("Please circle one picture first!");
      return;
    }
    if (!answer.trim()) {
      ValidationAlert.info("Please write an answer!");
      return;
    }

    const isCorrect = normalize(answer) === normalize(selectedImage);
    setWrong(!isCorrect);
    setLocked(isCorrect);
    setFullAudioReady(isCorrect);

    const color = isCorrect ? "green" : "red";
    const score = isCorrect ? 1 : 0;
    const message = `<div style="font-size:20px;text-align:center;"><span style="color:${color};font-weight:bold">Score: ${score} / 1</span></div>`;
    if (isCorrect) ValidationAlert.success(message);
    else ValidationAlert.error(message);
  };

  const playCompletedSentence = () => {
    if (!selectedItem) return;
    playAudioSequence("completed-sentence", [iWantAudio, selectedItem.audio]);
  };

  const reset = () => {
    setAnswer("");
    setSelectedImage(null);
    setWrong(false);
    setLocked(false);
    setFullAudioReady(false);
    stopAudio();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "30px" }}>
      <div className="div-forall" style={{ gap: "60px" }}>
        <ExerciseHeader
          sectionLetter="F"
          title="What do you want? Circle and write."
          subTitle="Listen to the request, then tap the food that completes I want...."
        />

        <div className="images-row-unit10-page6-q3 w-full">
          {ITEMS.map((item) => {
            const playing = activeAudioKey === `option-${item.value}`;
            return (
              <div
                key={item.value}
                role="button"
                tabIndex={0}
                aria-label={`${selectedImage === item.value ? "Selected. " : ""}Choose ${item.value} and play its audio`}
                aria-pressed={selectedImage === item.value}
                className={`image-box-unit10-page6-q3 unit10-audio-control ${selectedImage === item.value ? "selected-unit10-page6-q3" : ""}`}
                onClick={() => selectItem(item)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    selectItem(item);
                  }
                }}
              >
                {playing && <Unit10PlayingAudioIcon />}
                <img
                  src={item.img}
                  alt={item.alt}
                  style={{ height: "100px", width: "auto" }}
                />
              </div>
            );
          })}
        </div>

        <div
          className={`sentence-wrapper-unit10-page6-q3 w-full unit10-audio-control${fullAudioReady ? " unit10-completed-audio" : ""}`}
          style={{ position: "relative" }}
          role={fullAudioReady ? "button" : undefined}
          tabIndex={fullAudioReady ? 0 : undefined}
          aria-label={
            fullAudioReady
              ? `Play the completed sentence: I want ${answer}.`
              : undefined
          }
          onClick={fullAudioReady ? playCompletedSentence : undefined}
          onKeyDown={
            fullAudioReady
              ? (event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    playCompletedSentence();
                  }
                }
              : undefined
          }
        >
          {activeAudioKey === "completed-sentence" && (
            <Unit10PlayingAudioIcon />
          )}
          <span
            role={!fullAudioReady ? "button" : undefined}
            tabIndex={!fullAudioReady ? 0 : -1}
            aria-label={!fullAudioReady ? "Play audio: I want" : undefined}
            onClick={
              !fullAudioReady
                ? (event) => {
                    event.stopPropagation();
                    playAudio("i-want", iWantAudio);
                  }
                : undefined
            }
            onKeyDown={
              !fullAudioReady
                ? (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      playAudio("i-want", iWantAudio);
                    }
                  }
                : undefined
            }
            className="unit10-audio-control"
          >
            {activeAudioKey === "i-want" && <Unit10PlayingAudioIcon />}
            I want
          </span>
          <span
            className="auto-answer-unit10-page6-q3 unit10-audio-control"
            role={!fullAudioReady && selectedItem ? "button" : undefined}
            tabIndex={!fullAudioReady && selectedItem ? 0 : -1}
            aria-label={
              !fullAudioReady && selectedItem
                ? `Play audio: ${selectedItem.value}`
                : undefined
            }
            onClick={
              !fullAudioReady && selectedItem
                ? (event) => {
                    event.stopPropagation();
                    playAudio("selected-word", selectedItem.audio);
                  }
                : undefined
            }
            onKeyDown={
              !fullAudioReady && selectedItem
                ? (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      event.stopPropagation();
                      playAudio("selected-word", selectedItem.audio);
                    }
                  }
                : undefined
            }
          >
            {activeAudioKey === "selected-word" && (
              <Unit10PlayingAudioIcon />
            )}
            {answer}
          </span>
          {wrong && <div className="wrong-mark-unit10-p6-q3">✕</div>}
          <span>.</span>
        </div>
      </div>

      <div className="action-buttons-container">
        <button onClick={reset} className="try-again-button">
          Start Again ↻
        </button>
        <button onClick={checkAnswer} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit10_Page6_Q3;
