import React, { useRef, useState } from "react";
import presentImg from "../../../assets/img_unit2/imgs/Present img.svg";
import pizza from "../../../assets/img_unit2/imgs/pizza.svg";
import beard from "../../../assets/img_unit2/imgs/bird.svg";
import boat from "../../../assets/img_unit2/imgs/boate22.svg";
import pencil from "../../../assets/img_unit2/imgs/pincel22.svg";
import "./Unit2_Page5.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import birdSound from "../../../assets/unit2/Page 14 - B/bird.mp3";
import boatSound from "../../../assets/unit2/Page 14 - B/boat.mp3";
import whatIsItSound from "../../../assets/unit2/Page 14 - B/What is it.mp3";
import itsAPresentSound from "../../../assets/unit2/Page 14 - B/It's a present..mp3";
import pencilSound from "../../../assets/unit2/Page 14 - B/pencil.mp3";
import pizzaSound from "../../../assets/unit2/Page 14 - B/pizza.mp3";
import {
  FaVolumeUp,
  FaMicrophone,
  FaStop,
  FaPlay,
  FaPause,
  FaRedo,
} from "react-icons/fa";
import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import sound1 from "../../../assets/unit2/Page 14 - B/what-is-it.mp3";

const Unit2_Page5_Q3 = () => {
  const options = [
    { img: boat, num: 1, sound: boatSound, alt: "Boat" },
    { img: pizza, num: 2, sound: pizzaSound, alt: "Pizza" },
    { img: beard, num: 3, sound: birdSound, alt: "Bird" },
    { img: pencil, num: 4, sound: pencilSound, alt: "Pencil" },
  ];
  const captions = [
    { start: 0, end: 0.62, text: "What is it? " },
    { start: 1.18, end: 2.4, text: "It's a present." },
    { start: 3.4, end: 3.9, text: "Boat" },
    { start: 4.26, end: 5, text: "pizza" },
    { start: 5.48, end: 6.0, text: "bird" },
    { start: 6.58, end: 7.34, text: "pencil" },
  ];
  const audioRef = useRef(null);
  const [activeAudio, setActiveAudio] = useState(null);
  const [modelStopSignal, setModelStopSignal] = useState(0);

  const stopModelAudio = () => {
    setModelStopSignal((prev) => prev + 1);
  };
  const playAudio = (sound, index) => {
    if (!audioRef.current) return;

    // وقف QuestionAudioPlayer
    stopModelAudio();

    // وقف تسجيل الطالب إذا كان عم ينلعب
    if (recordedAudioRef.current) {
      recordedAudioRef.current.pause();
      recordedAudioRef.current.currentTime = 0;
    }

    setIsPlayingRecording(false);

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.onended = null;

    audioRef.current.src = sound;

    setActiveAudio(index);

    audioRef.current.play();

    audioRef.current.onended = () => {
      setActiveAudio(null);
    };
  };
  const playConversation = () => {
    if (!audioRef.current) return;

    // وقف الـ QuestionAudioPlayer
    stopModelAudio();

    // وقف تسجيل الطالب إذا كان عم ينلعب
    if (recordedAudioRef.current) {
      recordedAudioRef.current.pause();
      recordedAudioRef.current.currentTime = 0;
    }

    setIsPlayingRecording(false);

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    audioRef.current.onended = null;

    setActiveAudio("conversation");

    audioRef.current.src = whatIsItSound;

    audioRef.current.play();

    audioRef.current.onended = () => {
      audioRef.current.src = itsAPresentSound;
      audioRef.current.currentTime = 0;

      audioRef.current.play();

      audioRef.current.onended = () => {
        setActiveAudio(null);
      };
    };
  };
  // ✅ نسمح فقط باختيار إجابة واحدة
  const [selected, setSelected] = useState(null);

  const handleSelect = (index) => {
    setSelected(index); // اختيار إجابة واحدة فقط
  };

  const scoreMessage = `
    <div style="font-size: 20px; text-align:center; margin-top: 8px;">
      <span style="color:green; font-weight:bold;">
         Score: 1 /1
      </span>
    </div>
  `;

  // ✅ الفحص فقط إذا الطالب اختار أو لا
  const checkAnswers = () => {
    if (selected === null) {
      ValidationAlert.info("Oops!", "Please select an answer first.");
      return;
    }

    // إذا بدك لاحقًا تضيف صح/غلط، هون منعمله.
    ValidationAlert.success(scoreMessage);
  };

  // 🔄 زر الريست
  const resetAnswers = () => {
    // =============================
    // Reset selected answer
    // =============================
    setSelected(null);

    // =============================
    // Stop QuestionAudioPlayer
    // =============================
    stopModelAudio();

    // =============================
    // Stop normal image audio
    // =============================
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.onended = null;
    }

    setActiveAudio(null);

    // =============================
    // Stop recording if active
    // =============================
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    setIsRecording(false);

    // =============================
    // Close microphone
    // =============================
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    // =============================
    // Stop recorded playback
    // =============================
    if (recordedAudioRef.current) {
      recordedAudioRef.current.pause();
      recordedAudioRef.current.currentTime = 0;
    }

    setIsPlayingRecording(false);

    // =============================
    // Delete student recording
    // =============================
    if (recordedAudio) {
      URL.revokeObjectURL(recordedAudio);
    }

    setRecordedAudio(null);
  };
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const recordedAudioRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);

  const startRecording = async () => {
    try {
      stopModelAudio();
      // وقف أي صوت شغال من السؤال
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setActiveAudio(null);
      }

      // وقف التسجيل القديم إذا كان عم ينلعب
      if (recordedAudioRef.current) {
        recordedAudioRef.current.pause();
        recordedAudioRef.current.currentTime = 0;
      }

      setIsPlayingRecording(false);

      // احذف التسجيل القديم لو موجود
      if (recordedAudio) {
        URL.revokeObjectURL(recordedAudio);
        setRecordedAudio(null);
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });

        const audioUrl = URL.createObjectURL(blob);

        setRecordedAudio(audioUrl);

        streamRef.current?.getTracks().forEach((track) => {
          track.stop();
        });

        streamRef.current = null;
      };

      recorder.start();

      setIsRecording(true);
    } catch (error) {
      console.error("Microphone error:", error);

      ValidationAlert.info(
        "Microphone",
        "Please allow microphone access to record your voice.",
      );
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    setIsRecording(false);
  };

  const toggleRecordedAudio = () => {
    if (!recordedAudioRef.current) return;

    // وقف QuestionAudioPlayer
    stopModelAudio();

    // وقف أصوات الصور
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.onended = null;
      setActiveAudio(null);
    }

    if (recordedAudioRef.current.paused) {
      recordedAudioRef.current.play();
      setIsPlayingRecording(true);
    } else {
      recordedAudioRef.current.pause();
      setIsPlayingRecording(false);
    }
  };
  const recordAgain = () => {
    if (recordedAudioRef.current) {
      recordedAudioRef.current.pause();
      recordedAudioRef.current.currentTime = 0;
    }

    setIsPlayingRecording(false);

    if (recordedAudio) {
      URL.revokeObjectURL(recordedAudio);
    }

    setRecordedAudio(null);
  };
  const handleModelInteract = () => {
    // وقف أصوات الصور
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.onended = null;
    }

    setActiveAudio(null);

    // وقف تسجيل الطالب إذا كان Playback شغال
    if (recordedAudioRef.current) {
      recordedAudioRef.current.pause();
      recordedAudioRef.current.currentTime = 0;
    }

    setIsPlayingRecording(false);
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "30px",
        }}
      >
        <audio ref={audioRef} />
        <div
          className="div-forall"
          style={{
            gap: "10px",
          }}
        >
          <ExerciseHeader
            sectionLetter="B"
            title="Ask and answer."
            subTitle="Tap the picture, listen to the model question and answer, then say them aloud."
          />
          <QuestionAudioPlayer
            src={sound1}
            captions={captions}
            pageId="unit2-page14-3"
            forceStop={modelStopSignal}
            onInteract={handleModelInteract}
          />
          <div className="unit2-q3-content">
            {/* الصورة الرئيسية */}
            <div
              className="q3-main-img-box accessible-q3-item"
              role="button"
              tabIndex={0}
              aria-label="Play the model conversation: What is it? It's a present."
              style={{
                position: "relative",
                cursor: "pointer",
              }}
              onClick={playConversation}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  playConversation();
                }
              }}
            >
              <img
                src={presentImg}
                alt="What is it? It's a present."
                className="q3-main-img"
                style={{ cursor: "pointer" }}
              />

              {activeAudio === "conversation" && (
                <FaVolumeUp
                  size={28}
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    pointerEvents: "none",
                  }}
                />
              )}
            </div>

            {/* الخيارات */}
            <div className="q3-options">
              {options.map((item, index) => (
                <div
                  key={item.num}
                  className={`q3-option-item accessible-q3-item ${
                    selected === index ? "active" : ""
                  }`}
                  role="button"
                  tabIndex={0}
                  aria-label={`${item.alt}. Press Enter or Space to select and hear it.`}
                  onClick={() => {
                    handleSelect(index);
                    playAudio(item.sound, index);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();

                      handleSelect(index);
                      playAudio(item.sound, index);
                    }
                  }}
                  style={{
                    position: "relative",
                    cursor: "pointer",
                  }}
                >
                  <div>
                    <span className="q3-number">{item.num}</span>
                  </div>

                  <img
                    src={item.img}
                    className="q3-option-img"
                    alt={item.alt}
                  />

                  {activeAudio === index && (
                    <FaVolumeUp
                      size={26}
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        pointerEvents: "none",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              width: "50%",
              minWidth: "350px",
              margin: "10px auto 0",
              padding: "15px 25px",
              background: "#ffffff",
              borderRadius: "25px",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
            }}
          >
            <div
              style={{
                textAlign: "center",
                marginBottom: "12px",
                fontSize: "18px",
                fontWeight: "600",
                color: "#333",
              }}
            >
              Now it's your turn. Record yourself.
            </div>

            {!isRecording && !recordedAudio && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={startRecording}
                  style={{
                    minWidth: "130px",
                    height: "42px",
                    border: "none",
                    borderRadius: "22px",
                    background: "#430f68",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    cursor: "pointer",
                    fontSize: "15px",
                    fontWeight: "600",
                  }}
                >
                  <FaMicrophone />
                  Record
                </button>
              </div>
            )}

            {isRecording && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    color: "#d93333",
                    fontWeight: "600",
                    fontSize: "15px",
                  }}
                >
                  ● Recording...
                </div>

                <button
                  onClick={stopRecording}
                  style={{
                    minWidth: "130px",
                    height: "42px",
                    border: "none",
                    borderRadius: "22px",
                    background: "#d93333",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    cursor: "pointer",
                    fontSize: "15px",
                    fontWeight: "600",
                  }}
                >
                  <FaStop />
                  Stop
                </button>
              </div>
            )}

            {recordedAudio && (
              <>
                <audio
                  ref={recordedAudioRef}
                  src={recordedAudio}
                  onEnded={() => setIsPlayingRecording(false)}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onClick={toggleRecordedAudio}
                    style={{
                      minWidth: "130px",
                      height: "42px",
                      border: "none",
                      borderRadius: "22px",
                      background: "#430f68",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      cursor: "pointer",
                      fontSize: "15px",
                      fontWeight: "600",
                    }}
                  >
                    {isPlayingRecording ? (
                      <>
                        <FaPause />
                        Pause
                      </>
                    ) : (
                      <>
                        <FaPlay />
                        Playback
                      </>
                    )}
                  </button>

                  <button
                    onClick={recordAgain}
                    style={{
                      minWidth: "130px",
                      height: "42px",
                      border: "none",
                      borderRadius: "22px",
                      background: "#6b7280",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      cursor: "pointer",
                      fontSize: "15px",
                      fontWeight: "600",
                    }}
                  >
                    <FaRedo />
                    Record Again
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="action-buttons-container">
        <button onClick={resetAnswers} className="try-again-button">
          Start Again ↻
        </button>
        <button onClick={checkAnswers} className="check-button2">
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default Unit2_Page5_Q3;
