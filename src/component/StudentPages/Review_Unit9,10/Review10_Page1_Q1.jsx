import React, { useEffect, useRef, useState } from "react";

import img1 from "../../../assets/unit10/imgs/U10P90EXEA-01.svg";
import img2 from "../../../assets/unit10/imgs/U10P90EXEA-02.svg";
import img3 from "../../../assets/unit10/imgs/U10P90EXEA-03.svg";
import img4 from "../../../assets/unit10/imgs/U10P90EXEA-04.svg";

import appleAudio from "../../../assets/Review_9,10/Page 90 - A/I want an apple..mp3";
import chickenAudio from "../../../assets/Review_9,10/Page 90 - A/I want chicken..mp3";
import iceCreamAudio from "../../../assets/Review_9,10/Page 90 - A/I want ice cream..mp3";
import milkAudio from "../../../assets/Review_9,10/Page 90 - A/I want milk.mp3";

import "./Review10_Page1_Q1.css";

import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeaderReview from "../../ExerciseHeaderReview";
import ReviewPlayingAudioIcon from "./ReviewPlayingAudioIcon";
import useReviewAudio from "./useReviewAudio";
import useReviewMatching from "./useReviewMatching";

/* =====================================================
   DATA
===================================================== */

const exchanges = [
  {
    id: "exchange-1",
    question: "What do you want?",
    answer: "I want an apple.",
    target: "img4",
    audio: appleAudio,
  },
  {
    id: "exchange-2",
    question: "What do you want?",
    answer: "I want ice cream.",
    target: "img1",
    audio: iceCreamAudio,
  },
  {
    id: "exchange-3",
    question: "What do you want?",
    answer: "I want chicken.",
    target: "img2",
    audio: chickenAudio,
  },
  {
    id: "exchange-4",
    question: "What do you want?",
    answer: "I want milk",
    target: "img3",
    audio: milkAudio,
  },
];

const images = [
  {
    id: "img1",
    src: img1,
    alt: "A boy thinking about ice cream.",
  },
  {
    id: "img2",
    src: img2,
    alt: "A boy thinking about chicken.",
  },
  {
    id: "img3",
    src: img3,
    alt: "A boy thinking about milk.",
  },
  {
    id: "img4",
    src: img4,
    alt: "A girl thinking about an apple.",
  },
];

/* =====================================================
   COMPONENT
===================================================== */

export default function Review10_Page1_Q1() {
  /* =====================================================
     STATE
  ===================================================== */

  const [connections, setConnections] = useState({});

  const [lockedSources, setLockedSources] = useState(new Set());

  const [wrongSources, setWrongSources] = useState(new Set());

  const [showAnswer, setShowAnswer] = useState(false);

  /* =====================================================
     AUDIO
  ===================================================== */

  const { activeAudioKey, playAudio, stopAudio } = useReviewAudio();

  /* =====================================================
     KEYBOARD FOCUS REFS
  ===================================================== */

  /*
    نخزن كل source element
  */
  const sourceRefs = useRef({});

  /*
    نعرف إذا آخر connection
    تم عن طريق الكيبورد
  */
  const keyboardConnectionRef = useRef(false);

  /*
    نسخة من connections قبل التحديث
    حتى نعرف أي source صار له connection جديد
  */
  const previousConnectionsRef = useRef({});

  /* =====================================================
     MATCHING
  ===================================================== */

  const matching = useReviewMatching({
    sourceIds: exchanges.map((item) => item.id),

    targetIds: images.map((item) => item.id),

    connections,

    setConnections,

    lockedSources,

    onConnectionsEdited: (sourceIds) => {
      setWrongSources((current) => {
        const next = new Set(current);

        sourceIds.forEach((id) => {
          next.delete(id);
        });

        return next;
      });
    },
  });

  /* =====================================================
     KEYBOARD MATCHING HANDLER
  ===================================================== */

  const handleMatchingKeyDown = (event, side, id, locked) => {
    /*
      source locked:
      يظل Tab للصوت
      لكن ما يعمل matching
    */
    if (locked) return;

    const isActivation = event.key === "Enter" || event.key === " ";

    /*
      إذا في endpoint مختار من الجهة الثانية،
      فهذا Enter/Space رح يكمل connection.

      فقط بهذه الحالة نعلم إنه
      connection تم بالكيبورد.
    */
    if (
      isActivation &&
      matching.selectedEndpoint &&
      matching.selectedEndpoint.side !== side
    ) {
      keyboardConnectionRef.current = true;
    }

    matching.handleKeyDown(event, side, id);
  };

  /* =====================================================
     AFTER KEYBOARD CONNECTION
     FOCUS NEXT SOURCE
  ===================================================== */

  useEffect(() => {
    const previousConnections = previousConnectionsRef.current;

    /*
      نحدد الـsource اللي connection تبعه
      انضاف أو تغير.
    */
    const newlyConnectedSource = exchanges.find(
      (item) =>
        connections[item.id] &&
        previousConnections[item.id] !== connections[item.id],
    );

    /*
      حدث النسخة القديمة دائمًا
    */
    previousConnectionsRef.current = {
      ...connections,
    };

    /*
      إذا connection بالماوس:
      ما نعمل focus movement.
    */
    if (!keyboardConnectionRef.current || !newlyConnectedSource) {
      return;
    }

    keyboardConnectionRef.current = false;

    const currentIndex = exchanges.findIndex(
      (item) => item.id === newlyConnectedSource.id,
    );

    let nextSource = null;

    /*
      ندور من الـsource اللي بعد الحالي.
    */
    for (let offset = 1; offset <= exchanges.length; offset++) {
      const nextIndex = (currentIndex + offset) % exchanges.length;

      const candidate = exchanges[nextIndex];

      /*
        لا نرجع على نفس الـsource
      */
      if (candidate.id === newlyConnectedSource.id) {
        continue;
      }

      /*
        إذا locked تخطاه
      */
      if (lockedSources.has(candidate.id)) {
        continue;
      }

      /*
        إذا موصول أصلًا تخطاه
      */
      if (connections[candidate.id]) {
        continue;
      }

      nextSource = candidate;

      break;
    }

    if (!nextSource) return;

    /*
      بعد تحديث React:
      رجع الـfocus للـsource التالي
    */
    requestAnimationFrame(() => {
      sourceRefs.current[nextSource.id]?.focus?.();
    });
  }, [connections, lockedSources]);

  /* =====================================================
     CHECK ANSWERS
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswer || lockedSources.size === exchanges.length) {
      return;
    }

    /* =================================================
       REQUIRE ALL CONNECTIONS
    ================================================= */

    if (exchanges.some((item) => !connections[item.id])) {
      ValidationAlert.info("Please connect all the words to pictures.");

      return;
    }

    /* =================================================
       VALIDATE
    ================================================= */

    const nextLocked = new Set(lockedSources);

    const nextWrong = new Set();

    let score = 0;

    exchanges.forEach((item) => {
      if (connections[item.id] === item.target) {
        score += 1;

        nextLocked.add(item.id);
      } else {
        nextWrong.add(item.id);
      }
    });

    setLockedSources(nextLocked);

    setWrongSources(nextWrong);

    /* =================================================
       SCORE
    ================================================= */

    const color =
      score === exchanges.length ? "green" : score === 0 ? "red" : "orange";

    const message = `
      <div
        style="
          font-size:20px;
          text-align:center;
        "
      >
        <span
          style="
            color:${color};
            font-weight:bold;
          "
        >
          Score: ${score} / ${exchanges.length}
        </span>
      </div>
    `;

    if (score === exchanges.length) {
      ValidationAlert.success(message);
    } else if (score === 0) {
      ValidationAlert.error(message);
    } else {
      ValidationAlert.warning(message);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const showCorrectAnswer = () => {
    setConnections(
      Object.fromEntries(exchanges.map((item) => [item.id, item.target])),
    );

    setLockedSources(new Set(exchanges.map((item) => item.id)));

    setWrongSources(new Set());

    setShowAnswer(true);

    /*
      Show Answer مش keyboard connection
      فلا تنقلي focus
    */
    keyboardConnectionRef.current = false;

    matching.cancel();

    stopAudio();
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    setConnections({});

    setLockedSources(new Set());

    setWrongSources(new Set());

    setShowAnswer(false);

    keyboardConnectionRef.current = false;

    previousConnectionsRef.current = {};

    matching.cancel();

    stopAudio();
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div
      className="matching-wrapper"
      style={{
        padding: "30px",
      }}
    >
      <div className="div-forall">
        {/* =================================================
            HEADER
        ================================================= */}

        <ExerciseHeaderReview
          sectionLetter="A"
          title="Read, look, and match."
          subTitle="Read each What do you want? exchange, then connect it to the correct person and food."
        />

        {/* =================================================
            MATCHING AREA
        ================================================= */}

        <div className="container1 w-full" ref={matching.containerRef}>
          {exchanges.map((item, index) => {
            const image = images[index];

            const sourceSelected =
              matching.selectedEndpoint?.side === "source" &&
              matching.selectedEndpoint.id === item.id;

            const targetSelected =
              matching.selectedEndpoint?.side === "target" &&
              matching.selectedEndpoint.id === image.id;

            const sourceLocked = lockedSources.has(item.id) || showAnswer;

            const targetLocked =
              matching.isLocked("target", image.id) || showAnswer;

            return (
              <div className="matching-row-review10-p1-q1" key={item.id}>
                {/* =========================================
                      SOURCE
                  ========================================= */}

                <div className="word-with-dot-review10-p1-q1">
                  <span className="span-num">{index + 1}</span>

                  <div
                    style={{
                      position: "relative",
                    }}
                  >
                    <span
                      ref={(node) => {
                        /*
                            Matching endpoint ref
                          */
                        matching.registerEndpoint("source", item.id, node);

                        /*
                            Focus ref
                          */
                        sourceRefs.current[item.id] = node;
                      }}
                      id="width-span-review10-p1-q1"
                      className={`
                          clickable-word-unit2-p7-q2
                          review-audio-control

                          ${sourceLocked ? "disabled-hover" : ""}

                          ${sourceSelected ? "selected-match-item" : ""}
                        `}
                      role="button"
                      /*
                          مهم:
                          source يظل بالـTab حتى لو matched
                          لأنه الصوت لازم يظل available
                        */
                      tabIndex={0}
                      aria-label={`${item.question} ${item.answer}. ${
                        sourceLocked
                          ? "Play audio."
                          : "Play audio and start matching."
                      }`}
                      /* =====================================
                           MOUSE
                           AUDIO + MATCHING
                        ===================================== */

                      onClick={() => {
                        playAudio(`answer-${index}`, item.audio);

                        if (!sourceLocked) {
                          matching.activateEndpoint("source", item.id);
                        }
                      }}
                      /* =====================================
                           KEYBOARD
                        ===================================== */

                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();

                          /*
                              الصوت يشتغل سواء
                              source locked أو لا
                            */
                          playAudio(`answer-${index}`, item.audio);
                        }

                        /*
                            matching فقط إذا
                            source مش locked
                          */
                        handleMatchingKeyDown(
                          event,
                          "source",
                          item.id,
                          sourceLocked,
                        );
                      }}
                    >
                      {/* =================================
                            AUDIO ICON
                        ================================= */}

                      {activeAudioKey === `answer-${index}` && (
                        <ReviewPlayingAudioIcon />
                      )}

                      {item.question}

                      <br />

                      {item.answer}
                    </span>

                    {/* =================================
                          WRONG CONNECTION X
                      ================================= */}

                    {!showAnswer && wrongSources.has(item.id) && (
                      <span
                        className="error-mark-review10-p1-q1"
                        aria-hidden="true"
                      >
                        ✕
                      </span>
                    )}
                  </div>

                  {/* =========================================
                        SOURCE DOT
                    ========================================= */}

                  <div className="dot-wrapper">
                    <div
                      ref={(node) =>
                        matching.registerDot("source", item.id, node)
                      }
                      className="dot start-dot"
                      id={`${item.question}-${index + 1}-dot`}
                      tabIndex={-1}
                      aria-hidden="true"
                      onClick={() => {
                        if (!sourceLocked) {
                          matching.activateEndpoint("source", item.id);
                        }
                      }}
                    />
                  </div>
                </div>

                {/* =========================================
                      TARGET
                  ========================================= */}

                <div className="img-with-dot">
                  {/* =========================================
                        TARGET DOT
                    ========================================= */}

                  <div className="dot-wrapper">
                    <div
                      ref={(node) =>
                        matching.registerDot("target", image.id, node)
                      }
                      className="dot end-dot"
                      id={`${image.id}-dot`}
                      tabIndex={-1}
                      aria-hidden="true"
                      onClick={() => {
                        if (!targetLocked) {
                          matching.activateEndpoint("target", image.id);
                        }
                      }}
                    />
                  </div>

                  {/* =========================================
                        TARGET IMAGE
                    ========================================= */}

                  <img
                    ref={(node) =>
                      matching.registerEndpoint("target", image.id, node)
                    }
                    src={image.src}
                    className={`
                        matched-img

                        ${targetLocked ? "disabled-hover" : ""}

                        ${targetSelected ? "selected-match-item" : ""}
                      `}
                    style={{
                      height: "100px",
                    }}
                    alt={image.alt}
                    role="button"
                    tabIndex={targetLocked ? -1 : 0}
                    aria-label={`${image.alt} ${
                      targetLocked ? "Already matched." : "Select for matching."
                    }`}
                    /* =====================================
                         MOUSE
                      ===================================== */

                    onClick={() => {
                      if (!targetLocked) {
                        matching.activateEndpoint("target", image.id);
                      }
                    }}
                    /* =====================================
                         KEYBOARD
                      ===================================== */

                    onKeyDown={(event) =>
                      handleMatchingKeyDown(
                        event,
                        "target",
                        image.id,
                        targetLocked,
                      )
                    }
                  />
                </div>
              </div>
            );
          })}

          {/* =================================================
              LINES
          ================================================= */}

          <svg
            className="lines-layer"
            style={{
              pointerEvents: "none",
            }}
            aria-hidden="true"
          >
            {Object.entries(connections).map(([sourceId, targetId]) => {
              const line = matching.lineFor(sourceId, targetId);

              return line ? (
                <line key={sourceId} {...line} stroke="red" strokeWidth="3" />
              ) : null;
            })}

            {/* =========================================
                PREVIEW LINE
            ========================================= */}

            {matching.previewLine && (
              <line
                {...matching.previewLine}
                stroke="red"
                strokeWidth="3"
                strokeDasharray="6 4"
              />
            )}
          </svg>
        </div>
      </div>

      {/* =================================================
          BUTTONS
      ================================================= */}

      <div className="action-buttons-container">
        <button onClick={reset} className="try-again-button">
          Start Again ↻
        </button>

        <button
          onClick={showCorrectAnswer}
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
}
