import React, { useState, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import present from "../../../assets/img_unit2/imgs/Present1.jpg";
import cake from "../../../assets/img_unit2/imgs/Cake1.jpg";
import balloon from "../../../assets/img_unit2/imgs/Baloon1.jpg";
import ValidationAlert from "../../Popup/ValidationAlert";
import "./Unit2_Page6_Q2.css";

const exerciseData = {
  pairs: [
    { id: "pair-1", letter: "1", content: "Happy birthday! Here is a cake" },
    { id: "pair-2", letter: "2", content: "Happy birthday! Here is a balloon" },
    { id: "pair-3", letter: "3", content: "Happy birthday! Here is a present" },
  ],
  images: [cake, present, balloon],
};

const Unit2_Page6_Q2 = () => {
  const initialDroppedState = {
    "drop-1": null,
    "drop-2": null,
    "drop-3": null,
  };
  const [showAnswer, setShowAnswer] = useState(false);
  const [droppedLetters, setDroppedLetters] = useState(initialDroppedState);
  const clickAudioRef = useRef(null);
  const [wrongDrops, setWrongDrops] = useState([]);
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const { destination, draggableId } = result;
    const newDropped = { ...droppedLetters };

    // إزالة الرقم من أي مكان قديم
    Object.keys(newDropped).forEach((key) => {
      if (newDropped[key] === draggableId) {
        newDropped[key] = null;
      }
    });

    newDropped[destination.droppableId] = draggableId;
    setDroppedLetters(newDropped);
  };

  const correctAnswers = {
    "drop-1": "pair-1",
    "drop-2": "pair-3",
    "drop-3": "pair-2",
  };

  const handleCheckAnswers = () => {
    if (showAnswer) return;
    const allFilled = Object.values(droppedLetters).every((v) => v !== null);
    if (!allFilled)
      return ValidationAlert.info(
        "Incomplete!",
        "Please complete all drop zones.",
      );

    let correctCount = 0;
    const total = exerciseData.pairs.length;
    const wrongTemp = [];
    Object.keys(droppedLetters).forEach((dropId) => {
      if (droppedLetters[dropId] === correctAnswers[dropId]) correctCount++;
      else wrongTemp.push(dropId); // ✅ خزنا الـ drop الخطأ
    });
    setWrongDrops(wrongTemp);
    setShowAnswer(true);
    const color =
      correctCount === total ? "green" : correctCount === 0 ? "red" : "orange";

    const msg = `
      <div style="font-size: 20px; text-align:center;">
        <span style="color:${color}; font-weight:bold;"> Score: ${correctCount} / ${total}</span>
      </div>
    `;

    if (correctCount === total) ValidationAlert.success(msg);
    else if (correctCount === 0) ValidationAlert.error(msg);
    else ValidationAlert.warning(msg);
  };

  const handleReset = () => {
    setDroppedLetters(initialDroppedState);
    setWrongDrops([]);
    setShowAnswer(false);
  };

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
        <div
          className="div-forall"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            width: "60%",
            justifyContent: "flex-start",
          }}
        >
          <div className="u2-container2">
            <h5 className="header-title-page8">
              <span className="ex-A">E</span> Look, read, and choose.
            </h5>

            <DragDropContext onDragEnd={handleOnDragEnd}>
              <div className="layout2">
                <audio ref={clickAudioRef} style={{ display: "none" }} />

                {/* LEFT IMAGES + DROP ZONES */}
                <div className="left-side2">
                  {exerciseData.images.map((img, index) => {
                    const dropId = `drop-${index + 1}`;
                    const droppedId = showAnswer
                      ? correctAnswers[dropId]
                      : droppedLetters[dropId];
                    const droppedPair = exerciseData.pairs.find(
                      (p) => p.id === droppedId,
                    );

                    return (
                      <Droppable key={dropId} droppableId={dropId}>
                        {(provided, snapshot) => (
                          <div className="image-row2">
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`drop-circle2 ${
                                snapshot.isDraggingOver ? "drop2-hover" : ""
                              }`}
                              style={{ position: "relative" }}
                            >
                              {/* ✅ إشارة الخطأ - تظهر فقط إذا كانت هذه الـ drop من ضمن الأخطاء */}
                              {wrongDrops.includes(`drop-${index + 1}`) && (
                                <div className="wrong-x3">✕</div>
                              )}
                              {droppedPair && (
                                <div className="circle-number2">
                                  {droppedPair.letter}
                                </div>
                              )}
                              {provided.placeholder}
                            </div>
                            <img src={img} alt="" className="person-img2" />
                          </div>
                        )}
                      </Droppable>
                    );
                  })}
                </div>

                {/* RIGHT SIDE OPTIONS */}
                <Droppable droppableId="letters2">
                  {(provided) => (
                    <div
                      className="right-side2"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {exerciseData.pairs.map((pair, index) => (
                        <Draggable
                          key={pair.id}
                          draggableId={pair.id}
                          index={index}
                          isDragDisabled={showAnswer}
                        >
                          {(providedDraggable) => (
                            <div className="option-box2">
                              <span
                                ref={providedDraggable.innerRef}
                                {...providedDraggable.draggableProps}
                                {...providedDraggable.dragHandleProps}
                                className="number-tag2 draggable-number"
                              >
                                {pair.letter}
                              </span>
                              <span className="option-text2">
                                {pair.content}
                              </span>
                            </div>
                          )}
                        </Draggable>
                      ))}

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </DragDropContext>
          </div>
        </div>
      </div>
      <div className="action-buttons-container">
        <button onClick={handleReset} className="try-again-button">
          Start Again ↻
        </button>
        <button
          onClick={() => {
            setShowAnswer(true);
            setWrongDrops([]); // إخفاء X
            setDroppedLetters(initialDroppedState);
          }}
          className="show-answer-btn"
        >
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
