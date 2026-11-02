import { useRef, useState } from "react";
import audioBtn from "../../assets/unit1/imgs/Page 01/Audio btn.svg";
import "./FlashCardViewer.css";
export default function FlashCardViewer({ card }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const playSound = (soundPath) => {
    const audio = audioRef.current;
    if (!audio) return;

    document.querySelectorAll("audio, video").forEach((media) => {
      if (media !== audio) media.pause();
    });
    audio.src = soundPath;
    audio.currentTime = 0;
    setIsPlaying(true);
    audio.play().catch(() => setIsPlaying(false));
  };

  const openFlashcardAudio = () => {
    if (card.audio) playSound(card.audio);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.stopPropagation();

      if (!event.repeat) {
        openFlashcardAudio();
      }
    }
  };

  return (
    <div
      className="page1-img-wrapper-flashcard"
      style={{ backgroundImage: `url(${card.img})` }}
    >
      {card.audio && (
        <div
          className="audio-btn-wrapper"
          role="button"
          tabIndex={0}
          aria-label="Play flashcard audio"
          aria-pressed={isPlaying}
          onClick={openFlashcardAudio}
          onKeyDown={handleKeyDown}
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
      )}
      <audio
        ref={audioRef}
        id={`audio-${card.pageId}`}
        data-page-id={card.pageId}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        style={{ display: "none" }}
      />
    </div>
  );
}
