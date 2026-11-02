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

import present from "../../../assets/img_unit2/imgs/Present1.jpg";
import cake from "../../../assets/img_unit2/imgs/Cake1.jpg";
import balloon from "../../../assets/img_unit2/imgs/Baloon1.jpg";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit2_Page6_Q2.css";
import ExerciseHeader from "../../ExerciseHeader";

import { FaVolumeUp } from "react-icons/fa";

import cakeSentenceSound from "../../../assets/unit2/Page 15 - E/Happy birthday! Here is a cake..mp3";
import balloonSentenceSound from "../../../assets/unit2/Page 15 - E/Happy birthday! Here is a ballon..mp3";
import presentSentenceSound from "../../../assets/unit2/Page 15 - E/Happy birthday! Here is a present..mp3";

/* =====================================================
   DATA
===================================================== */

const exerciseData = {
  pairs: [
    {
      id: "pair-1",
      letter: "1",
      content: "Happy birthday! Here is a cake",
      sound: cakeSentenceSound,
    },
    {
      id: "pair-2",
      letter: "2",
      content: "Happy birthday! Here is a balloon",
      sound: balloonSentenceSound,
    },
    {
      id: "pair-3",
      letter: "3",
      content: "Happy birthday! Here is a present",
      sound: presentSentenceSound,
    },
  ],

  images: [
    {
      src: cake,
      alt: "Birthday cake",
    },
    {
      src: present,
      alt: "Birthday present",
    },
    {
      src: balloon,
      alt: "Orange balloon",
    },
  ],
};

/* =====================================================
   CORRECT ANSWERS
===================================================== */

const correctAnswers = {
  "drop-1": "pair-1",
  "drop-2": "pair-3",
  "drop-3": "pair-2",
};

/* =====================================================
   INITIAL STATE
===================================================== */

const initialDroppedState = {
  "drop-1": null,
  "drop-2": null,
  "drop-3": null,
};

/* =====================================================
   WORD BANK ITEM
===================================================== */

const WordBankItem = ({
  pair,
  isUsed,
  showAnswer,
  checkCompleted,

  activeSentenceAudio,
  onPlaySentence,

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
    <div className="option-box2">
      {/* NUMBER */}

      <span
        ref={(el) => {
          setNodeRef(el);
          bankRefs.current[pair.id] = el;
        }}
        style={style}
        className={`number-tag2 draggable-number${
          isDragging ? " dragging" : ""
        }`}
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
            ? `Number ${pair.letter} selected. Choose a box and press Enter.`
            : `Number ${pair.letter}. Press Enter to select it.`
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
            Mouse click ما نمسك الرقم منه،
            عشان يضل الـ drag بالماوس طبيعي.
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

      {/* SENTENCE + AUDIO */}

      <span
        className="option-text2 accessible-sentence-option"
        role="button"
        tabIndex={0}
        aria-label={`Play audio: ${pair.content}`}
        onClick={() => onPlaySentence(pair.sound, pair.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();

            onPlaySentence(pair.sound, pair.id);
          }
        }}
        style={{
          cursor: "pointer",
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {pair.content}

        {activeSentenceAudio === pair.id && (
          <FaVolumeUp
            size={20}
            aria-hidden="true"
            style={{
              flexShrink: 0,
              pointerEvents: "none",
            }}
          />
        )}
      </span>
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
      className="circle-number2 accessible-placed-number2"
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
  imageData,
  droppedPairId,

  isWrong,
  isLocked,

  showAnswer,
  checkCompleted,

  onReturn,

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
    إذا ماسكين رقم والـ focus
    واقف على هاي الخانة:
    الرقم يظهر جواتها ويرمش.
  */

  const showKeyboardPreview = keyboardActive && focusedDropId === dropId;

  return (
    <div className="image-row2">
      {/* =================================================
          DROP CIRCLE
      ================================================= */}

      <div
        ref={(el) => {
          setNodeRef(el);

          dropRefs.current[dropId] = el;
        }}
        className={`drop-circle2${isOver ? " drop2-hover" : ""}`}
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
            بدون رقم ممسوك
            ممنوع الـ focus يضيع بالخانة.
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

          /* =========================
             TAB BETWEEN DROPS
          ========================= */

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

          /* =========================
             ENTER / SPACE
          ========================= */

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
        ================================================= */}

        {showKeyboardPreview ? (
          <div
            className="circle-number2 keyboard-preview-number"
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

      {/* IMAGE */}

      <img src={imageData.src} alt={imageData.alt} className="person-img2" />
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

  activeSentenceAudio,
  onPlaySentence,

  keyboardPickedPair,
  onKeyboardPick,

  bankRefs,

  focusedBankId,
  setFocusedBankId,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: "letters2",
  });

  return (
    <div
      ref={setNodeRef}
      className="right-side2"
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
          activeSentenceAudio={activeSentenceAudio}
          onPlaySentence={onPlaySentence}
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

const Unit2_Page6_Q2 = () => {
  const [droppedLetters, setDroppedLetters] = useState({
    ...initialDroppedState,
  });

  const [wrongDrops, setWrongDrops] = useState([]);

  const [lockedDrops, setLockedDrops] = useState([]);

  const [showAnswer, setShowAnswer] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  const [activeDrag, setActiveDrag] = useState(null);

  /* =====================================================
     KEYBOARD ACCESSIBILITY
  ===================================================== */

  const bankRefs = useRef({});

  const dropRefs = useRef({});

  const placedRefs = useRef({});

  const [keyboardPickedPair, setKeyboardPickedPair] = useState(null);

  const [focusedBankId, setFocusedBankId] = useState(null);

  const [focusedDropId, setFocusedDropId] = useState(null);

  /* =====================================================
     SENTENCE AUDIO
  ===================================================== */

  const sentenceAudioRef = useRef(null);

  const [activeSentenceAudio, setActiveSentenceAudio] = useState(null);

  const playSentence = (src, pairId) => {
    if (!sentenceAudioRef.current) {
      return;
    }

    sentenceAudioRef.current.pause();

    sentenceAudioRef.current.currentTime = 0;

    sentenceAudioRef.current.src = src;

    setActiveSentenceAudio(pairId);

    sentenceAudioRef.current.play().catch((error) => {
      console.log("Sentence audio error:", error);

      setActiveSentenceAudio(null);
    });

    sentenceAudioRef.current.onended = () => {
      setActiveSentenceAudio(null);
    };
  };

  /* =====================================================
     USED PAIRS
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
     KEYBOARD PICK FROM BANK
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
        فور اختيار الرقم:
        روح لأول drop متاح.

        بمجرد وصول focus له
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
     PICK NUMBER FROM INSIDE DROP
  ===================================================== */

  const handleKeyboardPickPlaced = (pair) => {
    if (showAnswer || checkCompleted || lockedDrops.includes(pair.dropId)) {
      return;
    }

    setKeyboardPickedPair(pair);

    /*
        الرقم موجود حاليًا بخانة.
        روح لأول خانة ثانية متاحة.
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
            مكان الرقم الحالي لو كان
            أصلًا موجود بخانة.
          */

      const oldSourceDrop = Object.keys(next).find(
        (id) => next[id] === newPairId,
      );

      /*
            الرقم الموجود حاليًا
            داخل الخانة الهدف.
          */

      const oldTargetPair = next[dropId];

      /*
            إذا الرقم جاي من drop:
            SWAP.
          */

      if (
        oldSourceDrop &&
        oldSourceDrop !== dropId &&
        !lockedDrops.includes(oldSourceDrop)
      ) {
        next[oldSourceDrop] = oldTargetPair || null;
      }

      /*
            حط الرقم الجديد.
          */

      next[dropId] = newPairId;

      return next;
    });

    /*
        شيل X عن الخانة المعدلة.
      */

    setWrongDrops((prev) => prev.filter((id) => id !== dropId));

    setKeyboardPickedPair(null);

    setFocusedDropId(null);

    /*
        إذا الرقم جاي من داخل drop:
        خلي focus على الرقم بعد نقله.

        إذا جاي من bank:
        رجع focus لنفس رقم bank.
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
        لا تحرك خانة صح مقفلة.
      */

    if (source === "drop" && lockedDrops.includes(fromDropId)) {
      return;
    }

    /*
        لا تحط فوق خانة مقفلة.
      */

    if (toId !== "letters2" && lockedDrops.includes(toId)) {
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

        if (toId === "letters2") {
          next[fromDropId] = null;

          return next;
        }

        /*
              Swap بين خانتين.
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
        if (toId === "letters2") {
          return next;
        }

        /*
              Replace.
              الرقم الجديد يحل محل القديم.
              القديم يرجع متاح بالـ bank.
            */

        next[toId] = pairId;

        return next;
      }

      return next;
    });

    /* =================================================
         REMOVE X ONLY FROM EDITED DROPS
      ================================================= */

    setWrongDrops((prev) => {
      let updated = [...prev];

      if (source === "drop" && fromDropId) {
        updated = updated.filter((id) => id !== fromDropId);
      }

      if (toId !== "letters2") {
        updated = updated.filter((id) => id !== toId);
      }

      return updated;
    });
  };

  /* =====================================================
     RETURN TO BANK
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

    if (sentenceAudioRef.current) {
      sentenceAudioRef.current.pause();

      sentenceAudioRef.current.currentTime = 0;

      sentenceAudioRef.current.onended = null;
    }

    setActiveSentenceAudio(null);
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

    /* =============================
         LOCK CORRECT ONLY
      ============================= */

    setLockedDrops((prev) => Array.from(new Set([...prev, ...correctTemp])));

    /* =============================
         WRONG ONLY
      ============================= */

    setWrongDrops(wrongTemp);

    setKeyboardPickedPair(null);

    setFocusedDropId(null);

    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const msg = `
        <div style="font-size:20px;text-align:center;">
          <span style="color:${color};font-weight:bold;">
            Score: ${correctCount} / ${total}
          </span>
        </div>
      `;

    /* =============================
         ALL CORRECT
      ============================= */

    if (correctCount === total) {
      setLockedDrops(Object.keys(correctAnswers));

      setWrongDrops([]);

      setCheckCompleted(true);

      ValidationAlert.success(msg);

      return;
    }

    if (correctCount === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
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
        {/* SENTENCE AUDIO */}

        <audio
          ref={sentenceAudioRef}
          style={{
            display: "none",
          }}
        />

        <div
          className="div-forall"
          style={{
            gap: "30px",
          }}
        >
          <ExerciseHeader
            sectionLetter="E"
            title="Look, read, and choose."
            subTitle="Use the numbered birthday picture to complete each sentence."
          />

          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="layout2 w-full">
              {/* =====================
                  LEFT — IMAGES
              ===================== */}

              <div className="left-side2">
                {exerciseData.images.map((imageData, index) => {
                  const dropId = `drop-${index + 1}`;

                  return (
                    <DropCircle
                      key={dropId}
                      dropId={dropId}
                      imageData={imageData}
                      droppedPairId={droppedLetters[dropId]}
                      isWrong={wrongDrops.includes(dropId)}
                      isLocked={lockedDrops.includes(dropId)}
                      showAnswer={showAnswer}
                      checkCompleted={checkCompleted}
                      onReturn={handleReturnToBank}
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
                  RIGHT — SENTENCES
              ===================== */}

              <WordBank
                pairs={exerciseData.pairs}
                usedPairIds={usedPairIds}
                showAnswer={showAnswer}
                checkCompleted={checkCompleted}
                activeSentenceAudio={activeSentenceAudio}
                onPlaySentence={playSentence}
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
                  className="number-tag2 draggable-number dragging"
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
    </>
  );
};

export default Unit2_Page6_Q2;
