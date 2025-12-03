import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "./Popup.css";

const Popup = ({
  isOpen,
  onClose,
  children,
  isAudio = false,
  isVideo = false,
}) => {
  if (!isOpen) return null;
  

  return ReactDOM.createPortal(
    <div className="popup-overlay">
      <div
        className={`popup-content ${
          isAudio ? "audio-size" : isVideo ? "video-size" : "fullscreen-size"
        }`}
      >
        <button
          className={`popup-close-btn ${
          isAudio ? "audio" : isVideo ? "video" : ""
        }`}
          onClick={onClose}

        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        {children}
      </div>
    </div>,
    document.body
  );
};

export default Popup;
