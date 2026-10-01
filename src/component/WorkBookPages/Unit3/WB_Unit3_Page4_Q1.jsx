import React, { useMemo, useRef, useState } from "react";

import "./WB_Unit3_Page4_Q1.css";

import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   AUDIO
===================================================== */

import listenAudio from "../../../assets/U1 WB/U3/page_19/Item_001_Listen!.mp3";

import makeLineAudio from "../../../assets/U1 WB/U3/page_19/Item_002_Make_a_line.mp3";

import openBookAudio from "../../../assets/U1 WB/U3/page_19/Item_003_Open_your_book.mp3";

import quietAudio from "../../../assets/U1 WB/U3/page_19/Item_004_Quiet!.mp3";

/* =====================================================
   HELPERS
===================================================== */

const normalizeRange = (start, end) => ({
  start: Math.min(start, end),
  end: Math.max(start, end),
});

const sameRange = (a, b) => a.start === b.start && a.end === b.end;

const rangeContains = (range, index) =>
  index >= range.start && index <= range.end;

/* =====================================================
   COMPONENT
===================================================== */

const WB_Unit3_Page4_Q1 = () => {
  /* =====================================================
     QUESTIONS
  ===================================================== */

  const questions = useMemo(
    () => [
      {
        letters: "ltmnblistenpolq",

        answer: "Listen!",

        audio: listenAudio,

        words: [
          {
            start: 5,
            length: 6,
          },
        ],
      },

      {
        letters: "yrxbmakeoiakhqglineybcz",

        answer: "Make a line.",

        audio: makeLineAudio,

        words: [
          {
            start: 4,
            length: 4,
          },

          {
            start: 10,
            length: 1,
          },

          {
            start: 15,
            length: 4,
          },
        ],
      },

      {
        letters: "bzopenutyeyourlkjhbookmmrd",

        answer: "Open your book.",

        audio: openBookAudio,

        words: [
          {
            start: 2,
            length: 4,
          },

          {
            start: 10,
            length: 4,
          },

          {
            start: 18,
            length: 4,
          },
        ],
      },

      {
        letters: "uhkjquietbfas",

        answer: "Quiet!",

        audio: quietAudio,

        words: [
          {
            start: 4,
            length: 5,
          },
        ],
      },
    ],
    [],
  );

  /* =====================================================
     CORRECT RANGES
  ===================================================== */

  const correctRanges = useMemo(
    () =>
      questions.map((q) =>
        q.words.map(({ start, length }) => ({
          start,

          end: start + length - 1,
        })),
      ),
    [questions],
  );

  /* =====================================================
     REFS
  ===================================================== */

  const charRefs = useRef({});

  const audioRef = useRef(null);

  /*
    Pointer:
    Mouse + Touch + Apple Pencil
  */

  const pointerStartRef = useRef(null);

  const pointerCurrentRef = useRef(null);

  const pointerDraggingRef = useRef(false);

  /* =====================================================
     STATE
  ===================================================== */

  /*
    selections = {
      0: [
        { start: 5, end: 10 }
      ],

      1: [
        { start:4, end:7 },
        { start:10, end:10 },
        { start:15, end:18 }
      ]
    }
  */

  const [selections, setSelections] = useState({});

  /* =====================================================
     POINTER PREVIEW
  ===================================================== */

  const [pointerPreview, setPointerPreview] = useState(null);

  /* =====================================================
     KEYBOARD SELECTION
  ===================================================== */

  /*
    {
      qIndex,
      start,
      end,
      moved
    }
  */

  const [keyboardSelection, setKeyboardSelection] = useState(null);

  /* =====================================================
     CHECK / LOCK
  ===================================================== */

  const [lockedQuestions, setLockedQuestions] = useState([]);

  const [wrongQuestions, setWrongQuestions] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =====================================================
     AUDIO
  ===================================================== */

  const [playingQuestion, setPlayingQuestion] = useState(null);

  /* =====================================================
     ACCESSIBILITY
  ===================================================== */

  const [announcement, setAnnouncement] = useState("");

  /* =====================================================
     HELPERS
  ===================================================== */

  const getSelections = (qIndex) => {
    return selections[qIndex] || [];
  };

  const isQuestionLocked = (qIndex) => {
    return lockedQuestions.includes(qIndex);
  };

  const isIndexSelected = (qIndex, charIndex) => {
    return getSelections(qIndex).some((range) =>
      rangeContains(range, charIndex),
    );
  };

  /* =====================================================
     KEYBOARD PREVIEW
  ===================================================== */

  const isKeyboardPreview = (qIndex, charIndex) => {
    if (!keyboardSelection || keyboardSelection.qIndex !== qIndex) {
      return false;
    }

    const range = normalizeRange(
      keyboardSelection.start,
      keyboardSelection.end,
    );

    return rangeContains(range, charIndex);
  };

  /* =====================================================
     POINTER PREVIEW
  ===================================================== */

  const isPointerPreview = (qIndex, charIndex) => {
    if (!pointerPreview || pointerPreview.qIndex !== qIndex) {
      return false;
    }

    const range = normalizeRange(pointerPreview.start, pointerPreview.end);

    return rangeContains(range, charIndex);
  };

  /* =====================================================
     AUDIO
  ===================================================== */

  const stopAudio = () => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.pause();

    audioRef.current.currentTime = 0;

    audioRef.current = null;

    setPlayingQuestion(null);
  };

  const playAudio = (qIndex) => {
    const question = questions[qIndex];

    if (!question?.audio) {
      return;
    }

    stopAudio();

    const audio = new Audio(question.audio);

    audioRef.current = audio;

    setPlayingQuestion(qIndex);

    audio.play().catch(() => {
      setPlayingQuestion(null);

      if (audioRef.current === audio) {
        audioRef.current = null;
      }
    });

    audio.onended = () => {
      setPlayingQuestion(null);

      if (audioRef.current === audio) {
        audioRef.current = null;
      }
    };

    audio.onerror = () => {
      setPlayingQuestion(null);

      if (audioRef.current === audio) {
        audioRef.current = null;
      }
    };
  };

  /* =====================================================
     COMMIT RANGE
  ===================================================== */

  const commitRange = (qIndex, rawStart, rawEnd) => {
    if (showAnswer || checkCompleted || isQuestionLocked(qIndex)) {
      return;
    }

    const range = normalizeRange(rawStart, rawEnd);

    setSelections((prev) => {
      const current = prev[qIndex] || [];

      /*
          لو اختار نفس الـrange
          مرة ثانية:

          نشيله.
        */

      const exactExists = current.some((item) => sameRange(item, range));

      if (exactExists) {
        return {
          ...prev,

          [qIndex]: current.filter((item) => !sameRange(item, range)),
        };
      }

      /*
          إذا التحديد الجديد
          متداخل مع تحديد قديم:

          نشيل القديم
          ونحط الجديد.

          هيك يقدر يعدل الغلط.
        */

      const filtered = current.filter(
        (item) => range.end < item.start || range.start > item.end,
      );

      return {
        ...prev,

        [qIndex]: [...filtered, range],
      };
    });

    /*
      لو السؤال عليه X
      وشاف الطالب إنه غلط
      وعدله:

      شيل X.
    */

    setWrongQuestions((prev) => prev.filter((index) => index !== qIndex));

    const selectedText = questions[qIndex].letters.slice(
      range.start,
      range.end + 1,
    );

    setAnnouncement(`Selected ${selectedText}.`);
  };

  /* =====================================================
     FIND CHAR UNDER POINTER

     مهم خصوصًا للـ iPad:
     بنعرف الإصبع صار فوق أي حرف.
  ===================================================== */

  const getPointerCharacter = (clientX, clientY) => {
    const element = document.elementFromPoint(clientX, clientY);

    if (!element) {
      return null;
    }

    const charElement = element.closest?.("[data-wb-u3-p4-char='true']");

    if (!charElement) {
      return null;
    }

    const qIndex = Number(charElement.dataset.qIndex);

    const charIndex = Number(charElement.dataset.charIndex);

    if (Number.isNaN(qIndex) || Number.isNaN(charIndex)) {
      return null;
    }

    return {
      qIndex,
      charIndex,
    };
  };

  /* =====================================================
     POINTER DOWN

     Mouse + Touch + Pencil
  ===================================================== */

  const handlePointerDown = (e, qIndex, charIndex) => {
    if (showAnswer || checkCompleted || isQuestionLocked(qIndex)) {
      return;
    }

    /*
      منع تحديد النص العادي
      ومنع scroll أثناء سحب الكلمة.
    */

    e.preventDefault();

    /*
      Pointer يلغي Keyboard mode.
    */

    setKeyboardSelection(null);

    pointerDraggingRef.current = true;

    pointerStartRef.current = {
      qIndex,
      charIndex,
    };

    pointerCurrentRef.current = {
      qIndex,
      charIndex,
    };

    setPointerPreview({
      qIndex,

      start: charIndex,

      end: charIndex,
    });
  };

  /* =====================================================
     POINTER MOVE

     هذا المهم للـ iPad.
  ===================================================== */

  const handlePointerMove = (e) => {
    if (!pointerDraggingRef.current) {
      return;
    }

    const start = pointerStartRef.current;

    if (!start) {
      return;
    }

    const target = getPointerCharacter(e.clientX, e.clientY);

    if (!target) {
      return;
    }

    /*
      لازم يضل داخل
      نفس السؤال.
    */

    if (target.qIndex !== start.qIndex) {
      return;
    }

    pointerCurrentRef.current = target;

    setPointerPreview({
      qIndex: start.qIndex,

      start: start.charIndex,

      end: target.charIndex,
    });
  };

  /* =====================================================
     POINTER ENTER

     مفيد للماوس.
  ===================================================== */

  const handlePointerEnter = (qIndex, charIndex) => {
    if (!pointerDraggingRef.current) {
      return;
    }

    const start = pointerStartRef.current;

    if (!start) {
      return;
    }

    if (start.qIndex !== qIndex) {
      return;
    }

    pointerCurrentRef.current = {
      qIndex,
      charIndex,
    };

    setPointerPreview({
      qIndex,

      start: start.charIndex,

      end: charIndex,
    });
  };

  /* =====================================================
     POINTER UP
  ===================================================== */

  const handlePointerUp = (e) => {
    if (!pointerDraggingRef.current) {
      return;
    }

    e.preventDefault();

    const start = pointerStartRef.current;

    if (!start) {
      return;
    }

    /*
      نشوف الإصبع/الماوس
      وين انتهى فعليًا.
    */

    const target = getPointerCharacter(e.clientX, e.clientY);

    let end = pointerCurrentRef.current;

    if (target && target.qIndex === start.qIndex) {
      end = target;
    }

    /*
      إذا مجرد Tap / Click
      وما تحرك:

      end = start
      وبالتالي حرف واحد.
    */

    if (!end || end.qIndex !== start.qIndex) {
      end = {
        ...start,
      };
    }

    commitRange(start.qIndex, start.charIndex, end.charIndex);

    pointerDraggingRef.current = false;

    pointerStartRef.current = null;

    pointerCurrentRef.current = null;

    setPointerPreview(null);
  };

  /* =====================================================
     POINTER CANCEL
  ===================================================== */

  const cancelPointer = () => {
    pointerDraggingRef.current = false;

    pointerStartRef.current = null;

    pointerCurrentRef.current = null;

    setPointerPreview(null);
  };

  /* =====================================================
     KEYBOARD START
  ===================================================== */

  const startKeyboardSelection = (qIndex, charIndex) => {
    if (showAnswer || checkCompleted || isQuestionLocked(qIndex)) {
      return;
    }

    setPointerPreview(null);

    setKeyboardSelection({
      qIndex,

      start: charIndex,

      end: charIndex,

      /*
        false يعني:
        لسا ما تحرك بالأسهم.
      */

      moved: false,
    });

    const letter = questions[qIndex].letters[charIndex];

    setAnnouncement(
      `Selection started at letter ${letter}. Use Left or Right Arrow to select more letters, then press Enter.`,
    );
  };

  /* =====================================================
     KEYBOARD COMPLETE
  ===================================================== */

  const completeKeyboardSelection = () => {
    if (!keyboardSelection) {
      return;
    }

    const { qIndex, start, end } = keyboardSelection;

    commitRange(qIndex, start, end);

    setKeyboardSelection(null);
  };

  /* =====================================================
     KEYBOARD
  ===================================================== */

  const handleCharKeyDown = (e, qIndex, charIndex) => {
    if (showAnswer || checkCompleted || isQuestionLocked(qIndex)) {
      return;
    }

    /* =================================================
       ENTER / SPACE
    ================================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();

      e.stopPropagation();

      /*
        أول Enter:
        ابدأ التحديد.
      */

      if (!keyboardSelection) {
        startKeyboardSelection(qIndex, charIndex);

        return;
      }

      /*
        Selection من سؤال ثاني؟
      */

      if (keyboardSelection.qIndex !== qIndex) {
        return;
      }

      /*
        ثاني Enter:
        ثبت التحديد.
      */

      completeKeyboardSelection();

      return;
    }

    /* =================================================
       ARROW RIGHT
    ================================================= */

    if (e.key === "ArrowRight" && keyboardSelection?.qIndex === qIndex) {
      e.preventDefault();

      e.stopPropagation();

      const lastIndex = questions[qIndex].letters.length - 1;

      const nextIndex = Math.min(charIndex + 1, lastIndex);

      setKeyboardSelection((prev) => ({
        ...prev,

        end: nextIndex,

        moved: true,
      }));

      requestAnimationFrame(() => {
        charRefs.current[`${qIndex}-${nextIndex}`]?.focus();
      });

      return;
    }

    /* =================================================
       ARROW LEFT
    ================================================= */

    if (e.key === "ArrowLeft" && keyboardSelection?.qIndex === qIndex) {
      e.preventDefault();

      e.stopPropagation();

      const nextIndex = Math.max(charIndex - 1, 0);

      setKeyboardSelection((prev) => ({
        ...prev,

        end: nextIndex,

        moved: true,
      }));

      requestAnimationFrame(() => {
        charRefs.current[`${qIndex}-${nextIndex}`]?.focus();
      });

      return;
    }

    /* =================================================
       TAB

       Enter + Tab:
       إذا ما استخدم الأسهم
       = حرف واحد.

       لو استخدم الأسهم:
       لازم Enter يثبت الكلمة.
    ================================================= */

    if (e.key === "Tab" && keyboardSelection?.qIndex === qIndex) {
      /*
        ما تحرك بالأسهم:
        ثبت حرف واحد.

        مثال كلمة a.
      */

      if (!keyboardSelection.moved) {
        completeKeyboardSelection();

        /*
          مهم:
          ما في preventDefault.

          خلي Tab يكمل طبيعي
          للحرف اللي بعده.
        */

        return;
      }

      /*
        لو عمل:
        Enter
        Right
        Right...

        لازم يضغط Enter
        قبل ما يطلع.
      */

      e.preventDefault();

      e.stopPropagation();

      setAnnouncement("Press Enter to confirm the selected letters.");

      return;
    }

    /* =================================================
       ESCAPE
    ================================================= */

    if (e.key === "Escape" && keyboardSelection?.qIndex === qIndex) {
      e.preventDefault();

      e.stopPropagation();

      const start = keyboardSelection.start;

      setKeyboardSelection(null);

      setAnnouncement("Selection cancelled.");

      requestAnimationFrame(() => {
        charRefs.current[`${qIndex}-${start}`]?.focus();
      });
    }
  };

  /* =====================================================
     GET SELECTED TEXT
  ===================================================== */

  const getSelectedWords = (qIndex) => {
    const ranges = [...getSelections(qIndex)].sort((a, b) => a.start - b.start);

    return ranges
      .map((range) =>
        questions[qIndex].letters.slice(range.start, range.end + 1),
      )
      .join(" ");
  };

  /* =====================================================
     IS QUESTION CORRECT
  ===================================================== */

  const isQuestionCorrect = (qIndex) => {
    const userRanges = [...getSelections(qIndex)].sort(
      (a, b) => a.start - b.start,
    );

    const expected = [...correctRanges[qIndex]].sort(
      (a, b) => a.start - b.start,
    );

    if (userRanges.length !== expected.length) {
      return false;
    }

    return expected.every((correct, index) =>
      sameRange(correct, userRanges[index]),
    );
  };

  /* =====================================================
     CHECK ANSWER
  ===================================================== */

  const checkAnswer = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    /*
      لازم كل سؤال يكون
      عليه عدد selections
      المطلوب على الأقل.
    */

    const incompleteIndex = questions.findIndex(
      (_, qIndex) =>
        getSelections(qIndex).length < correctRanges[qIndex].length,
    );

    if (incompleteIndex !== -1) {
      ValidationAlert.info(
        "Oops!",

        `Please complete question ${incompleteIndex + 1}.`,
      );

      return;
    }

    let score = 0;

    const wrong = [];

    const newlyLocked = [];

    questions.forEach((_, qIndex) => {
      if (isQuestionCorrect(qIndex)) {
        score++;

        newlyLocked.push(qIndex);
      } else {
        wrong.push(qIndex);
      }
    });

    /*
      اقفل الصح فقط.
    */

    setLockedQuestions((prev) => [...new Set([...prev, ...newlyLocked])]);

    /*
      الغلط يضل editable.
    */

    setWrongQuestions(wrong);

    setKeyboardSelection(null);

    setPointerPreview(null);

    pointerDraggingRef.current = false;

    pointerStartRef.current = null;

    pointerCurrentRef.current = null;

    const total = questions.length;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    if (score === total) {
      setLockedQuestions(questions.map((_, index) => index));

      setWrongQuestions([]);

      setCheckCompleted(true);

      ValidationAlert.success(msg);

      return;
    }

    if (score === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const showTheAnswer = () => {
    const finalSelections = {};

    questions.forEach((_, qIndex) => {
      finalSelections[qIndex] = correctRanges[qIndex].map((range) => ({
        ...range,
      }));
    });

    setSelections(finalSelections);

    setLockedQuestions(questions.map((_, index) => index));

    setWrongQuestions([]);

    setShowAnswer(true);

    setCheckCompleted(true);

    setKeyboardSelection(null);

    setPointerPreview(null);

    pointerDraggingRef.current = false;

    pointerStartRef.current = null;

    pointerCurrentRef.current = null;

    setAnnouncement("Correct answers are displayed.");
  };

  /* =====================================================
     START AGAIN
  ===================================================== */

  const startAgain = () => {
    stopAudio();

    setSelections({});

    setPointerPreview(null);

    pointerDraggingRef.current = false;

    pointerStartRef.current = null;

    pointerCurrentRef.current = null;

    setKeyboardSelection(null);

    setLockedQuestions([]);

    setWrongQuestions([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setAnnouncement("");
  };

  /* =====================================================
     RENDER
  ===================================================== */

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
      {/* =================================================
          SCREEN READER
      ================================================= */}

      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only-wb-u3-p4-q1"
      >
        {announcement}
      </div>

      <div className="div-forall">
        <ExerciseHeader
          sectionLetter="G"
          title="Find the words."
          subTitle="Scan each letter string and tap the classroom command hidden inside."
        />

        <div className="wb-unit3-p4-q1-rows">
          {questions.map((q, qIndex) => {
            const locked = isQuestionLocked(qIndex);

            const wrong = wrongQuestions.includes(qIndex);

            const playing = playingQuestion === qIndex;

            return (
              <div key={qIndex} className="wb-unit3-p4-q1-row">
                {/* =====================================
                      LEFT
                  ===================================== */}

                <div className="wb-unit3-p4-q1-left">
                  {/* ===============================
                        LETTER LINE
                    =============================== */}

                  <div className="wb-unit3-p4-q1-line">
                    <span className="wb-unit3-p4-q1-number">{qIndex + 1}</span>

                    <span className="wb-unit3-p4-q1-letters">
                      {q.letters.split("").map((char, charIndex) => {
                        const selected = isIndexSelected(qIndex, charIndex);

                        const keyboardPreview = isKeyboardPreview(
                          qIndex,
                          charIndex,
                        );

                        const pointerPreviewActive = isPointerPreview(
                          qIndex,
                          charIndex,
                        );

                        return (
                          <span
                            key={charIndex}
                            ref={(node) => {
                              charRefs.current[`${qIndex}-${charIndex}`] = node;
                            }}
                            data-wb-u3-p4-char="true"
                            data-q-index={qIndex}
                            data-char-index={charIndex}
                            role="button"
                            tabIndex={
                              locked || showAnswer || checkCompleted ? -1 : 0
                            }
                            aria-disabled={locked}
                            aria-selected={
                              selected ||
                              keyboardPreview ||
                              pointerPreviewActive
                            }
                            aria-label={`Question ${
                              qIndex + 1
                            }, letter ${char}. ${
                              keyboardSelection?.qIndex === qIndex
                                ? "Use Left or Right Arrow to extend the selection, then press Enter."
                                : "Press Enter or Space to start selecting."
                            }`}
                            className={[
                              "wb-unit3-p4-q1-char",

                              selected ? "is-circled" : "",

                              keyboardPreview
                                ? "keyboard-preview-wb-u3-p4-q1"
                                : "",

                              pointerPreviewActive
                                ? "pointer-preview-wb-u3-p4-q1"
                                : "",
                            ]
                              .join(" ")
                              .trim()}
                            /* =========================
                                     KEYBOARD
                                  ========================= */
                            onKeyDown={(e) =>
                              handleCharKeyDown(e, qIndex, charIndex)
                            }
                            /* =========================
                                     MOUSE + IPAD + PENCIL
                                  ========================= */
                            onPointerDown={(e) =>
                              handlePointerDown(e, qIndex, charIndex)
                            }
                            onPointerMove={handlePointerMove}
                            onPointerEnter={() =>
                              handlePointerEnter(qIndex, charIndex)
                            }
                            onPointerUp={handlePointerUp}
                            onPointerCancel={cancelPointer}
                            onDragStart={(e) => e.preventDefault()}
                          >
                            {char}
                          </span>
                        );
                      })}
                    </span>

                    {/* =========================
                          WRONG
                      ========================= */}

                    {wrong && (
                      <div
                        className="wrong-mark-wb-unit3-p4-q1"
                        aria-hidden="true"
                      >
                        ✕
                      </div>
                    )}
                  </div>

                  {/* ===============================
                        INPUT
                    =============================== */}

                  <div className="wb-unit3-p4-q1-write">
                    <input
                      className="wb-unit3-p4-q1-input"
                      value={getSelectedWords(qIndex)}
                      readOnly
                      aria-label={`Selected words for question ${qIndex + 1}`}
                    />
                  </div>
                </div>

                {/* =====================================
                      WORD + AUDIO
                  ===================================== */}

                <span
                  className="wb-unit3-p4-q1-rightBtn"
                  role="button"
                  tabIndex={0}
                  aria-label={`${q.answer}. Press Enter or Space to hear it.`}
                  aria-pressed={playing}
                  onClick={() => playAudio(qIndex)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();

                      e.stopPropagation();

                      playAudio(qIndex);
                    }
                  }}
                >
                  {q.answer}

                  {playing && (
                    <FaVolumeUp
                      aria-hidden="true"
                      style={{
                        marginLeft: "8px",

                        color: "#2563eb",
                      }}
                    />
                  )}
                </span>
              </div>
            );
          })}
        </div>

        {/* =================================================
            BUTTONS
        ================================================= */}

        <div className="action-buttons-container">
          <button className="try-again-button" onClick={startAgain}>
            Start Again ↻
          </button>

          <button
            className="show-answer-btn swal-continue"
            onClick={showTheAnswer}
          >
            Show Answer
          </button>

          <button className="check-button2" onClick={checkAnswer}>
            Check Answer ✓
          </button>
        </div>
      </div>
    </div>
  );
};

export default WB_Unit3_Page4_Q1;
