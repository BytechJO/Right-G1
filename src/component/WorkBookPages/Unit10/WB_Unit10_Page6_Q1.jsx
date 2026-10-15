import React, { useState } from "react";
import "./WB_Unit10_Page6_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import img1 from "../../../assets/U1 WB/U10/U10P62EXEA-01.svg";
import img2 from "../../../assets/U1 WB/U10/U10P62EXEA-02.svg";
import img3 from "../../../assets/U1 WB/U10/U10P62EXEA-03.svg";
import img4 from "../../../assets/U1 WB/U10/U10P62EXEA-04.svg";
import img5 from "../../../assets/U1 WB/U10/U10P62EXEA-05.svg";
import img6 from "../../../assets/U1 WB/U10/U10P62EXEA-06.svg";
import eggAudio from "../../../assets/U1 WB/U10/audio/page62- A/egg.mp3";
import netAudio from "../../../assets/U1 WB/U10/audio/page62- A/net.mp3";
import jetAudio from "../../../assets/U1 WB/U10/audio/page62- A/jet.mp3";
import bedAudio from "../../../assets/U1 WB/U10/audio/page62- A/bed.mp3";
import henAudio from "../../../assets/U1 WB/U10/audio/page62- A/hen.mp3";
import tenAudio from "../../../assets/U1 WB/U10/audio/page62- A/ten.mp3";
import PlayingAudioIcon from "./Unit10PlayingAudioIcon";
import useUnit10Audio from "./useUnit10Audio";
import useUnit10TabDrag from "./useUnit10TabDrag";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";

const data = [
  {
    img: img1,
    alt: "An egg",
    scrambled: "geg",
    answer: "egg",
    audio: eggAudio,
  },
  {
    img: img2,
    alt: "A fishing net",
    scrambled: "ent",
    answer: "net",
    audio: netAudio,
  },
  {
    img: img3,
    alt: "A jet airplane",
    scrambled: "tej",
    answer: "jet",
    audio: jetAudio,
  },
  { img: img4, alt: "A bed", scrambled: "ebd", answer: "bed", audio: bedAudio },
  { img: img5, alt: "A hen", scrambled: "neh", answer: "hen", audio: henAudio },
  {
    img: img6,
    alt: "The number ten",
    scrambled: "nte",
    answer: "ten",
    audio: tenAudio,
  },
];

// ─── حرف قابل للسحب من الـ scrambled ────────────────────────────────────────
const LetterChip = ({ id, letter, used, locked, selected, tabDrag }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
    disabled: used || locked,
  });

  return (
    <div
      ref={(element) => {
        setNodeRef(element);
        tabDrag.registerItem(id, element);
      }}
      {...listeners}
      {...attributes}
      role="button"
      tabIndex={used || locked ? -1 : 0}
      aria-label={`Letter ${letter}. Press Enter to place it.`}
      onKeyDown={(event) => tabDrag.handleItemKeyDown(event, id)}
      className={selected ? "wb-unit10-keyboard-preview" : ""}
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        border: "2px solid #2c5287",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        cursor: used || locked ? "not-allowed" : "grab",
        background: used ? "#e0e0e0" : "white",
        color: used ? "#aaa" : "",
        opacity: isDragging ? 0.3 : used ? 0.45 : 1,
        userSelect: "none",
        transition: "opacity 0.2s, background 0.2s",
        touchAction: "none",
        flexShrink: 0,
      }}
    >
      {letter}
    </div>
  );
};

// ─── Drop zone (المكان اللي تحط فيه الحروف) ──────────────────────────────────
const DropZone = ({
  id,
  placedIds,
  isWrong,
  locked,
  onRemoveLetter,
  previewLetter,
  tabDrag,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id, disabled: locked });

  // استخرج الحرف من الـ id: "0-g-0" → "g"
  return (
    <div
      ref={(element) => {
        setNodeRef(element);
        tabDrag.registerTarget(id, element);
      }}
      role="button"
      tabIndex={
        !locked && (tabDrag.keyboardItemId || placedIds.length) ? 0 : -1
      }
      aria-label="Answer area. Press Enter to place the selected letter."
      onKeyDown={(event) => tabDrag.handleTargetKeyDown(event, id)}
      onFocus={() => tabDrag.focusTarget(id)}
      className={`text-input ${isOver ? "drag-over-cell" : ""}`}
      style={{
        display: "flex",
        gap: "4px",
        minHeight: "44px",
        alignItems: "center",
        padding: "4px 8px",
        // borderRadius: "8px",
        background: isOver ? "#e3f2fd" : "white",
        borderBottom: `2px solid black`,
        transition: "background 0.15s, border-color 0.15s",
        flexWrap: "wrap",
      }}
    >
      {placedIds.map((pid) => {
        const letter = pid.split("-")[1];
        return (
          <div
            key={pid}
            role="button"
            tabIndex={locked ? -1 : 0}
            aria-label={`Return letter ${letter}`}
            style={{
              // width: 34,
              // height: 34,
              // borderRadius: "50%",
              // border: "2px solid #2c5287",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              // background: "#dbeafe",
              // color: "#2c5287",
              fontSize: "18px",
              cursor: locked ? "default" : "pointer",
              userSelect: "none",
            }}
            title={locked ? "" : "Click to remove"}
            onClick={() => !locked && onRemoveLetter(pid)}
            onKeyDown={(event) => {
              if ((event.key === "Enter" || event.key === " ") && !locked) {
                event.preventDefault();
                onRemoveLetter(pid);
                tabDrag.focusItemById(pid);
              }
            }}
          >
            {letter}
          </div>
        );
      })}
      {previewLetter && (
        <span className="wb-unit10-keyboard-preview" aria-hidden="true">
          {previewLetter}
        </span>
      )}

      {/* علامة الخطأ */}
      {isWrong && <div className="review3-p1-q3-x">✕</div>}
    </div>
  );
};

// ─── Main component ────────────────────────────────────────────────────────────
const WB_Unit10_Page6_Q1 = () => {
  // inputs[i] = مصفوفة IDs الحروف اللي انحطت في الـ drop zone للسؤال i
  const [inputs, setInputs] = useState(
    Array.from({ length: data.length }, () => []),
  );
  const [wrongInputs, setWrongInputs] = useState(
    Array(data.length).fill(false),
  );
  const [locked, setLocked] = useState(false);
  const [lockedRows, setLockedRows] = useState(new Set());
  const [completedRows, setCompletedRows] = useState(new Set());
  const [activeLetter, setActiveLetter] = useState(null); // { id, letter }
  const { activeAudioKey, playAudio, stopAudio } = useUnit10Audio();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  // كل IDs المستخدمة في أي drop zone
  const usedIds = inputs.flat();
  const itemIds = data.flatMap((item, index) =>
    item.scrambled
      .split("")
      .map((letter, letterIndex) => `${index}-${letter}-${letterIndex}`),
  );
  const targetIds = data.map((_, index) => `drop-${index}`);

  const placeLetter = (qIndex, letterId) => {
    if (locked || lockedRows.has(qIndex) || usedIds.includes(letterId)) return;
    if (inputs[qIndex].length >= data[qIndex].answer.length) return;
    setInputs((prev) => {
      const copy = prev.map((arr) => [...arr]);
      copy[qIndex] = [...copy[qIndex], letterId];
      return copy;
    });
    setWrongInputs((prev) =>
      prev.map((value, index) => (index === qIndex ? false : value)),
    );
  };

  const tabDrag = useUnit10TabDrag({
    itemIds,
    targetIds,
    getTargetIds: (id) => (id ? [`drop-${id.split("-")[0]}`] : []),
    getItemIdsForItem: (id) =>
      itemIds.filter((itemId) => itemId.startsWith(`${id?.split("-")[0]}-`)),
    isItemDisabled: (id) => {
      const row = Number(id.split("-")[0]);
      return locked || lockedRows.has(row) || usedIds.includes(id);
    },
    isTargetDisabled: (id) => {
      const row = Number(id.replace("drop-", ""));
      return (
        locked ||
        lockedRows.has(row) ||
        inputs[row].length >= data[row].answer.length
      );
    },
    onPlace: (letterId, targetId) =>
      placeLetter(Number(targetId.replace("drop-", "")), letterId),
  });

  // ─── إزالة حرف من الـ drop zone (كبسة) ───────────────────────────────────
  const removeLetter = (qIndex, letterId) => {
    setInputs((prev) => {
      const copy = prev.map((arr) => [...arr]);
      copy[qIndex] = copy[qIndex].filter((id) => id !== letterId);
      return copy;
    });
    setWrongInputs(Array(data.length).fill(false));
  };

  // ─── Drag start ────────────────────────────────────────────────────────────
  const handleDragStart = (event) => {
    const id = event.active.id;
    const letter = id.split("-")[1];
    setActiveLetter({ id, letter });
  };

  // ─── Drag end ──────────────────────────────────────────────────────────────
  const handleDragEnd = (event) => {
    setActiveLetter(null);
    if (locked) return;

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id; // مثلاً "0-g-0"
    const dest = over.id; // مثلاً "drop-0"

    if (!dest.startsWith("drop-")) return;

    const qIndex = Number(dest.replace("drop-", ""));
    if (Number.isNaN(qIndex)) return;

    // تأكد الحرف من نفس السؤال
    const fromQIndex = Number(activeId.split("-")[0]);
    if (fromQIndex !== qIndex) return;

    // لا تضيف نفس الحرف مرتين
    if (usedIds.includes(activeId)) return;

    // لا تزيد عن طول الإجابة
    if (inputs[qIndex].length >= data[qIndex].answer.length) return;

    placeLetter(qIndex, activeId);
  };

  // ─── Check ─────────────────────────────────────────────────────────────────
  const checkAnswers = () => {
    if (locked) return;

    if (inputs.some((arr) => arr.length === 0)) {
      ValidationAlert.info("Please fill in all the answers before checking.");
      return;
    }

    let correctCount = 0;
    const wrongFlags = data.map((item, i) => {
      const word = inputs[i]
        .map((id) => id.split("-")[1])
        .join("")
        .toLowerCase();
      if (word === item.answer) {
        correctCount++;
        return false;
      }
      return true;
    });

    setWrongInputs(wrongFlags);
    const correctRows = new Set(lockedRows);
    wrongFlags.forEach((isWrong, index) => {
      if (!isWrong) correctRows.add(index);
    });
    setLockedRows(correctRows);
    setCompletedRows(correctRows);

    const total = data.length;
    const msg = `Score: ${correctCount} / ${total}`;
    if (correctCount === total) ValidationAlert.success(msg);
    else if (correctCount === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };

  const handleShowAnswer = () => {
    const correct = data.map((item, qIndex) => {
      const scrambledIds = item.scrambled.split("").map((ch, i) => ({
        id: `${qIndex}-${ch}-${i}`,
        letter: ch,
        used: false,
      }));

      return item.answer
        .split("")
        .map((answerLetter) => {
          const match = scrambledIds.find(
            (item) =>
              item.letter.toLowerCase() === answerLetter.toLowerCase() &&
              !item.used,
          );

          if (!match) return null;

          match.used = true;

          return match.id;
        })
        .filter(Boolean);
    });

    setInputs(correct);

    setWrongInputs(Array(data.length).fill(false));

    setLocked(true);

    setLockedRows(new Set(data.map((_, index) => index)));

    setCompletedRows(new Set(data.map((_, index) => index)));
  };

  const reset = () => {
    setInputs(Array.from({ length: data.length }, () => []));
    setWrongInputs(Array(data.length).fill(false));
    setLocked(false);
    setLockedRows(new Set());
    setCompletedRows(new Set());
    stopAudio();
  };

  return (
    <DndContext
      sensors={sensors}
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
        <div className="div-forall" style={{ gap: "30px" }}>
          <ExerciseHeader
            sectionLetter="A"
            title="Look, unscramble, and write."
            subTitle="Use each picture to arrange the letters into egg, net, jet, bed, hen, and ten."
          />

          <div className="unscramble-row-wb-unit10-p6-q1 w-full">
            {data.map((item, index) => (
              <div
                className={`unscramble-box-wb-unit10-p6-q1 ${completedRows.has(index) ? "wb-unit10-audio-control" : ""}`}
                key={index}
                role={completedRows.has(index) ? "button" : undefined}
                tabIndex={completedRows.has(index) ? 0 : undefined}
                aria-label={
                  completedRows.has(index) ? `Play ${item.answer}` : undefined
                }
                onClick={
                  completedRows.has(index)
                    ? () => playAudio(`word-${index}`, item.audio)
                    : undefined
                }
                onKeyDown={
                  completedRows.has(index)
                    ? (event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          playAudio(`word-${index}`, item.audio);
                        }
                      }
                    : undefined
                }
              >
                {completedRows.has(index) && (
                  <PlayingAudioIcon
                    active={activeAudioKey === `word-${index}`}
                  />
                )}
                {/* الصورة والرقم */}
                <div className="img-box-wb-unit10-p6-q1">
                  <span
                    className="num"
                    style={{ fontSize: "25px", fontWeight: "600" }}
                  >
                    {index + 1}
                  </span>
                  <img
                    src={item.img}
                    alt={item.alt}
                    className="img-wb-unit10-p6-q1"
                  />
                </div>

                <div className="input-row">
                  {/* ─── الحروف المبعثرة ─── */}
                  <span className="pattern" style={{ fontSize: "22px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {item.scrambled.split("").map((ch, i) => {
                        const id = `${index}-${ch}-${i}`;
                        return (
                          <LetterChip
                            key={id}
                            id={id}
                            letter={ch}
                            used={usedIds.includes(id)}
                            locked={locked || lockedRows.has(index)}
                            selected={tabDrag.keyboardItemId === id}
                            tabDrag={tabDrag}
                          />
                        );
                      })}
                    </div>
                  </span>

                  {/* ─── Drop zone ─── */}
                  <div className="input-wrapper">
                    <DropZone
                      id={`drop-${index}`}
                      placedIds={inputs[index]}
                      isWrong={wrongInputs[index]}
                      locked={locked || lockedRows.has(index)}
                      previewLetter={
                        tabDrag.keyboardTargetId === `drop-${index}`
                          ? tabDrag.keyboardItemId?.split("-")[1]
                          : ""
                      }
                      tabDrag={tabDrag}
                      onRemoveLetter={(letterId) =>
                        removeLetter(index, letterId)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Buttons ──────────────────────────────────────────────────── */}
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

      {/* ─── Drag Overlay ─────────────────────────────────────────────── */}
      <DragOverlay>
        {activeLetter ? (
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "2px solid #2c5287",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              background: "white",
              color: "#2c5287",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              cursor: "grabbing",
            }}
          >
            {activeLetter.letter}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit10_Page6_Q1;
