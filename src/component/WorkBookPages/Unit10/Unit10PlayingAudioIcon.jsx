import { FaVolumeUp } from "react-icons/fa";

export default function Unit10PlayingAudioIcon({ active = true }) {
  if (!active) return null;
  return <span className="wb-unit10-playing-audio-icon" aria-hidden="true"><FaVolumeUp /></span>;
}
