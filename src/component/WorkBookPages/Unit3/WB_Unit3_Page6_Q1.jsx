import React, { useState, useEffect, useRef } from "react";
import bat from "../../../assets/U1 WB/U3/SVG/U3P20EXEA-01.svg";
import cap from "../../../assets/U1 WB/U3/SVG/U3P20EXEA-02.svg";
import ant from "../../../assets/U1 WB/U3/SVG/U3P20EXEA-03.svg";
import dad from "../../../assets/U1 WB/U3/SVG/U3P20EXEA-04.svg";
import ant2 from "../../../assets/U1 WB/U3/SVG/U3P20EXEA-05.svg";
import dad2 from "../../../assets/U1 WB/U3/SVG/U3P20EXEA-06.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// import "./Review3_Page2_Q1.css";
import sound1 from "../../../assets/unit6/sounds/CD50.Pg53_Instruction1_Adult Lady.mp3";
import { TbMessageCircle } from "react-icons/tb";
import { FaPlay, FaPause } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
const WB_Unit3_Page6_Q1 = () => {
  const correctAnswers = ["rat", "cap", "ant", "bat", "dad", "pan"];
  // const [answers, setAnswers] = useState(["", "", "", "", "", ""]);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [locked, setLocked] = useState(false); // ⭐ NEW — قفل الإدخال بعد Show Answer
  const [bank] = useState([...correctAnswers]); // ثابت
  const [slots, setSlots] = useState(Array(6).fill(null));

  const onDragEnd = (result) => {
    if (!result.destination || locked) return;

    const { source, destination } = result;

    if (!destination.droppableId.startsWith("slot-")) return;

    const targetIndex = Number(destination.droppableId.replace("slot-", ""));
    const draggedWord = bank[source.index];

    setSlots((prev) => {
      const copy = [...prev];

      // ❌ منع تكرار نفس الكلمة
      const existingIndex = copy.findIndex((w) => w === draggedWord);
      if (existingIndex !== -1) {
        copy[existingIndex] = null;
      }

      copy[targetIndex] = draggedWord;
      return copy;
    });

    setWrongInputs([]);
  };

  // ---------------------- AUDIO SETUP (unchanged) -----------------------
  // إعدادات الصوت
  const audioRef = useRef(null);
  const [showContinue, setShowContinue] = useState(false);
  const [paused, setPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const stopAtSecond = 3.5;
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(1);
  const settingsRef = useRef(null);
  const [forceRender, setForceRender] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showCaption, setShowCaption] = useState(false);

 
  const checkAnswers = () => {
  if (locked) return;

  // ✅ فحص الخانات الفاضية (الصح)
  if (slots.some((slot) => !slot)) {
    ValidationAlert.info("Please fill in all the blanks before checking!");
    return;
  }

  let tempScore = 0;
  let wrong = [];

  slots.forEach((ans, i) => {
    if (ans === correctAnswers[i]) {
      tempScore++;
    } else {
      wrong.push(i);
    }
  });

  setWrongInputs(wrong);
  setLocked(true);

  const total = correctAnswers.length;
  const color =
    tempScore === total ? "green" : tempScore === 0 ? "red" : "orange";

  const msg = `
    <div style="font-size:20px;text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${tempScore} / ${total}
      </span>
    </div>
  `;

  tempScore === total
    ? ValidationAlert.success(msg)
    : tempScore === 0
    ? ValidationAlert.error(msg)
    : ValidationAlert.warning(msg);
};

  const reset = () => {
    setSlots(Array(6).fill(null));

    setWrongInputs([]);
    setLocked(false); // ⭐ إعادة فتح التعديل
  };

  // ⭐⭐⭐ NEW — Show Answer
const showAnswer = () => {
  setSlots([...correctAnswers]); // ✅ هذا الصح
  setWrongInputs([]);
  setLocked(true);
};


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
            //   gap: "30px",
            width: "60%",
            justifyContent: "flex-start",
          }}
        >
          <h5 className="header-title-page8">
            {" "}
            <span className="ex-A">A</span> Listen, look, and write.
          </h5>

          {/* AUDIO PLAYER — unchanged */}
          {/* -------------------------------------------------- */}
          {/* ... audio code remains as-is ... */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "30px",
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

          <Droppable droppableId="bank" direction="horizontal">
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
                          alignItems:"center",
                          justifyContent:"center"
                        }}
              >
                {bank.map((word, i) => (
                  <Draggable key={word} draggableId={word} index={i} isDragDisabled={locked}>
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
                                  cursor: "grab",
                                  ...provided.draggableProps.style,
                                }}
                      >
                        {word}
                      </span>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          {/* -------------------------------------------------- */}
          <div className="row-content10-review3-p2-q1">
            {[bat, cap, ant, dad, ant2, dad2].map((item, index) => (
              <div className="row2-review3-p2-q1" key={index}>
                <img src={item} alt="" className="q-img-wb-unit3-p6-q1" />

                <span style={{ position: "relative", display: "flex" }}>
                  <div className="input-wrapper-unit3-page6-q1">
                    <Droppable droppableId={`slot-${index}`} isDropDisabled={locked}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`q-input-review3-p2-q1 ${
                        snapshot.isDraggingOver ? "drag-over-cell" : ""
                      }`}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "#e3f2fd"
                              : "white",
                          }}
                        >
                          {slots[index] && <span>{slots[index]}</span>}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>

                    {wrongInputs.includes(index) && (
                      <span className="error-mark-input-review3-p2-q1">✕</span>
                    )}
                  </div>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>

          {/* ⭐⭐⭐ NEW BUTTON */}
          <button
            onClick={showAnswer}
            className="show-answer-btn swal-continue"
          >
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

export default WB_Unit3_Page6_Q1;
