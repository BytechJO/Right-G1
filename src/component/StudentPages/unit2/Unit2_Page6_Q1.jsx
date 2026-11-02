import React, { useState, useRef } from "react";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";

import { CSS } from "@dnd-kit/utilities";

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

import QuestionAudioPlayer from "../../QuestionAudioPlayer";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   DATA
===================================================== */

const exerciseData = {
  pairs: [
    {
      id: "pair-1",
      letter: "1",
      content: "January",
    },
    {
      id: "pair-2",
      letter: "2",
      content: "November",
    },
    {
      id: "pair-3",
      letter: "3",
      content: "May",
    },
    {
      id: "pair-4",
      letter: "4",
      content: "August",
    },
  ],

  images: [
    {
      img: girl1,
      sound: stella,
      alt: "Stella",
    },
    {
      img: girl2,
      sound: helen,
      alt: "Helen",
    },
    {
      img: boy1,
      sound: tom,
      alt: "Tom",
    },
    {
      img: boy2,
      sound: harley,
      alt: "Harley",
    },
  ],
};

/* =====================================================
   CORRECT ANSWERS
===================================================== */

const correctAnswers = {
  "drop-1": "pair-1",
  "drop-2": "pair-4",
  "drop-3": "pair-2",
  "drop-4": "pair-3",
};

/* =====================================================
   INITIAL STATE
===================================================== */

const initialDroppedState = {
  "drop-1": null,
  "drop-2": null,
  "drop-3": null,
  "drop-4": null,
};

/* =====================================================
   AUDIO
===================================================== */

const stopAtSecond = 4.5;

const captions = [
  {
    start: 0,
    end: 4.27,
    text: "Page 15, Exercise D. Listen and choose.",
  },
  {
    start: 4.29,
    end: 6.24,
    text: "1-January",
  },
  {
    start: 6.26,
    end: 8.28,
    text: "2-November",
  },
  {
    start: 8.3,
    end: 10.12,
    text: "3-May",
  },
  {
    start: 10.14,
    end: 12.07,
    text: "4-August",
  },
];

/* =====================================================
   WORD BANK ITEM
===================================================== */

const WordBankItem = ({
  pair,
  isUsed,
  showAnswer,
  checkCompleted,

  keyboardPickedPair,
  onKeyboardPick,

  bankRefs,

  focusedBankId,
  setFocusedBankId,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `bank-${pair.id}`,

      data: {
        pairId: pair.id,
        letter: pair.letter,
        source: "bank",
      },

      disabled: isUsed || showAnswer || checkCompleted,
    });

  const isPicked = keyboardPickedPair?.id === pair.id;

  const style = {
    transform: CSS.Translate.toString(transform),

    opacity: isDragging ? 0.35 : isUsed ? 0.35 : 1,

    cursor: isUsed || showAnswer || checkCompleted ? "default" : "grab",

    filter: isUsed ? "grayscale(60%)" : "none",

    transition:
      "opacity 0.2s, filter 0.2s, transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease",

    userSelect: "none",

    outline: isPicked
      ? "3px solid #2563eb"
      : focusedBankId === pair.id
        ? "2px solid #2563eb"
        : "none",

    outlineOffset: "3px",

    background: isPicked ? "#dbeafe" : undefined,

    boxShadow: isPicked ? "0 0 0 4px rgba(37,99,235,0.15)" : "none",
  };

  return (
    <div className="option-box">
      <span
        ref={(el) => {
          setNodeRef(el);
          bankRefs.current[pair.id] = el;
        }}
        style={style}
        className={`number-tag draggable-number${
          isUsed ? " number-tag--used" : ""
        }${isDragging ? " dragging" : ""}`}
        {...(isUsed || showAnswer || checkCompleted
          ? {}
          : {
              ...listeners,
              ...attributes,
            })}
        role="button"
        tabIndex={isUsed || showAnswer || checkCompleted ? -1 : 0}
        aria-pressed={isPicked}
        aria-disabled={isUsed || showAnswer || checkCompleted}
        aria-label={
          isPicked
            ? `Number ${pair.letter}, ${pair.content}, selected. Choose a box and press Enter.`
            : `Number ${pair.letter}, ${pair.content}. Press Enter to select it.`
        }
        onFocus={() => {
          setFocusedBankId(pair.id);
        }}
        onBlur={() => {
          setFocusedBankId(null);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();

            onKeyboardPick(pair);
            return;
          }

          listeners?.onKeyDown?.(e);
        }}
        onClick={(e) => {
          /*
            ما بدنا mouse click يتحول
            إلى keyboard pick.
            الماوس يظل للـ drag.
          */

          if (e.detail === 0) {
            e.preventDefault();
            e.stopPropagation();

            onKeyboardPick(pair);
          }
        }}
      >
        {pair.letter}
      </span>

      <span className="month-label">{pair.content}</span>
    </div>
  );
};

/* =====================================================
   PLACED NUMBER
===================================================== */

const PlacedNumber = ({
  pairId,
  letter,
  dropId,

  showAnswer,
  isLocked,
  checkCompleted,

  onReturn,

  onKeyboardPickPlaced,

  placedRefs,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `placed-${dropId}`,

      data: {
        pairId,
        letter,
        source: "drop",
        dropId,
      },

      disabled: showAnswer || isLocked || checkCompleted,
    });

  const isDisabled = showAnswer || isLocked || checkCompleted;

  const style = {
    transform: CSS.Translate.toString(transform),

    opacity: isDragging ? 0.35 : 1,

    cursor: isDisabled ? "default" : "grab",

    userSelect: "none",
  };

  return (
    <div
      ref={(el) => {
        setNodeRef(el);

        if (placedRefs) {
          placedRefs.current[dropId] = el;
        }
      }}
      style={style}
      className="circle-number accessible-placed-number"
      {...(isDisabled
        ? {}
        : {
            ...listeners,
            ...attributes,
          })}
      role={isDisabled ? undefined : "button"}
      tabIndex={isDisabled ? -1 : 0}
      aria-label={
        isDisabled
          ? undefined
          : `Number ${letter}. Press Enter to move it to another box.`
      }
      onKeyDown={(e) => {
        if (isDisabled) {
          return;
        }

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          onKeyboardPickPlaced({
            id: pairId,
            letter,
            source: "drop",
            dropId,
          });
        }
      }}
      onClick={() => {
        if (isDisabled) {
          return;
        }

        onReturn(dropId);
      }}
    >
      {letter}
    </div>
  );
};

/* =====================================================
   DROP CIRCLE
===================================================== */

const DropCircle = ({
  dropId,
  imgData,
  droppedPairId,

  isWrong,
  isLocked,

  showAnswer,
  checkCompleted,

  onReturn,

  onPlaySound,
  imageIndex,
  activeAudioIndex,

  keyboardPickedPair,
  onKeyboardDrop,

  dropRefs,

  focusedDropId,
  setFocusedDropId,

  getAvailableDropIds,

  onKeyboardPickPlaced,

  placedRefs,
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: dropId,

    disabled: showAnswer || isLocked || checkCompleted,
  });

  const droppedPair = droppedPairId
    ? exerciseData.pairs.find((pair) => pair.id === droppedPairId)
    : null;

  const keyboardActive =
    !!keyboardPickedPair && !isLocked && !showAnswer && !checkCompleted;

  /*
    هون أهم إضافة:

    إذا ماسكين رقم بالكيبورد
    والـ focus واقف على هاي الخانة،
    نظهر الرقم جوّا الخانة كـ preview
    ويرمش.
  */

  const showKeyboardPreview = keyboardActive && focusedDropId === dropId;

  return (
    <div className="image-row">
      {/* =================================================
          IMAGE + AUDIO
      ================================================= */}

      <div
        style={{
          position: "relative",
          display: "inline-block",
        }}
      >
        <img
          src={imgData.img}
          alt={imgData.alt}
          className="person-img"
          role="button"
          tabIndex={0}
          aria-label={`Play audio for ${imgData.alt}`}
          style={{
            cursor: "pointer",
          }}
          onClick={() => onPlaySound(imgData.sound, imageIndex)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();

              onPlaySound(imgData.sound, imageIndex);
            }
          }}
        />

        {activeAudioIndex === imageIndex && (
          <FaVolumeUp
            size={24}
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "6px",
              right: "6px",
              pointerEvents: "none",
              zIndex: 10,
            }}
          />
        )}
      </div>

      {/* =================================================
          DROP CIRCLE
      ================================================= */}

      <div
        ref={(el) => {
          setNodeRef(el);

          dropRefs.current[dropId] = el;
        }}
        className={`drop-circle${isOver ? " drop-hover" : ""}${
          showKeyboardPreview ? " keyboard-drop-preview" : ""
        }`}
        role={keyboardActive ? "button" : undefined}
        tabIndex={keyboardActive ? 0 : -1}
        aria-label={
          keyboardActive
            ? droppedPair
              ? `Box currently contains number ${droppedPair.letter}. Press Enter to replace it with number ${keyboardPickedPair.letter}.`
              : `Empty box. Press Enter to place number ${keyboardPickedPair.letter}.`
            : undefined
        }
        onFocus={(e) => {
          /*
            إذا ما في رقم ممسوك،
            ممنوع الـ focus يوقف على الخانة.
          */

          if (!keyboardActive) {
            e.currentTarget.blur();

            setFocusedDropId(null);

            return;
          }

          setFocusedDropId(dropId);
        }}
        onBlur={() => {
          setFocusedDropId(null);
        }}
        onKeyDown={(e) => {
          if (!keyboardActive) {
            return;
          }

          /* =================================================
             TAB BETWEEN DROP ZONES
          ================================================= */

          if (e.key === "Tab") {
            e.preventDefault();
            e.stopPropagation();

            const available = getAvailableDropIds();

            if (available.length === 0) {
              return;
            }

            const currentIndex = available.indexOf(dropId);

            let nextIndex;

            if (e.shiftKey) {
              nextIndex =
                currentIndex <= 0 ? available.length - 1 : currentIndex - 1;
            } else {
              nextIndex =
                currentIndex === -1 || currentIndex === available.length - 1
                  ? 0
                  : currentIndex + 1;
            }

            const nextDropId = available[nextIndex];

            dropRefs.current[nextDropId]?.focus();

            return;
          }

          /* =================================================
             ENTER / SPACE = PLACE NUMBER
          ================================================= */

          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();

            onKeyboardDrop(dropId);
          }
        }}
        style={{
          position: "relative",

          outline: showKeyboardPreview ? "3px solid #2563eb" : "none",

          outlineOffset: "3px",

          background: showKeyboardPreview ? "#dbeafe" : undefined,

          transform: showKeyboardPreview ? "scale(1.08)" : "scale(1)",

          boxShadow: showKeyboardPreview
            ? "0 0 0 4px rgba(37,99,235,0.15)"
            : "none",

          transition:
            "transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease",
        }}
      >
        {/* WRONG */}

        {isWrong && (
          <div className="wrong-x3" aria-hidden="true">
            ✕
          </div>
        )}

        {/* =================================================
            KEYBOARD PREVIEW

            إذا ماسكين رقم والـ focus على هاي الخانة:
            اعرض الرقم الممسوك جوّاها ويرمش.

            إذا تركناها بـ Tab:
            preview يختفي وترجع القيمة الأصلية.
        ================================================= */}

        {showKeyboardPreview ? (
          <div
            className="circle-number keyboard-preview-number"
            aria-hidden="true"
          >
            {keyboardPickedPair.letter}
          </div>
        ) : (
          droppedPair && (
            <PlacedNumber
              pairId={droppedPair.id}
              letter={droppedPair.letter}
              dropId={dropId}
              showAnswer={showAnswer}
              isLocked={isLocked}
              checkCompleted={checkCompleted}
              onReturn={onReturn}
              onKeyboardPickPlaced={onKeyboardPickPlaced}
              placedRefs={placedRefs}
            />
          )
        )}
      </div>
    </div>
  );
};

/* =====================================================
   WORD BANK
===================================================== */

const WordBank = ({
  pairs,
  usedPairIds,

  showAnswer,
  checkCompleted,

  keyboardPickedPair,
  onKeyboardPick,

  bankRefs,

  focusedBankId,
  setFocusedBankId,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: "letters",
  });

  return (
    <div
      ref={setNodeRef}
      className="right-side"
      style={{
        background: isOver ? "rgba(28,61,126,0.06)" : undefined,

        transition: "background 0.2s",
      }}
    >
      {pairs.map((pair) => (
        <WordBankItem
          key={pair.id}
          pair={pair}
          isUsed={usedPairIds.has(pair.id)}
          showAnswer={showAnswer}
          checkCompleted={checkCompleted}
          keyboardPickedPair={keyboardPickedPair}
          onKeyboardPick={onKeyboardPick}
          bankRefs={bankRefs}
          focusedBankId={focusedBankId}
          setFocusedBankId={setFocusedBankId}
        />
      ))}
    </div>
  );
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

const Unit2_Page6_Q1 = () => {
  const [droppedLetters, setDroppedLetters] = useState({
    ...initialDroppedState,
  });

  const [wrongDrops, setWrongDrops] = useState([]);

  const [lockedDrops, setLockedDrops] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  const [activeDrag, setActiveDrag] = useState(null);

  /* =====================================================
     KEYBOARD
  ===================================================== */

  const bankRefs = useRef({});

  const dropRefs = useRef({});

  const placedRefs = useRef({});

  const [keyboardPickedPair, setKeyboardPickedPair] = useState(null);

  const [focusedBankId, setFocusedBankId] = useState(null);

  const [focusedDropId, setFocusedDropId] = useState(null);

  /* =====================================================
     CLICK AUDIO
  ===================================================== */

  const clickAudioRef = useRef(null);

  const [activeAudioIndex, setActiveAudioIndex] = useState(null);

  /* =====================================================
     QUESTION AUDIO STOP SIGNAL
  ===================================================== */

  const [modelStopSignal, setModelStopSignal] = useState(0);

  const stopModelAudio = () => {
    setModelStopSignal((prev) => prev + 1);
  };

  /* =====================================================
     STOP IMAGE AUDIO
  ===================================================== */

  const stopImageAudio = () => {
    if (clickAudioRef.current) {
      clickAudioRef.current.pause();

      clickAudioRef.current.onended = null;
    }

    setActiveAudioIndex(null);
  };

  /* =====================================================
     PLAY IMAGE AUDIO
  ===================================================== */

  const playSound = (src, index) => {
    if (!clickAudioRef.current) {
      return;
    }

    stopModelAudio();

    clickAudioRef.current.pause();

    clickAudioRef.current.onended = null;

    clickAudioRef.current.src = src;

    setActiveAudioIndex(index);

    clickAudioRef.current.play().catch((error) => {
      console.log("Audio error:", error);

      setActiveAudioIndex(null);
    });

    clickAudioRef.current.onended = () => {
      setActiveAudioIndex(null);
    };
  };

  /* =====================================================
     QUESTION AUDIO INTERACTION
  ===================================================== */

  const handleModelInteract = () => {
    stopImageAudio();
  };

  /* =====================================================
     USED NUMBERS
  ===================================================== */

  const usedPairIds = new Set(Object.values(droppedLetters).filter(Boolean));

  /* =====================================================
     AVAILABLE DROP IDS
  ===================================================== */

  const getAvailableDropIds = () => {
    return Object.keys(droppedLetters).filter(
      (dropId) =>
        !lockedDrops.includes(dropId) && !showAnswer && !checkCompleted,
    );
  };

  /* =====================================================
     PICK NUMBER FROM WORD BANK
  ===================================================== */

  const handleKeyboardPick = (pair) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    if (usedPairIds.has(pair.id)) {
      return;
    }

    setKeyboardPickedPair({
      ...pair,
      source: "bank",
    });

    /*
        بعد Enter على الرقم:
        روح لأول drop متاح.

        أول ما ياخد focus،
        الرقم رح يظهر جواته ويرمش.
      */

    setTimeout(() => {
      const available = getAvailableDropIds();

      if (available.length > 0) {
        dropRefs.current[available[0]]?.focus();
      }
    }, 0);
  };

  /* =====================================================
     PICK NUMBER ALREADY INSIDE DROP
  ===================================================== */

  const handleKeyboardPickPlaced = (pair) => {
    if (showAnswer || checkCompleted || lockedDrops.includes(pair.dropId)) {
      return;
    }

    setKeyboardPickedPair(pair);

    /*
        لما نمسك رقم من جوّا drop،
        نروح لأول drop ثاني متاح.
      */

    setTimeout(() => {
      const available = getAvailableDropIds();

      if (available.length > 0) {
        const nextDrop =
          available.find((id) => id !== pair.dropId) || available[0];

        dropRefs.current[nextDrop]?.focus();
      }
    }, 0);
  };

  /* =====================================================
     KEYBOARD DROP / REPLACE / SWAP
  ===================================================== */

  const handleKeyboardDrop = (dropId) => {
    if (
      !keyboardPickedPair ||
      showAnswer ||
      checkCompleted ||
      lockedDrops.includes(dropId)
    ) {
      return;
    }

    const pickedPair = keyboardPickedPair;

    const newPairId = pickedPair.id;

    setDroppedLetters((prev) => {
      const next = {
        ...prev,
      };

      /*
            إذا الرقم جاي من drop:
            بنعرف مكانه القديم.
          */

      const oldSourceDrop = Object.keys(next).find(
        (id) => next[id] === newPairId,
      );

      /*
            الرقم الموجود بالخانة الهدف.
          */

      const oldTargetPair = next[dropId];

      /*
            SWAP:
            الرقم الممسوك يروح للهدف،
            والرقم الموجود بالهدف يرجع
            لمكان الرقم القديم.
          */

      if (
        oldSourceDrop &&
        oldSourceDrop !== dropId &&
        !lockedDrops.includes(oldSourceDrop)
      ) {
        next[oldSourceDrop] = oldTargetPair || null;
      }

      /*
            الرقم الجديد داخل الهدف.
          */

      next[dropId] = newPairId;

      return next;
    });

    /*
        شيل X عن الخانة اللي تغيرت.
      */

    setWrongDrops((prev) => prev.filter((id) => id !== dropId));

    /*
        خلصنا placement.
      */

    setKeyboardPickedPair(null);

    setFocusedDropId(null);

    /*
        إذا الرقم كان جاي من drop:
        خلي focus على الرقم بعد انتقاله.

        إذا جاي من bank:
        رجع للـ bank.
      */

    setTimeout(() => {
      if (pickedPair.source === "drop") {
        placedRefs.current[dropId]?.focus();
      } else {
        bankRefs.current[pickedPair.id]?.focus();
      }
    }, 0);
  };

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
        delay: 100,
        tolerance: 5,
      },
    }),
  );

  /* =====================================================
     DRAG START
  ===================================================== */

  const handleDragStart = (event) => {
    setActiveDrag(event.active.data.current);
  };

  /* =====================================================
     DRAG END
  ===================================================== */

  const handleDragEnd = (event) => {
    setActiveDrag(null);

    if (showAnswer || checkCompleted) {
      return;
    }

    const { active, over } = event;

    if (!over) {
      return;
    }

    const { pairId, source, dropId: fromDropId } = active.data.current;

    const toId = over.id;

    /*
        المصدر مقفول.
      */

    if (source === "drop" && lockedDrops.includes(fromDropId)) {
      return;
    }

    /*
        الهدف مقفول.
      */

    if (toId !== "letters" && lockedDrops.includes(toId)) {
      return;
    }

    setDroppedLetters((prev) => {
      const next = {
        ...prev,
      };

      /* =========================
             DRAG FROM DROP
          ========================= */

      if (source === "drop") {
        /*
              رجوع للـ bank.
            */

        if (toId === "letters") {
          next[fromDropId] = null;

          return next;
        }

        /*
              Swap بين drop و drop.
            */

        const targetPair = next[toId];

        next[toId] = pairId;

        next[fromDropId] = targetPair || null;

        return next;
      }

      /* =========================
             DRAG FROM BANK
          ========================= */

      if (source === "bank") {
        if (toId === "letters") {
          return next;
        }

        /*
              Replace:
              الرقم الجديد يحل مكان القديم.
              والقديم يرجع متاح بالـ bank.
            */

        next[toId] = pairId;

        return next;
      }

      return next;
    });

    /* =================================================
         REMOVE X ONLY FROM CHANGED DROPS
      ================================================= */

    setWrongDrops((prev) => {
      let updated = [...prev];

      if (source === "drop" && fromDropId) {
        updated = updated.filter((id) => id !== fromDropId);
      }

      if (toId !== "letters") {
        updated = updated.filter((id) => id !== toId);
      }

      return updated;
    });
  };

  /* =====================================================
     CLICK TO RETURN
  ===================================================== */

  const handleReturnToBank = (dropZoneId) => {
    if (showAnswer || checkCompleted || lockedDrops.includes(dropZoneId)) {
      return;
    }

    setDroppedLetters((prev) => ({
      ...prev,

      [dropZoneId]: null,
    }));

    setWrongDrops((prev) => prev.filter((id) => id !== dropZoneId));
  };

  /* =====================================================
     RESET
  ===================================================== */

  const handleReset = () => {
    setDroppedLetters({
      ...initialDroppedState,
    });

    setWrongDrops([]);

    setLockedDrops([]);

    setShowAnswer(false);

    setCheckCompleted(false);

    setActiveDrag(null);

    setKeyboardPickedPair(null);

    setFocusedBankId(null);

    setFocusedDropId(null);

    if (clickAudioRef.current) {
      clickAudioRef.current.pause();

      clickAudioRef.current.currentTime = 0;

      clickAudioRef.current.onended = null;
    }

    setActiveAudioIndex(null);

    stopModelAudio();
  };

  /* =====================================================
     CHECK ANSWERS
  ===================================================== */

  const handleCheckAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const allFilled = Object.values(droppedLetters).every(
      (value) => value !== null,
    );

    if (!allFilled) {
      ValidationAlert.info("Incomplete!", "Please complete all drop zones.");

      return;
    }

    let correctCount = 0;

    const total = exerciseData.pairs.length;

    const wrongTemp = [];

    const correctTemp = [];

    Object.keys(droppedLetters).forEach((dropId) => {
      if (droppedLetters[dropId] === correctAnswers[dropId]) {
        correctCount++;

        correctTemp.push(dropId);
      } else {
        wrongTemp.push(dropId);
      }
    });

    /*
        الصح فقط يتقفل.
      */

    setLockedDrops((prev) => Array.from(new Set([...prev, ...correctTemp])));

    /*
        X للغلط فقط.
      */

    setWrongDrops(wrongTemp);

    setKeyboardPickedPair(null);

    setFocusedDropId(null);

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const scoreMessage = `
        <div style="font-size:20px;margin-top:10px;text-align:center;">
          <span style="color:${color};font-weight:bold;">
            Score: ${correctCount} / ${total}
          </span>
        </div>
      `;

    if (correctCount === total) {
      setLockedDrops(Object.keys(correctAnswers));

      setWrongDrops([]);

      setCheckCompleted(true);

      ValidationAlert.success(scoreMessage);

      return;
    }

    if (correctCount === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const handleShowAnswer = () => {
    setDroppedLetters({
      ...correctAnswers,
    });

    setWrongDrops([]);

    setLockedDrops(Object.keys(correctAnswers));

    setShowAnswer(true);

    setCheckCompleted(true);

    setKeyboardPickedPair(null);

    setFocusedDropId(null);
  };

  /* =====================================================
     JSX
  ===================================================== */

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
        <div className="div-forall">
          <ExerciseHeader
            sectionLetter="D"
            title="Listen and choose."
            subTitle="Listen to each person, then drag the matching month to the correct picture."
          />

          {/* =================================================
              QUESTION AUDIO
          ================================================= */}

          <QuestionAudioPlayer
            src={sound1}
            captions={captions}
            stopAtSecond={stopAtSecond}
            pageId="unit2-page15-1"
            forceStop={modelStopSignal}
            onInteract={handleModelInteract}
          />

          <div className="u2-container">
            {/* =================================================
                IMAGE AUDIO
            ================================================= */}

            <audio
              ref={clickAudioRef}
              style={{
                display: "none",
              }}
            />

            <DndContext
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="layout">
                {/* =====================
                    LEFT SIDE
                ===================== */}

                <div className="left-side">
                  {exerciseData.images.map((imgData, index) => {
                    const dropId = `drop-${index + 1}`;

                    return (
                      <DropCircle
                        key={dropId}
                        dropId={dropId}
                        imgData={imgData}
                        droppedPairId={droppedLetters[dropId]}
                        isWrong={wrongDrops.includes(dropId)}
                        isLocked={lockedDrops.includes(dropId)}
                        showAnswer={showAnswer}
                        checkCompleted={checkCompleted}
                        onReturn={handleReturnToBank}
                        onPlaySound={playSound}
                        imageIndex={index}
                        activeAudioIndex={activeAudioIndex}
                        keyboardPickedPair={keyboardPickedPair}
                        onKeyboardDrop={handleKeyboardDrop}
                        dropRefs={dropRefs}
                        focusedDropId={focusedDropId}
                        setFocusedDropId={setFocusedDropId}
                        getAvailableDropIds={getAvailableDropIds}
                        onKeyboardPickPlaced={handleKeyboardPickPlaced}
                        placedRefs={placedRefs}
                      />
                    );
                  })}
                </div>

                {/* =====================
                    RIGHT SIDE
                ===================== */}

                <WordBank
                  pairs={exerciseData.pairs}
                  usedPairIds={usedPairIds}
                  showAnswer={showAnswer}
                  checkCompleted={checkCompleted}
                  keyboardPickedPair={keyboardPickedPair}
                  onKeyboardPick={handleKeyboardPick}
                  bankRefs={bankRefs}
                  focusedBankId={focusedBankId}
                  setFocusedBankId={setFocusedBankId}
                />
              </div>

              {/* =====================
                  DRAG OVERLAY
              ===================== */}

              <DragOverlay>
                {activeDrag ? (
                  <div
                    className="number-tag draggable-number dragging"
                    style={{
                      cursor: "grabbing",

                      opacity: 0.9,

                      boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
                    }}
                  >
                    {activeDrag.letter}
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        </div>

        {/* =================================================
            BUTTONS
        ================================================= */}

        <div className="action-buttons-container">
          <button onClick={handleReset} className="try-again-button">
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
