import React, { useEffect, useRef, useState } from "react";
import "./WB_Unit6_Page5_Q2.css";

import img1 from "../../../assets/U1 WB/U6/U6P37EXEJ-01.svg";
import img2 from "../../../assets/U1 WB/U6/U6P37EXEJ-02.svg";
import img3 from "../../../assets/U1 WB/U6/U6P37EXEJ-03.svg";
import img4 from "../../../assets/U1 WB/U6/U6P37EXEJ-04.svg";

import sentence1Audio from "../../../assets/U1 WB/U6/audio/page 37 - J/Item_001_She_can_fly_a_kite.mp3";
import sentence2Audio from "../../../assets/U1 WB/U6/audio/page 37 - J/Item_002_It_can't_swim.mp3";
import sentence3Audio from "../../../assets/U1 WB/U6/audio/page 37 - J/Item_003_It_can't_climb_a_tree.mp3";
import sentence4Audio from "../../../assets/U1 WB/U6/audio/page 37 - J/Item_004_He_can't_sail_a_boat.mp3";

import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   QUESTIONS
===================================================== */

const questions = [
  {
    id: 1,
    img: img1,
    alt: "A girl outdoors flying a colorful kite in a park.",
    sentence: "She can fly a kite.",
    audio: sentence1Audio,
    words: ["she", "can", "fly", "a", "kite"],
    letters: "typolshehguecanvqxzflyiklppatyeikitebcm",
  },
  {
    id: 2,
    img: img2,
    alt: "A dog in a swimming pool with its paws above the water.",
    sentence: "It can't swim.",
    audio: sentence2Audio,
    words: ["it", "cant", "swim"],
    letters: "kloiuitponbcantrwqaswimmhgfd",
  },
  {
    id: 3,
    img: img3,
    alt: "A dog standing beside a large tree outdoors.",
    sentence: "It can't climb a tree.",
    audio: sentence3Audio,
    words: ["it", "cant", "climb", "a", "tree"],
    letters: "ascxitwqtycantlnmclimbpxczajhiyktreewqer",
  },
  {
    id: 4,
    img: img4,
    alt: "A boy sitting in a small sailboat on the water.",
    sentence: "He can't sail a boat.",
    audio: sentence4Audio,
    words: ["he", "cant", "sail", "a", "boat"],
    letters: "kuyjhebzwsacantlzassailtruhavkooboatkhtg",
  },
];

/* =====================================================
   HELPERS
===================================================== */

const normalizeRange = (start, end) => ({
  start: Math.min(start, end),
  end: Math.max(start, end),
});

/*
  مهم:
  ما بنستخدم indexOf من البداية لكل كلمة؛
  لأنه في كلمات مثل "a" ممكن تتكرر.

  بنبحث بالتسلسل حسب ترتيب الكلمات.
*/
const getCorrectRanges = (question) => {
  const ranges = [];

  let searchFrom = 0;

  question.words.forEach((word) => {
    const start = question.letters
      .toLowerCase()
      .indexOf(word.toLowerCase(), searchFrom);

    if (start !== -1) {
      ranges.push({
        word,
        start,
        end: start + word.length - 1,
      });

      searchFrom = start + word.length;
    }
  });

  return ranges;
};

const sortRanges = (ranges) => [...ranges].sort((a, b) => a.start - b.start);

const rangesAreEqual = (a, b) => {
  const first = sortRanges(a);
  const second = sortRanges(b);

  if (first.length !== second.length) {
    return false;
  }

  return first.every(
    (range, index) =>
      range.start === second[index].start && range.end === second[index].end,
  );
};

const rangeExists = (ranges, target) =>
  ranges.some(
    (range) => range.start === target.start && range.end === target.end,
  );

const WB_Unit6_Page5_Q2 = () => {
  /* =====================================================
     SELECTED RANGES
  ===================================================== */

  const [selectedRanges, setSelectedRanges] = useState({});

  /* =====================================================
     PROGRESSIVE CHECK
  ===================================================== */

  const [lockedQuestions, setLockedQuestions] = useState([]);

  const [wrongQuestions, setWrongQuestions] = useState([]);

  const [showAnswerMode, setShowAnswerMode] = useState(false);

  /* =====================================================
     ROVING TABINDEX
  ===================================================== */

  const [activeLetters, setActiveLetters] = useState(() => {
    const initial = {};

    questions.forEach((q) => {
      initial[q.id] = 0;
    });

    return initial;
  });

  /* =====================================================
     KEYBOARD RANGE
  ===================================================== */

  const [keyboardStart, setKeyboardStart] = useState({});

  const [keyboardPreview, setKeyboardPreview] = useState(null);

  /* =====================================================
     POINTER RANGE
  ===================================================== */

  const [pointerSelection, setPointerSelection] = useState(null);

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioRef = useRef(null);

  const [playingQuestion, setPlayingQuestion] = useState(null);

  /* =====================================================
     QUESTION REFS
  ===================================================== */

  const lettersRefs = useRef({});

  /* =====================================================
     LOCK HELPERS
  ===================================================== */

  const isQuestionLocked = (qId) =>
    lockedQuestions.includes(qId) || showAnswerMode;

  const allCorrect =
    lockedQuestions.length === questions.length || showAnswerMode;

  /* =====================================================
     AUDIO
  ===================================================== */

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;
      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingQuestion(null);
  };

  const playAudio = (question) => {
    if (!question.audio) return;

    stopAudio();

    const audio = new Audio(question.audio);

    audioRef.current = audio;

    setPlayingQuestion(question.id);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingQuestion(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingQuestion(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingQuestion(null);
    };
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  /* =====================================================
     CLEAR WRONG STATE FOR ONE QUESTION
  ===================================================== */

  const clearWrongForQuestion = (qId) => {
    setWrongQuestions((prev) => prev.filter((id) => id !== qId));
  };

  /* =====================================================
     COMMIT RANGE
  ===================================================== */

  const commitRange = (qId, start, end) => {
    if (isQuestionLocked(qId)) return;

    const newRange = normalizeRange(start, end);

    setSelectedRanges((prev) => {
      const current = prev[qId] || [];

      /*
        نفس الـrange مرة ثانية:
        نشيله.
      */

      const sameRange = current.some(
        (range) => range.start === newRange.start && range.end === newRange.end,
      );

      if (sameRange) {
        return {
          ...prev,
          [qId]: current.filter(
            (range) =>
              !(range.start === newRange.start && range.end === newRange.end),
          ),
        };
      }

      /*
        أي range قديم متداخل مع الجديد:
        ينشال.

        الـranges الثانية غير المتداخلة تظل.
      */

      const withoutOverlap = current.filter(
        (range) => range.end < newRange.start || range.start > newRange.end,
      );

      return {
        ...prev,
        [qId]: [...withoutOverlap, newRange],
      };
    });

    /*
      تعديل نفس السؤال يشيل الـ X عنه فقط.
    */

    clearWrongForQuestion(qId);
  };

  /* =====================================================
     FOCUS LETTER
  ===================================================== */

  const focusLetter = (qId, index) => {
    requestAnimationFrame(() => {
      const container = lettersRefs.current[qId];

      if (!container) return;

      container.querySelector(`[data-letter-index="${index}"]`)?.focus();
    });
  };

  /* =====================================================
     MOVE ACTIVE LETTER
  ===================================================== */

  /* =====================================================
   MOVE ACTIVE LETTER
===================================================== */

  const moveActiveLetter = (question, currentIndex, key, selecting) => {
    const length = question.letters.length;

    let nextIndex = currentIndex;

    /*
    بما إن الحروف عندك بسطر واحد:
    Right / Down = التالي
    Left / Up = السابق
  */

    if (key === "ArrowRight" || key === "ArrowDown") {
      if (selecting) {
        nextIndex = Math.min(currentIndex + 1, length - 1);
      } else {
        nextIndex = (currentIndex + 1) % length;
      }
    }

    if (key === "ArrowLeft" || key === "ArrowUp") {
      if (selecting) {
        nextIndex = Math.max(currentIndex - 1, 0);
      } else {
        nextIndex = (currentIndex - 1 + length) % length;
      }
    }

    setActiveLetters((prev) => ({
      ...prev,
      [question.id]: nextIndex,
    }));

    requestAnimationFrame(() => {
      const container = lettersRefs.current[question.id];

      if (!container) return;

      const nextLetter = container.querySelector(
        `[data-letter-index="${nextIndex}"]`,
      );

      nextLetter?.focus();
    });

    return nextIndex;
  };

  /* =====================================================
   KEYBOARD
===================================================== */

  const handleLetterKeyDown = (e, question, index) => {
    if (isQuestionLocked(question.id)) {
      return;
    }

    const qId = question.id;

    const start = keyboardStart[qId];

    const selecting = start !== undefined;

    /* =================================================
     ARROWS
  ================================================= */

    if (
      e.key === "ArrowRight" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowUp" ||
      e.key === "ArrowDown"
    ) {
      e.preventDefault();
      e.stopPropagation();

      const nextIndex = moveActiveLetter(question, index, e.key, selecting);

      /*
      إذا المستخدم بدأ selection:
      الأسهم تمدد الـpreview.
    */

      if (selecting) {
        const preview = normalizeRange(start, nextIndex);

        setKeyboardPreview({
          qId,
          start: preview.start,
          end: preview.end,
        });
      }

      return;
    }

    /* =================================================
     ENTER / SPACE
  ================================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      /*
      أول Enter / Space:
      يبدأ تحديد الـrange من الحرف الحالي.
    */

      if (!selecting) {
        setKeyboardStart((prev) => ({
          ...prev,
          [qId]: index,
        }));

        setKeyboardPreview({
          qId,
          start: index,
          end: index,
        });

        return;
      }

      /*
      ثاني Enter / Space:
      ثبت الـrange.
    */

      commitRange(qId, start, index);

      setKeyboardStart((prev) => {
        const updated = {
          ...prev,
        };

        delete updated[qId];

        return updated;
      });

      setKeyboardPreview(null);

      return;
    }

    /* =================================================
     ESCAPE
  ================================================= */

    if (e.key === "Escape") {
      if (!selecting) return;

      e.preventDefault();
      e.stopPropagation();

      setKeyboardStart((prev) => {
        const updated = {
          ...prev,
        };

        delete updated[qId];

        return updated;
      });

      setKeyboardPreview(null);
    }
  };
  /* =====================================================
     TAB DURING SINGLE-LETTER SELECTION
  ===================================================== */

  const handleLetterBlur = (e, question, index) => {
    const qId = question.id;

    const start = keyboardStart[qId];

    if (start === undefined) return;

    /*
      إذا الفوكس رايح لحرف ثاني بنفس السؤال،
      ما نثبت لسا.
    */

    const nextElement = e.relatedTarget;

    if (nextElement?.dataset?.questionId === String(qId)) {
      return;
    }

    /*
      Enter على حرف ثم Tab:
      يثبت الـrange الحالي.
      وهذا يدعم حرف واحد كمان.
    */

    commitRange(qId, start, activeLetters[qId] ?? index);

    setKeyboardStart((prev) => {
      const updated = { ...prev };

      delete updated[qId];

      return updated;
    });

    setKeyboardPreview(null);
  };

  /* =====================================================
     POINTER DOWN
  ===================================================== */

  const handlePointerDown = (e, question, index) => {
    if (isQuestionLocked(question.id)) {
      return;
    }

    if (e.pointerType === "mouse" && e.button !== 0) {
      return;
    }

    e.preventDefault();

    setActiveLetters((prev) => ({
      ...prev,
      [question.id]: index,
    }));

    setPointerSelection({
      qId: question.id,
      start: index,
      end: index,
    });

    clearWrongForQuestion(question.id);
  };

  /* =====================================================
     POINTER MOVE
  ===================================================== */

  const handlePointerMove = (e, question) => {
    if (
      !pointerSelection ||
      pointerSelection.qId !== question.id ||
      isQuestionLocked(question.id)
    ) {
      return;
    }

    const element = document.elementFromPoint(e.clientX, e.clientY);

    const letterElement = element?.closest?.(
      `[data-question-id="${question.id}"][data-letter-index]`,
    );

    if (!letterElement) return;

    const nextIndex = Number(letterElement.dataset.letterIndex);

    if (Number.isNaN(nextIndex)) return;

    setPointerSelection((prev) => ({
      ...prev,
      end: nextIndex,
    }));
  };

  /* =====================================================
     POINTER UP
  ===================================================== */

  const finishPointerSelection = (question) => {
    if (!pointerSelection || pointerSelection.qId !== question.id) {
      return;
    }

    commitRange(question.id, pointerSelection.start, pointerSelection.end);

    setPointerSelection(null);
  };

  /* =====================================================
     POINTER CANCEL
  ===================================================== */

  const cancelPointerSelection = () => {
    setPointerSelection(null);
  };

  /* =====================================================
     CHECK ANSWERS
  ===================================================== */

  const checkAnswers = () => {
    /*
      الكل صح:
      Check يظل موجود لكن no-op.
    */

    if (allCorrect || showAnswerMode) {
      return;
    }

    /*
      كل سؤال غير locked لازم
      المستخدم يكون حدد فيه range واحد على الأقل.
    */

    const hasEmptyQuestion = questions.some(
      (question) =>
        !isQuestionLocked(question.id) && !selectedRanges[question.id]?.length,
    );

    if (hasEmptyQuestion) {
      ValidationAlert.info("Please find at least one word in each question.");

      return;
    }

    const newlyLocked = [];
    const wrong = [];

    let correctCount = 0;
    let totalCount = 0;

    questions.forEach((question) => {
      const correctRanges = getCorrectRanges(question);

      totalCount += correctRanges.length;

      /*
        سؤال مقفول من Check سابق:
        كل كلماته صح.
      */

      if (isQuestionLocked(question.id)) {
        correctCount += correctRanges.length;

        newlyLocked.push(question.id);

        return;
      }

      const userRanges = selectedRanges[question.id] || [];

      /*
        السكور:
        كل correct range محسوب لوحده.
      */

      correctRanges.forEach((correctRange) => {
        if (rangeExists(userRanges, correctRange)) {
          correctCount++;
        }
      });

      /*
        السؤال يقفل فقط إذا:
        كل الـranges مطابقة تمامًا
        وما في ranges زيادة غلط.
      */

      if (rangesAreEqual(userRanges, correctRanges)) {
        newlyLocked.push(question.id);
      } else {
        wrong.push(question.id);
      }
    });

    setLockedQuestions((prev) =>
      Array.from(new Set([...prev, ...newlyLocked])),
    );

    setWrongQuestions(wrong);

    /*
      أي keyboard preview مفتوح
      نلغيه وقت Check.
    */

    setKeyboardStart({});
    setKeyboardPreview(null);
    setPointerSelection(null);

    const color =
      correctCount === totalCount
        ? "green"
        : correctCount === 0
          ? "red"
          : "orange";

    const resultHTML = `
      <div style="
        font-size:20px;
        text-align:center;
        margin-top:8px;
      ">
        <span style="
          color:${color};
          font-weight:bold;
        ">
          Score: ${correctCount} / ${totalCount}
        </span>
      </div>
    `;

    if (correctCount === totalCount) {
      ValidationAlert.success(resultHTML);
    } else if (correctCount === 0) {
      ValidationAlert.error(resultHTML);
    } else {
      ValidationAlert.warning(resultHTML);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const showAnswers = () => {
    stopAudio();

    const answers = {};

    questions.forEach((question) => {
      answers[question.id] = getCorrectRanges(question);
    });

    setSelectedRanges(answers);

    setLockedQuestions(questions.map((q) => q.id));

    setWrongQuestions([]);

    setKeyboardStart({});
    setKeyboardPreview(null);
    setPointerSelection(null);

    setShowAnswerMode(true);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    stopAudio();

    setSelectedRanges({});

    setLockedQuestions([]);

    setWrongQuestions([]);

    setShowAnswerMode(false);

    setKeyboardStart({});

    setKeyboardPreview(null);

    setPointerSelection(null);

    const initialActive = {};

    questions.forEach((q) => {
      initialActive[q.id] = 0;
    });

    setActiveLetters(initialActive);

    /*
      بعد reset، أول سؤال يرجع
      لأول حرف في roving tabindex.
    */
  };

  /* =====================================================
     SELECTED WORD LABELS
  ===================================================== */

  const getSelectedWords = (question) => {
    const ranges = sortRanges(selectedRanges[question.id] || []);

    return ranges.map((range) =>
      question.letters.slice(range.start, range.end + 1),
    );
  };

  /* =====================================================
     JSX
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
      <div
        className="div-forall"
        style={{
          gap: "30px",
        }}
      >
        <ExerciseHeader
          sectionLetter="J"
          title="Find the words."
          subTitle="Find the full can or can’t sentence hidden in each letter string."
        />

        <div className="flex flex-col gap-5">
          {questions.map((q) => {
            const locked = isQuestionLocked(q.id);

            const wrong = wrongQuestions.includes(q.id);

            const selected = selectedRanges[q.id] || [];

            const selectedWords = getSelectedWords(q);

            const isSentencePlaying = playingQuestion === q.id;

            return (
              <div key={q.id} className="content-container-wb-unit6-p5-q2">
                <div
                  className="wb-unit6-p5-q2-question"
                  style={{
                    position: "relative",
                  }}
                >
                  {/* =====================================
                      SENTENCE + AUDIO
                  ====================================== */}

                  <div
                    className="wb-unit6-p5-q2-sentence-audio-wrapper"
                    role="button"
                    tabIndex={0}
                    aria-label={`Play audio: ${q.sentence}`}
                    onClick={() => playAudio(q)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();

                        playAudio(q);
                      }
                    }}
                  >
                    <p className="wb-unit6-p5-q2-sentence">
                      <b>{q.id}</b> {q.sentence}
                    </p>

                    {isSentencePlaying && (
                      <FaVolumeUp
                        size={15}
                        aria-hidden="true"
                        className="wb-unit6-p5-q2-audio-icon"
                      />
                    )}
                  </div>

                  {/* =====================================
                      LETTER RANGE
                  ====================================== */}

                  <div
                    ref={(element) => {
                      lettersRefs.current[q.id] = element;
                    }}
                    className={`wb-unit6-p5-q2-letters ${
                      locked ? "wb-unit6-p5-q2-letters-locked" : ""
                    }`}
                    role="group"
                    aria-label={`Question ${q.id}. Find the hidden words in the letter string.`}
                    onPointerMove={(e) => handlePointerMove(e, q)}
                    onPointerUp={() => finishPointerSelection(q)}
                    onPointerCancel={cancelPointerSelection}
                    onPointerLeave={(e) => {
                      /*
                        Mouse:
                        إذا ترك المنطقة أثناء drag
                        منلغي preview بدل ما نثبت
                        range غير مقصود.
                      */

                      if (
                        e.pointerType === "mouse" &&
                        pointerSelection?.qId === q.id
                      ) {
                        cancelPointerSelection();
                      }
                    }}
                  >
                    {q.letters.split("").map((letter, index) => {
                      const isSelected = selected.some(
                        (range) => index >= range.start && index <= range.end,
                      );

                      const keyboardRange =
                        keyboardPreview?.qId === q.id
                          ? normalizeRange(
                              keyboardPreview.start,
                              keyboardPreview.end,
                            )
                          : null;

                      const isKeyboardPreview =
                        keyboardRange &&
                        index >= keyboardRange.start &&
                        index <= keyboardRange.end;

                      const pointerRange =
                        pointerSelection?.qId === q.id
                          ? normalizeRange(
                              pointerSelection.start,
                              pointerSelection.end,
                            )
                          : null;

                      const isPointerPreview =
                        pointerRange &&
                        index >= pointerRange.start &&
                        index <= pointerRange.end;

                      const isPreview = isKeyboardPreview || isPointerPreview;

                      const activeIndex = activeLetters[q.id] ?? 0;

                      return (
                        <span
                          key={index}
                          data-question-id={q.id}
                          data-letter-index={index}
                          className={`
                              wb-unit6-p5-q2-letter

                              ${
                                isSelected
                                  ? "wb-unit6-p5-q2-letter-selected"
                                  : ""
                              }

                              ${
                                isPreview ? "wb-unit6-p5-q2-letter-preview" : ""
                              }
                            `}
                          role="button"
                          tabIndex={
                            locked ? -1 : activeIndex === index ? 0 : -1
                          }
                          aria-label={`Letter ${letter}, position ${
                            index + 1
                          } of ${q.letters.length}`}
                          aria-pressed={isSelected}
                          onPointerDown={(e) => handlePointerDown(e, q, index)}
                          onKeyDown={(e) => handleLetterKeyDown(e, q, index)}
                          onBlur={(e) => handleLetterBlur(e, q, index)}
                        >
                          {letter}
                        </span>
                      );
                    })}
                  </div>

                  {/* =====================================
                      WRONG X
                  ====================================== */}

                  {wrong && !showAnswerMode && (
                    <span
                      className="wb-unit6-p5-q2-question-wrong"
                      aria-hidden="true"
                    >
                      ✕
                    </span>
                  )}

                  {/* =====================================
                      FOUND RANGES
                  ====================================== */}

                  <div className="wb-unit6-p5-q2-found">
                    {selectedWords.map((word, index) => (
                      <span
                        key={`${word}-${index}`}
                        className="wb-unit6-p5-q2-found-word"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>

                {/* =====================================
                    IMAGE
                ====================================== */}

                <img src={q.img} alt={q.alt} className="img-wb-unit6-p5-q2" />
              </div>
            );
          })}
        </div>
      </div>

      {/* =================================================
          BUTTONS
      ================================================= */}

      <div className="action-buttons-container">
        <button className="try-again-button" onClick={reset}>
          Start Again ↻
        </button>

        <button className="show-answer-btn swal-continue" onClick={showAnswers}>
          Show Answer
        </button>

        <button className="check-button2" onClick={checkAnswers}>
          Check Answer ✓
        </button>
      </div>
    </div>
  );
};

export default WB_Unit6_Page5_Q2;
