import React, { useEffect, useRef, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";

import bat from "../../../assets/unit10/imgs/U10P87EXEE01-01.svg";
import cap from "../../../assets/unit10/imgs/U10P87EXEE01-02.svg";
import ant from "../../../assets/unit10/imgs/U10P87EXEE02-01.svg";
import dad from "../../../assets/unit10/imgs/U10P87EXEE02-02.svg";

import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";

import "./Unit10_Page6_Q2.css";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";

/* =====================================================
   AUDIO
===================================================== */

import chickenAudio from "../../../assets/unit10/sound/Page 87 - E/chicken.mp3";
import full2Audio from "../../../assets/unit10/sound/Page 87 - E/full1.mp3";
import full1Audio from "../../../assets/unit10/sound/Page 87 - E/full2.mp3";
import iWantAnAudio from "../../../assets/unit10/sound/Page 87 - E/I want an.mp3";
import iWantAudio from "../../../assets/unit10/sound/Page 87 - E/I want.mp3";
import orangeAudio from "../../../assets/unit10/sound/Page 87 - E/orange.mp3";
import whatDoYouWantAudio from "../../../assets/unit10/sound/Page 87 - E/What do you want.mp3";

/* =====================================================
   DATA
===================================================== */

const items = [
  {
    question: "What do you want?",
    questionAudio: whatDoYouWantAudio,

    images: [
      {
        img: bat,
        value: "chicken",
        alt: "A cooked chicken on a plate.",
        audio: null,
      },
      {
        img: cap,
        value: "apple",
        alt: "A red apple with a green leaf.",
        audio: null,
      },
    ],

    correct: "chicken",

    correctInput: "I want",

    afterAnswer: "chicken.",

    afterAudio: chickenAudio,

    fullAudio: full1Audio,

    inputsCount: 1,
  },

  {
    question: "",

    images: [
      {
        img: ant,
        value: "cake",
        alt: "A round cake with pink frosting.",
        audio: null,
      },
      {
        img: dad,
        value: "orange",
        alt: "An orange with a green leaf.",
        audio: null,
      },
    ],

    correct: "orange",

    correctInput: "I want an",

    correctQuestion: "What do you want",

    afterAnswer: "orange.",

    afterAudio: orangeAudio,

    fullAudio: full2Audio,

    inputsCount: 2,
  },
];

/* =====================================================
   WORD BANK
===================================================== */

const wordBank = [
  {
    id: "what-do-you-want",
    text: "What do you want",
    audio: whatDoYouWantAudio,
  },

  {
    id: "i-want",
    text: "I want",
    audio: iWantAudio,
  },

  {
    id: "i-want-an",
    text: "I want an",
    audio: iWantAnAudio,
  },
];

const getWordById = (id) => wordBank.find((item) => item.id === id);

const getWordIdByText = (text) =>
  wordBank.find((item) => item.text === text)?.id || "";

/* =====================================================
   BANK CHIP
===================================================== */

const BankChip = ({
  item,
  isUsed,
  selectedWordId,
  onKeyboardSelect,
  onPlayAudio,
  playingAudioId,
  bankRefs,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.id,
    disabled: isUsed,
  });

  const selected = selectedWordId === item.id;

  const pointerStartRef = useRef(null);
  const pointerMovedRef = useRef(false);

  const setRefs = (node) => {
    setNodeRef(node);
    bankRefs.current[item.id] = node;
  };

  const handlePointerDownCapture = (e) => {
    pointerStartRef.current = {
      x: e.clientX,
      y: e.clientY,
    };

    pointerMovedRef.current = false;
  };

  const handlePointerMoveCapture = (e) => {
    if (!pointerStartRef.current) return;

    const dx = e.clientX - pointerStartRef.current.x;

    const dy = e.clientY - pointerStartRef.current.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 5) {
      pointerMovedRef.current = true;
    }
  };

  const handlePointerUpCapture = () => {
    requestAnimationFrame(() => {
      pointerStartRef.current = null;
    });
  };

  /* =================================================
     MOUSE CLICK = AUDIO ONLY
  ================================================= */

  const handleClick = () => {
    if (pointerMovedRef.current || isDragging) {
      pointerMovedRef.current = false;
      return;
    }

    onPlayAudio(item.audio, `bank-${item.id}`);
  };

  /* =================================================
     KEYBOARD = AUDIO + PICK
  ================================================= */

  const handleKeyDown = (e) => {
    if (e.key !== "Enter" && e.key !== " ") {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    onPlayAudio(item.audio, `bank-${item.id}`);

    /*
      used option:
      audio replay only
    */

    if (isUsed) return;

    onKeyboardSelect(item.id);
  };

  return (
    <span
      ref={setRefs}
      {...listeners}
      {...attributes}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={
        isUsed
          ? `${item.text}. Used answer. Press Enter or Space to hear it again.`
          : selected
            ? `${item.text}. Selected. Tab through the answer blanks and press Enter or Space to place it.`
            : `${item.text}. Press Enter or Space to select and hear it.`
      }
      className={`
        unit10-p6-q2-bank-chip

        ${selected ? "unit10-p6-q2-bank-chip-selected" : ""}
      `}
      onPointerDownCapture={handlePointerDownCapture}
      onPointerMoveCapture={handlePointerMoveCapture}
      onPointerUpCapture={handlePointerUpCapture}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{
        opacity: isUsed ? 0.4 : isDragging ? 0.3 : 1,

        cursor: isUsed ? "pointer" : "grab",
      }}
    >
      {item.text}

      {playingAudioId === `bank-${item.id}` && (
        <FaVolumeUp
          className="unit10-p6-q2-bank-audio-icon"
          aria-hidden="true"
        />
      )}
    </span>
  );
};

/* =====================================================
   SLOT DROP ZONE
===================================================== */

const SlotDropZone = ({
  id,
  value,
  previewValue,
  isWrong,
  locked,
  selectedWordId,
  onRemove,
  onKeyboardDrop,
  onKeyboardCancel,
  onCycleFocus,
  inputRefs,
}) => {
  const [focused, setFocused] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id,
    disabled: locked,
  });

  const setRefs = (node) => {
    setNodeRef(node);
    inputRefs.current[id] = node;
  };

  const showPreview = Boolean(selectedWordId) && focused && !locked;

  const visibleValue = showPreview ? previewValue : value;

  const handleKeyDown = (e) => {
    if (locked) return;

    /* ESCAPE */

    if (e.key === "Escape" && selectedWordId) {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardCancel();

      return;
    }

    /* TAB */

    if (e.key === "Tab" && selectedWordId) {
      e.preventDefault();

      onCycleFocus(id, e.shiftKey);

      return;
    }

    /* ENTER / SPACE */

    if (e.key !== "Enter" && e.key !== " ") {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    if (selectedWordId) {
      onKeyboardDrop();
      return;
    }

    if (value) {
      onRemove(id);
    }
  };

  return (
    <div
      ref={setRefs}
      role="button"
      tabIndex={locked ? -1 : 0}
      aria-label={
        locked
          ? `${value}. Correct answer.`
          : showPreview
            ? `${previewValue}. Preview. Press Enter or Space to place it.`
            : value
              ? `${value}. Press Enter or Space to remove this answer.`
              : "Empty answer blank."
      }
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onKeyDown={handleKeyDown}
      onClick={(e) => {
        if (locked) return;

        if (value && !selectedWordId) {
          e.stopPropagation();
          onRemove(id);
        }
      }}
      className={`
        write-input-unit4-page5-q1

        ${isOver ? "drag-over-cell" : ""}

        ${showPreview ? "keyboard-preview-unit10-p6-q2" : ""}
      `}
    >
      <span className={showPreview ? "preview-text-unit10-p6-q2" : ""}>
        {visibleValue || ""}
      </span>

      {isWrong && (
        <span className="wrong-mark-unit10-p6-q2" aria-hidden="true">
          ✕
        </span>
      )}
    </div>
  );
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

const Unit10_Page6_Q2 = () => {
  /* =================================================
     IMAGE SELECT
  ================================================= */

  const [selected, setSelected] = useState(["", ""]);

  /*
    null | correct | wrong
    خاص بالـselect فقط
  */

  const [selectResults, setSelectResults] = useState([null, null]);

  /* =================================================
     DRAG ANSWERS
  ================================================= */

  const [answers, setAnswers] = useState([[""], ["", ""]]);

  /*
    null | correct | wrong
    للسؤال كامل
  */

  const [questionResults, setQuestionResults] = useState([null, null]);

  const [wrongInputs, setWrongInputs] = useState([]);

  const [showAnswerMode, setShowAnswerMode] = useState(false);

  const [activeId, setActiveId] = useState(null);

  /* =================================================
     KEYBOARD DRAG
  ================================================= */

  const [selectedWordId, setSelectedWordId] = useState(null);

  const bankRefs = useRef({});

  const inputRefs = useRef({});

  /* =================================================
     AUDIO
  ================================================= */

  const audioRef = useRef(null);

  const [playingAudioId, setPlayingAudioId] = useState(null);

  /* =================================================
     DND
  ================================================= */

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  /* =================================================
     HELPERS
  ================================================= */

  const isQuestionCorrect = (index) => questionResults[index] === "correct";

  const isQuestionLocked = (index) =>
    showAnswerMode || isQuestionCorrect(index);

  /*
    SELECT مستقل عن السؤال كامل
  */

  const isSelectCorrect = (index) => selectResults[index] === "correct";

  const isSelectLocked = (index) => showAnswerMode || isSelectCorrect(index);

  const allCorrect = questionResults.every((result) => result === "correct");

  const usedWordIds = new Set(answers.flat().filter(Boolean));

  const activeWord = getWordById(activeId);

  const selectedWord = getWordById(selectedWordId);

  /* =================================================
     UNLOCKED INPUTS
  ================================================= */

  const getUnlockedInputIds = () => {
    const ids = [];

    items.forEach((item, qIndex) => {
      if (isQuestionLocked(qIndex)) {
        return;
      }

      for (let inputIndex = 0; inputIndex < item.inputsCount; inputIndex++) {
        ids.push(`slot-${qIndex}-${inputIndex}`);
      }
    });

    return ids;
  };

  /* =================================================
     AUDIO
  ================================================= */

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;
      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingAudioId(null);
  };

  const playAudio = (src, audioId) => {
    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingAudioId(audioId);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingAudioId(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingAudioId(null);
    };

    audio.onerror = audio.onended;
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();

        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  /* =================================================
     SELECT IMAGE
  ================================================= */

  const handleSelect = (image, qIndex) => {
    /*
      إذا select صار صح:
      ممنوع يتغير
    */

    if (isSelectLocked(qIndex)) {
      return;
    }

    setSelected((prev) => {
      const copy = [...prev];

      copy[qIndex] = image.value;

      return copy;
    });

    /*
      لو كان select غلط من Check سابق:
      تعديل الصورة يشيل نتيجة الغلط
      للselect فقط
    */

    setSelectResults((prev) => {
      const copy = [...prev];

      if (copy[qIndex] === "wrong") {
        copy[qIndex] = null;
      }

      return copy;
    });

    /*
      السؤال كامل كان wrong؟
      تعديل جزء منه يخليه editable
    */

    setQuestionResults((prev) => {
      const copy = [...prev];

      if (copy[qIndex] === "wrong") {
        copy[qIndex] = null;
      }

      return copy;
    });

    /*
      امسح wrong image فقط،
      مش wrong inputs
    */

    setWrongInputs((prev) =>
      prev.filter(
        (wrong) => !(wrong.qIndex === qIndex && wrong.type === "image"),
      ),
    );

    /*
      صوت الخيار إذا موجود
    */

    if (image.audio) {
      playAudio(image.audio, `image-${qIndex}-${image.value}`);
    }
  };

  const handleImageKeyDown = (e, image, qIndex) => {
    if (e.key !== "Enter" && e.key !== " ") {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    handleSelect(image, qIndex);
  };

  /* =================================================
     DRAG START
     NO AUDIO
  ================================================= */

  const handleDragStart = ({ active }) => {
    setActiveId(String(active.id));
  };

  /* =================================================
     PLACE WORD
  ================================================= */

  const placeWord = (wordId, qIndex, inputIndex) => {
    if (isQuestionLocked(qIndex)) {
      return;
    }

    setAnswers((prev) => {
      const copy = prev.map((row) => [...row]);

      /*
        Remove same word
        from editable slots
      */

      copy.forEach((row, qi) => {
        if (isQuestionLocked(qi)) {
          return;
        }

        row.forEach((value, pi) => {
          if (value === wordId) {
            copy[qi][pi] = "";
          }
        });
      });

      /*
        PLACE / REPLACE
      */

      copy[qIndex][inputIndex] = wordId;

      return copy;
    });

    /*
      تعديل drag غلط:
      امسح wrong الخاص بالinput المعدل
    */

    setWrongInputs((prev) =>
      prev.filter(
        (wrong) =>
          !(wrong.qIndex === qIndex && wrong.inputIndex === inputIndex),
      ),
    );

    setQuestionResults((prev) => {
      const copy = [...prev];

      if (copy[qIndex] === "wrong") {
        copy[qIndex] = null;
      }

      return copy;
    });
  };

  /* =================================================
     MOUSE DRAG END
  ================================================= */

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);

    if (!over) return;

    const wordId = String(active.id);

    const destination = String(over.id);

    if (!destination.startsWith("slot-")) {
      return;
    }

    const [qIndex, inputIndex] = destination
      .replace("slot-", "")
      .split("-")
      .map(Number);

    placeWord(wordId, qIndex, inputIndex);
  };

  /* =================================================
     KEYBOARD SELECT WORD
  ================================================= */

  const handleKeyboardSelect = (wordId) => {
    if (selectedWordId === wordId) {
      setSelectedWordId(null);

      return;
    }

    setSelectedWordId(wordId);

    const ids = getUnlockedInputIds();

    if (!ids.length) return;

    requestAnimationFrame(() => {
      inputRefs.current[ids[0]]?.focus?.();
    });
  };

  /* =================================================
     TAB CYCLE
  ================================================= */

  const cycleInputFocus = (currentId, reverse = false) => {
    const ids = getUnlockedInputIds();

    if (!ids.length) return;

    const currentIndex = ids.indexOf(currentId);

    let nextIndex;

    if (reverse) {
      nextIndex = currentIndex <= 0 ? ids.length - 1 : currentIndex - 1;
    } else {
      nextIndex =
        currentIndex === ids.length - 1 || currentIndex === -1
          ? 0
          : currentIndex + 1;
    }

    inputRefs.current[ids[nextIndex]]?.focus?.();
  };

  /* =================================================
     KEYBOARD DROP
  ================================================= */

  const handleKeyboardDrop = (qIndex, inputIndex) => {
    if (!selectedWordId) {
      return;
    }

    const wordId = selectedWordId;

    /*
      نحسب nextAnswers
      عشان نعرف أول خيار
      غير مستخدم بعد drop
    */

    const nextAnswers = answers.map((row) => [...row]);

    nextAnswers.forEach((row, qi) => {
      if (isQuestionLocked(qi)) {
        return;
      }

      row.forEach((value, pi) => {
        if (value === wordId) {
          nextAnswers[qi][pi] = "";
        }
      });
    });

    nextAnswers[qIndex][inputIndex] = wordId;

    placeWord(wordId, qIndex, inputIndex);

    setSelectedWordId(null);

    const usedAfter = new Set(nextAnswers.flat().filter(Boolean));

    const nextUnused = wordBank.find((item) => !usedAfter.has(item.id));

    requestAnimationFrame(() => {
      if (nextUnused) {
        bankRefs.current[nextUnused.id]?.focus?.();
      }
    });
  };

  /* =================================================
     ESCAPE
  ================================================= */

  const cancelKeyboardSelection = () => {
    if (!selectedWordId) {
      return;
    }

    const oldId = selectedWordId;

    setSelectedWordId(null);

    requestAnimationFrame(() => {
      bankRefs.current[oldId]?.focus?.();
    });
  };

  /* =================================================
     REMOVE SLOT
  ================================================= */

  const handleRemove = (slotId) => {
    const [qIndex, inputIndex] = slotId
      .replace("slot-", "")
      .split("-")
      .map(Number);

    if (isQuestionLocked(qIndex)) {
      return;
    }

    const oldWordId = answers[qIndex][inputIndex];

    setAnswers((prev) => {
      const copy = prev.map((row) => [...row]);

      copy[qIndex][inputIndex] = "";

      return copy;
    });

    setQuestionResults((prev) => {
      const copy = [...prev];

      copy[qIndex] = null;

      return copy;
    });

    setWrongInputs((prev) =>
      prev.filter(
        (wrong) =>
          !(wrong.qIndex === qIndex && wrong.inputIndex === inputIndex),
      ),
    );

    requestAnimationFrame(() => {
      bankRefs.current[oldWordId]?.focus?.();
    });
  };

  /* =================================================
     CHECK ANSWERS
  ================================================= */

  const checkAnswers = () => {
    if (showAnswerMode || allCorrect) {
      return;
    }

    /* =========================
       REQUIRE ANSWERS
    ========================= */

    for (let qIndex = 0; qIndex < items.length; qIndex++) {
      if (isQuestionCorrect(qIndex)) {
        continue;
      }

      if (!selected[qIndex]) {
        ValidationAlert.info(
          `Please choose a picture in question ${qIndex + 1}.`,
        );

        return;
      }

      for (
        let inputIndex = 0;
        inputIndex < items[qIndex].inputsCount;
        inputIndex++
      ) {
        if (!answers[qIndex][inputIndex]) {
          ValidationAlert.info(`Please complete question ${qIndex + 1}.`);

          return;
        }
      }
    }

    const nextResults = [...questionResults];

    const nextSelectResults = [...selectResults];

    const wrong = [];

    let score = 0;

    const total = items.reduce((sum, item) => sum + item.inputsCount + 1, 0);

    items.forEach((item, qIndex) => {
      /*
          السؤال كامل كان صح:
          keep everything locked
        */

      if (isQuestionCorrect(qIndex)) {
        nextResults[qIndex] = "correct";

        nextSelectResults[qIndex] = "correct";

        score += item.inputsCount + 1;

        return;
      }

      let questionCorrect = true;

      /* =====================
           IMAGE SELECT
           مستقل progressive
        ===================== */

      if (selectResults[qIndex] === "correct") {
        /*
            كان صح من Check سابق
          */

        nextSelectResults[qIndex] = "correct";

        score++;
      } else if (selected[qIndex] === item.correct) {
        /*
            صار صح هسا
            ثبت الـselect
          */

        nextSelectResults[qIndex] = "correct";

        score++;
      } else {
        nextSelectResults[qIndex] = "wrong";

        questionCorrect = false;

        wrong.push({
          qIndex,
          type: "image",
        });
      }

      /* =====================
           DRAG INPUTS
        ===================== */

      for (let inputIndex = 0; inputIndex < item.inputsCount; inputIndex++) {
        const placedText = getWordById(answers[qIndex][inputIndex])?.text || "";

        const expected =
          item.correctQuestion && inputIndex === 0
            ? item.correctQuestion
            : item.correctInput;

        if (placedText.trim().toLowerCase() === expected.trim().toLowerCase()) {
          score++;
        } else {
          questionCorrect = false;

          wrong.push({
            qIndex,
            inputIndex,
          });
        }
      }

      if (questionCorrect) {
        nextResults[qIndex] = "correct";
      } else {
        nextResults[qIndex] = "wrong";
      }
    });

    setSelectResults(nextSelectResults);

    setWrongInputs(wrong);

    setQuestionResults(nextResults);

    /*
      NO AUTO AUDIO
    */

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold">
          Score: ${score} / ${total}
        </span>
      </div>
    `;

    if (score === total) {
      ValidationAlert.success(msg);
    } else if (score === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
    }
  };

  /* =================================================
     SHOW ANSWER
  ================================================= */

  const showAnswers = () => {
    stopAudio();

    setSelected(items.map((item) => item.correct));

    setSelectResults(Array(items.length).fill("correct"));

    const filledAnswers = items.map((item) => {
      if (item.correctQuestion) {
        return [
          getWordIdByText(item.correctQuestion),

          getWordIdByText(item.correctInput),
        ];
      }

      return [getWordIdByText(item.correctInput)];
    });

    setAnswers(filledAnswers);

    setWrongInputs([]);

    setQuestionResults(Array(items.length).fill("correct"));

    setShowAnswerMode(true);

    setSelectedWordId(null);

    setActiveId(null);
  };

  /* =================================================
     RESET
  ================================================= */

  const resetAll = () => {
    stopAudio();

    setSelected(["", ""]);

    setSelectResults([null, null]);

    setAnswers([[""], ["", ""]]);

    setWrongInputs([]);

    setQuestionResults([null, null]);

    setShowAnswerMode(false);

    setSelectedWordId(null);

    setActiveId(null);
  };

  /* =================================================
     RENDER
  ================================================= */

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
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
            gap: "40px",
          }}
        >
          <ExerciseHeader
            sectionLetter="E"
            title="Look, read, circle, and write."
            subTitle="Drag What do you want?, I want, and I want an into the correct blanks."
          />

          {/* =================================================
              WORD BANK
          ================================================= */}

          <div className="unit10-p6-q2-word-bank">
            {wordBank.map((item) => (
              <BankChip
                key={item.id}
                item={item}
                isUsed={usedWordIds.has(item.id)}
                selectedWordId={selectedWordId}
                onKeyboardSelect={handleKeyboardSelect}
                onPlayAudio={playAudio}
                playingAudioId={playingAudioId}
                bankRefs={bankRefs}
              />
            ))}
          </div>

          {/* =================================================
              QUESTIONS
          ================================================= */}

          <div className="question-grid-unit10-page6-q2">
            {items.map((item, qIndex) => {
              const correct = isQuestionCorrect(qIndex) || showAnswerMode;

              const locked = isQuestionLocked(qIndex);

              const selectLocked = isSelectLocked(qIndex);

              const fullAudioId = `full-${qIndex}`;

              return (
                <div
                  key={qIndex}
                  className={`
                      question-box-unit4-page5-q1

                      ${correct ? "completed-question-unit10-p6-q2" : ""}
                    `}
                  role={correct ? "button" : undefined}
                  tabIndex={correct ? 0 : undefined}
                  aria-label={
                    correct
                      ? `Question ${
                          qIndex + 1
                        } is correct. Press Enter or Space to hear the complete dialogue.`
                      : undefined
                  }
                  onClick={() => {
                    if (correct) {
                      playAudio(item.fullAudio, fullAudioId);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (!correct) {
                      return;
                    }

                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();

                      playAudio(item.fullAudio, fullAudioId);
                    }
                  }}
                >
                  {/* =========================================
                        IMAGE SELECT
                    ========================================= */}

                  <div className="choices-unit4-page5-q1">
                    {item.images.map((image, imageIndex) => {
                      const imageSelected = selected[qIndex] === image.value;

                      const imageWrong =
                        selectResults[qIndex] === "wrong" && imageSelected;

                      const imageCorrect =
                        selectResults[qIndex] === "correct" && imageSelected;

                      const imageAudioId = `image-${qIndex}-${image.value}`;

                      return (
                        <div
                          key={imageIndex}
                          role="button"
                          tabIndex={selectLocked ? -1 : 0}
                          aria-pressed={imageSelected}
                          aria-label={`${image.alt} ${
                            imageSelected ? "Selected." : "Not selected."
                          } ${
                            selectLocked
                              ? "Correct selection and locked."
                              : "Press Enter or Space to select."
                          }`}
                          className={`
                                circle-wrapper-unit10-page6-q2

                                ${imageSelected ? "active" : ""}

                                ${
                                  imageCorrect
                                    ? "correct-selected-unit10-p6-q2"
                                    : ""
                                }

                                ${
                                  imageWrong
                                    ? "wrong-selected-unit10-p6-q2"
                                    : ""
                                }
                              `}
                          onClick={(e) => {
                            /*
                                  SELECT صح؟
                                  ما نغيره.

                                  إذا السؤال كامل صح،
                                  نخلي click يطلع
                                  للكرت للـfull audio.
                                */

                            if (selectLocked) {
                              return;
                            }

                            e.stopPropagation();

                            handleSelect(image, qIndex);
                          }}
                          onKeyDown={(e) => {
                            if (selectLocked) {
                              return;
                            }

                            handleImageKeyDown(e, image, qIndex);
                          }}
                        >
                          <img
                            src={image.img}
                            className="q-img-unit10-page6-q2"
                            alt={image.alt}
                          />

                          {/* ==========================
                                  WRONG X ONLY
                              ========================== */}

                          {imageWrong && (
                            <div className="wrong-mark-unit10-p6-q2" aria-hidden="true">
                              ✕
                            </div>
                          )}

                          {/* ==========================
                                  OPTION AUDIO ICON
                              ========================== */}

                          {playingAudioId === imageAudioId && (
                            <FaVolumeUp
                              className="image-audio-icon-unit10-p6-q2"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* =========================================
                        FIXED QUESTION AUDIO
                    ========================================= */}

                  {item.question && (
                    <p
                      className="question-text fixed-audio-unit10-p6-q2"
                      role={correct ? undefined : "button"}
                      tabIndex={correct ? -1 : 0}
                      aria-label={
                        correct
                          ? undefined
                          : `${item.question} Press Enter or Space to hear it.`
                      }
                      onClick={(e) => {
                        if (correct) {
                          return;
                        }

                        e.stopPropagation();

                        playAudio(item.questionAudio, `question-${qIndex}`);
                      }}
                      onKeyDown={(e) => {
                        if (correct) {
                          return;
                        }

                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();

                          e.stopPropagation();

                          playAudio(item.questionAudio, `question-${qIndex}`);
                        }
                      }}
                    >
                      {item.question}

                      {playingAudioId === `question-${qIndex}` && (
                        <FaVolumeUp
                          className="small-audio-icon-unit10-p6-q2"
                          aria-hidden="true"
                        />
                      )}
                    </p>
                  )}

                  {/* =========================================
                        INPUTS
                    ========================================= */}

                  <div className="input-wrapper-unit10-page6-q2">
                    {Array.from({
                      length: item.inputsCount,
                    }).map((_, inputIndex) => {
                      const slotId = `slot-${qIndex}-${inputIndex}`;

                      const placedId = answers[qIndex][inputIndex];

                      const value = getWordById(placedId)?.text || "";

                      const isWrong = wrongInputs.some(
                        (wrong) =>
                          wrong.qIndex === qIndex &&
                          wrong.inputIndex === inputIndex,
                      );

                      const isAnswerLine = !(
                        item.correctQuestion && inputIndex === 0
                      );

                      return (
                        <div
                          key={inputIndex}
                          className="slot-row-unit10-p6-q2"
                          onClick={(e) => {
                            if (!correct) {
                              e.stopPropagation();
                            }
                          }}
                        >
                          <SlotDropZone
                            id={slotId}
                            value={value}
                            previewValue={selectedWord?.text || ""}
                            isWrong={isWrong}
                            locked={locked}
                            selectedWordId={selectedWordId}
                            onRemove={handleRemove}
                            onKeyboardDrop={() =>
                              handleKeyboardDrop(qIndex, inputIndex)
                            }
                            onKeyboardCancel={cancelKeyboardSelection}
                            onCycleFocus={cycleInputFocus}
                            inputRefs={inputRefs}
                          />

                          {/* ==========================
                                  CHICKEN / ORANGE AUDIO
                              ========================== */}

                          {isAnswerLine && (
                            <span
                              className="after-answer-audio-unit10-p6-q2"
                              role={correct ? undefined : "button"}
                              tabIndex={correct ? -1 : 0}
                              aria-label={
                                correct
                                  ? undefined
                                  : `${item.afterAnswer} Press Enter or Space to hear it.`
                              }
                              onClick={(e) => {
                                if (correct) {
                                  return;
                                }

                                e.stopPropagation();

                                playAudio(item.afterAudio, `after-${qIndex}`);
                              }}
                              onKeyDown={(e) => {
                                if (correct) {
                                  return;
                                }

                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();

                                  e.stopPropagation();

                                  playAudio(item.afterAudio, `after-${qIndex}`);
                                }
                              }}
                            >
                              {item.afterAnswer}

                              {playingAudioId === `after-${qIndex}` && (
                                <FaVolumeUp
                                  className="small-audio-icon-unit10-p6-q2"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* =========================================
                        FULL CORRECT AUDIO ICON
                    ========================================= */}

                  {correct && playingAudioId === fullAudioId && (
                    <FaVolumeUp
                      className="full-audio-icon-unit10-p6-q2"
                      aria-hidden="true"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* =================================================
            BUTTONS
        ================================================= */}

        <div className="action-buttons-container">
          <button onClick={resetAll} className="try-again-button">
            Start Again ↻
          </button>

          <button onClick={showAnswers} className="show-answer-btn">
            Show Answer
          </button>

          <button onClick={checkAnswers} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>

      {/* =================================================
          DRAG OVERLAY
      ================================================= */}

      <DragOverlay>
        {activeWord ? (
          <span className="drag-overlay-unit10-p6-q2">{activeWord.text}</span>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Unit10_Page6_Q2;
