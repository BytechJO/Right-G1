import React, { useState, useRef } from "react";

import "./Unit2_Page7_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";

import {
  DndContext,
  DragOverlay,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

import ExerciseHeaderReview from "../../ExerciseHeaderReview";

/* =====================================================
   DRAGGABLE NUMBER — WORD BANK
===================================================== */

function DraggableNumber({
  item,
  isDragDisabled,

  keyboardPickedItem,
  onKeyboardPick,

  bankRefs,

  focusedBankNum,
  setFocusedBankNum,
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `num-${item.num}`,

    data: {
      item,
      source: "bank",
    },

    disabled: isDragDisabled,
  });

  const isPicked =
    keyboardPickedItem?.num === item.num &&
    keyboardPickedItem?.source === "bank";

  return (
    <div className="word-number-unit2-p7-q1">
      <span
        ref={(el) => {
          setNodeRef(el);

          bankRefs.current[item.num] = el;
        }}
        className="num-word"
        {...(isDragDisabled
          ? {}
          : {
              ...listeners,
              ...attributes,
            })}
        role="button"
        tabIndex={isDragDisabled ? -1 : 0}
        aria-pressed={isPicked}
        aria-disabled={isDragDisabled}
        aria-label={
          isPicked
            ? `Number ${item.num}, ${item.word}, selected. Choose a box and press Enter.`
            : `Number ${item.num}, ${item.word}. Press Enter to select it.`
        }
        onFocus={() => {
          setFocusedBankNum(item.num);
        }}
        onBlur={() => {
          setFocusedBankNum(null);
        }}
        onKeyDown={(e) => {
          if (isDragDisabled) {
            return;
          }

          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();

            onKeyboardPick(item);

            return;
          }

          listeners?.onKeyDown?.(e);
        }}
        onClick={(e) => {
          /*
            click الناتج من keyboard فقط.
            Mouse يضل للـ drag.
          */

          if (!isDragDisabled && e.detail === 0) {
            e.preventDefault();
            e.stopPropagation();

            onKeyboardPick(item);
          }
        }}
        style={{
          opacity: isDragging ? 0.4 : 1,

          cursor: isDragDisabled ? "default" : "grab",

          touchAction: "none",

          outline: isPicked
            ? "3px solid #2563eb"
            : focusedBankNum === item.num
              ? "2px solid #2563eb"
              : "none",

          outlineOffset: "3px",

          background: isPicked ? "#dbeafe" : undefined,

          transform: isPicked ? "scale(1.08)" : "scale(1)",

          boxShadow: isPicked ? "0 0 0 4px rgba(37,99,235,0.15)" : "none",

          transition:
            "transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease",
        }}
      >
        {item.num}
      </span>

      <span className="word-label">{item.word}</span>
    </div>
  );
}

/* =====================================================
   WORD ALREADY INSIDE SLOT
===================================================== */

function PlacedWord({
  item,
  slotId,

  isLocked,
  showAnswer,
  checkCompleted,

  onKeyboardPickPlaced,

  placedRefs,
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `placed-${slotId}`,

    data: {
      item,
      source: "slot",
      sourceSlotId: slotId,
    },

    disabled: isLocked || showAnswer || checkCompleted,
  });

  const isDisabled = isLocked || showAnswer || checkCompleted;

  return (
    <span
      ref={(el) => {
        setNodeRef(el);

        placedRefs.current[slotId] = el;
      }}
      className="placed-word-keyboard"
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
          : `${item.word}. Press Enter to move it to another box.`
      }
      onKeyDown={(e) => {
        if (isDisabled) {
          return;
        }

        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          onKeyboardPickPlaced(item, slotId);
        }
      }}
      style={{
        opacity: isDragging ? 0.4 : 1,

        cursor: isDisabled ? "default" : "grab",

        display: "inline-block",

        touchAction: "none",
      }}
    >
      {item.word}
    </span>
  );
}

/* =====================================================
   DROPPABLE SLOT
===================================================== */

function DroppableSlot({
  id,
  value,

  words,

  isWrong,
  isChecked,
  isLocked,

  showAnswer,
  checkCompleted,

  keyboardPickedItem,

  focusedSlotId,
  setFocusedSlotId,

  slotRefs,
  placedRefs,

  getAvailableSlotIds,

  onKeyboardDrop,
  onKeyboardPickPlaced,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id,

    disabled: isLocked || showAnswer || checkCompleted,
  });

  const [, key, indexStr] = id.split("-");

  const index = Number(indexStr);

  const keyboardActive =
    !!keyboardPickedItem && !isLocked && !showAnswer && !checkCompleted;

  const showKeyboardPreview = keyboardActive && focusedSlotId === id;

  /*
    الكلمة الموجودة حاليًا بالخانة.

    بما إن كل كلمة مرتبطة برقم واحد في bank
    نقدر نجيب item من الكلمة.
  */

  const placedItem = value ? words.find((item) => item.word === value) : null;

  return (
    <div className="input-wrapper1">
      <div
        ref={(el) => {
          setNodeRef(el);

          slotRefs.current[id] = el;
        }}
        className={[
          "input-sentence",

          isChecked && isWrong ? "wrong-input1" : "",

          isOver && !isLocked ? "drag-over-cell" : "",

          showKeyboardPreview ? "keyboard-slot-active" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        role={keyboardActive ? "button" : undefined}
        tabIndex={keyboardActive ? 0 : -1}
        aria-label={
          keyboardActive
            ? value
              ? `Box contains ${value}. Press Enter to replace it with ${keyboardPickedItem.word}.`
              : `Empty box. Press Enter to place ${keyboardPickedItem.word}.`
            : undefined
        }
        onFocus={(e) => {
          /*
            بدون كلمة ممسوكة:
            الـ input ممنوع يدخل بالـ Tab.
          */

          if (!keyboardActive) {
            e.currentTarget.blur();

            setFocusedSlotId(null);

            return;
          }

          setFocusedSlotId(id);
        }}
        onBlur={() => {
          setFocusedSlotId(null);
        }}
        onKeyDown={(e) => {
          if (!keyboardActive) {
            return;
          }

          /* =========================================
             TAB BETWEEN AVAILABLE SLOTS
          ========================================= */

          if (e.key === "Tab") {
            e.preventDefault();
            e.stopPropagation();

            const available = getAvailableSlotIds();

            if (available.length === 0) {
              return;
            }

            const currentIndex = available.indexOf(id);

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

            const nextSlotId = available[nextIndex];

            slotRefs.current[nextSlotId]?.focus();

            return;
          }

          /* =========================================
             ENTER / SPACE = PLACE
          ========================================= */

          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();

            onKeyboardDrop(key, index);
          }
        }}
        style={{
          position: "relative",

          outline: showKeyboardPreview ? "3px solid #2563eb" : "none",

          outlineOffset: "3px",

          background: showKeyboardPreview ? "#dbeafe" : undefined,

          transform: showKeyboardPreview ? "scale(1.04)" : "scale(1)",

          boxShadow: showKeyboardPreview
            ? "0 0 0 4px rgba(37,99,235,0.15)"
            : "none",

          transition:
            "transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease",
        }}
      >
        {/* =========================================
            KEYBOARD PREVIEW

            الكلمة الممسوكة تظهر داخل الـ input
            وتعمل blink قبل Enter.
        ========================================= */}

        {showKeyboardPreview ? (
          <span className="keyboard-word-preview" aria-hidden="true">
            {keyboardPickedItem.word}
          </span>
        ) : placedItem ? (
          <PlacedWord
            item={placedItem}
            slotId={id}
            isLocked={isLocked}
            showAnswer={showAnswer}
            checkCompleted={checkCompleted}
            onKeyboardPickPlaced={onKeyboardPickPlaced}
            placedRefs={placedRefs}
          />
        ) : (
          ""
        )}
      </div>

      {isChecked && isWrong && <span className="wrong-icon">✕</span>}
    </div>
  );
}

/* =====================================================
   MAIN COMPONENT
===================================================== */

const Unit2_Page7_Q1 = () => {
  /* =====================================================
     DATA
  ===================================================== */

  const words = [
    { word: "Good", num: 1 },
    { word: "evening", num: 2 },
    { word: "Goodbye", num: 3 },
    { word: "afternoon", num: 4 },
    { word: "!", num: 5 },
    { word: "Hello", num: 6 },
    { word: "How", num: 7 },
    { word: "morning", num: 8 },
    { word: "Fine", num: 9 },
    { word: "?", num: 10 },
    { word: "are", num: 11 },
    { word: "thank", num: 12 },
    { word: ",", num: 13 },
    { word: "I'm Helen", num: 14 },
    { word: "you", num: 15 },
    { word: ".", num: 16 },
  ];

  const correctAnswers2 = {
    a: ["How", "are", "you", "?"],

    b: ["Good", "morning", "!"],

    c: ["Fine", ",", "thank", "you", "."],

    d: ["Goodbye", "!"],

    e: ["Hello", "!", "I'm Helen", "."],

    f: ["Good", "afternoon", "!"],
  };

  const sentences = {
    a: [7, 11, 15, 10],

    b: [1, 8, 5],

    c: [9, 13, 12, 15, 16],

    d: [3, 5],

    e: [6, 5, 14, 16],

    f: [1, 4, 5],
  };

  /* =====================================================
     STATES
  ===================================================== */

  const [userAnswers, setUserAnswers] = useState({});

  const [checked, setChecked] = useState(false);

  const [showAnswer, setShowAnswer] = useState(false);

  const [wrongInputs, setWrongInputs] = useState({});

  const [lockedInputs, setLockedInputs] = useState({});

  const [checkCompleted, setCheckCompleted] = useState(false);

  const [activeId, setActiveId] = useState(null);

  /* =====================================================
     KEYBOARD ACCESSIBILITY
  ===================================================== */

  const bankRefs = useRef({});

  const slotRefs = useRef({});

  const placedRefs = useRef({});

  const [keyboardPickedItem, setKeyboardPickedItem] = useState(null);

  const [focusedBankNum, setFocusedBankNum] = useState(null);

  const [focusedSlotId, setFocusedSlotId] = useState(null);

  /* =====================================================
     GET AVAILABLE SLOT IDS
  ===================================================== */

  const getAvailableSlotIds = () => {
    const result = [];

    Object.entries(sentences).forEach(([key, arr]) => {
      arr.forEach((_, index) => {
        if (!lockedInputs[key]?.[index] && !showAnswer && !checkCompleted) {
          result.push(`slot-${key}-${index}`);
        }
      });
    });

    return result;
  };

  /* =====================================================
     GET SLOT DATA
  ===================================================== */

  const parseSlotId = (slotId) => {
    const [, key, indexStr] = slotId.split("-");

    return {
      key,
      index: Number(indexStr),
    };
  };

  /* =====================================================
     KEYBOARD PICK FROM BANK
  ===================================================== */

  const handleKeyboardPick = (item) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    setKeyboardPickedItem({
      ...item,
      source: "bank",
    });

    /*
        روح لأول input غير مقفول.

        أول ما يوصل الفوكس،
        الكلمة تظهر جواته وترمش.
      */

    setTimeout(() => {
      const available = getAvailableSlotIds();

      if (available.length > 0) {
        slotRefs.current[available[0]]?.focus();
      }
    }, 0);
  };

  /* =====================================================
     KEYBOARD PICK FROM INSIDE SLOT
  ===================================================== */

  const handleKeyboardPickPlaced = (item, sourceSlotId) => {
    if (showAnswer || checkCompleted) {
      return;
    }

    const { key, index } = parseSlotId(sourceSlotId);

    if (lockedInputs[key]?.[index]) {
      return;
    }

    setKeyboardPickedItem({
      ...item,

      source: "slot",

      sourceSlotId,
    });

    /*
        روح لأول input ثاني متاح.
      */

    setTimeout(() => {
      const available = getAvailableSlotIds();

      if (available.length > 0) {
        const nextSlot =
          available.find((id) => id !== sourceSlotId) || available[0];

        slotRefs.current[nextSlot]?.focus();
      }
    }, 0);
  };

  /* =====================================================
     KEYBOARD DROP / REPLACE / SWAP
  ===================================================== */

  const handleKeyboardDrop = (targetKey, targetIndex) => {
    if (
      !keyboardPickedItem ||
      showAnswer ||
      checkCompleted ||
      lockedInputs[targetKey]?.[targetIndex]
    ) {
      return;
    }

    const picked = keyboardPickedItem;

    const targetSlotId = `slot-${targetKey}-${targetIndex}`;

    setUserAnswers((prev) => {
      const updated = {
        ...prev,
      };

      /*
            Clone target row.
          */

      updated[targetKey] = updated[targetKey] ? [...updated[targetKey]] : [];

      /*
            القيمة القديمة بالهدف.
          */

      const oldTargetValue = updated[targetKey][targetIndex];

      /* =================================
             ITEM CAME FROM ANOTHER SLOT
             => SWAP
          ================================= */

      if (picked.source === "slot" && picked.sourceSlotId) {
        const { key: sourceKey, index: sourceIndex } = parseSlotId(
          picked.sourceSlotId,
        );

        /*
              إذا نفس الخانة:
              ما في تغيير.
            */

        if (sourceKey === targetKey && sourceIndex === targetIndex) {
          return updated;
        }

        updated[sourceKey] = updated[sourceKey] ? [...updated[sourceKey]] : [];

        /*
              swap:
              القديم من target يرجع لمكان source.
            */

        updated[sourceKey][sourceIndex] = oldTargetValue || undefined;
      }

      /*
            حط الكلمة الممسوكة بالهدف.
          */

      updated[targetKey][targetIndex] = picked.word;

      return updated;
    });

    /* =================================================
         CLEAR WRONG STATE FROM EDITED SLOTS
      ================================================= */

    setWrongInputs((prev) => {
      const updated = {
        ...prev,
      };

      if (updated[targetKey]) {
        updated[targetKey] = [...updated[targetKey]];

        updated[targetKey][targetIndex] = false;
      }

      if (picked.source === "slot" && picked.sourceSlotId) {
        const { key: sourceKey, index: sourceIndex } = parseSlotId(
          picked.sourceSlotId,
        );

        if (updated[sourceKey]) {
          updated[sourceKey] = [...updated[sourceKey]];

          updated[sourceKey][sourceIndex] = false;
        }
      }

      return updated;
    });

    setKeyboardPickedItem(null);

    setFocusedSlotId(null);

    /*
        بعد التثبيت:
        - إذا جاي من slot خلي focus على الكلمة بالمكان الجديد.
        - إذا جاي من bank رجع focus لنفس الرقم فوق.
      */

    setTimeout(() => {
      if (picked.source === "slot") {
        placedRefs.current[targetSlotId]?.focus();
      } else {
        bankRefs.current[picked.num]?.focus();
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
        delay: 150,
        tolerance: 8,
      },
    }),
  );

  /* =====================================================
     DRAG START
  ===================================================== */

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);
  };

  /* =====================================================
     DRAG END
  ===================================================== */

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);

    if (!over || showAnswer || checkCompleted) {
      return;
    }

    const overId = over.id;

    if (!overId.startsWith("slot-")) {
      return;
    }

    const { key: targetKey, index: targetIndex } = parseSlotId(overId);

    /*
        target صحيح ومقفول.
      */

    if (lockedInputs[targetKey]?.[targetIndex]) {
      return;
    }

    const activeData = active.data.current;

    if (!activeData) {
      return;
    }

    const { item, source, sourceSlotId } = activeData;

    if (!item) {
      return;
    }

    setUserAnswers((prev) => {
      const updated = {
        ...prev,
      };

      updated[targetKey] = updated[targetKey] ? [...updated[targetKey]] : [];

      const oldTargetValue = updated[targetKey][targetIndex];

      /* =========================
             DRAG FROM SLOT
             => SWAP
          ========================= */

      if (source === "slot" && sourceSlotId) {
        const { key: sourceKey, index: sourceIndex } =
          parseSlotId(sourceSlotId);

        if (lockedInputs[sourceKey]?.[sourceIndex]) {
          return prev;
        }

        if (sourceKey === targetKey && sourceIndex === targetIndex) {
          return prev;
        }

        updated[sourceKey] = updated[sourceKey] ? [...updated[sourceKey]] : [];

        updated[sourceKey][sourceIndex] = oldTargetValue || undefined;
      }

      /*
            Put item in target.
          */

      updated[targetKey][targetIndex] = item.word;

      return updated;
    });

    /* =================================================
         REMOVE WRONG ONLY FROM EDITED SLOTS
      ================================================= */

    setWrongInputs((prev) => {
      const updated = {
        ...prev,
      };

      if (updated[targetKey]) {
        updated[targetKey] = [...updated[targetKey]];

        updated[targetKey][targetIndex] = false;
      }

      if (source === "slot" && sourceSlotId) {
        const { key: sourceKey, index: sourceIndex } =
          parseSlotId(sourceSlotId);

        if (updated[sourceKey]) {
          updated[sourceKey] = [...updated[sourceKey]];

          updated[sourceKey][sourceIndex] = false;
        }
      }

      return updated;
    });
  };

  /* =====================================================
     CHECK ANSWERS
  ===================================================== */

  const checkAnswers = () => {
    if (showAnswer || checkCompleted) {
      return;
    }

    /* =============================
         CHECK ALL FILLED
      ============================= */

    for (const key in sentences) {
      const expectedLength = sentences[key].length;

      if (!userAnswers[key]) {
        ValidationAlert.info(
          "Oops!",
          "Please fill all fields before checking.",
        );

        return;
      }

      for (let i = 0; i < expectedLength; i++) {
        if (!userAnswers[key][i]) {
          ValidationAlert.info(
            "Oops!",
            "Please fill all fields before checking.",
          );

          return;
        }
      }
    }

    /* =============================
         CHECK VALUES
      ============================= */

    let tempScore = 0;

    let totalInputs = 0;

    const newWrongInputs = {};

    const newLockedInputs = {};

    for (const key in sentences) {
      totalInputs += sentences[key].length;

      newWrongInputs[key] = [];

      newLockedInputs[key] = [];

      sentences[key].forEach((_, index) => {
        const entered = userAnswers[key][index]?.toLowerCase();

        const correct = correctAnswers2[key][index].toLowerCase();

        if (entered !== correct) {
          newWrongInputs[key][index] = true;

          newLockedInputs[key][index] = false;
        } else {
          newWrongInputs[key][index] = false;

          newLockedInputs[key][index] = true;

          tempScore++;
        }
      });
    }

    /* =============================
         KEEP OLD LOCKS + NEW LOCKS
      ============================= */

    setLockedInputs((prev) => {
      const updated = {
        ...prev,
      };

      for (const key in newLockedInputs) {
        const oldRow = updated[key] ? [...updated[key]] : [];

        const newRow = newLockedInputs[key];

        updated[key] = newRow.map((value, index) => oldRow[index] || value);
      }

      return updated;
    });

    setWrongInputs(newWrongInputs);

    setChecked(true);

    setKeyboardPickedItem(null);

    setFocusedSlotId(null);

    /* =============================
         SCORE
      ============================= */

    const color =
      tempScore === totalInputs ? "green" : tempScore === 0 ? "red" : "orange";

    const msg = `
        <div style="font-size:20px;text-align:center;">
          <span style="color:${color};font-weight:bold;">
            Score: ${tempScore} / ${totalInputs}
          </span>
        </div>
      `;

    /* =============================
         ALL CORRECT
      ============================= */

    if (tempScore === totalInputs) {
      setCheckCompleted(true);

      ValidationAlert.success(msg);

      return;
    }

    if (tempScore === 0) {
      ValidationAlert.error(msg);
    } else {
      ValidationAlert.warning(msg);
    }
  };

  /* =====================================================
     SHOW ANSWER
  ===================================================== */

  const handleShowAnswer = () => {
    setUserAnswers(correctAnswers2);

    setShowAnswer(true);

    setChecked(false);

    setWrongInputs({});

    const allLocked = {};

    for (const key in sentences) {
      allLocked[key] = sentences[key].map(() => true);
    }

    setLockedInputs(allLocked);

    setCheckCompleted(true);

    setKeyboardPickedItem(null);

    setFocusedSlotId(null);
  };

  /* =====================================================
     RESET
  ===================================================== */

  const reset = () => {
    setUserAnswers({});

    setChecked(false);

    setShowAnswer(false);

    setWrongInputs({});

    setLockedInputs({});

    setCheckCompleted(false);

    setActiveId(null);

    setKeyboardPickedItem(null);

    setFocusedBankNum(null);

    setFocusedSlotId(null);
  };

  /* =====================================================
     ACTIVE WORD
  ===================================================== */

  let activeWord = null;

  if (activeId) {
    /*
      Drag from bank.
    */

    if (String(activeId).startsWith("num-")) {
      activeWord = words.find(
        (word) => word.num === Number(String(activeId).replace("num-", "")),
      )?.word;
    }

    /*
      Drag from placed slot.
    */

    if (String(activeId).startsWith("placed-")) {
      const slotId = String(activeId).replace("placed-", "");

      const { key, index } = parseSlotId(slotId);

      activeWord = userAnswers[key]?.[index];
    }
  }

  /* =====================================================
     JSX
  ===================================================== */

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
            gap: "20px",
          }}
        >
          <ExerciseHeaderReview
            sectionLetter="A"
            title="Read and write."
            subTitle="Match each number to its letter to reveal the hidden words."
          />

          {/* ============================================
              WORD BANK
          ============================================ */}

          <div className="number-word-section">
            {words.map((item) => (
              <DraggableNumber
                key={item.num}
                item={item}
                isDragDisabled={showAnswer || checkCompleted}
                keyboardPickedItem={keyboardPickedItem}
                onKeyboardPick={handleKeyboardPick}
                bankRefs={bankRefs}
                focusedBankNum={focusedBankNum}
                setFocusedBankNum={setFocusedBankNum}
              />
            ))}
          </div>

          {/* ============================================
              SENTENCE SLOTS
          ============================================ */}

          <div className="num-input-section">
            {Object.entries(sentences).map(([key, correctArray]) => (
              <div key={key} className="sentence-row">
                <span className="sentence-label">{key}</span>

                {/* NUMBERS */}

                <div className="num-container">
                  {correctArray.map((num, index) => (
                    <span key={index} className="sentence-preview">
                      {num}
                    </span>
                  ))}
                </div>

                {/* ANSWERS */}

                <div className="sentence-line">
                  {correctArray.map((_, index) => (
                    <DroppableSlot
                      key={index}
                      id={`slot-${key}-${index}`}
                      value={userAnswers[key]?.[index]}
                      words={words}
                      isWrong={!!wrongInputs[key]?.[index]}
                      isChecked={checked}
                      isLocked={!!lockedInputs[key]?.[index]}
                      showAnswer={showAnswer}
                      checkCompleted={checkCompleted}
                      keyboardPickedItem={keyboardPickedItem}
                      focusedSlotId={focusedSlotId}
                      setFocusedSlotId={setFocusedSlotId}
                      slotRefs={slotRefs}
                      placedRefs={placedRefs}
                      getAvailableSlotIds={getAvailableSlotIds}
                      onKeyboardDrop={handleKeyboardDrop}
                      onKeyboardPickPlaced={handleKeyboardPickPlaced}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================
            BUTTONS
        ============================================ */}

        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>

          <button onClick={handleShowAnswer} className="show-answer-btn">
            Show Answer
          </button>

          <button onClick={checkAnswers} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>

      {/* ============================================
          DRAG OVERLAY
      ============================================ */}

      <DragOverlay>
        {activeWord ? (
          <div
            style={{
              padding: "6px 14px",

              background: "#fff",

              border: "2px solid #4a90e2",

              borderRadius: "8px",

              fontWeight: "bold",

              fontSize: "16px",

              width: "110px",

              textAlign: "center",

              boxShadow: "0 4px 16px rgba(0,0,0,0.18)",

              pointerEvents: "none",

              userSelect: "none",
            }}
          >
            {activeWord}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Unit2_Page7_Q1;
