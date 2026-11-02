import { useCallback, useEffect, useRef, useState } from "react";
import "./unit10QuestionAudio.css";

export default function useUnit10Audio() {
  const audioRef = useRef(null);
  const sequenceTokenRef = useRef(0);
  const [activeAudioKey, setActiveAudioKey] = useState(null);

  const stopAudio = useCallback(() => {
    sequenceTokenRef.current += 1;
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
      const token = sequenceTokenRef.current;
      const audio = new Audio(source);
      audioRef.current = audio;
      setActiveAudioKey(key);

      const finish = () => {
        if (sequenceTokenRef.current === token && audioRef.current === audio) {
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

  const playAudioSequence = useCallback(
    (key, sources) => {
      const playableSources = sources.filter(Boolean);
      if (!playableSources.length) return;
      stopAudio();
      const token = sequenceTokenRef.current;
      setActiveAudioKey(key);
      let index = 0;

      const playNext = () => {
        if (sequenceTokenRef.current !== token) return;
        if (index >= playableSources.length) {
          audioRef.current = null;
          setActiveAudioKey(null);
          return;
        }

        const audio = new Audio(playableSources[index]);
        index += 1;
        audioRef.current = audio;
        audio.onended = playNext;
        audio.onerror = playNext;
        audio.play().catch(playNext);
      };

      playNext();
    },
    [stopAudio],
  );

  useEffect(() => stopAudio, [stopAudio]);

  return { activeAudioKey, playAudio, playAudioSequence, stopAudio };
}
