import React, { useEffect, useRef, useState } from "react";
import "./WB_Unit3_Page4_Q2.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import { FaVolumeUp } from "react-icons/fa";
import img1 from "../../../assets/U1 WB/U3/SVG/U3P18EXEH-01.svg";
import img2 from "../../../assets/U1 WB/U3/SVG/U3P18EXEH-02.svg";
import img3 from "../../../assets/U1 WB/U3/SVG/U3P18EXEH-03.svg";
import img4 from "../../../assets/U1 WB/U3/SVG/U3P18EXEH-04.svg";
import openAudio from "../../../assets/U1 WB/U3/page_19/Item_001_Open.mp3";
import aLineAudio from "../../../assets/U1 WB/U3/page_19/Item_002_a_line.mp3";
import closeAudio from "../../../assets/U1 WB/U3/page_19/Item_003_Close.mp3";
import makeAudio from "../../../assets/U1 WB/U3/page_19/Item_004_Make.mp3";
import listenAudio from "../../../assets/U1 WB/U3/page_19/Item_005_Listen!.mp3";
import yourBookAudio from "../../../assets/U1 WB/U3/page_19/Item_006_your_book.mp3";
import quietAudio from "../../../assets/U1 WB/U3/page_19/Item_007_Quiet!.mp3";
import ExerciseHeader from "../../ExerciseHeader";

const WB_Unit3_Page4_Q2 = () => {
  const questions = [
    {
      id: 1,
      parts: [
        { type: "text", value: "" },
        {
          type: "blank",
          options: [
            { text: "Open", audio: openAudio },
            { text: "Close", audio: closeAudio },
          ],
        },
        { type: "text", value: "your book.", audio: yourBookAudio },
      ],
      correct: ["Close"],
      image: img1,
      imageAlt: "A student closing a book",
    },
    {
      id: 2,
      parts: [
        { type: "text", value: "" },
        {
          type: "blank",
          options: [
            { text: "Listen", audio: listenAudio },
            { text: "Make", audio: makeAudio },
          ],
        },
        { type: "text", value: "a line.", audio: aLineAudio },
      ],
      correct: ["Make"],
      image: img2,
      imageAlt: "A student making a line",
    },
    {
      id: 3,
      parts: [
        { type: "text", value: "" },
        {
          type: "blank",
          options: [
            { text: "Listen!", audio: listenAudio },
            { text: "Quiet!", audio: quietAudio },
          ],
        },
        { type: "text", value: "" },
      ],
      correct: ["Listen!"],
      image: img3,
      imageAlt: "A teacher asking students to listen",
    },
    {
      id: 4,
      parts: [
        { type: "text", value: "" },
        {
          type: "blank",
          options: [
            { text: "Open", audio: openAudio },
            { text: "Close", audio: closeAudio },
          ],
        },
        { type: "text", value: "your book.", audio: yourBookAudio },
      ],
      correct: ["Open"],
      image: img4,
      imageAlt: "A student opening a book",
    },
  ];

  const emptyAnswers = () => questions.map(() => [null]);

  const [answers, setAnswers] = useState(emptyAnswers);
  const [wrongQuestions, setWrongQuestions] = useState([]);
  const [lockedQuestions, setLockedQuestions] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [checkCompleted, setCheckCompleted] = useState(false);
  const [playingId, setPlayingId] = useState(null);
  const audioRef = useRef(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current = null;
    }

    setPlayingId(null);
  };

  const playAudio = (id, src) => {
    if (!src) return;

    stopAudio();

    const audio = new Audio(src);
    audioRef.current = audio;
    setPlayingId(id);

    audio.onended = () => {
      audio.currentTime = 0;

      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingId(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingId(null);
    };

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingId(null);
    });
  };

  useEffect(
    () => () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    },
    [],
  );

  const isQuestionLocked = (qIndex) => lockedQuestions.includes(qIndex);

  const handleSelect = (qIndex, blankIndex, option) => {
    if (showAnswer || checkCompleted || isQuestionLocked(qIndex)) return;

    setAnswers((previousAnswers) => {
      const updated = previousAnswers.map((answer) => [...answer]);
      updated[qIndex][blankIndex] = option;
      return updated;
    });

    setWrongQuestions((previous) =>
      previous.filter((index) => index !== qIndex),
    );
  };

  const handleKeyDown = (event, callback) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      callback();
    }
  };

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) return;

    const allAnswered = answers.every((answer) => answer[0] !== null);

    if (!allAnswered) {
      ValidationAlert.info("");
      return;
    }

    const correctQuestions = [];
    const wrongQuestionsTemp = [];

    questions.forEach((question, qIndex) => {
      if (answers[qIndex][0] === question.correct[0]) {
        correctQuestions.push(qIndex);
      } else {
        wrongQuestionsTemp.push(qIndex);
      }
    });

    setLockedQuestions((previous) =>
      Array.from(new Set([...previous, ...correctQuestions])),
    );
    setWrongQuestions(wrongQuestionsTemp);

    const correctCount = correctQuestions.length;
    const total = questions.length;
    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size: 20px; margin-top: 10px; text-align:center;">
        <span style="color:${color}; font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    if (correctCount === total) {
      setLockedQuestions(questions.map((_, index) => index));
      setWrongQuestions([]);
      setCheckCompleted(true);
      ValidationAlert.success(scoreMessage);
    } else if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  const showAnswers = () => {
    stopAudio();
    setAnswers(questions.map((question) => [...question.correct]));
    setWrongQuestions([]);
    setLockedQuestions(questions.map((_, index) => index));
    setShowAnswer(true);
    setCheckCompleted(true);
  };

  const startAgain = () => {
    stopAudio();
    setAnswers(emptyAnswers());
    setWrongQuestions([]);
    setLockedQuestions([]);
    setShowAnswer(false);
    setCheckCompleted(false);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <div
        className="div-forall"
        style={{
          gap: "35px",
        }}
      >
        <ExerciseHeader
          sectionLetter="H"
          title="Look, read, and circle."
          subTitle="Use the picture to choose the word that completes the command."
        />
        <div className="content-container-wb-unit3-p4-q2 w-full">
          {questions.map((question, qIndex) => {
            const questionLocked = isQuestionLocked(qIndex);

            return (
              <div className="question-row-review8-p2-q4" key={question.id}>
                <div className="sentence-wb-unit3-p4-q2">
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      className="header-title-page8"
                      style={{
                        color: "#2c5287",
                        fontWeight: "700",
                        fontSize: "20px",
                      }}
                    >
                      {question.id}
                    </span>

                    <img
                      src={question.image}
                      alt={question.imageAlt}
                      className="question-img-wb-unit3-p4-q2"
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      width: "60%",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    {question.parts.map((part, partIndex) => {
                      if (part.type === "text") {
                        if (!part.value) return null;

                        const textAudioId = `text-${qIndex}-${partIndex}`;

                        return (
                          <span
                            key={partIndex}
                            className="sentence-text-review5-p2-q3 audio-text-wb-unit3-p4-q2"
                            role="button"
                            tabIndex={0}
                            aria-label={`Play audio for ${part.value}`}
                            onClick={() => playAudio(textAudioId, part.audio)}
                            onKeyDown={(event) =>
                              handleKeyDown(event, () =>
                                playAudio(textAudioId, part.audio),
                              )
                            }
                          >
                            {part.value}

                            {playingId === textAudioId && (
                              <FaVolumeUp
                                className="playing-icon-wb-unit3-p4-q2"
                                size={16}
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        );
                      }

                      if (part.type === "blank") {
                        const actualBlankIndex = question.parts
                          .filter((item) => item.type === "blank")
                          .indexOf(part);

                        return (
                          <span
                            key={partIndex}
                            className="blank-options-wb-unit3-p4-q2"
                            role="group"
                            aria-label={`Question ${question.id} choices`}
                          >
                            {part.options.map((option, optionIndex) => {
                              const isSelected =
                                answers[qIndex][actualBlankIndex] ===
                                option.text;
                              const isWrongSelected =
                                wrongQuestions.includes(qIndex) &&
                                isSelected &&
                                option.text !==
                                  question.correct[actualBlankIndex];
                              const optionAudioId = `option-${qIndex}-${optionIndex}`;

                              const activateOption = () => {
                                playAudio(optionAudioId, option.audio);
                                handleSelect(
                                  qIndex,
                                  actualBlankIndex,
                                  option.text,
                                );
                              };

                              return (
                                <div
                                  key={option.text}
                                  className="option-wrapper"
                                >
                                  <span
                                    className={`option-word-review5-p2-q3 accessible-option-wb-unit3-p4-q2 ${
                                      isSelected ? "selected2" : ""
                                    }`}
                                    role="button"
                                    tabIndex={0}
                                    aria-pressed={isSelected}
                                    aria-label={`${option.text}. Play audio and select this answer${
                                      questionLocked ? ". Answer locked" : ""
                                    }`}
                                    onClick={activateOption}
                                    onKeyDown={(event) =>
                                      handleKeyDown(event, activateOption)
                                    }
                                  >
                                    {option.text}

                                    {playingId === optionAudioId && (
                                      <FaVolumeUp
                                        className="playing-icon-wb-unit3-p4-q2"
                                        size={16}
                                        aria-hidden="true"
                                      />
                                    )}
                                  </span>

                                  {isWrongSelected && (
                                    <div
                                      className="wrong-mark"
                                      aria-label="Incorrect answer"
                                    >
                                      ✕
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </span>
                        );
                      }

                      return null;
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="action-buttons-container">
        <button className="try-again-button" onClick={startAgain}>
          Start Again ↻
        </button>

        <button onClick={showAnswers} className="show-answer-btn">
          Show Answer
        </button>

        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default WB_Unit3_Page4_Q2;
