import React, { useState, useRef, useEffect } from "react";
import audioBtn from "../../../assets/unit1/imgs/Page 01/Audio btn.svg";
import AudioWithCaption from "../../AudioWithCaption";
import "../../../index.css";
import "./Unit1_PosterMain.css";

const activationKeys = {
  onKeyDown: (event) => {
    if (
      event.target !== event.currentTarget ||
      (event.key !== "Enter" && event.key !== " ")
    )
      return;
    event.preventDefault();
    event.stopPropagation();
    if (!event.repeat) event.currentTarget.click();
  },
  onKeyUp: (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.stopPropagation();
    }
  },
};

const PosterMain = ({ openPopup, data }) => {
  const {
    image,
    nums,
    words,
    sounds,
    positions,
    vocabularyAudio,
    captions,
    vocabBottom,
    vocabRight,
    fontSize,
  } = data;
  console.log("Poster image:", data.unit, image);
  const [clickedIndex, setClickedIndex] = useState(null);
  const wordRefs = useRef(sounds.map(() => React.createRef()));

  const playbackGeneration = useRef(0);

  useEffect(() => {
    const audios = wordRefs.current.map((ref) => ref.current);
    return () => {
      playbackGeneration.current += 1;
      audios.forEach((audio) => {
        if (audio) {
          audio.onended = audio.onerror = null;
          audio.pause();
        }
      });
    };
  }, []);

  const playWordAudio = (index) => {
    const generation = ++playbackGeneration.current;
    wordRefs.current.forEach((ref) => {
      if (ref.current) {
        ref.current.onended = ref.current.onerror = null;
        ref.current.pause();
        ref.current.currentTime = 0;
      }
    });

    const audio = wordRefs.current[index].current;
    if (!audio) return;

    audio.currentTime = 0;
    const finish = () => {
      if (generation === playbackGeneration.current) setClickedIndex(null);
    };
    audio.onended = audio.onerror = finish;
    setClickedIndex(index);
    audio.play().catch(finish);
  };

  return (
    <div data-poster-unit={data.unit} style={{ width: "850px" }}>
      <style>{`[data-poster-unit] :focus-visible {outline:3px solid #2563eb !important;outline-offset:3px;border-radius:50%;}`}</style>
      {/* Image + Words */}
      <div
        className="poster-wrapper"
        style={{
          backgroundImage: `url(${image})`,
        }}
      >
        {/* Words */}
        <div
          className="vocab_container_poster_vocab"
          style={{
            bottom: vocabBottom,
            right: vocabRight,
            height: "2%",
            fontSize: fontSize,
          }}
        >
          {words.map((text, i) => (
            <h6
              key={i}
              role="button"
              tabIndex={0}
              data-poster-control
              {...activationKeys}
              aria-label={`Listen to ${text}`}
              aria-pressed={clickedIndex === i}
              className={clickedIndex === i ? "active" : ""}
              onClick={() => playWordAudio(i)}
            >
              {i + 1} {text}
            </h6>
          ))}
        </div>

        {/* Numbers */}
        {nums.map((num, i) => (
          <img
            key={i}
            src={num}
            alt=""
            aria-hidden="true"
            className={`num-img-posterVocab ${
              clickedIndex === i ? "active" : ""
            }`}
            style={{
              position: "absolute",
              top: positions[i]?.top,
              left: positions[i]?.left,
              height: "1.5vw",
            }}
          />
        ))}
      </div>

      {/* Audio Button */}
      <div
        className="audio-btn-poster hover:scale-110 transition"
        role="button"
        tabIndex={0}
        data-poster-control
        {...activationKeys}
        aria-label="Open poster vocabulary audio"
        onClick={() => {
          playbackGeneration.current += 1;
          wordRefs.current.forEach((ref) => {
            if (ref.current) {
              ref.current.onended = ref.current.onerror = null;
              ref.current.pause();
            }
          });
          setClickedIndex(null);
          openPopup(
            "audio",
            <AudioWithCaption
              src={vocabularyAudio}
              captions={captions}
              pageId={`poster_unit${data.unit}_vocabulary`}
            />,
          );
        }}
      >
        <svg width="22" height="22" viewBox="0 0 90 90">
          <image
            href={audioBtn}
            x="0"
            y="0"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
          />
        </svg>
      </div>

      {/* Hidden audios */}
      {sounds.map((src, i) => (
        <audio key={i} ref={wordRefs.current[i]} src={src} />
      ))}
    </div>
  );
};

export default PosterMain;
