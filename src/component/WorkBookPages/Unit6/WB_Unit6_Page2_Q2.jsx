import React, { useEffect, useRef, useState } from "react";

import ValidationAlert from "../../Popup/ValidationAlert";
import "./WB_Unit6_Page2_Q2.css";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";

import ExerciseHeader from "../../ExerciseHeader";
import { FaVolumeUp } from "react-icons/fa";

/* =====================================================
   IMAGES
===================================================== */

import img1 from "../../../assets/U1 WB/U6/U6P34EXED-01.svg";
import img2 from "../../../assets/U1 WB/U6/U6P34EXED-02.svg";
import img3 from "../../../assets/U1 WB/U6/U6P34EXED-03.svg";
import img4 from "../../../assets/U1 WB/U6/U6P34EXED-04.svg";

/* =====================================================
   AUDIO
===================================================== */

import sentence1Audio from "../../../assets/U1 WB/U6/audio/page 34 - D/Item_001_He_can't_ride_a_bike.mp3";
import sentence2Audio from "../../../assets/U1 WB/U6/audio/page 34 - D/Item_002_He_can't_sail_a_boat.mp3";
import sentence3Audio from "../../../assets/U1 WB/U6/audio/page 34 - D/Item_003_It_can't_climb_a_tree.mp3";
import sentence4Audio from "../../../assets/U1 WB/U6/audio/page 34 - D/Item_004_I_can_swim.mp3";

import sailAudio from "../../../assets/U1 WB/U6/audio/page 34 - D/Item_005_sail_a_boat.mp3";
import climbAudio from "../../../assets/U1 WB/U6/audio/page 34 - D/Item_006_climb_a_tree.mp3";
import swimAudio from "../../../assets/U1 WB/U6/audio/page 34 - D/Item_007_swim.mp3";
import rideAudio from "../../../assets/U1 WB/U6/audio/page 34 - D/Item_008_ride_a_bike.mp3";

/* =====================================================
   DATA
===================================================== */

const leftParts = [
  { id: 1, text: "He can't" },
  { id: 2, text: "He can't" },
  { id: 3, text: "It can't" },
  { id: 4, text: "I can" },
];

const images = [
  {
    id: "img1",
    src: img1,
    alt: "A child swimming in a pool outdoors.",
  },
  {
    id: "img2",
    src: img2,
    alt: "A dog standing beside a large tree.",
  },
  {
    id: "img3",
    src: img3,
    alt: "A child riding a bicycle outdoors.",
  },
  {
    id: "img4",
    src: img4,
    alt: "A person sailing a boat on the water.",
  },
];

const rightParts = [
  {
    id: "r1",
    text: "sail a boat.",
    audio: sailAudio,
  },
  {
    id: "r2",
    text: "climb a tree.",
    audio: climbAudio,
  },
  {
    id: "r3",
    text: "swim.",
    audio: swimAudio,
  },
  {
    id: "r4",
    text: "ride a bike.",
    audio: rideAudio,
  },
];

const correctMatches = [
  {
    leftId: 1,
    right: "ride a bike.",
    image: "img3",
  },
  {
    leftId: 2,
    right: "sail a boat.",
    image: "img4",
  },
  {
    leftId: 3,
    right: "climb a tree.",
    image: "img2",
  },
  {
    leftId: 4,
    right: "swim.",
    image: "img1",
  },
];

const correctSentences = {
  1: "He can't ride a bike.",
  2: "He can't sail a boat.",
  3: "It can't climb a tree.",
  4: "I can swim.",
};

const sentenceBank = [
  {
    sentence: "He can't ride a bike.",
    audio: sentence1Audio,
  },
  {
    sentence: "He can't sail a boat.",
    audio: sentence2Audio,
  },
  {
    sentence: "It can't climb a tree.",
    audio: sentence3Audio,
  },
  {
    sentence: "I can swim.",
    audio: sentence4Audio,
  },
];

/* =====================================================
   GET CENTER
===================================================== */

const getCenter = (element, container) => {
  if (!element || !container) return null;

  const elementRect = element.getBoundingClientRect();

  const containerRect = container.getBoundingClientRect();

  return {
    x: elementRect.left - containerRect.left + elementRect.width / 2,

    y: elementRect.top - containerRect.top + elementRect.height / 2,
  };
};

/* =====================================================
   DRAGGABLE SENTENCE
===================================================== */

const DraggableSentence = ({
  item,

  locked,
  isUsed,

  keyboardPickedSentence,
  onKeyboardPick,

  sentenceRefs,

  playingKey,
  playAudio,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sentence-${item.sentence}`,
    disabled: locked || isUsed,
  });

  const isPicked = keyboardPickedSentence === item.sentence;

  const isPlaying = playingKey === `sentence-${item.sentence}`;

  return (
    <div
      ref={(el) => {
        setNodeRef(el);

        sentenceRefs.current[item.sentence] = el;
      }}
      {...(!locked && !isUsed
        ? {
            ...listeners,
            ...attributes,
          }
        : {})}
      role="button"
      tabIndex={locked || isUsed ? -1 : 0}
      aria-disabled={locked || isUsed}
      aria-pressed={isPicked}
      aria-label={
        isPicked
          ? `${item.sentence} selected. Choose a sentence line.`
          : `${item.sentence}. Press Enter or Space to hear and select this sentence.`
      }
      onClick={(e) => {
        /*
          dnd-kit رح يضل ماسك mouse drag.
          Click بدون drag يشغل الصوت.
        */

        playAudio(`sentence-${item.sentence}`, item.audio);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();

          playAudio(`sentence-${item.sentence}`, item.audio);

          if (!locked && !isUsed) {
            onKeyboardPick(item.sentence);
          }
        }
      }}
      style={{
        padding: "2px 5px",

        border: `2px solid ${isUsed ? "#aaa" : "#2c5287"}`,

        borderRadius: "8px",

        background: isUsed ? "#e0e0e0" : "white",

        fontWeight: "bold",

        color: isUsed ? "#999" : "",

        cursor: locked || isUsed ? "default" : "grab",

        opacity: isDragging ? 0.3 : 1,

        touchAction: "none",

        userSelect: "none",

        transition: "all 0.2s",

        position: "relative",
      }}
    >
      {item.sentence}

      {isPlaying && (
        <FaVolumeUp
          size={14}
          aria-hidden="true"
          style={{
            marginLeft: "6px",
          }}
        />
      )}
    </div>
  );
};

/* =====================================================
   DROPPABLE WRITE BOX
===================================================== */

const DroppableWriteBox = ({
  id,
  value,

  isWrong,
  locked,

  showAnswerMode,
  checkCompleted,

  keyboardPickedSentence,

  focusedWriteId,
  setFocusedWriteId,

  writeRefs,
  getAvailableWriteIds,

  onKeyboardDrop,
  onKeyboardRemove,
  onCancelKeyboardPick,

  onRemove,
}) => {
  const droppableId = `write-${id}`;

  const { setNodeRef, isOver } = useDroppable({
    id: droppableId,

    disabled: locked || showAnswerMode || checkCompleted,
  });

  const keyboardActive =
    !!keyboardPickedSentence && !locked && !showAnswerMode && !checkCompleted;

  const canEditFilled =
    !!value &&
    !keyboardPickedSentence &&
    !locked &&
    !showAnswerMode &&
    !checkCompleted;

  const showPreview = keyboardActive && focusedWriteId === droppableId;

  const displayedValue = showPreview ? keyboardPickedSentence : value;

  const handleKeyDown = (e) => {
    /* =========================================
       FILLED SLOT → RETURN SENTENCE
    ========================================= */

    if (canEditFilled && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardRemove(id, value);

      return;
    }

    if (!keyboardActive) {
      return;
    }

    /* =========================================
       TAB / SHIFT TAB
    ========================================= */

    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const available = getAvailableWriteIds();

      if (!available.length) {
        return;
      }

      const currentIndex = available.indexOf(droppableId);

      let nextIndex;

      if (e.shiftKey) {
        nextIndex = currentIndex <= 0 ? available.length - 1 : currentIndex - 1;
      } else {
        nextIndex =
          currentIndex === -1 || currentIndex === available.length - 1
            ? 0
            : currentIndex + 1;
      }

      const nextId = available[nextIndex];

      writeRefs.current[nextId]?.focus();

      return;
    }

    /* =========================================
       PLACE
    ========================================= */

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      onKeyboardDrop(id);

      return;
    }

    /* =========================================
       ESCAPE
    ========================================= */

    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      onCancelKeyboardPick();
    }
  };

  return (
    <div className="input-wrapper-wb-unit6-p2-q2">
      <div
        ref={(el) => {
          setNodeRef(el);

          writeRefs.current[droppableId] = el;
        }}
        role="button"
        tabIndex={
          locked || showAnswerMode || checkCompleted
            ? -1
            : keyboardActive || canEditFilled
              ? 0
              : -1
        }
        aria-label={
          keyboardActive
            ? value
              ? `Sentence line ${id} currently contains ${value}. Press Enter or Space to replace it with ${keyboardPickedSentence}.`
              : `Sentence line ${id}. Press Enter or Space to place ${keyboardPickedSentence}.`
            : canEditFilled
              ? `Sentence line ${id} contains ${value}. Press Enter or Space to return it to the sentence bank.`
              : `Sentence line ${id}.`
        }
        className={`write-drop-wb-unit6-p2-q2 ${
          isOver ? "drag-over-cell" : ""
        }`}
        onFocus={() => {
          if (keyboardActive) {
            setFocusedWriteId(droppableId);
          }
        }}
        onBlur={() => {
          setFocusedWriteId(null);
        }}
        onKeyDown={handleKeyDown}
        onClick={() =>
          !locked && !showAnswerMode && !checkCompleted && value && onRemove(id)
        }
        style={{
          background: isOver || showPreview ? "#e3f2fd" : "",

          cursor:
            !locked && !showAnswerMode && !checkCompleted && value
              ? "pointer"
              : "default",

          transition: "background 0.15s ease",

          position: "relative",
        }}
        title={
          !locked && !showAnswerMode && !checkCompleted && value
            ? "Click to remove"
            : ""
        }
      >
        {displayedValue || ""}

        {isWrong && (
          <span className="wrong-input-mark-wb-unit6-p2-q2" aria-hidden="true">
            ✕
          </span>
        )}
      </div>
    </div>
  );
};

/* =====================================================
   MAIN
===================================================== */

const WB_Unit6_Page2_Q2 = () => {
  const containerRef = useRef(null);

  /* =================================================
     MATCHING
  ================================================= */

  const [connections, setConnections] = useState([]);

  const [wrongLeft, setWrongLeft] = useState([]);

  const [lockedLeft, setLockedLeft] = useState([]);

  const [lockedImages, setLockedImages] = useState([]);

  const [lockedRight, setLockedRight] = useState([]);

  /* =================================================
     MATCHING SELECTION
  ================================================= */

  const [firstPoint, setFirstPoint] = useState(null);

  const [selectedLeftId, setSelectedLeftId] = useState(null);

  const [selectedImageId, setSelectedImageId] = useState(null);

  /* =================================================
     KEYBOARD MATCHING
  ================================================= */

  const [keyboardMatching, setKeyboardMatching] = useState(false);

  const [keyboardStage, setKeyboardStage] = useState(null);
  // image | right

  const [previewLine, setPreviewLine] = useState(null);

  const leftRefs = useRef({});
  const imageRefs = useRef({});
  const rightRefs = useRef({});

  const leftDotRefs = useRef({});
  const imageLeftDotRefs = useRef({});
  const imageRightDotRefs = useRef({});
  const rightDotRefs = useRef({});

  /* =================================================
     DRAG
  ================================================= */

  const [written, setWritten] = useState({});

  const [wrongInputs, setWrongInputs] = useState([]);

  const [lockedWriteIds, setLockedWriteIds] = useState([]);

  const [activeSentence, setActiveSentence] = useState(null);

  const [keyboardPickedSentence, setKeyboardPickedSentence] = useState(null);

  const [focusedWriteId, setFocusedWriteId] = useState(null);

  const sentenceRefs = useRef({});
  const writeRefs = useRef({});

  /* =================================================
     FINAL
  ================================================= */

  const [showAnswerMode, setShowAnswerMode] = useState(false);

  const [checkCompleted, setCheckCompleted] = useState(false);

  /* =================================================
     AUDIO
  ================================================= */

  const audioRef = useRef(null);

  const [playingKey, setPlayingKey] = useState(null);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      audioRef.current.onended = null;
      audioRef.current.onerror = null;

      audioRef.current = null;
    }

    setPlayingKey(null);
  };

  const playAudio = (key, src) => {
    if (!src) return;

    stopAudio();

    const audio = new Audio(src);

    audioRef.current = audio;

    setPlayingKey(key);

    audio.play().catch(() => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingKey(null);
    });

    audio.onended = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingKey(null);
    };

    audio.onerror = () => {
      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setPlayingKey(null);
    };
  };

  /* =================================================
     DND SENSOR
  ================================================= */

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  /* =================================================
     HELPERS
  ================================================= */

  const usedSentences = Object.values(written).filter(Boolean);

  const isLeftLocked = (id) => lockedLeft.includes(id);

  const isImageLocked = (id) => lockedImages.includes(id);

  const isRightLocked = (text) => lockedRight.includes(text);

  const isWriteLocked = (id) => lockedWriteIds.includes(Number(id));

  const getCorrectMatch = (leftId) =>
    correctMatches.find((item) => item.leftId === leftId);

  /* =================================================
     CLEAR MATCHING SELECTION
  ================================================= */

  const clearMatchingSelection = () => {
    setFirstPoint(null);

    setSelectedLeftId(null);

    setSelectedImageId(null);

    setKeyboardMatching(false);

    setKeyboardStage(null);

    setPreviewLine(null);
  };

  /* =================================================
     MATCHING CONNECTION HELPERS
  ================================================= */

  const getLeftConnection = (leftId) =>
    connections.find((item) => item.leftId === leftId);

  const commitLeftImage = (leftId, imageId) => {
    if (
      showAnswerMode ||
      checkCompleted ||
      isLeftLocked(leftId) ||
      isImageLocked(imageId)
    ) {
      return;
    }

    setConnections((prev) => {
      const currentLeft = prev.find((item) => item.leftId === leftId);

      return [
        ...prev.filter(
          (item) => item.leftId !== leftId && item.image !== imageId,
        ),

        {
          leftId,
          image: imageId,
          right: currentLeft?.right || null,
        },
      ];
    });

    setWrongLeft((prev) => prev.filter((id) => id !== leftId));
  };

  const commitImageRight = (imageId, rightText) => {
    if (
      showAnswerMode ||
      checkCompleted ||
      isImageLocked(imageId) ||
      isRightLocked(rightText)
    ) {
      return;
    }

    setConnections((prev) => {
      const source = prev.find((item) => item.image === imageId);

      if (!source) {
        return prev;
      }

      return prev.map((item) => {
        if (item.image === imageId) {
          return {
            ...item,
            right: rightText,
          };
        }

        if (item.right === rightText) {
          return {
            ...item,
            right: null,
          };
        }

        return item;
      });
    });

    if (sourceLeftIdForImage(imageId)) {
      setWrongLeft((prev) =>
        prev.filter((id) => id !== sourceLeftIdForImage(imageId)),
      );
    }
  };

  const sourceLeftIdForImage = (imageId) =>
    connections.find((item) => item.image === imageId)?.leftId;

  /* =================================================
     MOUSE MATCHING
  ================================================= */

  const handleLeftClick = (leftId) => {
    if (showAnswerMode || checkCompleted || isLeftLocked(leftId)) {
      return;
    }

    const dot = leftDotRefs.current[leftId];

    if (!dot || !containerRef.current) {
      return;
    }

    /*
      لو عليه توصيل غلط قديم
      نشيله حتى يقدر يعدل.
    */

    setConnections((prev) =>
      prev.filter(
        (item) => item.leftId !== leftId || isLeftLocked(item.leftId),
      ),
    );

    setWrongLeft((prev) => prev.filter((id) => id !== leftId));

    const point = getCenter(dot, containerRef.current);

    if (!point) return;

    setFirstPoint({
      type: "left",
      leftId,
      x: point.x,
      y: point.y,
    });

    setSelectedLeftId(leftId);

    setSelectedImageId(null);

    setKeyboardMatching(false);

    setKeyboardStage(null);

    setPreviewLine(null);
  };

  const handleImageClick = (imageId) => {
    if (showAnswerMode || checkCompleted || isImageLocked(imageId)) {
      return;
    }

    /*
      LEFT → IMAGE
    */

    if (firstPoint?.type === "left") {
      commitLeftImage(firstPoint.leftId, imageId);

      const dot = imageRightDotRefs.current[imageId];

      const point = getCenter(dot, containerRef.current);

      if (!point) {
        clearMatchingSelection();
        return;
      }

      /*
        بعد الصورة مباشرة
        نكمل لليمين.
      */

      setFirstPoint({
        type: "image",
        image: imageId,
        leftId: firstPoint.leftId,
        x: point.x,
        y: point.y,
      });

      setSelectedLeftId(null);

      setSelectedImageId(imageId);

      return;
    }

    /*
      IMAGE START
    */

    const connection = connections.find((item) => item.image === imageId);

    if (!connection) {
      return;
    }

    const dot = imageRightDotRefs.current[imageId];

    const point = getCenter(dot, containerRef.current);

    if (!point) return;

    setFirstPoint({
      type: "image",
      image: imageId,
      leftId: connection.leftId,
      x: point.x,
      y: point.y,
    });

    setSelectedLeftId(null);

    setSelectedImageId(imageId);

    setKeyboardMatching(false);

    setKeyboardStage(null);

    setPreviewLine(null);
  };

  const handleRightClick = (rightText) => {
    if (
      !firstPoint ||
      firstPoint.type !== "image" ||
      showAnswerMode ||
      checkCompleted ||
      isRightLocked(rightText)
    ) {
      return;
    }

    commitImageRight(firstPoint.image, rightText);

    clearMatchingSelection();
  };

  /* =================================================
     KEYBOARD MATCHING START
  ================================================= */

  const startKeyboardMatch = (leftId) => {
    if (showAnswerMode || checkCompleted || isLeftLocked(leftId)) {
      return;
    }

    const dot = leftDotRefs.current[leftId];

    const point = getCenter(dot, containerRef.current);

    if (!point) return;

    /*
      remove old wrong matching
    */

    setConnections((prev) =>
      prev.filter(
        (item) => item.leftId !== leftId || isLeftLocked(item.leftId),
      ),
    );

    setWrongLeft((prev) => prev.filter((id) => id !== leftId));

    const startPoint = {
      type: "left",
      leftId,
      x: point.x,
      y: point.y,
    };

    setFirstPoint(startPoint);

    setSelectedLeftId(leftId);

    setSelectedImageId(null);

    setKeyboardMatching(true);

    setKeyboardStage("image");

    requestAnimationFrame(() => {
      const available = images.filter((img) => !isImageLocked(img.id));

      if (!available.length) {
        return;
      }

      const firstImage = available[0];

      imageRefs.current[firstImage.id]?.focus();

      updateImagePreview(startPoint, firstImage.id);
    });
  };

  /* =================================================
     PREVIEW
  ================================================= */

  const updateImagePreview = (startPoint, imageId) => {
    const target = imageLeftDotRefs.current[imageId];

    const end = getCenter(target, containerRef.current);

    if (!end) return;

    setPreviewLine({
      x1: startPoint.x,
      y1: startPoint.y,
      x2: end.x,
      y2: end.y,
    });
  };

  const updateRightPreview = (startPoint, rightText) => {
    const target = rightDotRefs.current[rightText];

    const end = getCenter(target, containerRef.current);

    if (!end) return;

    setPreviewLine({
      x1: startPoint.x,
      y1: startPoint.y,
      x2: end.x,
      y2: end.y,
    });
  };

  /* =================================================
     IMAGE KEYBOARD
  ================================================= */

  const handleImageKeyDown = (e, imageId) => {
    if (
      !keyboardMatching ||
      keyboardStage !== "image" ||
      !firstPoint ||
      firstPoint.type !== "left"
    ) {
      return;
    }

    const available = images.filter((img) => !isImageLocked(img.id));

    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const currentIndex = available.findIndex((img) => img.id === imageId);

      let nextIndex;

      if (e.shiftKey) {
        nextIndex = currentIndex <= 0 ? available.length - 1 : currentIndex - 1;
      } else {
        nextIndex =
          currentIndex === available.length - 1 ? 0 : currentIndex + 1;
      }

      const next = available[nextIndex];

      imageRefs.current[next.id]?.focus();

      updateImagePreview(firstPoint, next.id);

      return;
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      const leftId = firstPoint.leftId;

      commitLeftImage(leftId, imageId);

      const imageDot = imageRightDotRefs.current[imageId];

      const point = getCenter(imageDot, containerRef.current);

      if (!point) {
        clearMatchingSelection();
        return;
      }

      const newStartPoint = {
        type: "image",
        image: imageId,
        leftId,
        x: point.x,
        y: point.y,
      };

      setFirstPoint(newStartPoint);

      setSelectedLeftId(null);

      setSelectedImageId(imageId);

      setKeyboardStage("right");

      requestAnimationFrame(() => {
        const availableRight = rightParts.filter((r) => !isRightLocked(r.text));

        if (!availableRight.length) {
          return;
        }

        const firstRight = availableRight[0];

        rightRefs.current[firstRight.text]?.focus();

        updateRightPreview(newStartPoint, firstRight.text);
      });

      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      const leftId = firstPoint.leftId;

      clearMatchingSelection();

      requestAnimationFrame(() => {
        leftRefs.current[leftId]?.focus();
      });
    }
  };

  /* =================================================
     RIGHT KEYBOARD
  ================================================= */

  const handleRightKeyDown = (e, rightText) => {
    if (
      !keyboardMatching ||
      keyboardStage !== "right" ||
      !firstPoint ||
      firstPoint.type !== "image"
    ) {
      /*
        حتى لو مش بmatching،
        Enter/Space للصوت.
      */

      if (e.key === "Enter" || e.key === " ") {
        const right = rightParts.find((item) => item.text === rightText);

        if (right?.audio) {
          e.preventDefault();
          e.stopPropagation();

          playAudio(`right-${right.text}`, right.audio);
        }
      }

      return;
    }

    const available = rightParts.filter((r) => !isRightLocked(r.text));

    if (e.key === "Tab") {
      e.preventDefault();
      e.stopPropagation();

      const currentIndex = available.findIndex((r) => r.text === rightText);

      let nextIndex;

      if (e.shiftKey) {
        nextIndex = currentIndex <= 0 ? available.length - 1 : currentIndex - 1;
      } else {
        nextIndex =
          currentIndex === available.length - 1 ? 0 : currentIndex + 1;
      }

      const next = available[nextIndex];

      rightRefs.current[next.text]?.focus();

      updateRightPreview(firstPoint, next.text);

      return;
    }

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();

      const sourceLeftId = firstPoint.leftId;

      commitImageRight(firstPoint.image, rightText);

      clearMatchingSelection();

      window.setTimeout(() => {
        const nextLeft = leftParts.find(
          (item) => item.id !== sourceLeftId && !isLeftLocked(item.id),
        );

        if (nextLeft) {
          leftRefs.current[nextLeft.id]?.focus();
        } else {
          leftRefs.current[sourceLeftId]?.focus();
        }
      }, 0);

      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      const sourceLeftId = firstPoint.leftId;

      clearMatchingSelection();

      requestAnimationFrame(() => {
        leftRefs.current[sourceLeftId]?.focus();
      });
    }
  };

  /* =================================================
     DRAG MOUSE
  ================================================= */

  const handleDragStart = (event) => {
    setActiveSentence(String(event.active.id).replace("sentence-", ""));
  };

  const handleDragEnd = (event) => {
    setActiveSentence(null);

    if (showAnswerMode || checkCompleted) {
      return;
    }

    const { active, over } = event;

    if (!over || !String(over.id).startsWith("write-")) {
      return;
    }

    const sentence = String(active.id).replace("sentence-", "");

    const id = Number(String(over.id).replace("write-", ""));

    if (isWriteLocked(id)) {
      return;
    }

    setWritten((prev) => {
      const updated = {
        ...prev,
      };

      /*
        sentence واحدة بمكان واحد.
      */

      Object.keys(updated).forEach((key) => {
        if (updated[key] === sentence) {
          delete updated[key];
        }
      });

      updated[id] = sentence;

      return updated;
    });

    setWrongInputs((prev) => prev.filter((item) => item !== id));
  };

  /* =================================================
     DRAG KEYBOARD PICK
  ================================================= */

  const handleKeyboardSentencePick = (sentence) => {
    if (showAnswerMode || checkCompleted || usedSentences.includes(sentence)) {
      return;
    }

    setKeyboardPickedSentence(sentence);

    setFocusedWriteId(null);

    requestAnimationFrame(() => {
      const available = getAvailableWriteIds();

      if (!available.length) {
        return;
      }

      writeRefs.current[available[0]]?.focus();
    });
  };

  const getAvailableWriteIds = () =>
    Object.keys(correctSentences)
      .map(Number)
      .filter((id) => !isWriteLocked(id))
      .map((id) => `write-${id}`);

  /* =================================================
     KEYBOARD DROP SENTENCE
  ================================================= */

  const handleKeyboardSentenceDrop = (id) => {
    if (
      !keyboardPickedSentence ||
      showAnswerMode ||
      checkCompleted ||
      isWriteLocked(id)
    ) {
      return;
    }

    const sentence = keyboardPickedSentence;

    setWritten((prev) => {
      const updated = {
        ...prev,
      };

      Object.keys(updated).forEach((key) => {
        if (updated[key] === sentence) {
          delete updated[key];
        }
      });

      updated[id] = sentence;

      return updated;
    });

    setWrongInputs((prev) => prev.filter((item) => item !== Number(id)));

    setKeyboardPickedSentence(null);

    setFocusedWriteId(null);

    window.setTimeout(() => {
      sentenceRefs.current[sentence]?.focus();
    }, 0);
  };

  /* =================================================
     FILLED WRITE SLOT → BANK
  ================================================= */

  const handleKeyboardRemoveWritten = (id, sentence) => {
    if (showAnswerMode || checkCompleted || isWriteLocked(id)) {
      return;
    }

    setWritten((prev) => {
      const updated = {
        ...prev,
      };

      delete updated[id];

      return updated;
    });

    setWrongInputs((prev) => prev.filter((item) => item !== Number(id)));

    setKeyboardPickedSentence(null);

    setFocusedWriteId(null);

    window.setTimeout(() => {
      sentenceRefs.current[sentence]?.focus();
    }, 0);
  };

  const cancelKeyboardSentence = () => {
    const sentence = keyboardPickedSentence;

    setKeyboardPickedSentence(null);

    setFocusedWriteId(null);

    window.setTimeout(() => {
      if (sentence) {
        sentenceRefs.current[sentence]?.focus();
      }
    }, 0);
  };

  const handleRemoveWritten = (id) => {
    if (showAnswerMode || checkCompleted || isWriteLocked(id)) {
      return;
    }

    setWritten((prev) => {
      const updated = {
        ...prev,
      };

      delete updated[id];

      return updated;
    });

    setWrongInputs((prev) => prev.filter((item) => item !== Number(id)));
  };

  /* =================================================
     CHECK
  ================================================= */

  const checkAnswers = () => {
    if (showAnswerMode || checkCompleted) {
      return;
    }

    /* =============================================
       WRITE COMPLETE?
    ============================================= */

    const emptyInputs = Object.keys(correctSentences).filter(
      (id) => !written[id],
    );

    if (emptyInputs.length > 0) {
      ValidationAlert.info(
        "Pay attention!",
        "Please complete all the sentences before checking.",
      );

      return;
    }

    /* =============================================
       MATCHING COMPLETE?
    ============================================= */

    const incompleteMatching = correctMatches.some((correct) => {
      const connection = connections.find(
        (item) => item.leftId === correct.leftId,
      );

      return !connection || !connection.image || !connection.right;
    });

    if (incompleteMatching) {
      ValidationAlert.info(
        "Pay attention!",
        "Please connect all the pairs before checking.",
      );

      return;
    }

    let matchingScore = 0;

    let writingScore = 0;

    const wrongMatching = [];

    const wrongWriting = [];

    const newLockedLeft = [];
    const newLockedImages = [];
    const newLockedRight = [];
    const newLockedWrite = [];

    /* =============================================
       CHECK MATCHING
    ============================================= */

    correctMatches.forEach((correct) => {
      const connection = connections.find(
        (item) => item.leftId === correct.leftId,
      );

      const isCorrect =
        connection?.image === correct.image &&
        connection?.right === correct.right;

      if (isCorrect) {
        matchingScore++;

        newLockedLeft.push(correct.leftId);

        newLockedImages.push(correct.image);

        newLockedRight.push(correct.right);
      } else {
        wrongMatching.push(correct.leftId);
      }
    });

    /* =============================================
       CHECK WRITING
    ============================================= */

    Object.entries(correctSentences).forEach(([id, text]) => {
      const numericId = Number(id);

      const userValue = written[id]?.trim().toLowerCase();

      if (userValue === text.toLowerCase()) {
        writingScore++;

        newLockedWrite.push(numericId);
      } else {
        wrongWriting.push(numericId);
      }
    });

    /* =============================================
       PROGRESSIVE LOCK
    ============================================= */

    setLockedLeft((prev) => Array.from(new Set([...prev, ...newLockedLeft])));

    setLockedImages((prev) =>
      Array.from(new Set([...prev, ...newLockedImages])),
    );

    setLockedRight((prev) => Array.from(new Set([...prev, ...newLockedRight])));

    setLockedWriteIds((prev) =>
      Array.from(new Set([...prev, ...newLockedWrite])),
    );

    setWrongLeft(wrongMatching);

    setWrongInputs(wrongWriting);

    clearMatchingSelection();

    setKeyboardPickedSentence(null);

    setFocusedWriteId(null);

    const score = matchingScore + writingScore;

    const total = correctMatches.length + Object.keys(correctSentences).length;

    const color = score === total ? "green" : score === 0 ? "red" : "orange";

    const scoreMessage = `
      <div style="
        font-size:20px;
        text-align:center;
      ">
        <b style="color:${color}">
          Score: ${score} / ${total}
        </b>
      </div>
    `;

    if (score === total) {
      setLockedLeft(correctMatches.map((item) => item.leftId));

      setLockedImages(correctMatches.map((item) => item.image));

      setLockedRight(correctMatches.map((item) => item.right));

      setLockedWriteIds(Object.keys(correctSentences).map(Number));

      setWrongLeft([]);

      setWrongInputs([]);

      setCheckCompleted(true);

      ValidationAlert.success(scoreMessage);

      return;
    }

    if (score === 0) {
      ValidationAlert.error(scoreMessage);
    } else {
      ValidationAlert.warning(scoreMessage);
    }
  };

  /* =================================================
     SHOW ANSWER
  ================================================= */

  const showAnswer = () => {
    stopAudio();

    setConnections(
      correctMatches.map((item) => ({
        ...item,
      })),
    );

    setWritten({
      ...correctSentences,
    });

    setLockedLeft(correctMatches.map((item) => item.leftId));

    setLockedImages(correctMatches.map((item) => item.image));

    setLockedRight(correctMatches.map((item) => item.right));

    setLockedWriteIds(Object.keys(correctSentences).map(Number));

    setWrongLeft([]);

    setWrongInputs([]);

    setShowAnswerMode(true);

    setCheckCompleted(true);

    clearMatchingSelection();

    setKeyboardPickedSentence(null);

    setFocusedWriteId(null);
  };

  /* =================================================
     RESET
  ================================================= */

  const reset = () => {
    stopAudio();

    setConnections([]);

    setWritten({});

    setWrongLeft([]);

    setWrongInputs([]);

    setLockedLeft([]);

    setLockedImages([]);

    setLockedRight([]);

    setLockedWriteIds([]);

    setShowAnswerMode(false);

    setCheckCompleted(false);

    setActiveSentence(null);

    clearMatchingSelection();

    setKeyboardPickedSentence(null);

    setFocusedWriteId(null);
  };

  /* =================================================
     COMPUTE SVG LINES
  ================================================= */

  const [svgLines, setSvgLines] = useState([]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const result = [];

    connections.forEach((connection) => {
      /* LEFT → IMAGE */

      if (connection.leftId && connection.image) {
        const leftDot = leftDotRefs.current[connection.leftId];

        const imageDot = imageLeftDotRefs.current[connection.image];

        const p1 = getCenter(leftDot, containerRef.current);

        const p2 = getCenter(imageDot, containerRef.current);

        if (p1 && p2) {
          result.push({
            key: `left-${connection.leftId}-${connection.image}`,

            x1: p1.x,
            y1: p1.y,

            x2: p2.x,
            y2: p2.y,
          });
        }
      }

      /* IMAGE → RIGHT */

      if (connection.image && connection.right) {
        const imageDot = imageRightDotRefs.current[connection.image];

        const rightDot = rightDotRefs.current[connection.right];

        const p1 = getCenter(imageDot, containerRef.current);

        const p2 = getCenter(rightDot, containerRef.current);

        if (p1 && p2) {
          result.push({
            key: `right-${connection.image}-${connection.right}`,

            x1: p1.x,
            y1: p1.y,

            x2: p2.x,
            y2: p2.y,
          });
        }
      }
    });

    setSvgLines(result);
  }, [connections, lockedLeft, lockedImages, lockedRight]);

  /* =================================================
     RESIZE
  ================================================= */

  useEffect(() => {
    const update = () => {
      setConnections((prev) => [...prev]);
    };

    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
    };
  }, []);

  /* =================================================
     RENDER
  ================================================= */

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveSentence(null)}
    >
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
            gap: "20px",
            marginBottom: "50px",
          }}
        >
          <ExerciseHeader
            sectionLetter="D"
            title="Read, match, and write."
            subTitle="Match the subject, picture, and action phrase, then complete the sentence."
          />

          {/* =================================================
              SENTENCE BANK
          ================================================= */}

          <div
            style={{
              display: "flex",

              gap: "10px",

              padding: "10px",

              border: "2px dashed #ccc",

              borderRadius: "10px",

              alignItems: "center",

              justifyContent: "center",

              width: "100%",

              flexWrap: "wrap",
            }}
          >
            {sentenceBank.map((item) => (
              <DraggableSentence
                key={item.sentence}
                item={item}
                locked={showAnswerMode || checkCompleted}
                isUsed={usedSentences.includes(item.sentence)}
                keyboardPickedSentence={keyboardPickedSentence}
                onKeyboardPick={handleKeyboardSentencePick}
                sentenceRefs={sentenceRefs}
                playingKey={playingKey}
                playAudio={playAudio}
              />
            ))}
          </div>

          {/* =================================================
              MATCHING AREA
          ================================================= */}

          <div className="matching-area" ref={containerRef}>
            {/* =================================================
                LEFT
            ================================================= */}

            <div className="left-col-wb-unit6-p2-q2">
              {leftParts.map((left, index) => {
                const locked = isLeftLocked(left.id);

                return (
                  <div
                    key={left.id}
                    ref={(el) => {
                      leftRefs.current[left.id] = el;
                    }}
                    className="item-wb-unit6-p2-q2 clickable"
                    data-left-id={left.id}
                  >
                    <span className="num-wb-unit6-p2-q2">{index + 1}</span>

                    <span
                      className={`word-text-wb-unit6-p2-q2 ${
                        selectedLeftId === left.id ? "selected-item" : ""
                      } ${locked ? "disabled-word" : ""}`}
                      role="button"
                      tabIndex={
                        locked || showAnswerMode || checkCompleted ? -1 : 0
                      }
                      aria-label={`${left.text}. Press Enter or Space to start matching.`}
                      onClick={() => handleLeftClick(left.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();

                          startKeyboardMatch(left.id);
                        }
                      }}
                    >
                      {left.text}
                    </span>

                    <div
                      ref={(el) => {
                        leftDotRefs.current[left.id] = el;
                      }}
                      className="dot-wb-unit6-p2-q2 start-dot"
                      tabIndex={-1}
                      aria-hidden="true"
                      onClick={() => handleLeftClick(left.id)}
                    />

                    {wrongLeft.includes(left.id) && (
                      <span
                        className="wrong-mark-wb-unit6-p2-q2"
                        aria-hidden="true"
                      >
                        ✕
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* =================================================
                IMAGES
            ================================================= */}

            <div className="mid-col-wb-unit6-p2-q2">
              {images.map((img) => {
                const locked = isImageLocked(img.id);

                const targetActive =
                  keyboardMatching && keyboardStage === "image";

                return (
                  <div
                    key={img.id}
                    className="item-wb-unit6-p2-q2 clickable"
                    data-image={img.id}
                  >
                    <div
                      ref={(el) => {
                        imageLeftDotRefs.current[img.id] = el;
                      }}
                      className="dot-wb-unit6-p2-q2 end-dot"
                      tabIndex={-1}
                      aria-hidden="true"
                      onClick={() => handleImageClick(img.id)}
                    />

                    <img
                      ref={(el) => {
                        imageRefs.current[img.id] = el;
                      }}
                      src={img.src}
                      alt={img.alt}
                      className={`matched-img2 ${
                        selectedImageId === img.id ? "selected-item" : ""
                      } ${locked ? "disabled-hover" : ""}`}
                      role={targetActive && !locked ? "button" : undefined}
                      tabIndex={
                        targetActive &&
                        !locked &&
                        !showAnswerMode &&
                        !checkCompleted
                          ? 0
                          : -1
                      }
                      aria-label={
                        targetActive && !locked
                          ? `${img.alt} Press Enter or Space to connect this picture.`
                          : img.alt
                      }
                      onClick={() => handleImageClick(img.id)}
                      onFocus={() => {
                        if (
                          keyboardMatching &&
                          keyboardStage === "image" &&
                          firstPoint?.type === "left" &&
                          !locked
                        ) {
                          updateImagePreview(firstPoint, img.id);
                        }
                      }}
                      onKeyDown={(e) => handleImageKeyDown(e, img.id)}
                    />

                    <div
                      ref={(el) => {
                        imageRightDotRefs.current[img.id] = el;
                      }}
                      className="dot-wb-unit6-p2-q2 start-dot"
                      tabIndex={-1}
                      aria-hidden="true"
                      onClick={() => handleImageClick(img.id)}
                    />
                  </div>
                );
              })}
            </div>

            {/* =================================================
                RIGHT
            ================================================= */}

            <div className="right-col-wb-unit6-p2-q2">
              {rightParts.map((right) => {
                const locked = isRightLocked(right.text);

                const targetActive =
                  keyboardMatching && keyboardStage === "right";

                const isPlaying = playingKey === `right-${right.text}`;

                return (
                  <div
                    key={right.id}
                    className="item-wb-unit6-p2-q2 clickable"
                    data-right={right.text}
                  >
                    <div
                      ref={(el) => {
                        rightDotRefs.current[right.text] = el;
                      }}
                      className="dot-wb-unit6-p2-q2 end-dot"
                      tabIndex={-1}
                      aria-hidden="true"
                      onClick={() => handleRightClick(right.text)}
                    />

                    <span
                      ref={(el) => {
                        rightRefs.current[right.text] = el;
                      }}
                      className={`word-text-wb-unit6-p2-q2 ${
                        locked ? "disabled-word" : ""
                      }`}
                      role="button"
                      /*
                          الright يضل بالTab
                          للصوت حتى لو locked.
                        */

                      tabIndex={0}
                      aria-label={
                        targetActive && !locked
                          ? `${right.text} Press Enter or Space to hear and connect this action phrase.`
                          : `Play audio: ${right.text}`
                      }
                      onClick={() => {
                        playAudio(`right-${right.text}`, right.audio);

                        if (
                          firstPoint?.type === "image" &&
                          !locked &&
                          !showAnswerMode &&
                          !checkCompleted
                        ) {
                          handleRightClick(right.text);
                        }
                      }}
                      onFocus={() => {
                        if (
                          keyboardMatching &&
                          keyboardStage === "right" &&
                          firstPoint?.type === "image" &&
                          !locked
                        ) {
                          updateRightPreview(firstPoint, right.text);
                        }
                      }}
                      onKeyDown={(e) => {
                        /*
                            أثناء matching:
                            handler نفسه يتكفل
                            بالصوت + الاتصال.
                          */

                        if (keyboardMatching && keyboardStage === "right") {
                          if (e.key === "Enter" || e.key === " ") {
                            playAudio(`right-${right.text}`, right.audio);
                          }

                          handleRightKeyDown(e, right.text);

                          return;
                        }

                        /*
                            Audio only
                          */

                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();

                          playAudio(`right-${right.text}`, right.audio);
                        }
                      }}
                      style={{
                        position: "relative",
                      }}
                    >
                      {right.text}

                      {isPlaying && (
                        <FaVolumeUp
                          size={14}
                          aria-hidden="true"
                          style={{
                            marginLeft: "6px",
                          }}
                        />
                      )}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* =================================================
                LINES
            ================================================= */}

            <svg
              className="lines-layer"
              aria-hidden="true"
              style={{
                pointerEvents: "none",
              }}
            >
              {svgLines.map((line) => (
                <line
                  key={line.key}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="red"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              ))}

              {/* =========================================
                  KEYBOARD PREVIEW ONLY
              ========================================= */}

              {keyboardMatching && previewLine && (
                <line
                  x1={previewLine.x1}
                  y1={previewLine.y1}
                  x2={previewLine.x2}
                  y2={previewLine.y2}
                  stroke="red"
                  strokeWidth="3"
                  strokeDasharray="6 4"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </div>

          {/* =================================================
              WRITE SECTION
          ================================================= */}

          <div className="write-section-wb-unit6-p2-q2">
            {Object.keys(correctSentences).map((id) => (
              <div key={id} className="write-line-wb-unit6-p2-q2">
                <span>{id}</span>

                <DroppableWriteBox
                  id={Number(id)}
                  value={written[id] || ""}
                  isWrong={wrongInputs.includes(Number(id))}
                  locked={isWriteLocked(Number(id))}
                  showAnswerMode={showAnswerMode}
                  checkCompleted={checkCompleted}
                  keyboardPickedSentence={keyboardPickedSentence}
                  focusedWriteId={focusedWriteId}
                  setFocusedWriteId={setFocusedWriteId}
                  writeRefs={writeRefs}
                  getAvailableWriteIds={getAvailableWriteIds}
                  onKeyboardDrop={handleKeyboardSentenceDrop}
                  onKeyboardRemove={handleKeyboardRemoveWritten}
                  onCancelKeyboardPick={cancelKeyboardSentence}
                  onRemove={handleRemoveWritten}
                />
              </div>
            ))}
          </div>
        </div>

        {/* =================================================
            BUTTONS
        ================================================= */}

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

      {/* =================================================
          DRAG OVERLAY
      ================================================= */}

      <DragOverlay>
        {activeSentence && (
          <div
            style={{
              padding: "2px 5px",

              border: "2px solid #2c5287",

              borderRadius: "8px",

              background: "white",

              fontWeight: "bold",

              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",

              cursor: "grabbing",
            }}
          >
            {activeSentence}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default WB_Unit6_Page2_Q2;
