import { useRef, useState } from "react";

const activateKey = (event) => event.key === "Enter" || event.key === " ";

export default function useUnit10TabDrag({
  itemIds,
  targetIds,
  getTargetIds,
  getItemIdsForItem,
  isItemDisabled,
  isTargetDisabled,
  onPlace,
}) {
  const [keyboardItemId, setKeyboardItemId] = useState(null);
  const [keyboardTargetId, setKeyboardTargetId] = useState(null);
  const itemRefs = useRef({});
  const targetRefs = useRef({});

  const availableTargets = (itemId = keyboardItemId) => (getTargetIds ? getTargetIds(itemId) : targetIds).filter((id) => !isTargetDisabled(id));
  const focusItem = (id) => requestAnimationFrame(() => itemRefs.current[id]?.focus());
  const focusTarget = (id) => requestAnimationFrame(() => targetRefs.current[id]?.focus());

  const pickItem = (id) => {
    if (isItemDisabled(id)) return;
    const targets = availableTargets(id);
    if (!targets.length) return;
    setKeyboardItemId(id);
    setKeyboardTargetId(targets[0]);
    focusTarget(targets[0]);
  };

  const handleItemKeyDown = (event, id) => {
    if (!activateKey(event)) return;
    event.preventDefault();
    pickItem(id);
  };

  const cancel = () => {
    const origin = keyboardItemId;
    setKeyboardItemId(null);
    setKeyboardTargetId(null);
    if (origin) focusItem(origin);
  };

  const focusFirstUnused = (placedId) => {
    const candidates = getItemIdsForItem ? getItemIdsForItem(placedId) : itemIds;
    const first = candidates.find((id) => id !== placedId && !isItemDisabled(id));
    focusItem(first || placedId);
  };

  const handleTargetKeyDown = (event, targetId) => {
    if (!keyboardItemId) return;
    if (event.key === "Escape") {
      event.preventDefault();
      cancel();
      return;
    }
    if (event.key === "Tab") {
      event.preventDefault();
      const targets = availableTargets();
      const index = targets.indexOf(targetId);
      const direction = event.shiftKey ? -1 : 1;
      const next = targets[(index + direction + targets.length) % targets.length];
      setKeyboardTargetId(next);
      focusTarget(next);
      return;
    }
    if (activateKey(event)) {
      event.preventDefault();
      const placedId = keyboardItemId;
      onPlace(placedId, targetId);
      setKeyboardItemId(null);
      setKeyboardTargetId(null);
      focusFirstUnused(placedId);
    }
  };

  return {
    keyboardItemId,
    keyboardTargetId,
    pickItem,
    handleItemKeyDown,
    handleTargetKeyDown,
    registerItem: (id, element) => { itemRefs.current[id] = element; },
    registerTarget: (id, element) => { targetRefs.current[id] = element; },
    focusItemById: focusItem,
    focusTarget: (id) => setKeyboardTargetId(id),
    cancel,
  };
}
