import React, { useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import girl1 from "../../../assets/img_unit2/imgs/girl1.jpg";
import girl2 from "../../../assets/img_unit2/imgs/girl2.jpg";
import boy1 from "../../../assets/img_unit2/imgs/boy1.jpg";
import boy2 from "../../../assets/img_unit2/imgs/boy2.jpg";
import sound1 from "../../../assets/unit1/sounds/P15QD.mp3";
import stella from "../../../assets/img_unit2/sounds-unit2/Pg15_1.1_Stella.mp3";
import tom from "../../../assets/img_unit2/sounds-unit2/Pg15_1.2_Tom.mp3";
import harley from "../../../assets/img_unit2/sounds-unit2/Pg15_1.3_Harley.mp3";
import helen from "../../../assets/img_unit2/sounds-unit2/Pg15_1.4_Helen.mp3";
import "./Unit2_Page6_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { TbMessageCircle } from "react-icons/tb";
const exerciseData = {
  pairs: [
    { id: "pair-1", letter: "1", content: "January" },
    { id: "pair-2", letter: "2", content: "November" },
    { id: "pair-3", letter: "3", content: "May" },
    { id: "pair-4", letter: "4", content: "August" },
  ],
  images: [
    { img: girl1, sound: stella },
    { img: girl2, sound: helen },
    { img: boy1, sound: tom },
    { img: boy2, sound: harley },
  ],
};

const Unit2_Page6_Q1 = () => {
  const audioRef = useRef(null);

  // زر الكابشن
  const [isMuted, setIsMuted] = useState(false);
  const stopAtSecond = 4.5;
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
  const [activeIndex, setActiveIndex] = useState(null);
  const initialDroppedState = {
    "drop-1": null,
    "drop-2": null,
    "drop-3": null,
    "drop-4": null,
  };
  const [wrongDrops, setWrongDrops] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);

  const [droppedLetters, setDroppedLetters] = useState(initialDroppedState);
  const clickAudioRef = useRef(null); // ✅ صوت المناطق
  // ================================
  // ✔ Captions Array
  // ================================
  const captions = [
    { start: 0, end: 4.27, text: "Page 15, Exercise D. Listen and choose." },
    { start: 4.29, end: 6.24, text: "1-January " },
    { start: 6.26, end: 8.28, text: "2-November " },
    { start: 8.3, end: 10.12, text: "3-May" },
    { start: 10.14, end: 12.07, text: "4-August" },
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
  const handleOnDragEnd = (result) => {
    if (showAnswer) return; // 🚫 يمنع السحب بعد عرض الإجابة

    if (!result.destination) return;

    const { destination, draggableId } = result;
    const newDropped = { ...droppedLetters };

    const previousDrop = Object.keys(newDropped).find(
      (key) => newDropped[key] === draggableId,
    );
    if (previousDrop) newDropped[previousDrop] = null;

    newDropped[destination.droppableId] = draggableId;
    setDroppedLetters(newDropped);
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
      setActiveIndex(null);
      setPaused(false);
      setIsPlaying(false);
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
  const playSound = (src) => {
    if (!clickAudioRef.current) return;
    clickAudioRef.current.src = src;
    clickAudioRef.current.currentTime = 0;
    clickAudioRef.current.play();
  };

  const correctAnswers = {
    "drop-1": "pair-1",
    "drop-2": "pair-4",
    "drop-3": "pair-2",
    "drop-4": "pair-3",
  };

  const handleCheckAnswers = () => {
    if (showAnswer) return;
    const allFilled = Object.values(droppedLetters).every((v) => v !== null);

    if (!allFilled) {
      ValidationAlert.info("Incomplete!", "Please complete all drop zones.");
      return;
    }

    let correctCount = 0;
    const total = exerciseData.pairs.length;
    const wrongTemp = [];
    // مقارنة كل drop بالقيمة الصحيحة
    Object.keys(droppedLetters).forEach((dropId) => {
      const placedLetter = droppedLetters[dropId]; // ex: "1" or "3"
      const correctLetter = correctAnswers[dropId]; // القيمة المطلوبة حسب الخريطة

      if (placedLetter === correctLetter) {
        correctCount++;
      } else {
        wrongTemp.push(dropId); // ✅ خزنا الـ drop الخطأ
      }
    });
    setWrongDrops(wrongTemp); // ✅ تخزين الأخطاء لعرض الـ X
    setShowAnswer(true)
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
      ValidationAlert.success(scoreMessage);
    } else if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };
  const handleShowAnswer = () => {
    // ❗ ضبط جميع الإجابات على الصحيح
    const correct = { ...correctAnswers };

    setDroppedLetters(correct); // يحط كل إجابة صحيحة مكانها
    setWrongDrops([]); // يشيل X من الغلط
    setShowAnswer(true); // يمنع أي تعديل بعد هيك
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
    <>
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
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            width: "60%",
            justifyContent: "flex-start",
          }}
        >
          <h5 className="header-title-page8">
            <span className="ex-A">D</span> Listen and choose.
          </h5>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
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

          <div className="u2-container">
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <div className="layout">
                <audio ref={clickAudioRef} style={{ display: "none" }} />
                <div className="left-side">
                  {exerciseData.images.map((img, index) => {
                    const droppedId = droppedLetters[`drop-${index + 1}`];
                    const droppedPair = exerciseData.pairs.find(
                      (p) => p.id === droppedId,
                    );

                    return (
                      <Droppable key={index} droppableId={`drop-${index + 1}`} isDropDisabled={showAnswer}>
                        {(provided, snapshot) => (
                          <div className="image-row">
                            <img
                              src={img.img}
                              alt=""
                              className="person-img"
                              style={{ cursor: "pointer" }}
                              onClick={() => playSound(img.sound)}
                            />

                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`drop-circle ${
                                snapshot.isDraggingOver ? "drop-hover" : ""
                              }`}
                              style={{ position: "relative" }}
                            >
                              {/* ✅ إشارة الخطأ - تظهر فقط إذا كانت هذه الـ drop من ضمن الأخطاء */}
                              {wrongDrops.includes(`drop-${index + 1}`) && (
                                <div className="wrong-x3">✕</div>
                              )}
                              {droppedPair && (
                                <Draggable
                                  draggableId={droppedPair.id}
                                  index={index}
                                >
                                  {(providedDraggable) => (
                                    <div
                                      ref={providedDraggable.innerRef}
                                      {...providedDraggable.draggableProps}
                                      {...providedDraggable.dragHandleProps}
                                      className="circle-number"
                                    >
                                      {droppedPair.letter}
                                    </div>
                                  )}
                                </Draggable>
                              )}
                              {provided.placeholder}
                            </div>
                          </div>
                        )}
                      </Droppable>
                    );
                  })}
                </div>

                <Droppable droppableId="letters">
                  {(provided) => (
                    <div
                      className="right-side"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {exerciseData.pairs
                      
                        .map((pair, index) => (
                          <div className="option-box" key={pair.id}>
                            <Draggable draggableId={pair.id} index={index} isDragDisabled={showAnswer}>
                              {(providedDraggable) => (
                                <span
                                  ref={providedDraggable.innerRef}
                                  {...providedDraggable.draggableProps}
                                  {...providedDraggable.dragHandleProps}
                                  className="number-tag draggable-number"
                                >
                                  {pair.letter}
                                </span>
                              )}
                            </Draggable>

                            <span className="month-label">{pair.content}</span>
                          </div>
                        ))}

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </DragDropContext>
          </div>
        </div>
        <div className="action-buttons-container">
          <button
            onClick={() => {
              setDroppedLetters(initialDroppedState);
              setWrongDrops([]);
              setShowAnswer(false);
            }}
            className="try-again-button"
          >
            Start Again ↻
          </button>
          <button onClick={handleShowAnswer} className="show-answer-btn">
            Show Answer
          </button>

          <button onClick={handleCheckAnswers} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>
    </>
  );
};

export default Unit2_Page6_Q1;
