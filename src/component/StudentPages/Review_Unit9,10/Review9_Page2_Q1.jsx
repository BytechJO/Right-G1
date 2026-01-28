import React, { useState, useEffect, useRef } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Review9_Page2_Q1.css";
import pauseBtn from "../../../assets/unit1/imgs/Right Video Button.svg";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { CgPlayPauseO } from "react-icons/cg";
import sound1 from "../../../assets/unit4/sounds/U4P37EXEE.mp3";
import img2 from "../../../assets/unit10/imgs/U10P89EXED-01.svg";
import img3 from "../../../assets/unit10/imgs/U10P89EXED-02.svg";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { TbMessageCircle } from "react-icons/tb";

const data = [
  {
    parts: [
      {
        before: "The ",
        blank: 1,
        after: "an walks at",
      },
      {
        before: " ",
        blank: 2,
        after: "ight.",
      },
    ],
    correct: ["m", "n"],
    img: img2,
  },
  {
    parts: [
      {
        before: "My",
        blank: 1,
        after: "om is a",
      },
      {
        before: " ",
        blank: 2,
        after: "urse",
      },
    ],
    correct: ["m", "n"],
    img: img3,
  },
];

const Review9_Page2_Q1 = () => {
  const [answers, setAnswers] = useState(
    data.map((d) => Array(d.correct.length).fill("")),
  );
  const [wrongInputs, setWrongInputs] = useState([]);

  const [locked, setLocked] = useState(false); // ⭐ NEW — قفل التعديل بعد Show Answer

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || locked) return;

    const value = draggableId.replace("char-", "");
    const [, qIndex, blankIndex] = destination.droppableId.split("-");

    setAnswers((prev) => {
      const updated = prev.map((row) => [...row]);
      updated[qIndex][blankIndex] = value;
      return updated;
    });

    setWrongInputs([]);
  };

  const checkAnswers = () => {
    if (locked) return; // ⭐ NEW — لا تعديل بعد Show Answer
    // 1) افحص إذا في أي خانة فاضية
    const hasEmpty = answers.some((arr) =>
      arr.some((val) => val.trim() === ""),
    );

    if (hasEmpty) {
      ValidationAlert.info("Please fill in all blanks before checking!");
      return;
    }

    // 2) اجمع كل الأخطاء
    let wrong = [];
    let correctCount = 0;

    answers.forEach((arr, qIndex) => {
      arr.forEach((val, blankIndex) => {
        if (val.trim() === data[qIndex].correct[blankIndex]) {
          correctCount++; // صح
        } else {
          wrong.push(`${qIndex}-${blankIndex}`); // غلط
        }
      });
    });

    setWrongInputs(wrong);

    // 3) احسب العدد الكلي للحقول
    const totalInputs = data.reduce(
      (acc, item) => acc + item.correct.length,
      0,
    );

    // 4) اختر اللون حسب السكور
    let color =
      correctCount === totalInputs
        ? "green"
        : correctCount === 0
          ? "red"
          : "orange";

    const scoreMessage = `
    <div style="font-size:20px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${correctCount} / ${totalInputs}
      </span>
    </div>
  `;
    setLocked(true); // ⭐ NEW — قفل التعديل بعد Check
    // 5) طباعة النتيجة
    if (correctCount === totalInputs) {
      ValidationAlert.success(scoreMessage);
    } else if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };
  // ⭐⭐⭐ NEW — Show Answer
  const showAnswer = () => {
    const correctFilled = data.map((d) => [...d.correct]);

    setAnswers(correctFilled); // ضع الإجابات الصحيحة
    setWrongInputs([]); // إزالة الأخطاء
    setLocked(true); // قفل الحقول
  };
  const audioRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [showContinue, setShowContinue] = useState(false);
  const [paused, setPaused] = useState(false);
  const stopAtSecond = 3.5;
  // إعدادات الصوت
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(1);
  const settingsRef = useRef(null);
  const [forceRender, setForceRender] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showCaption, setShowCaption] = useState(false);

  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    {
      start: 0,
      end: 4.23,
      text: "Page 8. Right Activities. Exercise A, number 1. ",
    },
    {
      start: 4.25,
      end: 8.28,
      text: "Listen and write the missing letters. Number the pictures.  ",
    },
    { start: 8.3, end: 11.05, text: "1-tiger." },
    { start: 11.07, end: 13.12, text: "2-taxi." },
    { start: 13.14, end: 15.14, text: "3-duck." },
    { start: 15.16, end: 17.13, text: "4-deer." },
  ];

  // ================================
  // ✔ Update caption highlight
  // ================================
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

    // عند انتهاء الأوديو يرجع يبطل أنيميشن + يظهر Continue
    const handleEnded = () => {
      const audio = audioRef.current;
      audio.currentTime = 0; // ← يرجع للبداية
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
    }, 1000); // كل ثانية
    if (activeIndex === -1 || activeIndex === null) return;

    const el = document.getElementById(`caption-${activeIndex}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return () => clearInterval(timer);
  }, [activeIndex]);

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
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="page8-wrapper">
        <div
          className="div-forall"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            position: "relative",
            width: "60%",
          }}
        >
          <h3 className="header-title-page8">D Listen and write.</h3>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "30px 0px",
              width: "100%",
            }}
          >
            <div
              className="audio-popup-read"
              style={{
                width: "50%",
              }}
            >
              <div className="audio-inner player-ui">
                <audio
                  ref={audioRef}
                  src={sound1}
                  onTimeUpdate={(e) => {
                    const time = e.target.currentTime;
                    setCurrent(time);
                    updateCaption(time);
                  }}
                  onLoadedMetadata={(e) => setDuration(e.target.duration)}
                ></audio>
                {/* Play / Pause */}
                {/* Play / Pause */}
                {/* الوقت - السلايدر - الوقت */}
                <div className="top-row">
                  <span className="audio-time">
                    {new Date(current * 1000).toISOString().substring(14, 19)}
                  </span>

                  <input
                    type="range"
                    className="audio-slider"
                    min="0"
                    max={duration}
                    value={current}
                    onChange={(e) => {
                      audioRef.current.currentTime = e.target.value;
                      updateCaption(Number(e.target.value));
                    }}
                    style={{
                      background: `linear-gradient(to right, #430f68 ${
                        (current / duration) * 100
                      }%, #d9d9d9ff ${(current / duration) * 100}%)`,
                    }}
                  />

                  <span className="audio-time">
                    {new Date(duration * 1000).toISOString().substring(14, 19)}
                  </span>
                </div>
                {/* الأزرار 3 أزرار بنفس السطر */}
                <div className="bottom-row">
                  {/* فقاعة */}
                  <div
                    className={`round-btn ${showCaption ? "active" : ""}`}
                    style={{ position: "relative" }}
                    onClick={() => setShowCaption(!showCaption)}
                  >
                    <TbMessageCircle size={36} />
                    <div
                      className={`caption-inPopup ${showCaption ? "show" : ""}`}
                      style={{ top: "100%", left: "10%" }}
                    >
                      {captions.map((cap, i) => (
                        <p
                          key={i}
                          id={`caption-${i}`}
                          className={`caption-inPopup-line2 ${
                            activeIndex === i ? "active" : ""
                          }`}
                        >
                          {cap.text}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Play */}
                  <button className="play-btn2" onClick={togglePlay}>
                    {isPlaying ? <FaPause size={26} /> : <FaPlay size={26} />}
                  </button>

                  {/* Settings */}
                  <div className="settings-wrapper" ref={settingsRef}>
                    <button
                      className={`round-btn ${showSettings ? "active" : ""}`}
                      onClick={() => setShowSettings(!showSettings)}
                    >
                      <IoMdSettings size={36} />
                    </button>

                    {showSettings && (
                      <div className="settings-popup">
                        <label>Volume</label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={volume}
                          onChange={(e) => {
                            setVolume(e.target.value);
                            audioRef.current.volume = e.target.value;
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>{" "}
              </div>
            </div>
          </div>

          <Droppable droppableId="char-bank" isDropDisabled={locked}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  display: "flex",
                  gap: "10px",
                  padding: "10px",
                  border: "2px dashed #ccc",
                  borderRadius: "10px",
                  // margin: "10px 0",
                  alignItems: "center",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                {["m", "n"].map((char, index) => (
                  <Draggable
                    key={char}
                    draggableId={`char-${char}`}
                    index={index}
                    isDragDisabled={locked}
                  >
                    {(provided) => (
                      <span
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          padding: "7px 14px",
                          border: "2px solid #2c5287",
                          borderRadius: "8px",
                          background: "white",
                          fontWeight: "bold",
                          fontSize:"22px",
                          cursor: "grab",
                          ...provided.draggableProps.style,
                        }}
                      >
                        {char}
                      </span>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {data.map((item, qIndex) => (
            <div className="row-missing" key={qIndex}>
              <span className="num">{qIndex + 1}.</span>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <div className="sentence-review4-p2-q1">
                  {item.parts.map((p, blankIndex) => (
                    <span
                      key={blankIndex}
                      className="sentence-part"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      {p.before}

                      <div className="input-wrapper-review9-p2-q2">
                        <Droppable
                          droppableId={`slot-${qIndex}-${blankIndex}`}
                          isDropDisabled={locked}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`missing-input-review4-p2-q1 ${
                                snapshot.isDraggingOver ? "drag-over-cell" : ""
                              }`}
                            >
                              {answers[qIndex][blankIndex] && (
                                <Draggable
                                  draggableId={`filled-${answers[qIndex][blankIndex]}-${qIndex}-${blankIndex}`}
                                  index={0}
                                  isDragDisabled
                                >
                                  {(provided) => (
                                    <span
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      {answers[qIndex][blankIndex]}
                                    </span>
                                  )}
                                </Draggable>
                              )}
                              {provided.placeholder}

                              {wrongInputs.includes(
                                `${qIndex}-${blankIndex}`,
                              ) && (
                                <span className="wrong-icon-review4-p2-q1">
                                  ✕
                                </span>
                              )}
                            </div>
                          )}
                        </Droppable>
                      </div>

                      {p.after}
                    </span>
                  ))}
                </div>
                <img
                  src={item.img}
                  className="middle-img-review9-p2-q2"
                  alt=""
                />
              </div>
            </div>
          ))}
        </div>
        <div className="action-buttons-container">
          <button
            className="try-again-button"
            onClick={() => {
              setAnswers(data.map((d) => Array(d.correct.length).fill("")));
              setWrongInputs([]);
              setLocked(false); // ⭐ NEW — فتح التعديل من جديد
            }}
          >
            Start Again ↻
          </button>

          {/* ⭐⭐⭐ NEW BUTTON */}
          <button
            onClick={showAnswer}
            className="show-answer-btn swal-continue"
          >
            Show Answer
          </button>

          <button className="check-button2" onClick={checkAnswers}>
            Check Answers ✓
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Review9_Page2_Q1;
