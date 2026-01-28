import React, { useState, useRef, useEffect } from "react";
import bat from "../../../assets/unit4/imgs/U4P32ExeA2-01.svg";
import cap from "../../../assets/unit4/imgs/U4P32ExeA2-02.svg";
import ant from "../../../assets/unit4/imgs/U4P32ExeA2-03.svg";
import dad from "../../../assets/unit4/imgs/U4P32ExeA2-04.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit4_Page5_Q2.css";
import sound from "../../../assets/unit4/sounds/U4P32EXEA2.mp3";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { TbMessageCircle } from "react-icons/tb";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const Unit4_Page5_Q2 = () => {
  const correctAnswers = ["f", "v", "v", "f"];
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [wrongInputs, setWrongInputs] = useState([]);
  const stopAtSecond = 11.13;
  const [checked, setChecked] = useState(false);
  const audioRef = useRef(null);

  // إعدادات الصوت
  const [paused, setPaused] = useState(false);
  // إعدادات الصوت
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(1);
  const settingsRef = useRef(null);
  const [forceRender, setForceRender] = useState(0);
  const [showContinue, setShowContinue] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showCaption, setShowCaption] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  const onDragEnd = (result) => {
    const { destination, draggableId } = result;
    if (!destination || showAnswer) return;

    if (destination.droppableId.startsWith("slot-")) {
      const index = Number(destination.droppableId.split("-")[1]);
      const value = draggableId.replace("bank-", "");

      const updated = [...answers];
      updated[index] = value;
      setAnswers(updated);
      setWrongInputs([]);
    }
  };

  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    {
      start: 0,
      end: 11.13,
      text: "page 32 Right activities exercise A number 2 does it begin with f or v listen and write ",
    },

    { start: 11.15, end: 13.17, text: "1.	frog " },
    { start: 13.19, end: 15.14, text: "2.	violin" },
    { start: 15.16, end: 17.29, text: "3.	vase " },
    { start: 17.31, end: 20.06, text: "4.	father" },
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

  const handleShowAnswer = () => {
    setAnswers([...correctAnswers]); // املي الأجوبة الصحيحة
    setWrongInputs([]); // ما في غلط عند عرض الحل
    setShowAnswer(true); // حتى نغير لون النص
    setChecked(true); // 🔒
  };

  const checkAnswers = () => {
    if (showAnswer) return;
    if (answers.some((ans) => ans.trim() === "")) {
      ValidationAlert.info("Please fill in all the blanks before checking!");
      return;
    }

    let tempScore = 0;
    let wrong = [];
    answers.forEach((ans, i) => {
      if (ans === correctAnswers[i]) {
        tempScore++;
      } else {
        wrong.push(i); // خزن رقم السؤال الغلط بدل الكلمة
      }
    });
    setWrongInputs(wrong);
    setChecked(true); // 🔒
    const total = correctAnswers.length;
    const color =
      tempScore === total ? "green" : tempScore === 0 ? "red" : "orange";

    const scoreMessage = `
    <div style="font-size: 20px; margin-top: 10px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${tempScore} / ${total}
      </span>
    </div>
  `;

    if (tempScore === total) {
      ValidationAlert.success(scoreMessage);
    } else if (tempScore === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  const reset = () => {
    setAnswers(["", "", "", ""]);
    setWrongInputs([]);
    setShowAnswer(false);
    setChecked(false); // 🔓
  };
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
      <div
        className="question-wrapper-unit3-page6-q1"
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
            display: "flex",
            flexDirection: "column",
            // gap: "30px",
            width: "60%",
            justifyContent: "flex-start",
          }}
        >
          <h5 className="header-title-page8">
            <span style={{ color: "purple" }}>2</span>Does it begin with{" "}
            <span style={{ color: "red" }}>f</span> or{" "}
            <span style={{ color: "red" }}>v</span>? Listen and write.
          </h5>
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
                  src={sound}
                  onTimeUpdate={(e) => {
                    const time = e.target.currentTime;
                    setCurrent(time);
                    updateCaption(time);
                  }}
                  onLoadedMetadata={(e) => setDuration(e.target.duration)}
                ></audio>
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

          <Droppable droppableId="bank" direction="horizontal" isDropDisabled>
            {(provided) => (
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  padding: "10px",
                  border: "2px dashed #ccc",
                  borderRadius: "10px",
                  // margin: "10px 0",
                  alignItems: "center",justifyContent:"center"
                }}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {["f", "v"].map((letter, index) => (
                  <Draggable
                    key={letter}
                    draggableId={`bank-${letter}`}
                    index={index}
                    isDragDisabled={showAnswer || checked}
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
                          cursor: "grab",fontSize:"22px",
                          ...provided.draggableProps.style,
                        }}
                      >
                        {letter}
                      </span>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div className="row-content10-unit4-page5-q2">
            <div className="row2-unit3-page6-q1">
              <div style={{ display: "flex", gap: "15px" }}>
                <span className="num-span">1</span>{" "}
                <img src={bat} alt="" className="q-img-unit3-page6-q1" />
              </div>
              <span style={{ position: "relative", display: "flex" }}>
                <div className="input-wrapper-unit3-page6-q1">
                  <Droppable droppableId="slot-0">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`q-input-unit3-page6-q1 ${
                          snapshot.isDraggingOver ? "drag-over-cell" : ""
                        }`}
                      >
                        {answers[0] && (
                          <Draggable
                            draggableId={`slot-0-${answers[0]}`}
                            index={0}
                            isDragDisabled={showAnswer || checked}
                          >
                            {(provided) => (
                              <span
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                {answers[0]}
                              </span>
                            )}
                          </Draggable>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  {wrongInputs.includes(0) && (
                    <span className="error-mark-input">✕</span>
                  )}
                </div>
              </span>
            </div>

            <div className="row2-unit3-page6-q1">
              <div style={{ display: "flex", gap: "15px" }}>
                <span className="num-span">2</span>{" "}
                <img src={cap} alt="" className="q-img-unit3-page6-q1" />
              </div>
              <span style={{ position: "relative", display: "flex" }}>
                <div className="input-wrapper-unit3-page6-q1">
                  <Droppable droppableId="slot-1">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`q-input-unit3-page6-q1 ${
                          snapshot.isDraggingOver ? "drag-over-cell" : ""
                        }`}
                      >
                        {answers[1] && (
                          <Draggable
                            draggableId={`slot-1-${answers[1]}`}
                            index={1}
                            isDragDisabled={showAnswer || checked}
                          >
                            {(provided) => (
                              <span
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                {answers[1]}
                              </span>
                            )}
                          </Draggable>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  {wrongInputs.includes(1) && (
                    <span className="error-mark-input">✕</span>
                  )}
                </div>
              </span>
            </div>

            <div className="row2-unit3-page6-q1">
              <div style={{ display: "flex", gap: "15px" }}>
                <span className="num-span">3</span>{" "}
                <img src={ant} alt="" className="q-img-unit3-page6-q1" />
              </div>
              <span style={{ position: "relative", display: "flex" }}>
                <div className="input-wrapper-unit3-page6-q1">
                  <Droppable droppableId="slot-2">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`q-input-unit3-page6-q1 ${
                          snapshot.isDraggingOver ? "drag-over-cell" : ""
                        }`}
                      >
                        {answers[2] && (
                          <Draggable
                            draggableId={`slot-2-${answers[2]}`}
                            index={2}
                            isDragDisabled={showAnswer || checked}
                          >
                            {(provided) => (
                              <span
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                {answers[2]}
                              </span>
                            )}
                          </Draggable>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  {wrongInputs.includes(2) && (
                    <span className="error-mark-input">✕</span>
                  )}
                </div>
              </span>
            </div>

            <div className="row2-unit3-page6-q1">
              <div style={{ display: "flex", gap: "15px" }}>
                <span className="num-span">4</span>{" "}
                <img src={dad} alt="" className="q-img-unit3-page6-q1" />
              </div>
              <span style={{ position: "relative", display: "flex" }}>
                <div className="input-wrapper-unit3-page6-q1">
                  <Droppable droppableId="slot-3">
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`q-input-unit3-page6-q1 ${
                          snapshot.isDraggingOver ? "drag-over-cell" : ""
                        }`}
                      >
                        {answers[3] && (
                          <Draggable
                            draggableId={`slot-3-${answers[3]}`}
                            index={3}
                            isDragDisabled={showAnswer}
                          >
                            {(provided) => (
                              <span
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                {answers[3]}
                              </span>
                            )}
                          </Draggable>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  {wrongInputs.includes(3) && (
                    <span className="error-mark-input">✕</span>
                  )}
                </div>
              </span>
            </div>
          </div>
        </div>
        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>
          <button onClick={handleShowAnswer} className="show-answer-btn">
            Show Answer
          </button>
          <button onClick={checkAnswers} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Unit4_Page5_Q2;
