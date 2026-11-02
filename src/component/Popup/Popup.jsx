import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "./Popup.css";

const Popup = ({ isOpen, onClose, type = "default", children }) => {
  const popupRef = useRef(null);
  const previousFocusRef = useRef(null);

  const sizeClass = {
    audio: "audio-size",
    video: "video-size",
    exercise: "exercise-size",
    image: "image-size",
    html: "fullscreen-size",
    default: "fullscreen-size",
  }[type];

  useEffect(() => {
    if (!isOpen) return;

    // العنصر اللي فتح الـ popup
    previousFocusRef.current = document.activeElement;

    const popup = popupRef.current;

    if (!popup) return;

    // العناصر اللي ممكن يوصلها Tab داخل الـ popup
    const getFocusableElements = () =>
      Array.from(
        popup.querySelectorAll(
          `
          button:not([disabled]),
          [href],
          input:not([disabled]),
          select:not([disabled]),
          textarea:not([disabled]),
          [tabindex]:not([tabindex="-1"])
          `,
        ),
      ).filter(
        (element) =>
          !element.hasAttribute("disabled") &&
          element.getAttribute("aria-hidden") !== "true",
      );

    /*
      بعد ما يفتح:
      إذا في عنصر تفاعلي جواته دخّل الـ focus عليه.
      غير هيك focus على البوب نفسه.
    */
    requestAnimationFrame(() => {
      const focusable = getFocusableElements();

      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        popup.focus();
      }
    });

    const handleKeyDown = (e) => {
      // ============================
      // ESC CLOSE
      // ============================
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      // ============================
      // FOCUS TRAP
      // ============================
      if (e.key !== "Tab") return;

      const focusable = getFocusableElements();

      /*
        لو ما في أي عناصر تفاعلية:
        خليه يضل على الـ dialog نفسه.
      */
      if (focusable.length === 0) {
        e.preventDefault();
        popup.focus();
        return;
      }

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];

      // Shift + Tab على أول عنصر
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
        return;
      }

      // Tab على آخر عنصر
      if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      /*
        لما يتسكر:
        رجع الـ focus للزر اللي فتحه.
      */
      requestAnimationFrame(() => {
        previousFocusRef.current?.focus?.();
      });
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className={`popup-overlay popup-${type}`}
      onMouseDown={(e) => {
        /*
          إذا كبس على الخلفية نفسها فقط
          وليس داخل المحتوى.
        */
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={popupRef}
        className={`popup-content ${sizeClass}`}
        role="dialog"
        aria-modal="true"
        aria-label="Dialog"
        tabIndex={-1}
      >
        <button
          type="button"
          className={`popup-close-btn type-${type}`}
          onClick={onClose}
          aria-label="Close dialog"
        >
          <FontAwesomeIcon icon={faTimes} aria-hidden="true" />
        </button>

        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Popup;
