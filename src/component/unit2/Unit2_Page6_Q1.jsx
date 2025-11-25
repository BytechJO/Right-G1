import React, { useState, useRef, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import girl1 from "../../assets/img_unit2/imgs/girl1.jpg";
import girl2 from "../../assets/img_unit2/imgs/girl2.jpg";
import boy1 from "../../assets/img_unit2/imgs/boy1.jpg";
import boy2 from "../../assets/img_unit2/imgs/boy2.jpg";
import sound1 from "../../assets/unit1/sounds/P15QD.mp3"
import stella from "../../assets/img_unit2/sounds-unit2/Pg15_1.1_Stella.mp3";
import tom from "../../assets/img_unit2/sounds-unit2/Pg15_1.2_Tom.mp3";
import harley from "../../assets/img_unit2/sounds-unit2/Pg15_1.3_Harley.mp3";
import helen from "../../assets/img_unit2/sounds-unit2/Pg15_1.4_Helen.mp3";
import "./Unit2_Page6_Q1.css";
import ValidationAlert from "../Popup/ValidationAlert";
import pauseBtn from "../../assets/unit1/imgs/Right Video Button.svg";
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { CgPlayPauseO } from "react-icons/cg";
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
  // إعدادات الصوت
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(1);
  const [activeSpeed, setActiveSpeed] = useState(1);
  const settingsRef = useRef(null);
  const [forceRender, setForceRender] = useState(0);
  const [showContinue, setShowContinue] = useState(false);
  // زر الكابشن
  const [isMuted, setIsMuted] = useState(false);
  const stopAtSecond = 4.5;
  const [paused, setPaused] = useState(false);
  const changeSpeed = (rate) => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = rate;
    setActiveSpeed(rate);
  };
  const initialDroppedState = {
    "drop-1": null,
    "drop-2": null,
    "drop-3": null,
    "drop-4": null,
  };
  const [wrongDrops, setWrongDrops] = useState([]);
  const [droppedLetters, setDroppedLetters] = useState(initialDroppedState);
  const clickAudioRef = useRef(null); // ✅ صوت المناطق
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const { destination, draggableId } = result;
    const newDropped = { ...droppedLetters };

    // Remove previous droppable placement (if exists):
    const previousDrop = Object.keys(newDropped).find(
      (key) => newDropped[key] === draggableId
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
        setShowContinue(true);
        clearInterval(interval);
      }
    }, 250);

    // ⚡⚡ هنا الإضافة الوحيدة
    const handleEnded = () => {
      audio.currentTime = 0; // يرجع لأول ثانية
      audio.pause(); // يوقف
      setPaused(true); // زر البلاي يصير Play
      setShowContinue(true); // يظهر زر Continue
      // setActiveIndex(null); // يشيل الأنيميشن عن الكلمات
    };

    const handleClickOutside = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setShowSettings(false);
      }
    };

    // audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded); // 👈 الإضافة
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded); // 👈 تنظيف الإضافة
      document.removeEventListener("mousedown", handleClickOutside);
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      setForceRender((prev) => prev + 1);
    }, 1000); // كل ثانية

    return () => clearInterval(timer);
  }, []);

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

  const togglePlay = () => {
    const audio = audioRef.current;

    if (audio.paused) {
      audio.play();
      setPaused(false);
    } else {
      audio.pause();
      setPaused(true);
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
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
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
              justifyContent: "flex-start",
            }}
          >
            <div className="audio-popup-vocab">
              <div className="audio-inner-vocab">
                {/* Play / Pause */}
                <button
                  className="audio-play-btn"
                  style={{ height: "30px", width: "30px" }}
                  onClick={togglePlay}
                >
                  {paused ? <FaPlay size={22} /> : <FaPause size={22} />}
                </button>

                {/* Slider */}
                <input
                  type="range"
                  min="0"
                  max={audioRef.current?.duration || 0}
                  value={audioRef.current?.currentTime || 0}
                  className="audio-slider"
                  onChange={(e) => {
                    if (!audioRef.current) return;
                    audioRef.current.currentTime = e.target.value;
                  }}
                />

                {/* Current Time */}
                <span className="audio-time">
                  {new Date((audioRef.current?.currentTime || 0) * 1000)
                    .toISOString()
                    .substring(14, 19)}
                </span>

                {/* Total Time */}
                <span className="audio-time">
                  {new Date((audioRef.current?.duration || 0) * 1000)
                    .toISOString()
                    .substring(14, 19)}
                </span>

                {/* Mute */}
                <button
                  className="mute-btn-outside"
                  onClick={() => {
                    audioRef.current.muted = !audioRef.current.muted;
                    setIsMuted(!isMuted);
                  }}
                >
                  {audioRef.current?.muted ? (
                    <FaVolumeMute size={22} color="#1d4f7b" />
                  ) : (
                    <FaVolumeUp size={22} color="#1d4f7b" />
                  )}
                </button>
                <div className="settings-wrapper" ref={settingsRef}>
                  <button
                    className={`settings-btn ${showSettings ? "active" : ""}`}
                    onClick={() => setShowSettings(!showSettings)}
                  >
                    <IoMdSettings size={22} color="#1d4f7b" />
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
              </div>
            </div>
            <audio ref={audioRef}>
              <source src={sound1} type="audio/mp3" />
            </audio>
          </div>

          <div className="u2-container">
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <div className="layout">
                <audio ref={clickAudioRef} style={{ display: "none" }} />
                <div className="left-side">
                  {exerciseData.images.map((img, index) => {
                    const droppedId = droppedLetters[`drop-${index + 1}`];
                    const droppedPair = exerciseData.pairs.find(
                      (p) => p.id === droppedId
                    );

                    return (
                      <Droppable key={index} droppableId={`drop-${index + 1}`}>
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
                                  index={0}
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
                        .filter(
                          (p) => !Object.values(droppedLetters).includes(p.id)
                        )
                        .map((pair, index) => (
                          <Draggable
                            key={pair.id}
                            draggableId={pair.id}
                            index={index}
                          >
                            {(providedDraggable) => (
                              <div
                                ref={providedDraggable.innerRef}
                                {...providedDraggable.draggableProps}
                                {...providedDraggable.dragHandleProps}
                                className="option-box"
                              >
                                <span className="number-tag">
                                  {pair.letter}
                                </span>{" "}
                                {pair.content}
                              </div>
                            )}
                          </Draggable>
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
            }}
            className="try-again-button"
          >
            Start Again ↻
          </button>
          {showContinue && (
            <button className="play-btn swal-continue" onClick={togglePlay}>
              {paused ? (
                <>
                  Continue
                  <svg width="20" height="20" viewBox="0 0 30 30">
                    <image href={pauseBtn} x="0" y="0" width="30" height="30" />
                  </svg>
                </>
              ) : (
                <>
                  Pause
                  <CgPlayPauseO size={20} style={{ color: "red" }} />
                </>
              )}
            </button>
          )}

          <button onClick={handleCheckAnswers} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>
    </>
  );
};

export default Unit2_Page6_Q1;
