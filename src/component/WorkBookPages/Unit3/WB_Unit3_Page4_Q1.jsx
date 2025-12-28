import React, { useMemo, useState } from "react";
import "./WB_Unit3_Page4_Q1.css";
import ValidationAlert from "../../Popup/ValidationAlert";
// import img1 from "../../../assets/U1 WB/U1/SVG/U1P5EXEF.svg"; // إذا بدك الصورة الجانبية

const WB_Unit3_Page4_Q1 = () => {
  const questions = useMemo(
    () => [
      { letters: "ltmnblistenpolq", answer: "Listen!", startIndex: 5 },
      {
        letters: "yrxbmakeoiakhqglineybcz",
        answer: "Make a line.",
        startIndex: 4,
      },
      {
        letters: "bzopenutyeourlkjhbookmmrd",
        answer: "Open your book.",
        startIndex: 2,
      },
      { letters: "uhkjquietbfqas", answer: "Quiet!", startIndex: 4 },
    ],
    []
  );

  // نحسب اندكسات الكلمة الصحيحة لكل سؤال (حسب startIndex وطول answer بدون مسافات/علامات)
  const correctIndices = useMemo(() => {
    const normalize = (s) => s.toLowerCase().replace(/[^a-z]/g, ""); // فقط حروف
    return questions.map((q) => {
      const word = normalize(q.answer); // مثل listen
      const start = q.startIndex;
      return Array.from({ length: word.length }, (_, i) => start + i);
    });
  }, [questions]);

  const [selectedIndices, setSelectedIndices] = useState({}); // {0:[...], 1:[...]}
  const [inputs, setInputs] = useState({}); // {0:"", 1:""}
  const [checked, setChecked] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const normalizeAnswer = (s) => s.toLowerCase().replace(/[^a-z]/g, "");
  const normalizeInput = (s) => s.toLowerCase().replace(/[^a-z]/g, "");


  const handleCharClick = (qIndex, cIndex) => {
    if (checked || showAnswer) return;

    const correct = correctIndices[qIndex];

    // ❌ إذا الحرف مو من الكلمة الصحيحة → لا تعمل شيء
    if (!correct.includes(cIndex)) return;

    setSelectedIndices((prev) => {
      const next = { ...prev };

      const alreadySelected =
        next[qIndex]?.length === correct.length &&
        next[qIndex].every((v, i) => v === correct[i]);

      // toggle
      next[qIndex] = alreadySelected ? [] : [...correct];

      return next;
    });
  };

  const startAgain = () => {
    setSelectedIndices({});
    setInputs({});
    setChecked(false);
    setShowAnswer(false);
  };

  const showTheAnswer = () => {
    const obj = {};
    questions.forEach((_, i) => {
      obj[i] = [...correctIndices[i]];
    });
    setSelectedIndices(obj);
    // كمان نعبّي المدخلات بالإجابات (إذا بدك)
    const inObj = {};
    questions.forEach((q, i) => (inObj[i] = q.answer));
    setInputs(inObj);

    setShowAnswer(true);
    setChecked(false);
  };

  const checkAnswer = () => {
    if (showAnswer) return;

    // 🔴 فحص الأسطر الفاضية
    for (let i = 0; i < questions.length; i++) {
      const hasCircle = selectedIndices[i]?.length > 0;
      const hasInput = inputs[i] && inputs[i].trim() !== "";

      // إذا السطر فاضي بالكامل
      if (!hasCircle && !hasInput) {
        ValidationAlert.info(
          `Please complete question ${i + 1} (circle and write).`
        );
        return;
      }
    }

    let score = 0;
    let maxScore = questions.length * 2; // 8

    questions.forEach((q, i) => {
      const selected = (selectedIndices[i] || []).slice().sort((a, b) => a - b);
      const correctSel = correctIndices[i];

      // ✅ 1) فحص الدائرة
      const isCircleCorrect =
        selected.length === correctSel.length &&
        selected.every((v, idx) => v === correctSel[idx]);

      if (isCircleCorrect) score += 1;

      // ✅ 2) فحص الكتابة
      const isWriteCorrect =
        normalizeInput(inputs[i] || "") === normalizeAnswer(q.answer);

      if (isWriteCorrect) score += 1;
    });

    setChecked(true);

    const msg = `Score: ${score} / ${maxScore}`;

    if (score === maxScore) return ValidationAlert.success(msg);
    if (score === 0) return ValidationAlert.error(msg);
    return ValidationAlert.warning(msg);
  };
  const isCircleCorrect = (i) => {
    const selected = (selectedIndices[i] || []).slice().sort((a, b) => a - b);
    const correctSel = correctIndices[i];

    return (
      selected.length === correctSel.length &&
      selected.every((v, idx) => v === correctSel[idx])
    );
  };

  const isWriteCorrect = (i) =>
    normalizeInput(inputs[i] || "") === normalizeAnswer(questions[i].answer);

  return (
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
          // gap: "30px",
          width: "60%",
          justifyContent: "flex-start",
        }}
      >
        <h5 className="header-title-page8">
          <span className="ex-A">G</span> Find, circle, and write.
        </h5>

        <div className="wb-unit3-p4-q1-rows">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="wb-unit3-p4-q1-row">
              <div className="wb-unit3-p4-q1-left">
                <div className="wb-unit3-p4-q1-line">
                  <span className="wb-unit3-p4-q1-number">{qIndex + 1}</span>

                  <span className="wb-unit3-p4-q1-letters">
                    {q.letters.split("").map((ch, cIndex) => {
                      const isCircled = (
                        selectedIndices[qIndex] || []
                      ).includes(cIndex);
                      return (
                        <span
                          key={cIndex}
                          className={`wb-unit3-p4-q1-char ${
                            isCircled ? "is-circled" : ""
                          }`}
                          onClick={() => handleCharClick(qIndex, cIndex)}
                        >
                          {ch}
                        </span>
                      );
                    })}
                  </span>
                  {checked &&
                    selectedIndices[qIndex]?.length > 0 &&
                    !isCircleCorrect(qIndex) && (
                      <div className="wrong-mark-wb-unit3-p4-q1">✕</div>
                    )}
                </div>

                <div className="wb-unit3-p4-q1-write">
                  <input
                    className="wb-unit3-p4-q1-input"
                    placeholder="Write here..."
                    value={inputs[qIndex] || ""}
                    onChange={(e) => {
                      if (checked || showAnswer) return;
                      setInputs((prev) => ({
                        ...prev,
                        [qIndex]: e.target.value,
                      }));
                    }}
                  />
                  {/* ❌ X للكتابة */}
                  {checked &&
                    inputs[qIndex]?.trim() !== "" &&
                    !isWriteCorrect(qIndex) && (
                      <div className="wrong-mark-wb-unit3-p4-q1">✕</div>
                    )}
                </div>
              </div>

              {/* زر يمين مثل الصورة */}
              <span className="wb-unit3-p4-q1-rightBtn" type="button">
                {q.answer}
              </span>
            </div>
          ))}
        </div>

        <div className="action-buttons-container">
          <button className="try-again-button" onClick={startAgain}>
            Start Again ↻
          </button>

          <button
            className="show-answer-btn swal-continue"
            onClick={showTheAnswer}
          >
            Show Answer
          </button>

          <button className="check-button2" onClick={checkAnswer}>
            Check Answer ✓
          </button>
        </div>
      </div>
    </div>
  );
};

export default WB_Unit3_Page4_Q1;
