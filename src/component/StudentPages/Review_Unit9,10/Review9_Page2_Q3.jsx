import React, { useEffect, useRef, useState } from "react";

import img1 from "../../../assets/unit10/imgs/U10P89EXEF-01.svg";
import img2 from "../../../assets/unit10/imgs/U10P89EXEF-02.svg";
import img3 from "../../../assets/unit10/imgs/U10P89EXEF-03.svg";
import img4 from "../../../assets/unit10/imgs/U10P89EXEF-04.svg";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import "./Review9_Page2_Q3.css";

import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeaderReview from "../../ExerciseHeaderReview";

import useReviewDragKeyboard from "./useReviewDragKeyboard";
import useReviewMatching from "./useReviewMatching";

/* =====================================================
   DATA
===================================================== */

const matches = [
  {
    id: "nest",
    suffix: "est",
    target: "img4",
  },
  {
    id: "nurse",
    suffix: "urse",
    target: "img2",
  },
  {
    id: "night",
    suffix: "ight",
    target: "img3",
  },
  {
    id: "man",
    suffix: "an",
    target: "img1",
  },
];

const images = [
  {
    id: "img1",
    src: img1,
    alt: "A man.",
  },
  {
    id: "img2",
    src: img2,
    alt: "A nurse.",
  },
  {
    id: "img3",
    src: img3,
    alt: "A dark night sky.",
  },
  {
    id: "img4",
    src: img4,
    alt: "A bird's nest.",
  },
];

/* =====================================================
   COMPONENT
===================================================== */

export default function Review9_Page2_Q3() {
  /* =====================================================
     STATE
  ===================================================== */

  const [letters, setLetters] = useState({});

  const [connections, setConnections] = useState({});

  const [lockedLetters, setLockedLetters] = useState(new Set());

  const [lockedSources, setLockedSources] = useState(new Set());

  const [wrongLetters, setWrongLetters] = useState(new Set());

  const [wrongConnections, setWrongConnections] = useState(new Set());

  const [showAnswer, setShowAnswer] = useState(false);

  /* =====================================================
     REFS FOR MATCHING KEYBOARD FOCUS
  ===================================================== */

  /*
    نخزن كل source element
    nest / nurse / night / man
  */
  const sourceRefs = useRef({});

  /*
    true فقط إذا الـconnection
    تم عن طريق Enter / Space
  */
  const keyboardConnectionRef = useRef(false);

  /*
    نخزن connections السابقة
    حتى نعرف متى connection جديد اكتمل
  */
  const previousConnectionsRef = useRef({});

  /* =====================================================
     LETTER TARGET IDS
  ===================================================== */

  const letterTargetIds = matches.map((item) => `letter-${item.id}`);

  /* =====================================================
     PLACE LETTER
  ===================================================== */

  const placeLetter = (targetId, letter) => {
    if (showAnswer || lockedLetters.has(targetId)) {
      return;
    }

    const word = targetId.replace("letter-", "");

    setLetters((current) => ({
      ...current,
      [word]: letter,
    }));

    /*
      تعديل الخانة يشيل wrong
      لهذه الكلمة فقط
    */
    setWrongLetters((current) => {
      const next = new Set(current);

      next.delete(word);

      return next;
    });
  };

  /* =====================================================
     REMOVE LETTER
  ===================================================== */

  const removeLetter = (targetId) => {
    if (showAnswer || lockedLetters.has(targetId)) {
      return;
    }

    const word = targetId.replace("letter-", "");

    setLetters((current) => ({
      ...current,
      [word]: "",
    }));

    setWrongLetters((current) => {
      const next = new Set(current);

      next.delete(word);

      return next;
    });
  };

  /* =====================================================
     LETTER KEYBOARD DRAG
  ===================================================== */

  const keyboardDrag = useReviewDragKeyboard({
    targetIds: letterTargetIds,

    lockedIds: lockedLetters,

    getValue: (targetId) => letters[targetId.replace("letter-", "")] || "",

    onPlace: placeLetter,

    onRemove: removeLetter,
  });

  /* =====================================================
     MATCHING
  ===================================================== */

  const matching = useReviewMatching({
    sourceIds: matches.map((item) => item.id),

    targetIds: images.map((item) => item.id),

    connections,

    setConnections,

    lockedSources,

    onConnectionsEdited: (sourceIds) => {
      setWrongConnections((current) => {
        const next = new Set(current);

        sourceIds.forEach((id) => next.delete(id));

        return next;
      });
    },
  });

  /* =====================================================
     KEYBOARD MATCHING
     ENTER / SPACE
  ===================================================== */

  const handleMatchingKeyDown = (event, side, id, locked) => {
    if (locked) return;

    const isActivation = event.key === "Enter" || event.key === " ";

    /*
      إذا في endpoint مختار من الجهة الثانية،
      فهذا الـEnter/Space رح يكمل connection.

      هون فقط نعلم إنه connection بالكيبورد.
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
     GO TO NEXT SOURCE
  ===================================================== */

  useEffect(() => {
    const previousConnections = previousConnectionsRef.current;

    /*
      دور على source صار له connection جديد
      أو تغير target تبعه.
    */
    const newlyConnectedSource = matches.find(
      (item) =>
        connections[item.id] &&
        previousConnections[item.id] !== connections[item.id],
    );

    /*
      لازم دائماً نحدث النسخة القديمة
    */
    previousConnectionsRef.current = {
      ...connections,
    };

    /*
      إذا التوصيل Mouse:
      لا نعمل أي focus movement
    */
    if (!keyboardConnectionRef.current || !newlyConnectedSource) {
      return;
    }

    keyboardConnectionRef.current = false;

    const currentIndex = matches.findIndex(
      (item) => item.id === newlyConnectedSource.id,
    );

    let nextSource = null;

    /*
      نبحث من العنصر التالي مباشرة:
      nest -> nurse -> night -> man
    */
    for (let offset = 1; offset <= matches.length; offset++) {
      const nextIndex = (currentIndex + offset) % matches.length;

      const candidate = matches[nextIndex];

      /*
        لا نرجع لنفس النقطة
      */
      if (candidate.id === newlyConnectedSource.id) {
        continue;
      }

      /*
        إذا locked:
        تخطاها
      */
      if (lockedSources.has(candidate.id)) {
        continue;
      }

      /*
        إذا موصولة أصلاً:
        تخطاها وروح للي بعدها
      */
      if (connections[candidate.id]) {
        continue;
      }

      nextSource = candidate;

      break;
    }

    if (!nextSource) return;

    /*
      بعد ما React يخلص تحديث الـconnection
      انقل focus للنقطة التالية
    */
    requestAnimationFrame(() => {
      sourceRefs.current[nextSource.id]?.focus?.();
    });
  }, [connections, lockedSources]);

  /* =====================================================
     LETTER DRAG END
  ===================================================== */

  const onDragEnd = ({ destination, draggableId }) => {
    if (
      !destination ||
      showAnswer ||
      !destination.droppableId.startsWith("letter-")
    ) {
      return;
    }

    placeLetter(destination.droppableId, draggableId.replace("char-", ""));
  };

  /* =====================================================
     CHECK ANSWERS
  ===================================================== */

  const checkAnswers = () => {
    if (
      showAnswer ||
      (lockedLetters.size === matches.length &&
        lockedSources.size === matches.length)
    ) {
      return;
    }

    /* =================================================
       REQUIRE ALL LETTERS
    ================================================= */

    if (matches.some((item) => !letters[item.id])) {
      ValidationAlert.info("Please fill in all the letters.");

      return;
    }

    /* =================================================
       REQUIRE ALL CONNECTIONS
    ================================================= */

    if (matches.some((item) => !connections[item.id])) {
      ValidationAlert.info("Please connect all the words to pictures.");

      return;
    }

    /* =================================================
       VALIDATE
    ================================================= */

    const nextLockedLetters = new Set(lockedLetters);

    const nextLockedSources = new Set(lockedSources);

    const nextWrongLetters = new Set();

    const nextWrongConnections = new Set();

    let score = 0;

    matches.forEach((item) => {
      /* ==========================
         LETTER
      ========================== */

      if (letters[item.id] === item.id[0]) {
        score += 1;

        nextLockedLetters.add(`letter-${item.id}`);
      } else {
        nextWrongLetters.add(item.id);
      }

      /* ==========================
         CONNECTION
      ========================== */

      if (connections[item.id] === item.target) {
        score += 1;

        nextLockedSources.add(item.id);
      } else {
        nextWrongConnections.add(item.id);
      }
    });

    setLockedLetters(nextLockedLetters);

    setLockedSources(nextLockedSources);

    setWrongLetters(nextWrongLetters);

    setWrongConnections(nextWrongConnections);

    /* =================================================
       SCORE
    ================================================= */

    const total = matches.length * 2;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

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
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    if (score === total) {
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
    setLetters(
      Object.fromEntries(matches.map((item) => [item.id, item.id[0]])),
    );

    setConnections(
      Object.fromEntries(matches.map((item) => [item.id, item.target])),
    );

    setLockedLetters(new Set(letterTargetIds));

    setLockedSources(new Set(matches.map((item) => item.id)));

    setWrongLetters(new Set());

    setWrongConnections(new Set());

    setShowAnswer(true);

    /*
      Show Answer مش keyboard connection،
      فلا ننقل focus.
    */
    keyboardConnectionRef.current = false;

    matching.cancel();
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    setLetters({});

    setConnections({});

    setLockedLetters(new Set());

    setLockedSources(new Set());

    setWrongLetters(new Set());

    setWrongConnections(new Set());

    setShowAnswer(false);

    keyboardConnectionRef.current = false;

    previousConnectionsRef.current = {};

    matching.cancel();
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <DragDropContext onDragEnd={onDragEnd}>
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
            sectionLetter="F"
            title="Read, write, and match."
            subTitle="Complete nest, nurse, night, and man with m or n, then connect each word to its picture."
          />

          {/* =================================================
              LETTER BANK
          ================================================= */}

          <Droppable droppableId="letters-bank" isDropDisabled>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  display: "flex",

                  gap: "10px",

                  padding: "10px",

                  width: "100%",

                  border: "2px dashed #ccc",

                  borderRadius: "10px",

                  alignItems: "center",

                  justifyContent: "center",
                }}
              >
                {["m", "n"].map((char, index) => (
                  <Draggable
                    key={char}
                    draggableId={`char-${char}`}
                    index={index}
                    isDragDisabled={
                      showAnswer || lockedLetters.size === matches.length
                    }
                  >
                    {(dragProvided) => (
                      <span
                        ref={(node) => {
                          dragProvided.innerRef(node);

                          keyboardDrag.registerBank(`bank-${char}`, node);
                        }}
                        {...dragProvided.draggableProps}
                        {...dragProvided.dragHandleProps}
                        role="button"
                        tabIndex={
                          keyboardDrag.picked ||
                          lockedLetters.size === matches.length
                            ? -1
                            : 0
                        }
                        aria-label={`Pick up the letter ${char}.`}
                        onKeyDown={(event) =>
                          keyboardDrag.handleBankKeyDown(
                            event,
                            char,
                            `bank-${char}`,
                          )
                        }
                        style={{
                          padding: "7px 14px",

                          border: "2px solid #2c5287",

                          borderRadius: "8px",

                          background: "white",

                          fontWeight: "bold",

                          cursor: "grab",

                          fontSize: "22px",

                          ...dragProvided.draggableProps.style,
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

          {/* =================================================
              MATCHING AREA
          ================================================= */}

          <div className="container1 w-full" ref={matching.containerRef}>
            {matches.map((item, index) => {
              const image = images[index];

              const letterId = `letter-${item.id}`;

              const letterPreview = keyboardDrag.previewFor(letterId);

              const sourceLocked = lockedSources.has(item.id) || showAnswer;

              const targetLocked =
                matching.isLocked("target", image.id) || showAnswer;

              const sourceSelected =
                matching.selectedEndpoint?.side === "source" &&
                matching.selectedEndpoint.id === item.id;

              const targetSelected =
                matching.selectedEndpoint?.side === "target" &&
                matching.selectedEndpoint.id === image.id;

              return (
                <div className="matching-row-review9-p2-q3" key={item.id}>
                  {/* =========================================
                        WORD / SOURCE
                    ========================================= */}

                  <div className="word-with-dot">
                    <div
                      ref={(node) => {
                        /*
                            Matching hook ref
                          */
                        matching.registerEndpoint("source", item.id, node);

                        /*
                            Our focus ref
                          */
                        sourceRefs.current[item.id] = node;
                      }}
                      className={`
                          word-with-dot-review9-p2-q3

                          ${sourceLocked ? "disabled-hover" : ""}

                          ${sourceSelected ? "selected-match-item" : ""}
                        `}
                      style={{
                        position: "relative",

                        width: "90px",

                        display: "flex",
                      }}
                      role="button"
                      tabIndex={sourceLocked ? -1 : 0}
                      aria-label={`${item.id}. ${
                        sourceLocked
                          ? "Matched correctly."
                          : "Start matching this word."
                      }`}
                      onClick={() => {
                        /*
                            Mouse behavior كما هو
                          */
                        if (!sourceLocked) {
                          matching.activateEndpoint("source", item.id);
                        }
                      }}
                      onKeyDown={(event) =>
                        handleMatchingKeyDown(
                          event,
                          "source",
                          item.id,
                          sourceLocked,
                        )
                      }
                    >
                      {/* ==============================
                            NUMBER
                        ============================== */}

                      <span className="span-num">{index + 1}</span>

                      {/* ==============================
                            LETTER DROP
                        ============================== */}

                      <Droppable
                        droppableId={letterId}
                        isDropDisabled={
                          showAnswer || lockedLetters.has(letterId)
                        }
                      >
                        {(dropProvided, snapshot) => (
                          <div
                            ref={(node) => {
                              dropProvided.innerRef(node);

                              keyboardDrag.registerTarget(letterId, node);
                            }}
                            {...dropProvided.droppableProps}
                            role="button"
                            tabIndex={keyboardDrag.targetTabIndex(letterId)}
                            aria-label={
                              letterPreview
                                ? `Place ${letterPreview} here.`
                                : letters[item.id]
                                  ? `${letters[item.id]}. Press Enter or Space to return it.`
                                  : `Missing first letter in ${item.id}.`
                            }
                            onClick={(event) => {
                              /*
                                  لا نخلي click على الحرف
                                  يفعّل matching source
                                */
                              event.stopPropagation();

                              if (letters[item.id]) {
                                removeLetter(letterId);
                              }
                            }}
                            onKeyDown={(event) => {
                              event.stopPropagation();

                              keyboardDrag.handleTargetKeyDown(event, letterId);
                            }}
                            className={`
                                letter-input-review9-p2-q3

                                ${
                                  snapshot.isDraggingOver
                                    ? "drag-over-cell"
                                    : ""
                                }

                                ${
                                  letterPreview
                                    ? "review-keyboard-drop-preview"
                                    : ""
                                }
                              `}
                          >
                            {letterPreview || letters[item.id] || ""}

                            {!showAnswer && wrongLetters.has(item.id) && (
                              <span
                                className="error-mark-review9-p2-q3"
                                aria-hidden="true"
                              >
                                ✕
                              </span>
                            )}
                          </div>
                        )}
                      </Droppable>

                      {/* ==============================
                            SUFFIX
                        ============================== */}

                      <span
                        style={{
                          fontSize: "20px",

                          fontWeight: "500",
                        }}
                      >
                        {item.suffix}
                      </span>
                    </div>

                    {/* =================================
                          SOURCE DOT
                      ================================= */}

                    <div
                      className="dot-wrapper"
                      style={{
                        position: "relative",
                      }}
                    >
                      <div
                        ref={(node) =>
                          matching.registerDot("source", item.id, node)
                        }
                        className="dot start-dot"
                        id={`${item.id}-dot`}
                        tabIndex={-1}
                        aria-hidden="true"
                        onClick={() => {
                          if (!sourceLocked) {
                            matching.activateEndpoint("source", item.id);
                          }
                        }}
                      />

                      {!showAnswer && wrongConnections.has(item.id) && (
                        <span
                          className="connection-error-review9-p2-q3"
                          aria-hidden="true"
                        >
                          ✕
                        </span>
                      )}
                    </div>
                  </div>

                  {/* =========================================
                        IMAGE / TARGET
                    ========================================= */}

                  <div className="img-with-dot">
                    {/* =================================
                          TARGET DOT
                      ================================= */}

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

                    {/* =================================
                          TARGET IMAGE
                      ================================= */}

                    <img
                      ref={(node) =>
                        matching.registerEndpoint("target", image.id, node)
                      }
                      src={image.src}
                      className={`
                          matched-img

                          ${targetSelected ? "selected-match-item" : ""}
                        `}
                      style={{
                        height: "100px",
                      }}
                      alt={image.alt}
                      role="button"
                      tabIndex={targetLocked ? -1 : 0}
                      aria-label={`${image.alt} ${
                        targetLocked
                          ? "Matched correctly."
                          : "Select for matching."
                      }`}
                      onClick={() => {
                        /*
                            Mouse:
                            ما نغير الـfocus بعد connection
                          */
                        if (!targetLocked) {
                          matching.activateEndpoint("target", image.id);
                        }
                      }}
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
                CONNECTION LINES
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
    </DragDropContext>
  );
}
