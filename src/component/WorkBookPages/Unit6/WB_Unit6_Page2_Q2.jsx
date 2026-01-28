import React, { useState, useRef } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit6_Page2_Q2.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// 🔹 الصور
import img1 from "../../../assets/U1 WB/U6/U6P34EXED-01.svg";
import img2 from "../../../assets/U1 WB/U6/U6P34EXED-02.svg";
import img3 from "../../../assets/U1 WB/U6/U6P34EXED-03.svg";
import img4 from "../../../assets/U1 WB/U6/U6P34EXED-04.svg";

/* ================= DATA ================= */

const leftParts = [
  { id: 1, text: "He can’t" },
  { id: 2, text: "He can’t" },
  { id: 3, text: "It can’t" },
  { id: 4, text: "I can" },
];

const images = [
  { id: "img1", src: img1 },
  { id: "img2", src: img2 },
  { id: "img3", src: img3 },
  { id: "img4", src: img4 },
];

const rightParts = [
  { id: "r1", text: "sail a boat." },
  { id: "r2", text: "climb a tree." },
  { id: "r3", text: "swim." },
  { id: "r4", text: "ride a bike." },
];

const correctMatches = [
  { leftId: 1, right: "ride a bike.", image: "img3" },
  { leftId: 2, right: "sail a boat.", image: "img4" },
  { leftId: 3, right: "climb a tree.", image: "img2" },
  { leftId: 4, right: "swim.", image: "img1" },
];

const correctSentences = {
  1: "He can’t ride a bike.",
  2: "It can’t climb a tree.",
  3: "He can’t sail a boat.",
  4: "I can swim.",
};

/* ================= COMPONENT ================= */

const WB_Unit6_Page2_Q2 = () => {
  const containerRef = useRef(null);

  const [lines, setLines] = useState([]);
  const [firstPoint, setFirstPoint] = useState(null);
  const [wrongLeft, setWrongLeft] = useState([]);
  const [written, setWritten] = useState({});
  const [locked, setLocked] = useState(false);
  const [checked, setChecked] = useState(false);
  const [wrongInputs, setWrongInputs] = useState([]);

  const onDragEnd = (result) => {
    if (!result.destination || locked || checked) return;

    const sentence = result.draggableId;
    const dest = result.destination.droppableId;

    // dest مثال: write-2
    if (!dest.startsWith("write-")) return;

    const id = dest.replace("write-", "");

    setWritten((prev) => {
      const updated = { ...prev };

      // ⭐ شيل الجملة من أي مكان قديم
      Object.keys(updated).forEach((key) => {
        if (updated[key] === sentence) delete updated[key];
      });

      updated[id] = sentence;
      return updated;
    });
  };

  /* ================= HELPERS ================= */

  const getDotCenter = (parent, selector) => {
    const rect = containerRef.current.getBoundingClientRect();
    const dot = parent.querySelector(selector);
    if (!dot) return null;

    const r = dot.getBoundingClientRect();
    return {
      x: r.left - rect.left + r.width / 2,
      y: r.top - rect.top + r.height / 2,
    };
  };
  const getCenter = (el) => {
    const rect = containerRef.current.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return {
      x: r.left - rect.left + r.width / 2,
      y: r.top - rect.top + r.height / 2,
    };
  };
  const getDotCenterFromParent = (parent, dotSelector) => {
    const dot = parent.querySelector(dotSelector);
    if (!dot) return null;
    return getCenter(dot);
  };

  /* ================= CLICK HANDLERS ================= */
  const handleStart = (e) => {
    if (locked) return;

    const data = e.currentTarget.dataset;

    let type = null;
    if (data.leftId) type = "left";
    else if (data.image) type = "image";
    else if (data.right) type = "right";

    let pos = null;

    if (type === "left") {
      pos = getDotCenterFromParent(e.currentTarget, ".start-dot");
    } else if (type === "image") {
      pos = getDotCenterFromParent(e.currentTarget, ".start-dot");
    } else {
      return;
    }

    if (!pos) return;

    setFirstPoint({
      type,
      leftId: data.leftId ? Number(data.leftId) : null,
      image: data.image || null,
      x: pos.x,
      y: pos.y,
    });
  };

  const handleEnd = (e) => {
    if (!firstPoint || locked) return;

    const data = e.currentTarget.dataset;

    let endType = null;
    if (data.leftId) endType = "left";
    else if (data.image) endType = "image";
    else if (data.right) endType = "right";

    if (firstPoint.type === "left" && endType !== "image") {
      setFirstPoint(null);
      return;
    }

    if (firstPoint.type === "image" && endType !== "right") {
      setFirstPoint(null);
      return;
    }

    let pos = null;
    if (endType === "image" || endType === "right") {
      pos = getDotCenterFromParent(e.currentTarget, ".end-dot");
    }

    if (!pos) return;

    const newLine = {
      x1: firstPoint.x,
      y1: firstPoint.y,
      x2: pos.x,
      y2: pos.y,
      leftId: firstPoint.leftId,
      image: firstPoint.image || data.image,
      right: data.right || null,
    };

    setLines((prev) => [...prev, newLine]);

    if (firstPoint.type === "left" && endType === "image") {
      const startFromImagePos = getDotCenterFromParent(
        e.currentTarget,
        ".start-dot",
      );

      setFirstPoint({
        type: "image",
        image: data.image,
        x: startFromImagePos?.x ?? pos.x,
        y: startFromImagePos?.y ?? pos.y,
      });
    } else {
      setFirstPoint(null);
    }
  };

  /* ================= CHECK ================= */

  const checkAnswers = () => {
    if (checked || locked) return;
    // 🔴 Check empty inputs
    const emptyInputs = Object.keys(correctSentences).filter(
      (id) => !written[id] || written[id].trim() === "",
    );

    if (emptyInputs.length > 0) {
      ValidationAlert.info(
        "Pay attention!",
        "Please complete all the sentences before checking.",
      );
      return;
    }

    if (lines.length < correctMatches.length * 2) {
      ValidationAlert.info(
        "Pay attention!",
        "Please connect all the pairs before checking.",
      );
      return;
    }

    let score = 0;
    let wrong = [];
    let wrongInputsArr = [];

    Object.entries(correctSentences).forEach(([id, text]) => {
      const userVal = written[id]?.trim().toLowerCase() || "";
      if (userVal && userVal !== text.toLowerCase()) {
        wrongInputsArr.push(Number(id));
      }
    });

    setWrongInputs(wrongInputsArr);

    correctMatches.forEach((c) => {
      const leftToImg = lines.find(
        (l) => l.leftId === c.leftId && l.image === c.image,
      );

      const imgToRight = lines.find(
        (l) => l.image === c.image && l.right === c.right,
      );

      if (leftToImg && imgToRight) {
        score++;
      } else {
        wrong.push(c.leftId);
      }
    });

    Object.entries(correctSentences).forEach(([id, text]) => {
      if (written[id]?.trim().toLowerCase() === text.toLowerCase()) {
        score++;
      }
    });

    setWrongLeft(wrong);
    setChecked(true);
    setLocked(true);

    const total = correctMatches.length + Object.keys(correctSentences).length;
    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    ValidationAlert[
      score === total ? "success" : score === 0 ? "error" : "warning"
    ](
      `<div style="font-size:20px;text-align:center;color:${color}">
        <b>Score: ${score} / ${total}</b>
      </div>`,
    );
  };

  /* ================= SHOW ANSWER ================= */

  const showAnswer = () => {
    const finalLines = [];

    correctMatches.forEach((c) => {
      // العناصر
      const leftEl = document.querySelector(`[data-left-id="${c.leftId}"]`);
      const imgEl = document.querySelector(`[data-image="${c.image}"]`);
      const rightEl = document.querySelector(`[data-right="${c.right}"]`);

      if (!leftEl || !imgEl || !rightEl) return;

      // 🔹 Left → Image
      const leftDot = getDotCenter(leftEl, ".start-dot");
      const imageLeftDot = getDotCenter(imgEl, ".end-dot");

      if (leftDot && imageLeftDot) {
        finalLines.push({
          x1: leftDot.x,
          y1: leftDot.y,
          x2: imageLeftDot.x,
          y2: imageLeftDot.y,
        });
      }

      // 🔹 Image → Right
      const imageRightDot = getDotCenter(imgEl, ".start-dot");
      const rightDot = getDotCenter(rightEl, ".end-dot");

      if (imageRightDot && rightDot) {
        finalLines.push({
          x1: imageRightDot.x,
          y1: imageRightDot.y,
          x2: rightDot.x,
          y2: rightDot.y,
        });
      }
    });

    setLines(finalLines);
    setWritten(correctSentences);
    setLocked(true);
    setChecked(true);
  };

  /* ================= RESET ================= */

  const reset = () => {
    setLines([]);
    setWritten({});
    setWrongLeft([]);
    setLocked(false);
    setChecked(false);
    setFirstPoint(null);
  };

  /* ================= RENDER ================= */

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "30px",
        }}
      >
        <div
          className="div-forall"
          style={{
            width: "60%",
            display: "flex",
            flexDirection: "column",
            // gap: "20px",
          }}
        >
          <h4 className="header-title-page8">
            <span className="ex-A">D</span> Read, match, and write.
          </h4>
          <Droppable droppableId="sentence-bank" direction="vertical">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  display: "flex",
                  gap: "10px",
                  padding: "10px",
                  border: "2px dashed #ccc",
                  borderRadius: "10px",
                  // margin: "10px 0",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {Object.values(correctSentences).map((sentence, i) => {
                  return (
                    <Draggable
                      key={sentence}
                      draggableId={sentence}
                      index={i}
                      isDragDisabled={locked || checked}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            padding: "2px 5px",
                            border: "2px solid #2c5287",
                            borderRadius: "8px",
                            background: "white",
                            fontWeight: "bold",
                            cursor: "grab",
                            ...provided.draggableProps.style,
                          }}
                        >
                          {sentence}
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div className="matching-area" ref={containerRef}>
            {/* LEFT */}
            <div className="left-col-wb-unit6-p2-q2">
              {leftParts.map((l, i) => (
                <div
                  key={i}
                  className="item-wb-unit6-p2-q2 clickable"
                  data-left-id={l.id}
                  onClick={handleStart}
                >
                  <span className="num-wb-unit6-p2-q2">{i + 1}</span>
                  <span
                    className={`word-text-wb-unit6-p2-q2 ${
                      locked || checked ? "disabled-word" : ""
                    }`}
                  >
                    {l.text}
                  </span>
                  <div className="dot-wb-unit6-p2-q2 start-dot" />
                  {wrongLeft.includes(l.id) && checked && (
                    <span className="wrong-mark-wb-unit6-p2-q2">✕</span>
                  )}
                </div>
              ))}
            </div>

            {/* IMAGES */}
            <div className="mid-col-wb-unit6-p2-q2">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="item-wb-unit6-p2-q2 clickable"
                  data-image={img.id}
                  onClick={(e) => (firstPoint ? handleEnd(e) : handleStart(e))}
                >
                  <div className="dot-wb-unit6-p2-q2 end-dot" />
                  <img
                    src={img.src}
                    alt=""
                    className={`matched-img2 ${
                      locked || checked ? "disabled-hover" : ""
                    }`}
                  />

                  <div className="dot-wb-unit6-p2-q2 start-dot" />
                </div>
              ))}
            </div>

            {/* RIGHT */}
            <div className="right-col-wb-unit6-p2-q2">
              {rightParts.map((r) => (
                <div
                  key={r.id}
                  className="item-wb-unit6-p2-q2 clickable"
                  data-right={r.text}
                  onClick={handleEnd}
                >
                  <div className="dot-wb-unit6-p2-q2 end-dot" />
                  <span
                    className={`word-text-wb-unit6-p2-q2 ${
                      locked || checked ? "disabled-word" : ""
                    }`}
                  >
                    {" "}
                    {r.text}
                  </span>
                </div>
              ))}
            </div>

            {/* LINES */}
            <svg className="lines-layer">
              {lines.map((l, i) => (
                <line key={i} {...l} stroke="red" strokeWidth="3" />
              ))}
            </svg>
          </div>

          {/* WRITE SECTION */}
          <div className="write-section-wb-unit6-p2-q2">
            {Object.keys(correctSentences).map((id) => (
              <div className="write-line-wb-unit6-p2-q2">
                <span>{id}</span>

                <div className="input-wrapper-wb-unit6-p2-q2">
                  <Droppable droppableId={`write-${id}`}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`write-drop-wb-unit6-p2-q2  ${
                          snapshot.isDraggingOver ? "drag-over-cell" : ""
                        }`}
                        style={{
                          background: snapshot.isDraggingOver ? "#e3f2fd" : "",
                        }}
                      >
                        {written[id] || ""}

                        {checked && wrongInputs.includes(Number(id)) && (
                          <span className="wrong-input-mark-wb-unit6-p2-q2">
                            ✕
                          </span>
                        )}

                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* BUTTONS */}
        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>
          <button onClick={showAnswer} className="show-answer-btn">
            Show Answer
          </button>
          <button onClick={checkAnswers} className="check-button2">
            Check Answer ✓
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default WB_Unit6_Page2_Q2;
