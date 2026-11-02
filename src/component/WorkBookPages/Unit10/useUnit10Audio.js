import { useCallback, useEffect, useRef, useState } from "react";
import "./unit10Audio.css";

export default function useUnit10Audio() {
  const audioRef = useRef(null);
  const tokenRef = useRef(0);
  const [activeAudioKey, setActiveAudioKey] = useState(null);

  const stopAudio = useCallback(() => {
    tokenRef.current += 1;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current = null;
    }
    setActiveAudioKey(null);
  }, []);

  const playAudio = useCallback((key, source) => {
    if (!source) return;
    stopAudio();
    const token = tokenRef.current;
    const audio = new Audio(source);
    audioRef.current = audio;
    setActiveAudioKey(key);
    const finish = () => {
      if (tokenRef.current === token && audioRef.current === audio) {
        audioRef.current = null;
        setActiveAudioKey(null);
      }
    };
    audio.onended = finish;
    audio.onerror = finish;
    audio.play().catch(finish);
  }, [stopAudio]);

  const playAudioSequence = useCallback((key, sources) => {
    const queue = sources.filter(Boolean);
    if (!queue.length) return;
    stopAudio();
    const token = tokenRef.current;
    setActiveAudioKey(key);
    const playNext = (index) => {
      if (tokenRef.current !== token) return;
      if (index >= queue.length) {
        audioRef.current = null;
        setActiveAudioKey(null);
        return;
      }
      const audio = new Audio(queue[index]);
      audioRef.current = audio;
      audio.onended = () => playNext(index + 1);
      audio.onerror = () => playNext(index + 1);
      audio.play().catch(() => playNext(index + 1));
    };
    playNext(0);
  }, [stopAudio]);

  useEffect(() => stopAudio, [stopAudio]);
  return { activeAudioKey, playAudio, playAudioSequence, stopAudio };
}
