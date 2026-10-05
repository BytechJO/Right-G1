import React, { useRef, useState } from "react";

import "./Review3_Page1_Q2.css";

import table from "../../../assets/unit4/imgs/U4P34EXEB-01.svg";
import dish from "../../../assets/unit4/imgs/U4P34EXEB-02.svg";
import tiger from "../../../assets/unit4/imgs/U4P34EXEB-03.svg";
import duck from "../../../assets/unit4/imgs/U4P34EXEB-04.svg";

import openBookAudio from "../../../assets/unit4/Page 34 - B/Open your book.mp3";
import makeLineAudio from "../../../assets/unit4/Page 34 - B/Make a line.mp3";
import closeBookAudio from "../../../assets/unit4/Page 34 - B/Close your book.mp3";
import takePencilAudio from "../../../assets/unit4/Page 34 - B/take out your pencil..mp3";

import { FaVolumeUp } from "react-icons/fa";

import ValidationAlert from "../../Popup/ValidationAlert";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

import ExerciseHeaderReview from "../../ExerciseHeaderReview";

/* =========================================================
   DRAGGABLE SENTENCE
========================================================= */

const DraggableSentence = ({
  id,
  sentence,
  audio,
  disabled,
  isUsed,

  keyboardPickedSentence,
  onKeyboardPick,

  playingSentence,
  playSentenceAudio,

  bankRefs,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled: disabled || isUsed,
  });

  const isDisabled = disabled || isUsed;

  const isPicked = keyboardPickedSentence === sentence;

  const isPlaying = playingSentence === sentence;

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
      }}
    >
      <div
        ref={(el) => {
          setNodeRef(el);
          bankRefs.current[sentence] = el;
        }}
        {...(!isDisabled
          ? {
              ...listeners,
              ...attributes,
            }
          : {})}
        role="button"
        tabIndex={isDisabled ? -1 : 0}
        aria-disabled={isDisabled}
        aria-pressed={isPicked}
        aria-label={
          isPicked
            ? `${sentence} selected. Choose an answer box.`
            : `${sentence}. Press Enter or Space to select this sentence.`
        }
        onClick={(e) => {
          /*
            Mouse click بدون drag:
            يشغّل الصوت.
          */
          if (isDragging) return;

          playSentenceAudio(sentence, audio);
        }}
        onKeyDown={(e) => {
          if (isDisabled) return;

          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();

            playSentenceAudio(sentence, audio);

            onKeyboardPick(sentence);
          }
        }}
        className={isPicked ? "keyboard-picked-sentence-review3-p1-q2" : ""}
        style={{
          padding: "5px 8px",

          border: `2px solid ${isUsed ? "#aab3c4" : "#2c5287"}`,

          borderRadius: "8px",

          background: isPicked ? "#dbeafe" : isUsed ? "#f0f2f5" : "white",

          fontWeight: "bold",

          cursor: isDisabled ? "default" : "grab",

          opacity: isDragging ? 0.4 : isUsed ? 0.45 : 1,

          color: isUsed ? "#9aa3b0" : "inherit",

          transition: "all 0.2s ease",

          userSelect: "none",

          whiteSpace: "nowrap",

          touchAction: "none",
        }}
      >
        {sentence}
      </div>

      {isPlaying && (
        <FaVolumeUp
          size={16}
          aria-hidden="true"
          className="audio-icon-review3-p1-q2"
        />
      )}
    </div>
  );
};

/* =========================================================
   INPUT SLOT - DRAG PATTERN
========================================================= */

const InputSlot = ({
  slotKey,
  value,

  isWrong,
  locked,

  showAnswer,
  checkCompleted,

  keyboardPickedSentence,

  focusedInputId,
  setFocusedInputId,

  inputRefs,
  getAvailableInputKeys,

  onKeyboardDrop,
  onKeyboardClearWrong,
  onCancelKeyboardPick,

  onRemove,

  playingSentence,
  playSentenceAudio,
  getSentenceAudio,
}) => {
  const id = `input-${slotKey}`;

  const { setNodeRef, isOver } = useDroppable({
    id,

    disabled: locked || showAnswer || checkCompleted,
  });

  const keyboardDropActive =
    !!keyboardPickedSentence && !locked && !showAnswer && !checkCompleted;

  const canFixWrong =
    !!value &&
    isWrong &&
    !keyboardPickedSentence &&
    !locked &&
    !showAnswer &&
    !checkCompleted;

  const showPreview = keyboardDropActive && focusedInputId === id;

  const displayValue = showPreview ? keyboardPickedSentence : value;

  const handleKeyDown = (e) => {
    /* =================================================
       WRONG AFTER CHECK
    ================================================= */

    if (canFixWrong && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardClearWrong(slotKey, value);

      return;
    }

    if (!keyboardDropActive) {
      return;
    }

    /* =================================================
       TAB / SHIFT TAB
    ================================================= */

    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const available = getAvailableInputKeys();

      if (!available.length) {
        return;
      }

      const currentPosition = available.indexOf(String(slotKey));

      let nextPosition;

      if (e.shiftKey) {
        nextPosition =
          currentPosition <= 0 ? available.length - 1 : currentPosition - 1;
      } else {
        nextPosition =
          currentPosition === -1 || currentPosition === available.length - 1
            ? 0
            : currentPosition + 1;
      }

      const nextKey = available[nextPosition];

      inputRefs.current[nextKey]?.focus();

      return;
    }

    /* =================================================
       ENTER / SPACE
    ================================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardDrop(String(slotKey));

      return;
    }

    /* =================================================
       ESCAPE
    ================================================= */

    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      onCancelKeyboardPick();
    }
  };

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <div
        ref={(el) => {
          setNodeRef(el);

          inputRefs.current[String(slotKey)] = el;
        }}
        className={`unscramble-input ${
          isOver && !locked ? "drag-over-cell" : ""
        } ${showPreview ? "keyboard-drop-preview-review3-p1-q2" : ""}`}
        role="button"
        tabIndex={
          locked || showAnswer || checkCompleted
            ? -1
            : keyboardDropActive || canFixWrong
              ? 0
              : -1
        }
        aria-label={
          keyboardDropActive
            ? value
              ? `Sentence box ${slotKey}. Current sentence ${value}. Press Enter to replace it with ${keyboardPickedSentence}.`
              : `Sentence box ${slotKey}. Press Enter to place ${keyboardPickedSentence}.`
            : canFixWrong
              ? `${value} is incorrect. Press Enter to return it to the sentence bank.`
              : value
                ? `Sentence box ${slotKey}: ${value}`
                : `Empty sentence box ${slotKey}`
        }
        onFocus={() => {
          if (keyboardDropActive) {
            setFocusedInputId(id);
          }
        }}
        onBlur={() => setFocusedInputId(null)}
        onKeyDown={handleKeyDown}
      >
        <div className="drop-inner-review3-p1-q2">
          {displayValue && (
            <span
              style={{
                cursor:
                  locked || showAnswer || checkCompleted
                    ? "default"
                    : "pointer",

                userSelect: "none",

                display: "inline-flex",

                alignItems: "center",

                position: "relative",

                gap: "5px",
              }}
              onClick={(e) => {
                e.stopPropagation();

                /*
                  الجملة الموضوعة:
                  الكبس عليها يشغل الصوت.
                */

                playSentenceAudio(displayValue, getSentenceAudio(displayValue));
              }}
            >
              {displayValue}

              {playingSentence === displayValue && (
                <FaVolumeUp
                  size={15}
                  aria-hidden="true"
                  style={{
                    marginLeft: "4px",
                  }}
                />
              )}
            </span>
          )}
        </div>
      </div>

      {isWrong && (
        <span className="input-error-x" aria-hidden="true">
          ✕
        </span>
      )}

      {value && !locked && !showAnswer && !checkCompleted && (
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={onRemove}
          style={{
            position: "absolute",

            width: "1px",
            height: "1px",

            opacity: 0,

            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};

/* =========================================================
   MAIN
========================================================= */

const Review3_Page1_Q2 = () => {
  const containerRef = useRef(null);

  /* =====================================================
     SENTENCES + AUDIO
  ===================================================== */

  const sentenceBank = [
    {
      sentence: "open your book.",
      audio: openBookAudio,
    },

    {
      sentence: "make a line.",
      audio: makeLineAudio,
    },

    {
      sentence: "close your book.",
      audio: closeBookAudio,
    },

    {
      sentence: "take out your pencil.",
      audio: takePencilAudio,
    },
  ];

  const correctSentences = {
    1: "open your book.",
    2: "make a line.",
    3: "close your book.",
    4: "take out your pencil.",
  };

  /* =====================================================
     MATCHING
  ===================================================== */

  const correctMatches = [
    {
      word: "your book open.",
      image: "img2",
    },

    {
      word: "a line make.",
      image: "img4",
    },

    {
      word: "close book your.",
      image: "img3",
    },

    {
      word: "pencil take your out.",
      image: "img1",
    },
  ];

  const rows = [
    {
      key: 1,

      scrambled: "your book open.",

      dotId: "dot-open",

      imgSrc: table,

      imgId: "dot-img1",

      imgKey: "img1",

      alt: "A boy taking a pencil out of his pencil case at a desk.",
    },

    {
      key: 2,

      scrambled: "a line make.",

      dotId: "dot-line",

      imgSrc: dish,

      imgId: "dot-img2",

      imgKey: "img2",

      alt: "A teacher showing an open book to a student.",
    },

    {
      key: 3,

      scrambled: "close book your.",

      dotId: "dot-close",

      imgSrc: duck,

      imgId: "dot-img3",

      imgKey: "img3",

      alt: "A teacher giving a book-related classroom instruction to a student.",
    },

    {
      key: 4,

      scrambled: "pencil take your out.",

      dotId: "dot-pencil",

      imgSrc: tiger,

      imgId: "dot-img4",

      imgKey: "img4",

      alt: "A teacher directing students to stand in a line.",
    },
  ];

  /* =====================================================
     DRAG STATE
  ===================================================== */

  const [userInputs, setUserInputs] = useState({
    1: "",
    2: "",
    3: "",
    4: "",
  });

  const [wrongInputs, setWrongInputs] = useState([]);

  const [lockedInputs, setLockedInputs] = useState([]);

  const [activeWord, setActiveWord] = useState(null);

  /* =====================================================
     KEYBOARD DRAG
  ===================================================== */

  const bankRefs = useRef({});

  const inputRefs = useRef({});

  const [keyboardPickedSentence, setKeyboardPickedSentence] = useState(null);

  const [focusedInputId, setFocusedInputId] = useState(null);

  /* =====================================================
     MATCHING STATE
  ===================================================== */

  const [lines, setLines] = useState([]);

  const [previewLine, setPreviewLine] = useState(null);

  const [firstDot, setFirstDot] = useState(null);

  const [wrongWords, setWrongWords] = useState([]);

  const [lockedWords, setLockedWords] = useState([]);

  const [lockedImages, setLockedImages] = useState([]);

  const [selectedLeftWord, setSelectedLeftWord] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);

  const leftRefs = useRef({});

  const imageRefs = useRef([]);

  /* =====================================================
     FINAL STATES
  ===================================================== */

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =====================================================
     AUDIO
  ===================================================== */

  const audioRef = useRef(null);

  const [playingSentence, setPlayingSentence] = useState(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;

      audioRef.current = null;
    }

    setPlayingSentence(null);
  };

  const playSentenceAudio = (sentence, src) => {
    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingSentence(sentence);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingSentence(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingSentence(null);
    };
  };

  const getSentenceAudio = (sentence) =>
    sentenceBank.find((item) => item.sentence === sentence)?.audio;

  /* =====================================================
     HELPERS - DRAG
  ===================================================== */

  const isInputLocked = (key) => lockedInputs.includes(String(key));

  const usedSentences = new Set(Object.values(userInputs).filter(Boolean));

  const getAvailableInputKeys = () =>
    Object.keys(userInputs).filter(
      (key) => !isInputLocked(key) && !showAnswer && !checkCompleted,
    );

  const getFirstAvailableSentence = (updatedInputs) => {
    const used = new Set(Object.values(updatedInputs).filter(Boolean));

    return sentenceBank.find((item) => !used.has(item.sentence))?.sentence;
  };

  /* =====================================================
     HELPERS - MATCH
  ===================================================== */

  const isWordLocked = (word) => lockedWords.includes(word);

  const isImageLocked = (image) => lockedImages.includes(image);

  const isCorrectMatch = (word, image) =>
    correctMatches.some((pair) => pair.word === word && pair.image === image);

  const getDotPosition = (element) => {
    if (!element || !containerRef.current) {
      return null;
    }

    const container = containerRef.current.getBoundingClientRect();

    const rect = element.getBoundingClientRect();

    return {
      x: rect.left - container.left + rect.width / 2,

      y: rect.top - container.top + rect.height / 2,
    };
  };

  const clearMatchingSelection = () => {
    setFirstDot(null);

    setPreviewLine(null);

    setSelectedLeftWord(null);

    setSelectedImage(null);
  };

  const getAvailableImageIndexes = () =>
    rows
      .map((row, index) => ({
        image: row.imgKey,

        index,
      }))
      .filter(({ image }) => !isImageLocked(image))
      .map(({ index }) => index);

  /* =====================================================
     SENSORS
  ===================================================== */

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),

    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
  );

  /* =====================================================
     DRAG START
  ===================================================== */

  const onDragStart = ({ active }) => {
    setActiveWord(active.id.replace("sentence-", ""));
  };

  /* =====================================================
     DRAG END
  ===================================================== */

  const onDragEnd = ({ active, over }) => {
    setActiveWord(null);

    if (!over || showAnswer || checkCompleted) {
      return;
    }

    if (!String(over.id).startsWith("input-")) {
      return;
    }

    const sentence = active.id.replace("sentence-", "");

    const targetKey = String(over.id).replace("input-", "");

    if (isInputLocked(targetKey)) {
      return;
    }

    let oldKey = null;

    setUserInputs((prev) => {
      const updated = {
        ...prev,
      };

      oldKey =
        Object.keys(updated).find((key) => updated[key] === sentence) || null;

      /*
          UNIQUE SENTENCE:
          شيلها من مكانها القديم.
        */

      if (oldKey && oldKey !== targetKey && !isInputLocked(oldKey)) {
        updated[oldKey] = "";
      }

      /*
          REPLACE:
          الجملة الموجودة بالهدف
          ترجع للبنك.
        */

      updated[targetKey] = sentence;

      return updated;
    });

    setWrongInputs((prev) =>
      prev.filter((key) => key !== targetKey && key !== oldKey),
    );
  };

  const onDragCancel = () => {
    setActiveWord(null);
  };

  /* =====================================================
     KEYBOARD DRAG - PICK
  ===================================================== */

  const handleKeyboardPick = (sentence) => {
    if (showAnswer || checkCompleted || usedSentences.has(sentence)) {
      return;
    }

    setKeyboardPickedSentence(sentence);

    setFocusedInputId(null);

    requestAnimationFrame(() => {
      const available = getAvailableInputKeys();

      if (!available.length) {
        return;
      }

      inputRefs.current[available[0]]?.focus();
    });
  };

  /* =====================================================
     KEYBOARD DRAG - DROP
  ===================================================== */

  const handleKeyboardDrop = (targetKey) => {
    if (
      !keyboardPickedSentence ||
      showAnswer ||
      checkCompleted ||
      isInputLocked(targetKey)
    ) {
      return;
    }

    const sentence = keyboardPickedSentence;

    const updated = {
      ...userInputs,
    };

    const oldKey = Object.keys(updated).find(
      (key) => updated[key] === sentence,
    );

    if (oldKey && oldKey !== targetKey && !isInputLocked(oldKey)) {
      updated[oldKey] = "";
    }

    updated[targetKey] = sentence;

    setUserInputs(updated);

    setWrongInputs((prev) =>
      prev.filter((key) => key !== targetKey && key !== oldKey),
    );

    setKeyboardPickedSentence(null);

    setFocusedInputId(null);

    window.setTimeout(() => {
      const next = getFirstAvailableSentence(updated);

      if (next) {
        bankRefs.current[next]?.focus();
      }
    }, 0);
  };

  /* =====================================================
     WRONG INPUT AFTER CHECK
  ===================================================== */

  const handleKeyboardClearWrong = (key, sentence) => {
    if (showAnswer || checkCompleted || isInputLocked(key)) {
      return;
    }

    const updated = {
      ...userInputs,

      [key]: "",
    };

    setUserInputs(updated);

    setWrongInputs((prev) => prev.filter((item) => item !== String(key)));

    setKeyboardPickedSentence(null);

    setFocusedInputId(null);

    window.setTimeout(() => {
      if (sentence && bankRefs.current[sentence]) {
        bankRefs.current[sentence]?.focus();
      }
    }, 0);
  };

  /* =====================================================
     CANCEL DRAG KEYBOARD
  ===================================================== */

  const handleCancelKeyboardPick = () => {
    const sentence = keyboardPickedSentence;

    setKeyboardPickedSentence(null);

    setFocusedInputId(null);

    window.setTimeout(() => {
      if (sentence && bankRefs.current[sentence]) {
        bankRefs.current[sentence]?.focus();
      }
    }, 0);
  };

  /* =====================================================
     REMOVE INPUT - MOUSE
  ===================================================== */

  const removeInput = (key) => {
    if (showAnswer || checkCompleted || isInputLocked(key)) {
      return;
    }

    setUserInputs((prev) => ({
      ...prev,
      [key]: "",
    }));

    setWrongInputs((prev) => prev.filter((item) => item !== String(key)));
  };

  /* =====================================================
     MATCHING PREVIEW
  ===================================================== */

  const updatePreviewLine = (startPoint, image) => {
    if (!startPoint) {
      return;
    }

    const row = rows.find((item) => item.imgKey === image);

    if (!row) return;

    const dot = document.getElementById(row.imgId);

    const pos = getDotPosition(dot);

    if (!pos) return;

    setPreviewLine({
      x1: startPoint.x,
      y1: startPoint.y,

      x2: pos.x,
      y2: pos.y,
    });
  };

  /* =====================================================
     MATCHING COMMIT
  ===================================================== */

  const commitConnection = (word, image) => {
    if (
      !word ||
      !image ||
      showAnswer ||
      checkCompleted ||
      isWordLocked(word) ||
      isImageLocked(image)
    ) {
      return;
    }

    const sourceRow = rows.find((row) => row.scrambled === word);

    const targetRow = rows.find((row) => row.imgKey === image);

    if (!sourceRow || !targetRow) {
      return;
    }

    const leftDot = document.getElementById(sourceRow.dotId);

    const rightDot = document.getElementById(targetRow.imgId);

    const start = getDotPosition(leftDot);

    const end = getDotPosition(rightDot);

    if (!start || !end) {
      return;
    }

    const displacedLine = lines.find((line) => line.image === image);

    const newLine = {
      x1: start.x,
      y1: start.y,

      x2: end.x,
      y2: end.y,

      word,
      image,
    };

    /*
      ONE TO ONE
    */

    setLines((prev) => [
      ...prev.filter((line) => line.word !== word && line.image !== image),

      newLine,
    ]);

    /*
      X فقط من الوصلات
      التي تغيرت.
    */

    setWrongWords((prev) =>
      prev.filter((item) => item !== word && item !== displacedLine?.word),
    );

    setSelectedLeftWord(word);

    setSelectedImage(image);

    setFirstDot(null);

    setPreviewLine(null);

    window.setTimeout(() => {
      setSelectedLeftWord(null);

      setSelectedImage(null);
    }, 250);
  };

  /* =====================================================
     KEYBOARD MATCH START
  ===================================================== */

  const startKeyboardMatch = (word) => {
    if (showAnswer || checkCompleted || isWordLocked(word)) {
      return;
    }

    const row = rows.find((item) => item.scrambled === word);

    if (!row) return;

    const dot = document.getElementById(row.dotId);

    const pos = getDotPosition(dot);

    if (!pos) return;

    /*
      شيل خطه القديم إذا
      كان غلط وقابل للتعديل.
    */

    setLines((prev) =>
      prev.filter((line) => line.word !== word || isWordLocked(line.word)),
    );

    setWrongWords((prev) => prev.filter((item) => item !== word));

    const startPoint = {
      type: "word",

      word,

      x: pos.x,
      y: pos.y,
    };

    setFirstDot(startPoint);

    setSelectedLeftWord(word);

    setSelectedImage(null);

    requestAnimationFrame(() => {
      const available = getAvailableImageIndexes();

      if (!available.length) {
        return;
      }

      const index = available[0];

      imageRefs.current[index]?.focus();

      updatePreviewLine(startPoint, rows[index].imgKey);
    });
  };

  /* =====================================================
     IMAGE KEYBOARD
  ===================================================== */

  const handleImageKeyboard = (e, index, image) => {
    if (!firstDot || firstDot.type !== "word") {
      return;
    }

    if (showAnswer || checkCompleted || isImageLocked(image)) {
      return;
    }

    /* TAB */

    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const available = getAvailableImageIndexes();

      if (!available.length) {
        return;
      }

      const current = available.indexOf(index);

      let next;

      if (e.shiftKey) {
        next = current <= 0 ? available.length - 1 : current - 1;
      } else {
        next =
          current === -1 || current === available.length - 1 ? 0 : current + 1;
      }

      const target = available[next];

      imageRefs.current[target]?.focus();

      updatePreviewLine(firstDot, rows[target].imgKey);

      return;
    }

    /* ENTER */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      const source = firstDot.word;

      commitConnection(source, image);

      window.setTimeout(() => {
        const nextWord = rows.find(
          (row) => !isWordLocked(row.scrambled) && row.scrambled !== source,
        )?.scrambled;

        if (nextWord) {
          leftRefs.current[nextWord]?.focus();
        }
      }, 0);

      return;
    }

    /* ESCAPE */

    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      const source = firstDot.word;

      clearMatchingSelection();

      requestAnimationFrame(() => {
        leftRefs.current[source]?.focus();
      });
    }
  };

  /* =====================================================
     MOUSE MATCH - START FROM EITHER SIDE
  ===================================================== */

  const handleStartDotClick = (e) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const word = e.currentTarget.dataset.word || null;

    const image = e.currentTarget.dataset.image || null;

    if (word && isWordLocked(word)) {
      return;
    }

    if (image && isImageLocked(image)) {
      return;
    }

    const pos = getDotPosition(e.currentTarget);

    if (!pos) return;

    if (!firstDot) {
      /*
        Editable old connection
        gets removed first.
      */

      setLines((prev) =>
        prev.filter((line) => {
          if (word && line.word === word && !isWordLocked(word)) {
            return false;
          }

          if (image && line.image === image && !isImageLocked(image)) {
            return false;
          }

          return true;
        }),
      );

      if (word) {
        setWrongWords((prev) => prev.filter((item) => item !== word));
      }

      setFirstDot({
        type: word ? "word" : "image",

        word,
        image,

        x: pos.x,
        y: pos.y,
      });

      setSelectedLeftWord(word);

      setSelectedImage(image);

      return;
    }

    /*
      opposite sides = commit
    */

    if (firstDot.type === "word" && image) {
      commitConnection(firstDot.word, image);

      return;
    }

    if (firstDot.type === "image" && word) {
      commitConnection(word, firstDot.image);

      return;
    }

    /*
      Same side -> replace selection
    */

    setFirstDot({
      type: word ? "word" : "image",

      word,
      image,

      x: pos.x,
      y: pos.y,
    });

    setSelectedLeftWord(word);

    setSelectedImage(image);
  };

  /* =====================================================
     CHECK
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (Object.values(userInputs).some((value) => !value)) {
      ValidationAlert.info("Oops!", "Please complete all sentences.");

      return;
    }

    if (lines.length < correctMatches.length) {
      ValidationAlert.info("Oops!", "Please match all pairs before checking.");

      return;
    }

    /* =================================================
       SENTENCE CHECK
    ================================================= */

    const newWrongInputs = [];

    const newLockedInputs = [];

    let sentenceCorrect = 0;

    Object.keys(correctSentences).forEach((key) => {
      const correct =
        userInputs[key].trim().toLowerCase() === correctSentences[key];

      if (correct) {
        sentenceCorrect++;

        newLockedInputs.push(key);
      } else {
        newWrongInputs.push(key);
      }
    });

    setLockedInputs((prev) =>
      Array.from(new Set([...prev, ...newLockedInputs])),
    );

    setWrongInputs(newWrongInputs);

    /* =================================================
       CONNECTION CHECK
    ================================================= */

    const newWrongWords = [];

    const newLockedWords = [];

    const newLockedImages = [];

    let lineCorrect = 0;

    lines.forEach((line) => {
      if (isCorrectMatch(line.word, line.image)) {
        lineCorrect++;

        newLockedWords.push(line.word);

        newLockedImages.push(line.image);
      } else {
        newWrongWords.push(line.word);
      }
    });

    setLockedWords((prev) => Array.from(new Set([...prev, ...newLockedWords])));

    setLockedImages((prev) =>
      Array.from(new Set([...prev, ...newLockedImages])),
    );

    setWrongWords(newWrongWords);

    setKeyboardPickedSentence(null);

    setFocusedInputId(null);

    clearMatchingSelection();

    /* =================================================
       SCORE
    ================================================= */

    const userScore = sentenceCorrect + lineCorrect;

    const totalScore = 8;

    const color =
      userScore === totalScore ? "green" : userScore === 0 ? "red" : "orange";

    const message = `
      <div style="font-size:20px;text-align:center;">
        <span style="color:${color};font-weight:bold;">
          Score: ${userScore} / ${totalScore}
        </span>
      </div>
    `;

    if (userScore === totalScore) {
      setLockedInputs(Object.keys(correctSentences));

      setLockedWords(correctMatches.map((item) => item.word));

      setLockedImages(correctMatches.map((item) => item.image));

      setWrongInputs([]);

      setWrongWords([]);

      setCheckCompleted(true);

      ValidationAlert.success(message);

      return;
    }

    if (userScore === 0) {
      ValidationAlert.error(message);
    } else {
      ValidationAlert.warning(message);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const handleShowAnswer = () => {
    stopAudio();

    const finalInputs = {
      ...correctSentences,
    };

    setUserInputs(finalInputs);

    setLockedInputs(Object.keys(correctSentences));

    const finalLines = correctMatches
      .map((pair) => {
        const sourceRow = rows.find((row) => row.scrambled === pair.word);

        const targetRow = rows.find((row) => row.imgKey === pair.image);

        const start = getDotPosition(document.getElementById(sourceRow?.dotId));

        const end = getDotPosition(document.getElementById(targetRow?.imgId));

        if (!start || !end) {
          return null;
        }

        return {
          x1: start.x,
          y1: start.y,

          x2: end.x,
          y2: end.y,

          word: pair.word,

          image: pair.image,
        };
      })
      .filter(Boolean);

    setLines(finalLines);

    setLockedWords(correctMatches.map((item) => item.word));

    setLockedImages(correctMatches.map((item) => item.image));

    setWrongInputs([]);

    setWrongWords([]);

    setShowAnswer(true);

    setCheckCompleted(true);

    setKeyboardPickedSentence(null);

    clearMatchingSelection();
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    stopAudio();

    setLines([]);

    setPreviewLine(null);

    setFirstDot(null);

    setWrongWords([]);

    setLockedWords([]);

    setLockedImages([]);

    setSelectedLeftWord(null);

    setSelectedImage(null);

    setUserInputs({
      1: "",
      2: "",
      3: "",
      4: "",
    });

    setWrongInputs([]);

    setLockedInputs([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setActiveWord(null);

    setKeyboardPickedSentence(null);

    setFocusedInputId(null);
  };

  /* =====================================================
     JSX
  ===================================================== */

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
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
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            justifyContent: "flex-start",
          }}
        >
          <ExerciseHeaderReview
            sectionLetter="B"
            title="Unscramble, write, and match."
            subTitle="Put the words in sentence order, then match each command to its picture."
          />

          {/* =================================================
              SENTENCE BANK
          ================================================= */}

          <div
            style={{
              display: "flex",

              gap: "10px",

              padding: "10px",

              border: "2px dashed #ccc",

              borderRadius: "10px",

              width: "100%",

              alignItems: "center",

              justifyContent: "center",

              flexWrap: "wrap",
            }}
          >
            {sentenceBank.map((item) => (
              <DraggableSentence
                key={item.sentence}
                id={`sentence-${item.sentence}`}
                sentence={item.sentence}
                audio={item.audio}
                disabled={showAnswer || checkCompleted}
                isUsed={usedSentences.has(item.sentence)}
                keyboardPickedSentence={keyboardPickedSentence}
                onKeyboardPick={handleKeyboardPick}
                playingSentence={playingSentence}
                playSentenceAudio={playSentenceAudio}
                bankRefs={bankRefs}
              />
            ))}
          </div>

          {/* =================================================
              MATCHING ROWS
          ================================================= */}

          <div className="container12 w-full" ref={containerRef}>
            {rows.map((row, rowIndex) => {
              const wordLocked = isWordLocked(row.scrambled);

              const imageLocked = isImageLocked(row.imgKey);

              const matchingActive = firstDot?.type === "word";

              return (
                <div className="matching-row2" key={row.key}>
                  {/* =========================================
                        LEFT SIDE
                    ========================================= */}

                  <div>
                    <div className="word-with-dot2">
                      <span className="span-num2">{row.key}</span>

                      <span
                        ref={(el) => {
                          leftRefs.current[row.scrambled] = el;
                        }}
                        className={`word-text2-review3-p1-q2 ${
                          selectedLeftWord === row.scrambled
                            ? "selected-item"
                            : ""
                        } ${wordLocked || showAnswer ? "disabled-hover" : ""}`}
                        role="button"
                        tabIndex={
                          wordLocked || showAnswer || checkCompleted || firstDot
                            ? -1
                            : 0
                        }
                        aria-label={
                          wordLocked
                            ? `${row.scrambled}. Correct match.`
                            : `${row.scrambled}. Press Enter or Space to start matching.`
                        }
                        onClick={() =>
                          document.getElementById(row.dotId)?.click()
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();

                            e.stopPropagation();

                            startKeyboardMatch(row.scrambled);
                          }
                        }}
                        style={{
                          cursor:
                            wordLocked || showAnswer || checkCompleted
                              ? "default"
                              : "pointer",
                        }}
                      >
                        {row.scrambled}
                      </span>

                      {wrongWords.includes(row.scrambled) && (
                        <span className="error-mark-review3-p1-q2">✕</span>
                      )}

                      <div className="dot-wrapper2">
                        <div
                          className="dot2 start-dot2"
                          id={row.dotId}
                          data-word={row.scrambled}
                          onClick={handleStartDotClick}
                          tabIndex={-1}
                          aria-hidden="true"
                        />
                      </div>
                    </div>

                    {/* =====================================
                          DRAG INPUT
                      ===================================== */}

                    <InputSlot
                      slotKey={row.key}
                      value={userInputs[row.key]}
                      isWrong={wrongInputs.includes(String(row.key))}
                      locked={isInputLocked(row.key)}
                      showAnswer={showAnswer}
                      checkCompleted={checkCompleted}
                      keyboardPickedSentence={keyboardPickedSentence}
                      focusedInputId={focusedInputId}
                      setFocusedInputId={setFocusedInputId}
                      inputRefs={inputRefs}
                      getAvailableInputKeys={getAvailableInputKeys}
                      onKeyboardDrop={handleKeyboardDrop}
                      onKeyboardClearWrong={handleKeyboardClearWrong}
                      onCancelKeyboardPick={handleCancelKeyboardPick}
                      onRemove={() => removeInput(row.key)}
                      playingSentence={playingSentence}
                      playSentenceAudio={playSentenceAudio}
                      getSentenceAudio={getSentenceAudio}
                    />
                  </div>

                  {/* =========================================
                        RIGHT IMAGE
                    ========================================= */}

                  <div className="img-with-dot2">
                    <div className="dot-wrapper2">
                      <div
                        className="dot2 end-dot2"
                        data-image={row.imgKey}
                        id={row.imgId}
                        onClick={handleStartDotClick}
                        tabIndex={-1}
                        aria-hidden="true"
                      />
                    </div>

                    <img
                      ref={(el) => {
                        imageRefs.current[rowIndex] = el;
                      }}
                      src={row.imgSrc}
                      className={`matched-img2 ${
                        selectedImage === row.imgKey ? "selected-item" : ""
                      } ${imageLocked || showAnswer ? "disabled-hover" : ""}`}
                      alt={row.alt}
                      role={matchingActive ? "button" : undefined}
                      tabIndex={
                        matchingActive &&
                        !imageLocked &&
                        !showAnswer &&
                        !checkCompleted
                          ? 0
                          : -1
                      }
                      aria-label={
                        matchingActive
                          ? `${row.alt} Press Enter or Space to connect this picture.`
                          : row.alt
                      }
                      onClick={() =>
                        document.getElementById(row.imgId)?.click()
                      }
                      onFocus={() => {
                        if (firstDot?.type === "word" && !imageLocked) {
                          updatePreviewLine(firstDot, row.imgKey);
                        }
                      }}
                      onKeyDown={(e) =>
                        handleImageKeyboard(e, rowIndex, row.imgKey)
                      }
                      style={{
                        cursor:
                          imageLocked || showAnswer || checkCompleted
                            ? "default"
                            : "pointer",

                        height: "100px",

                        width: "auto",
                      }}
                    />
                  </div>
                </div>
              );
            })}

            {/* =================================================
                LINES
            ================================================= */}

            <svg className="lines-layer2" aria-hidden="true">
              {lines.map((line, index) => (
                <line
                  key={`${line.word}-${line.image}-${index}`}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="red"
                  strokeWidth="3"
                />
              ))}

              {previewLine && (
                <line
                  x1={previewLine.x1}
                  y1={previewLine.y1}
                  x2={previewLine.x2}
                  y2={previewLine.y2}
                  stroke="red"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                  pointerEvents="none"
                />
              )}
            </svg>
          </div>

          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="action-buttons-container">
            <button onClick={reset} className="try-again-button">
              Start Again ↻
            </button>

            <button
              onClick={handleShowAnswer}
              className="show-answer-btn swal-continue"
            >
              Show Answer
            </button>

            <button onClick={checkAnswers} className="check-button2">
              Check Answer ✓
            </button>
          </div>
        </div>
      </div>

      {/* =================================================
          DRAG OVERLAY
      ================================================= */}

      <DragOverlay>
        {activeWord ? (
          <div
            style={{
              padding: "5px 8px",

              border: "2px solid #2c5287",

              borderRadius: "8px",

              background: "#fff",

              fontWeight: "bold",

              boxShadow: "0 5px 15px rgba(0,0,0,.2)",

              whiteSpace: "nowrap",
            }}
          >
            {activeWord}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Review3_Page1_Q2;
