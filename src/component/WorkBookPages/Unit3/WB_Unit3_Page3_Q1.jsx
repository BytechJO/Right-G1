import React, { useState, useRef, useEffect } from "react";
import bat from "../../../assets/U1 WB/U3/SVG/U3P17EXEE-01.svg";
import cap from "../../../assets/U1 WB/U3/SVG/U3P17EXEE-02.svg";
import ant from "../../../assets/U1 WB/U3/SVG/U3P17EXEE-03.svg";
import dad from "../../../assets/U1 WB/U3/SVG/U3P17EXEE-04.svg";
import dad2 from "../../../assets/U1 WB/U3/SVG/U3P17EXEE-05.svg";
import dad3 from "../../../assets/U1 WB/U3/SVG/U3P17EXEE-06.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./WB_Unit3_Page3_Q1.css";
const WB_Unit3_Page3_Q1 = () => {
  const correctAnswers = [
    "Take out your pencil.",
    "Listen!",
    "Make a line.",
    "Open your book.",
    "Quiet!",
    "Close your book.",
  ];
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  const [answers, setAnswers] = useState(["", "", "", "", "", ""]);
  const [wrongInputs, setWrongInputs] = useState([]);
  const [locked, setLocked] = useState(false);
  const [shuffledWords, setShuffledWords] = useState([]);
  const [bank, setBank] = useState([]);
  const [slots, setSlots] = useState(Array(6).fill(null));
  useEffect(() => {
    setBank(shuffleArray(correctAnswers));
    setSlots(Array(6).fill(null));
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination || locked) return;

    const { source, destination } = result;

    // لازم يكون الإسقاط على slot
    if (!destination.droppableId.startsWith("slot-")) return;

    const targetIndex = Number(destination.droppableId.replace("slot-", ""));

    let draggedItem = null;

    // 🟢 جاي من البنك (نسخ)
    if (source.droppableId === "bank") {
      draggedItem = bank[source.index];
    }

    // 🟡 جاي من slot ثاني (نقل)
    if (source.droppableId.startsWith("slot-")) {
      const fromIndex = Number(source.droppableId.replace("slot-", ""));
      draggedItem = slots[fromIndex];

      // نشيلها من مكانها القديم
      setSlots((prev) => {
        const copy = [...prev];
        copy[fromIndex] = null;
        return copy;
      });
    }

    if (!draggedItem) return;

    setSlots((prev) => {
      const copy = [...prev];

      // ❌ منع تكرار نفس الكلمة بأكثر من slot
      const existingIndex = copy.findIndex((item) => item === draggedItem);

      if (existingIndex !== -1) {
        copy[existingIndex] = null; // نشيلها من مكانها القديم
      }

      // ✅ نحطها بالمكان الجديد
      copy[targetIndex] = draggedItem;

      return copy;
    });
  };

  const normalizeText = (text) => {
    return text
      .toLowerCase() // تجاهل capital / small
      .replace(/[.!?]/g, "") // حذف النقاط وعلامات التعجب والاستفهام
      .replace(/\s+/g, " ") // توحيد المسافات
      .trim(); // حذف الفراغات من البداية والنهاية
  };

  const checkAnswers = () => {
    if (locked) return;

    if (slots.some((s) => !s)) {
      ValidationAlert.info("Please fill in all the blanks before checking!");
      return;
    }

    let correct = 0;
    let wrong = [];

    slots.forEach((s, i) => {
      if (normalizeText(s) === normalizeText(correctAnswers[i])) {
        correct++;
      } else {
        wrong.push(i);
      }
    });

    setWrongInputs(wrong);
    setLocked(true);

    const total = correctAnswers.length;
    const color =
      correct === total ? "green" : correct === 0 ? "red" : "orange";

    ValidationAlert[
      correct === total ? "success" : correct === 0 ? "error" : "warning"
    ](`
    <div style="font-size:20px;text-align:center;">
      <span style="color:${color};font-weight:bold;">
        Score: ${correct} / ${total}
      </span>
    </div>
  `);
  };

  const showAnswers = () => {
    setSlots([...correctAnswers]);
    setWrongInputs([]);
    setLocked(true);
  };

  const reset = () => {
    setBank(shuffleArray(correctAnswers));
    setSlots(Array(6).fill(null));
    setWrongInputs([]);
    setLocked(false);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        className="question-wrapper-unit3-page6-q1"
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
              gap: "10px",
            width: "60%",
            justifyContent: "flex-start",
          }}
        >
          <h5 className="header-title-page8">
            <span className="ex-A">E</span>Look, read, and write.
          </h5>

          <Droppable droppableId="bank" direction="vertical">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  display: "grid",
                  gap: "10px",
                  padding: "10px",
                  border: "2px dashed #ccc",
                  borderRadius: "10px",
                  // margin: "10px 0",
                  alignItems: "center",
                  gridTemplateColumns:"1fr 1fr 1fr"
                }}
              >
                {bank.map((w, i) => (
                  <Draggable draggableId={`bank-${i}`} index={i} key={w} isDragDisabled={locked}>
                    {(provided) => (
                      <span
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          padding: "7px 7px",
                          border: "2px solid #2c5287",
                          borderRadius: "8px",
                          background: "white",
                          fontWeight: "bold",
                          cursor: "grab",
                          ...provided.draggableProps.style,
                        }}
                      >
                        {w}
                      </span>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div className="row-content10-wb-unit3-page3-q1">
            <div
              className="row2-unit3-page6-q1"
              style={{ alignItems: "flex-start" }}
            >
              <div style={{ display: "flex", gap: "10px" }}>
                <span className="num-span">1</span>
                <img src={bat} alt="" className="q-img-wb-unit3-page3-q2" />
              </div>

              <Droppable droppableId="slot-0" isDropDisabled={locked}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`q-input-wb-unit3-page3-q1 ${
                      snapshot.isDraggingOver ? "drag-over-cell" : ""
                    }`}
                    style={{
                      background: snapshot.isDraggingOver ? "#e3f2fd" : "white",
                    }}
                  >
                    {slots[0] && (
                      <Draggable draggableId={`slot-0`} index={0} isDragDisabled={true}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {slots[0]}
                          </div>
                        )}
                      </Draggable>
                    )}
                    {provided.placeholder}
                    {wrongInputs.includes(0) && (
                      <span className="error-mark-input-wb-unit2-page3-q2">
                        ✕
                      </span>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
            <div
              className="row2-unit3-page6-q1"
              style={{ alignItems: "flex-start" }}
            >
              <div style={{ display: "flex", gap: "10px" }}>
                <span className="num-span">2</span>
                <img src={cap} alt="" className="q-img-wb-unit3-page3-q2" />
              </div>

              <Droppable droppableId="slot-1" isDropDisabled={locked}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`q-input-wb-unit3-page3-q1 ${
                      snapshot.isDraggingOver ? "drag-over-cell" : ""
                    }`}
                    style={{
                      background: snapshot.isDraggingOver ? "#e3f2fd" : "white",
                    }}
                  >
                    {slots[1] && (
                      <Draggable draggableId={`slot-1`} index={0} isDragDisabled={true}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {slots[1]}
                          </div>
                        )}
                      </Draggable>
                    )}
                    {provided.placeholder}{" "}
                    {wrongInputs.includes(1) && (
                      <span className="error-mark-input-wb-unit2-page3-q2">
                        ✕
                      </span>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
            <div
              className="row2-unit3-page6-q1"
              style={{ alignItems: "flex-start" }}
            >
              <div style={{ display: "flex", gap: "10px" }}>
                <span className="num-span">3</span>{" "}
                <img src={ant} alt="" className="q-img-wb-unit3-page3-q2" />
              </div>

              <Droppable droppableId="slot-2" isDropDisabled={locked}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                   className={`q-input-wb-unit3-page3-q1 ${
                      snapshot.isDraggingOver ? "drag-over-cell" : ""
                    }`}
                    style={{
                      background: snapshot.isDraggingOver ? "#e3f2fd" : "white",
                    }}
                  >
                    {slots[2] && (
                      <Draggable draggableId={`slot-2`} index={0} isDragDisabled={true}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {slots[2]}
                          </div>
                        )}
                      </Draggable>
                    )}
                    {provided.placeholder}{" "}
                    {wrongInputs.includes(2) && (
                      <span className="error-mark-input-wb-unit2-page3-q2">
                        ✕
                      </span>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
            <div
              className="row2-unit3-page6-q1"
              style={{ alignItems: "flex-start" }}
            >
              <div style={{ display: "flex", gap: "10px" }}>
                <span className="num-span">4</span>

                <img src={dad} alt="" className="q-img-wb-unit3-page3-q2" />
              </div>

              <Droppable droppableId="slot-3" isDropDisabled={locked}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                   className={`q-input-wb-unit3-page3-q1 ${
                      snapshot.isDraggingOver ? "drag-over-cell" : ""
                    }`}
                    style={{
                      background: snapshot.isDraggingOver ? "#e3f2fd" : "white",
                    }}
                  >
                    {slots[3] && (
                      <Draggable draggableId={`slot-3`} index={0} isDragDisabled={true}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {slots[3]}
                          </div>
                        )}
                      </Draggable>
                    )}
                    {provided.placeholder}{" "}
                    {wrongInputs.includes(3) && (
                      <span className="error-mark-input-wb-unit2-page3-q2">
                        ✕
                      </span>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
            <div
              className="row2-unit3-page6-q1"
              style={{ alignItems: "flex-start" }}
            >
              <div style={{ display: "flex", gap: "10px" }}>
                <span className="num-span">5</span>

                <img src={dad2} alt="" className="q-img-wb-unit3-page3-q2" />
              </div>

              <Droppable droppableId="slot-4" isDropDisabled={locked}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                   className={`q-input-wb-unit3-page3-q1 ${
                      snapshot.isDraggingOver ? "drag-over-cell" : ""
                    }`}
                    style={{
                      background: snapshot.isDraggingOver ? "#e3f2fd" : "white",
                    }}
                  >
                    {slots[4] && (
                      <Draggable draggableId={`slot-4`} index={0} isDragDisabled={true}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {slots[4]}
                          </div>
                        )}
                      </Draggable>
                    )}
                    {provided.placeholder}{" "}
                    {wrongInputs.includes(4) && (
                      <span className="error-mark-input-wb-unit2-page3-q2">
                        ✕
                      </span>
                    )}
                  </div>
                )}
              </Droppable>
            </div>{" "}
            <div
              className="row2-unit3-page6-q1"
              style={{ alignItems: "flex-start" }}
            >
              <div style={{ display: "flex", gap: "10px" }}>
                <span className="num-span">6</span>

                <img src={dad3} alt="" className="q-img-wb-unit3-page3-q2" />
              </div>

              <Droppable droppableId="slot-5" isDropDisabled={locked}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                   className={`q-input-wb-unit3-page3-q1 ${
                      snapshot.isDraggingOver ? "drag-over-cell" : ""
                    }`}
                    style={{
                      background: snapshot.isDraggingOver ? "#e3f2fd" : "white",
                    }}
                  >
                    {slots[5] && (
                      <Draggable draggableId={`slot-5`} index={0} isDragDisabled={true}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {slots[5]}
                          </div>
                        )}
                      </Draggable>
                    )}
                    {provided.placeholder}
                    {wrongInputs.includes(5) && (
                      <span className="error-mark-input-wb-unit2-page3-q2">
                        ✕
                      </span>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </div>
        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>
          {/* ⭐⭐⭐ NEW — زر Show Answer */}
          <button
            onClick={showAnswers}
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
};

export default WB_Unit3_Page3_Q1;
