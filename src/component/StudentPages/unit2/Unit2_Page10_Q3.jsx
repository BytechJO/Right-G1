import React, { useState, useRef, useEffect } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit2_Page10_Q3.css";

import sound1 from "../../../assets/unit1/sounds/P19QF.mp3";

import ball from "../../../assets/img_unit2/imgs/Football.jpg";
import bag from "../../../assets/img_unit2/imgs/bag.jpg";
import pants from "../../../assets/img_unit2/imgs/pants.jpg";
import panda from "../../../assets/img_unit2/imgs/panda.jpg";
import paper from "../../../assets/img_unit2/imgs/paper.jpg";
import baby from "../../../assets/img_unit2/imgs/baby.jpg";

import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";

import { IoMdSettings } from "react-icons/io";
import { TbMessageCircle } from "react-icons/tb";

import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import ExerciseHeader from "../../ExerciseHeader";

const Unit2_Page10_Q3 = () => {
  const audioRef = useRef(null);

  const stopAtSecond = 4.2;

  // ======================================================
  // SHOW ANSWER
  // ======================================================

  const [showAnswer, setShowAnswer] = useState(false);

  // ======================================================
  // PROGRESSIVE CHECK
  // ======================================================

  // الأسئلة الصح اللي اتقفلت
  const [lockedQuestions, setLockedQuestions] = useState([]);

  // الأسئلة الغلط بعد Check
  const [wrongQuestions, setWrongQuestions] = useState([]);

  // يصير true فقط لما كل النشاط صح
  const [checkCompleted, setCheckCompleted] = useState(false);

  // ======================================================
  // AUDIO SETTINGS
  // ======================================================

  const [paused, setPaused] = useState(false);

  const [showSettings, setShowSettings] = useState(false);

  const [volume, setVolume] = useState(1);

  const settingsRef = useRef(null);

  const [forceRender, setForceRender] = useState(0);

  const [showContinue, setShowContinue] = useState(false);

  const [isPlaying, setIsPlaying] = useState(true);

  const [current, setCurrent] = useState(0);

  const [duration, setDuration] = useState(0);

  const [showCaption, setShowCaption] = useState(false);

  const [activeIndex, setActiveIndex] = useState(null);

  // ======================================================
  // CAPTIONS
  // ======================================================

  const captions = [
    {
      start: 0,
      end: 4.19,
      text: "Page 19, Exercise f. Listen and circle.",
    },
    {
      start: 4.21,
      end: 9.01,
      text: "1-ball, baby, bag. ",
    },
    {
      start: 9.03,
      end: 14.03,
      text: "2-pants, paper, panda- ",
    },
  ];

  // ======================================================
  // UPDATE CAPTION
  // ======================================================

  const updateCaption = (time) => {
    const index = captions.findIndex(
      (cap) => time >= cap.start && time <= cap.end,
    );

    setActiveIndex(index);
  };

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.currentTime = 0;

    audio.play();

    const interval = setInterval(() => {
      if (audio.currentTime >= stopAtSecond) {
        audio.pause();

        setPaused(true);

        setIsPlaying(false);

        setShowContinue(true);

        clearInterval(interval);
      }
    }, 100);

    const handleEnded = () => {
      const audio = audioRef.current;

      audio.currentTime = 0;

      setIsPlaying(false);

      setPaused(false);

      setActiveIndex(null);

      setShowContinue(true);
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      clearInterval(interval);

      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setForceRender((prev) => prev + 1);
    }, 1000);

    if (activeIndex === -1 || activeIndex === null) {
      return;
    }

    const el = document.getElementById(`caption-${activeIndex}`);

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }

    return () => clearInterval(timer);
  }, [activeIndex]);

  // ======================================================
  // QUESTIONS
  // ======================================================

  const questions = [
    {
      id: 1,
      images: [ball, baby, bag],
      correct: "b",
      options: ["b", "p"],
    },
    {
      id: 2,
      images: [pants, paper, panda],
      correct: "p",
      options: ["b", "p"],
    },
  ];

  // ======================================================
  // ANSWERS
  // ======================================================

  const [answers, setAnswers] = useState({});

  const isQuestionLocked = (qId) => lockedQuestions.includes(qId);

  // ======================================================
  // SELECT ANSWER
  // ======================================================

  const handleSelect = (qId, option) => {
    if (showAnswer || checkCompleted || isQuestionLocked(qId)) {
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      [qId]: option,
    }));

    /*
      لو السؤال كان غلط من Check سابق،
      أول ما يعدل نفس السؤال نشيل X عنه فقط.
    */

    setWrongQuestions((prev) => prev.filter((id) => id !== qId));
  };

  // ======================================================
  // CHECK ANSWERS
  // ======================================================

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    // لازم يجاوب على كل الأسئلة

    const allAnswered = questions.every(
      (q) =>
        answers[q.id] !== undefined &&
        answers[q.id] !== null &&
        answers[q.id] !== "",
    );

    if (!allAnswered) {
      ValidationAlert.info("Oops!", "Please answer all items first.");

      return;
    }

    let correctCount = 0;

    const correctQuestions = [];

    const wrongTemp = [];

    questions.forEach((q) => {
      const studentAnswer = answers[q.id]?.toLowerCase();

      const correctAnswer = q.correct.toLowerCase();

      if (studentAnswer === correctAnswer) {
        correctCount++;

        correctQuestions.push(q.id);
      } else {
        wrongTemp.push(q.id);
      }
    });

    // ======================================================
    // LOCK CORRECT QUESTIONS ONLY
    // ======================================================

    setLockedQuestions((prev) =>
      Array.from(new Set([...prev, ...correctQuestions])),
    );

    // ======================================================
    // SHOW X ONLY ON WRONG QUESTIONS
    // ======================================================

    setWrongQuestions(wrongTemp);

    const total = questions.length;

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="font-size:20px;text-align:center;margin-top:8px;">
        <span style="color:${color};font-weight:bold;">
          Score: ${correctCount} / ${total}
        </span>
      </div>
    `;

    // ======================================================
    // ALL CORRECT
    // ======================================================

    if (correctCount === total) {
      setLockedQuestions(questions.map((q) => q.id));

      setWrongQuestions([]);

      setCheckCompleted(true);

      ValidationAlert.success(scoreMessage);

      return;
    }

    // ======================================================
    // WRONG / PARTIAL
    // ======================================================

    if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  // ======================================================
  // TOGGLE PLAY
  // ======================================================

  const togglePlay = () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (audio.paused) {
      audio.play();

      setPaused(false);

      setIsPlaying(true);
    } else {
      audio.pause();

      setPaused(true);

      setIsPlaying(false);
    }
  };

  // ======================================================
  // SHOW ANSWER
  // ======================================================

  const handleShowAnswer = () => {
    const correctObj = {};

    questions.forEach((q) => {
      correctObj[q.id] = q.correct;
    });

    setAnswers(correctObj);

    setWrongQuestions([]);

    setLockedQuestions(questions.map((q) => q.id));

    setShowAnswer(true);

    setCheckCompleted(true);
  };

  // ======================================================
  // RESET
  // ======================================================

  const resetAll = () => {
    setAnswers({});

    setWrongQuestions([]);

    setLockedQuestions([]);

    setShowAnswer(false);

    setCheckCompleted(false);
  };

  // ======================================================
  // RENDER
  // ======================================================

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
          gap: "30px",
        }}
      >
        <ExerciseHeader
          sectionLetter="F"
          title="Listen and circle."
          subTitle="Listen to each word, then tap its beginning sound: b or p."
        />

        <QuestionAudioPlayer
          src={sound1}
          captions={captions}
          stopAtSecond={stopAtSecond}
          pageId="unit2-page19-3"
        />

        <div className="questions-grid">
          {questions.map((q) => {
            const questionLocked = isQuestionLocked(q.id);

            const questionWrong = wrongQuestions.includes(q.id);

            return (
              <div key={q.id} className="question-box">
                <div className="question-number">{q.id}</div>

                {/* ===========================
                      IMAGES
                  =========================== */}

                <div className="images-row">
                  {q.images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt=""
                      className="question-img-unit2-p10-q3"
                    />
                  ))}
                </div>

                {/* ===========================
                      OPTIONS
                  =========================== */}

                <div className="options-row">
                  {q.options.map((opt) => {
                    const isSelected = answers[q.id] === opt;

                    /*
                          X يظهر فقط على الاختيار الغلط المختار
                        */

                    const isWrong =
                      questionWrong && isSelected && opt !== q.correct;

                    /*
                          Show Answer:
                          خلي correct-answer فقط على الصح
                        */

                    const isCorrectShow = showAnswer && opt === q.correct;

                    return (
                      <span
                        key={opt}
                        className={`option-letter ${
                          isSelected ? "selected3" : ""
                        } ${isCorrectShow ? "correct-answer" : ""}`}
                        onClick={() => handleSelect(q.id, opt)}
                        style={{
                          cursor:
                            questionLocked || showAnswer || checkCompleted
                              ? "default"
                              : "pointer",
                        }}
                      >
                        {opt}

                        {isWrong && <span className="wrong-x10-3">✕</span>}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =================================================
          BUTTONS
      ================================================= */}

      <div className="action-buttons-container">
        <button onClick={resetAll} className="try-again-button">
          Start Again ↻
        </button>

        <button
          onClick={handleShowAnswer}
          className="show-answer-btn swal-continue"
        >
          Show Answer
        </button>

        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit2_Page10_Q3;
