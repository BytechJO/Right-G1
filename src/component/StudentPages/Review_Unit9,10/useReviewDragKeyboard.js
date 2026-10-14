import { useRef, useState } from "react";
import "./reviewQuestionAudio.css";

const focusSoon = (node) => {
  window.requestAnimationFrame(() => node?.focus());
};

export default function useReviewDragKeyboard({
  targetIds,
  lockedIds,
  getValue,
  onPlace,
  onRemove,
}) {
  const [picked, setPicked] = useState(null);
  const [focusedTargetId, setFocusedTargetId] = useState(null);
  const bankRefs = useRef(new Map());
  const targetRefs = useRef(new Map());

  const availableTargets = targetIds.filter((id) => !lockedIds.has(id));

  const registerBank = (id, node) => {
    if (node) bankRefs.current.set(id, node);
    else bankRefs.current.delete(id);
  };

  const registerTarget = (id, node) => {
    if (node) targetRefs.current.set(id, node);
    else targetRefs.current.delete(id);
  };

  const cancelPick = () => {
    const originId = picked?.originId;
    setPicked(null);
    setFocusedTargetId(null);
    if (originId) focusSoon(bankRefs.current.get(originId));
  };

  const startPick = (word, originId) => {
    if (!availableTargets.length) return;
    setPicked({ word, originId });
    const firstTarget = availableTargets[0];
    setFocusedTargetId(firstTarget);
    focusSoon(targetRefs.current.get(firstTarget));
  };

  const handleBankKeyDown = (event, word, originId, canPick = true) => {
    if (event.key !== "Enter" && event.key !== " ") return false;
    event.preventDefault();
    if (canPick) startPick(word, originId);
    return true;
  };

  const handleTargetKeyDown = (event, targetId) => {
    if (lockedIds.has(targetId)) return;

    if (picked) {
      if (event.key === "Escape") {
        event.preventDefault();
        cancelPick();
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const { word, originId } = picked;
        onPlace(targetId, word);
        setPicked(null);
        setFocusedTargetId(null);
        focusSoon(bankRefs.current.get(originId));
        return;
      }

      if (event.key === "Tab" && availableTargets.length) {
        event.preventDefault();
        const currentIndex = Math.max(0, availableTargets.indexOf(targetId));
        const direction = event.shiftKey ? -1 : 1;
        const nextIndex =
          (currentIndex + direction + availableTargets.length) %
          availableTargets.length;
        const nextTarget = availableTargets[nextIndex];
        setFocusedTargetId(nextTarget);
        focusSoon(targetRefs.current.get(nextTarget));
      }
      return;
    }

    if ((event.key === "Enter" || event.key === " ") && getValue(targetId)) {
      event.preventDefault();
      const returnedWord = getValue(targetId);
      onRemove(targetId);
      focusSoon(bankRefs.current.get(`bank-${returnedWord}`));
    }
  };

  return {
    picked,
    focusedTargetId,
    registerBank,
    registerTarget,
    handleBankKeyDown,
    handleTargetKeyDown,
    targetTabIndex: (targetId) =>
      lockedIds.has(targetId) ? -1 : picked || getValue(targetId) ? 0 : -1,
    previewFor: (targetId) =>
      picked && focusedTargetId === targetId ? picked.word : null,
    cancelPick,
  };
}
