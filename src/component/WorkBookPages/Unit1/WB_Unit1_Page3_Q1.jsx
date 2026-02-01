import React, { useState } from "react";
import ValidationAlert from "../../Popup/ValidationAlert";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const WB_Unit1_Page3_Q1 = () => {
  const data = [
    { scrambled: "morning Good !", answer: "Good morning !" },
    { scrambled: "you How are ?", answer: "How are you ?" },
    { scrambled: "you Fine , thank .", answer: "Fine, thank you ." },
    { scrambled: "evening Good !", answer: "Good evening !" },
    { scrambled: "I'm John . Hello !", answer: "Hello ! I'm John ." },
  ];

  const [inputs, setInputs] = useState(data.map(() => ""));
  const [showAnswer, setShowAnswer] = useState(false);
  const [wrong, setWrong] = useState(data.map(() => false));
  const onDragEnd = (result) => {
    if (!result.destination || showAnswer) return;

    const { draggableId, source, destination } = result;

    // source: bank-0 | destination: blank-0
    const sourceIndex = Number(source.droppableId.replace("bank-", ""));
    const destIndex = Number(destination.droppableId.replace("blank-", ""));

    // ❌ منع وضع كلمة بجملة غيرها
    if (sourceIndex !== destIndex) return;

    const word = draggableId.split("-").slice(1, -1).join("-");

    setInputs((prev) =>
      prev.map((v, i) => {
        if (i !== destIndex) return v;

        // تقسيم الجملة الحالية لكلمات
        const currentWords = v.trim() ? v.trim().split(/\s+/) : [];

        // ❌ منع تكرار نفس الكلمة
        if (currentWords.includes(word)) return v;

        return currentWords.length ? `${v} ${word}` : word;
      }),
    );

    setWrong(data.map(() => false));
  };

  const checkAnswers = () => {
    if (showAnswer) return;

    let correct = 0;

    const wrongStatus = inputs.map((v, i) => {
      if (v.trim() === "") return false; // تجاهل الفارغ
      const ok = v.trim().toLowerCase() === data[i].answer.toLowerCase();
      if (ok) correct++;
      return !ok;
    });

    setWrong(wrongStatus);

    if (inputs.some((v) => v.trim() === "")) {
      ValidationAlert.info(
        "Oops!",
        "Please complete all answers before checking.",
      );
      return;
    }

    const total = data.length;
    const color =
      correct === total ? "green" : correct === 0 ? "red" : "orange";

    const msg = `
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
          {data.map((item, i) => {
            const words = item.scrambled.replace(/[]/g, "").split(/\s+/);

            return (
              <div key={i} style={{ marginBottom: "5px", width: "100%" }}>
                {/* الجملة المبعثرة */}
                <div className="scrambled-wb-unit1-p3-q1">
                  <div>
                    <span style={{ fontWeight: "600", marginRight: "8px" }}>
                      {i + 1}
                    </span>
                    {item.scrambled}
                  </div>
                  {/* word bank الخاص بالجملة */}
                  <Droppable droppableId={`bank-${i}`} direction="horizontal">
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
                        }}
                      >
                        {words.map((word, index) => (
                          <Draggable
                            key={`${i}-${word}-${index}`}
                            draggableId={`${i}-${word}-${index}`}
                            index={index}
                          >
                            {(provided) => (
                              <span
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
                                {word}
                              </span>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>

                {/* مكان الجواب */}
                <Droppable droppableId={`blank-${i}`}>
                  {(provided, snapshot) => (
                    <div style={{position:"relative"}}>
                      <input
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`missing-input-wb-unit1-p3-q1 ${
                          snapshot.isDraggingOver ? "drag-over-cell" : ""
                        }`}
                        value={showAnswer ? item.answer : inputs[i]}
                        readOnly
                      />

                      {wrong[i] && (
                        <div className="wrong-icon-wb-unit1-p3-q1">✕</div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
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
