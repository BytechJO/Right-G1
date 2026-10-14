import { useCallback, useEffect, useRef, useState } from "react";
import "./reviewQuestionAudio.css";

export default function useReviewAudio() {
  const audioRef = useRef(null);
  const playTokenRef = useRef(0);
  const [activeAudioKey, setActiveAudioKey] = useState(null);

  const stopAudio = useCallback(() => {
    playTokenRef.current += 1;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current = null;
    }

    setActiveAudioKey(null);
  }, []);

  const playAudio = useCallback(
    (key, source) => {
      if (!source) return;

      stopAudio();
      const token = playTokenRef.current;
      const audio = new Audio(source);
      audioRef.current = audio;
      setActiveAudioKey(key);

      const finish = () => {
        if (playTokenRef.current === token && audioRef.current === audio) {
          audioRef.current = null;
          setActiveAudioKey(null);
        }
      };

      audio.onended = finish;
      audio.onerror = finish;
      audio.play().catch(finish);
    },
    [stopAudio],
  );

  useEffect(() => stopAudio, [stopAudio]);

  return { activeAudioKey, playAudio, stopAudio };
}
