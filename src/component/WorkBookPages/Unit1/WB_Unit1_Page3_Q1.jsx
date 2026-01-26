import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const WB_Unit1_Page3_Q1 = () => {
  const data = [
    { scrambled: "morning Good !", answer: "Good morning" },
    { scrambled: "you How are ?", answer: "How are you" },
    { scrambled: "you Fine, thank .", answer: "Fine thank you" },
    { scrambled: "evening Good !", answer: "Good evening" },
    { scrambled: "I'm John. Hello!", answer: "Hello I'm John" },
  ];

  const [inputs, setInputs] = useState(data.map(() => ""));
  const [showAnswer, setShowAnswer] = useState(false);
  const [wrong, setWrong] = useState(data.map(() => false));
  const onDragEnd = (result) => {
    if (!result.destination || showAnswer) return;

    const { draggableId, destination } = result;
    const index = Number(destination.droppableId.replace("blank-", ""));

    const word = draggableId.split("-").slice(1, -1).join("-");
    const current = inputs[index];

    setInputs((prev) =>
      prev.map((v, i) => (i === index ? (v ? `${v} ${word}` : word) : v)),
    );

    setWrong(data.map(() => false));
  };

  const updateInput = (index, value) => {
    if (showAnswer) return;
    setInputs((prev) => prev.map((v, i) => (i === index ? value : v)));
    setWrong(data.map(() => false));
  };

  const checkAnswers = () => {
    if (showAnswer) return;

    // تجاهل أول إنبوت (index === 0) عند التحقق من المدخلات الفارغة
    if (inputs.some((v) => v.trim() === "")) {
      ValidationAlert.info(
        "Oops!",
        "Please complete all answers before checking.",
      );
      return;
    }

    let correct = 0;

    const wrongStatus = inputs.map((v, i) => {
      const ok = v.trim().toLowerCase() === data[i].answer.toLowerCase();
      if (ok) correct++;
      return !ok;
    });

    setWrong(wrongStatus);

    const total = data.length; // لأننا حذفنا السؤال الأول من السكور

    let color = correct === total ? "green" : correct === 0 ? "red" : "orange";

    let msg = `
    <div style="font-size:20px; text-align:center;">
      <span style="color:${color}; font-weight:bold;">
        Score: ${correct} / ${total}
      </span>
    </div>
  `;

    if (correct === total) ValidationAlert.success(msg);
    else if (correct === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };

  const reset = () => {
    setInputs(data.map(() => ""));
    setWrong(data.map(() => false));
    setShowAnswer(false);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="page8-wrapper" style={{ padding: "30px" }}>
        <div
          className="div-forall"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            position: "relative",
            width: "60%",
          }}
        >
          <div className="page8-content">
            <header className="header-title-page8">
              <span className="ex-A">A</span>
              Unscramble and write.
            </header>
          </div>{" "}
          <Droppable droppableId="word-bank" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                 className="word-bank-review9-p2-q2"
                style={{ flexWrap: "wrap" }}
              >
                {Array.from(
                  new Set(
                    data
                      .map((d) => d.scrambled)
                      .join(" ")
                      .replace(/[?.!,]/g, "")
                      .split(/\s+/),
                  ),
                ).map((word, i) => (
                  <Draggable
                    key={`bank-${word}-${i}`}
                    draggableId={`bank-${word}-${i}`}
                    index={i}
                  >
                    {(provided) => (
                      <span
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                            className="word-item-unit2-p8-q2"
                      >
                        {word}
                      </span>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          {data.map((item, i) => (
            <div
              key={i}
              style={{
                margin: "10px 0",
                display: "flex",
                justifyContent: "space-evenly",
                width: "100%",
              }}
            >
              <div className="scrambled-wb-unit1-p3-q1">
                <span
                  style={{
                    color: "#0d47a1",
                    fontWeight: "600",
                    marginRight: "10px",
                  }}
                >
                  {i + 1}
                </span>{" "}
                {item.scrambled}
              </div>
              <div style={{ position: "relative", display: "inline-block" }}>
                <Droppable droppableId={`blank-${i}`}>
                  {(provided,snapshot) => (
                    <input
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                       className={`missing-input-wb-unit1-p3-q1 ${
                                snapshot.isDraggingOver ? "drag-over-cell" : ""
                              }`}
                      value={showAnswer ? item.answer : inputs[i]}
                      readOnly
                    />
                  )}
                </Droppable>

                {wrong[i] && <div className="wrong-icon-wb-unit1-p3-q1">✕</div>}
              </div>
            </div>
          ))}
        </div>

        <div className="action-buttons-container">
          <button onClick={reset} className="try-again-button">
            Start Again ↻
          </button>

          <button
            className="show-answer-btn swal-continue"
            onClick={() => setShowAnswer(true)}
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

export default WB_Unit1_Page3_Q1;
