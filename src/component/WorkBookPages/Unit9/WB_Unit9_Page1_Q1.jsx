import React, { useEffect, useRef, useState } from "react";
import img1 from "../../../assets/U1 WB/U9/U9P51EXEA-01.svg";
import img2 from "../../../assets/U1 WB/U9/U9P51EXEA-02.svg";
import img3 from "../../../assets/U1 WB/U9/U9P51EXEA-03.svg";
import ValidationAlert from "../../Popup/ValidationAlert";
import ExerciseHeader from "../../ExerciseHeader";
import useUnit9Audio from "./useUnit9Audio";
import Unit9PlayingAudioIcon from "./Unit9PlayingAudioIcon";
import catsAudio from "../../../assets/U1 WB/U9/audio/page51- A/item-001-how-many-cats-are-there.mp3";
import horsesAudio from "../../../assets/U1 WB/U9/audio/page51- A/item-002-how-many-horses-are-there.mp3";
import cowsAudio from "../../../assets/U1 WB/U9/audio/page51- A/item-003-how-many-cowes-are-there.mp3";
import "./WB_Unit9_Page1_Q1.css";

const sources = [
  { id: "img1", image: img1, alt: "Two cows" },
  { id: "img2", image: img2, alt: "Three cats" },
  { id: "img3", image: img3, alt: "One horse" },
];

const targets = [
  { id: "cats", text: "How many cats are there? There are three cats.", audio: catsAudio },
  { id: "horses", text: "How many horses are there? There is one horse.", audio: horsesAudio },
  { id: "cows", text: "How many cows are there? There are two cows.", audio: cowsAudio },
];

const correctMatches = { img1: "cows", img2: "cats", img3: "horses" };

const WB_Unit9_Page1_Q1 = () => {
  const [lines, setLines] = useState([]);
  const [firstEndpoint, setFirstEndpoint] = useState(null);
  const [focusedTarget, setFocusedTarget] = useState(null);
  const [lockedSources, setLockedSources] = useState([]);
  const [wrongSources, setWrongSources] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [, setLayoutVersion] = useState(0);
  const containerRef = useRef(null);
  const endpointRefs = useRef({ source: {}, target: {} });
  const dotRefs = useRef({ source: {}, target: {} });
  const { activeAudioKey, playAudio } = useUnit9Audio();

  useEffect(() => {
    const refresh = () => setLayoutVersion((version) => version + 1);
    window.addEventListener("resize", refresh);
    return () => window.removeEventListener("resize", refresh);
  }, []);

  const targetLocked = (targetId) => {
    const line = lines.find((item) => item.target === targetId);
    return line ? lockedSources.includes(line.source) : false;
  };

  const endpointAvailable = (side, id) => side === "source" ? !lockedSources.includes(id) : !targetLocked(id);

  const getCenter = (side, id) => {
    const element = dotRefs.current[side][id];
    const container = containerRef.current;
    if (!element || !container) return { x: 0, y: 0 };
    const rect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    return { x: rect.left - containerRect.left + rect.width / 2, y: rect.top - containerRect.top + rect.height / 2 };
  };

  const oppositeItems = (side) => (side === "source" ? targets : sources).filter((item) => endpointAvailable(side === "source" ? "target" : "source", item.id));

  const focusNextOrigin = (side, id) => {
    const items = side === "source" ? sources : targets;
    const currentIndex = items.findIndex((item) => item.id === id);
    for (let step = 1; step <= items.length; step += 1) {
      const candidate = items[(currentIndex + step) % items.length];
      if (endpointAvailable(side, candidate.id)) {
        requestAnimationFrame(() => endpointRefs.current[side][candidate.id]?.focus());
        break;
      }
    }
  };

  const commitMatch = (first, second) => {
    const source = first.side === "source" ? first.id : second.id;
    const target = first.side === "target" ? first.id : second.id;
    if (!endpointAvailable("source", source) || !endpointAvailable("target", target)) return;
    setLines((current) => current.filter((line) => line.source !== source && line.target !== target).concat({ source, target }));
    setWrongSources((current) => {
      const displaced = lines.find((line) => line.target === target)?.source;
      return current.filter((id) => id !== source && id !== displaced);
    });
  };

  const activateEndpoint = (side, id, keyboard = false) => {
    if (showAnswer || !endpointAvailable(side, id)) return;
    if (!firstEndpoint) {
      const first = { side, id, keyboard };
      setFirstEndpoint(first);
      if (keyboard) {
        const firstOpposite = oppositeItems(side)[0];
        if (firstOpposite) {
          const oppositeSide = side === "source" ? "target" : "source";
          setFocusedTarget({ side: oppositeSide, id: firstOpposite.id });
          requestAnimationFrame(() => endpointRefs.current[oppositeSide][firstOpposite.id]?.focus());
        }
      }
      return;
    }
    if (firstEndpoint.side === side) {
      setFirstEndpoint({ side, id, keyboard });
      return;
    }
    const origin = firstEndpoint;
    commitMatch(origin, { side, id });
    setFirstEndpoint(null);
    setFocusedTarget(null);
    if (origin.keyboard) focusNextOrigin(origin.side, origin.id);
  };

  const handleEndpointKeyDown = (event, side, id) => {
    if (event.key === "Escape" && firstEndpoint?.keyboard) {
      event.preventDefault();
      const origin = firstEndpoint;
      setFirstEndpoint(null);
      setFocusedTarget(null);
      requestAnimationFrame(() => endpointRefs.current[origin.side][origin.id]?.focus());
      return;
    }
    if (event.key === "Tab" && firstEndpoint?.keyboard && firstEndpoint.side !== side) {
      event.preventDefault();
      const items = oppositeItems(firstEndpoint.side);
      const index = items.findIndex((item) => item.id === id);
      const direction = event.shiftKey ? -1 : 1;
      const next = items[(index + direction + items.length) % items.length];
      if (next) {
        setFocusedTarget({ side, id: next.id });
        endpointRefs.current[side][next.id]?.focus();
      }
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activateEndpoint(side, id, true);
    }
  };

  const checkAnswers = () => {
    if (showAnswer || lockedSources.length === sources.length) return;
    if (lines.length < sources.length) {
      ValidationAlert.info("Oops!", "Please connect all the pairs before checking.");
      return;
    }
    const correct = lines.filter((line) => correctMatches[line.source] === line.target).map((line) => line.source);
    const wrong = sources.map((source) => source.id).filter((id) => !correct.includes(id));
    setLockedSources(correct);
    setWrongSources(wrong);
    const color = correct.length === sources.length ? "green" : correct.length === 0 ? "red" : "orange";
    const message = `<div style="font-size:20px;margin-top:10px;text-align:center;"><span style="color:${color};font-weight:bold;">Score: ${correct.length} / ${sources.length}</span></div>`;
    if (correct.length === sources.length) ValidationAlert.success(message);
    else if (correct.length === 0) ValidationAlert.error(message);
    else ValidationAlert.warning(message);
  };

  const showAnswers = () => {
    setLines(sources.map((source) => ({ source: source.id, target: correctMatches[source.id] })));
    setLockedSources(sources.map((source) => source.id));
    setWrongSources([]);
    setFirstEndpoint(null);
    setFocusedTarget(null);
    setShowAnswer(true);
  };

  const reset = () => {
    setLines([]);
    setLockedSources([]);
    setWrongSources([]);
    setFirstEndpoint(null);
    setFocusedTarget(null);
    setShowAnswer(false);
  };

  const previewLine = firstEndpoint?.keyboard && focusedTarget ? {
    start: getCenter(firstEndpoint.side, firstEndpoint.id),
    end: getCenter(focusedTarget.side, focusedTarget.id),
  } : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "30px" }}>
      <div className="div-forall" style={{ gap: "30px" }}>
        <ExerciseHeader sectionLetter="A" title="Look and match." subTitle="Count the animals, then connect each picture to its question-and-answer pair." />
        <div className="match-wrapper2 w-full" ref={containerRef}>
          <div className="match-images-row2">
            {sources.map((source, index) => (
              <div key={source.id} className="img-box2" style={{ display: "flex", gap: "10px", flexDirection: "row", alignItems: "flex-start", position: "relative" }}>
                <span style={{ color: "darkblue", fontWeight: "700" }}>{index + 1} </span>
                <img
                  ref={(element) => { endpointRefs.current.source[source.id] = element; }}
                  src={source.image}
                  alt={source.alt}
                  style={{ height: "150px" }}
                  className={`matched-img2 ${firstEndpoint?.side === "source" && firstEndpoint.id === source.id ? "selected-item" : ""} ${lockedSources.includes(source.id) || showAnswer ? "disabled-hover" : ""}`}
                  role="button"
                  tabIndex={endpointAvailable("source", source.id) && !showAnswer ? 0 : -1}
                  aria-label={`Match ${source.alt}`}
                  onClick={() => activateEndpoint("source", source.id, false)}
                  onKeyDown={(event) => handleEndpointKeyDown(event, "source", source.id)}
                />
                {wrongSources.includes(source.id) && <span className="error-mark-img-unit7-p6-q2">✕</span>}
                <div ref={(element) => { dotRefs.current.source[source.id] = element; }} className="dot22-unit7-p6-q2 start-dot22-unit7-p6-q2" data-image={source.id} tabIndex={-1} aria-hidden="true" onClick={() => activateEndpoint("source", source.id, false)} />
              </div>
            ))}
          </div>

          <div className="match-words-row2">
            {targets.map((target) => (
              <div key={target.id} className="word-box2">
                <div>
                  <h5
                    ref={(element) => { endpointRefs.current.target[target.id] = element; }}
                    className={`h5-wb-unit9-p1-q1 wb-unit9-audio-control ${firstEndpoint?.side === "target" && firstEndpoint.id === target.id ? "selected-item" : ""} ${targetLocked(target.id) || showAnswer ? "disabled-word" : ""}`}
                    role="button"
                    tabIndex={0}
                    aria-label={`Match ${target.text}`}
                    onClick={() => {
                      playAudio(`sentence-${target.id}`, target.audio);
                      activateEndpoint("target", target.id, false);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        playAudio(`sentence-${target.id}`, target.audio);
                      }
                      handleEndpointKeyDown(event, "target", target.id);
                    }}
                  >
                    {activeAudioKey === `sentence-${target.id}` && <Unit9PlayingAudioIcon />}
                    {target.text.split("? ")[0]}?<br />{target.text.split("? ")[1]}
                  </h5>
                  <div ref={(element) => { dotRefs.current.target[target.id] = element; }} className="dot22-unit7-p6-q2 end-dot22-wb-unit9-p1-q1" data-word={target.id} tabIndex={-1} aria-hidden="true" onClick={() => activateEndpoint("target", target.id, false)} />
                </div>
              </div>
            ))}
          </div>

          <svg className="lines-layer2" aria-hidden="true">
            {lines.map((line) => {
              const start = getCenter("source", line.source);
              const end = getCenter("target", line.target);
              return <line key={line.source} x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="red" strokeWidth="3" />;
            })}
            {previewLine && <line x1={previewLine.start.x} y1={previewLine.start.y} x2={previewLine.end.x} y2={previewLine.end.y} stroke="red" strokeWidth="3" strokeDasharray="6 4" />}
          </svg>
        </div>
      </div>
      <div className="action-buttons-container">
        <button type="button" onClick={reset} className="try-again-button">Start Again ↻</button>
        <button type="button" onClick={showAnswers} className="show-answer-btn swal-continue">Show Answer</button>
        <button type="button" onClick={checkAnswers} className="check-button2">Check Answer ✓</button>
      </div>
    </div>
  );
};

export default WB_Unit9_Page1_Q1;
