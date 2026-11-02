import { useRef, useState } from "react";

const focusSoon = (node) => window.requestAnimationFrame(() => node?.focus());

export default function useReviewMatching({
  sourceIds,
  targetIds,
  connections,
  setConnections,
  lockedSources,
  onConnectionsEdited,
}) {
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [keyboardMatching, setKeyboardMatching] = useState(false);
  const [keyboardTarget, setKeyboardTarget] = useState(null);
  const endpointRefs = useRef(new Map());
  const dotRefs = useRef(new Map());
  const containerRef = useRef(null);

  const keyFor = (side, id) => `${side}:${id}`;
  const lockedTargets = new Set(
    Array.from(lockedSources)
      .map((sourceId) => connections[sourceId])
      .filter(Boolean),
  );

  const registerEndpoint = (side, id, node) => {
    const key = keyFor(side, id);
    if (node) endpointRefs.current.set(key, node);
    else endpointRefs.current.delete(key);
  };

  const registerDot = (side, id, node) => {
    const key = keyFor(side, id);
    if (node) dotRefs.current.set(key, node);
    else dotRefs.current.delete(key);
  };

  const isLocked = (side, id) =>
    side === "source" ? lockedSources.has(id) : lockedTargets.has(id);

  const availableOpposite = (side) =>
    (side === "source" ? targetIds : sourceIds).filter(
      (id) => !isLocked(side === "source" ? "target" : "source", id),
    );

  const cancel = () => {
    const origin = selectedEndpoint;
    setSelectedEndpoint(null);
    setKeyboardMatching(false);
    setKeyboardTarget(null);
    if (origin) focusSoon(endpointRefs.current.get(keyFor(origin.side, origin.id)));
  };

  const commit = (sourceId, targetId) => {
    if (lockedSources.has(sourceId) || lockedTargets.has(targetId)) return;
    let displacedSource = null;
    Object.entries(connections).forEach(([existingSource, existingTarget]) => {
      if (existingTarget === targetId && existingSource !== sourceId) {
        displacedSource = existingSource;
      }
    });
    setConnections((current) => {
      const next = { ...current };
      if (displacedSource) delete next[displacedSource];
      next[sourceId] = targetId;
      return next;
    });
    onConnectionsEdited?.([sourceId, displacedSource].filter(Boolean));
    setSelectedEndpoint(null);
    setKeyboardMatching(false);
    setKeyboardTarget(null);
  };

  const activateEndpoint = (side, id, viaKeyboard = false) => {
    if (isLocked(side, id)) return;
    if (!selectedEndpoint) {
      const opposite = availableOpposite(side);
      if (!opposite.length) return;
      setSelectedEndpoint({ side, id });
      setKeyboardMatching(viaKeyboard);
      if (viaKeyboard) {
        const target = opposite[0];
        setKeyboardTarget({ side: side === "source" ? "target" : "source", id: target });
        focusSoon(endpointRefs.current.get(keyFor(side === "source" ? "target" : "source", target)));
      }
      return;
    }

    if (selectedEndpoint.side === side) {
      if (selectedEndpoint.id === id) cancel();
      else setSelectedEndpoint({ side, id });
      return;
    }

    const sourceId = side === "source" ? id : selectedEndpoint.id;
    const targetId = side === "target" ? id : selectedEndpoint.id;
    commit(sourceId, targetId);
  };

  const handleKeyDown = (event, side, id) => {
    if (event.key === "Escape" && selectedEndpoint) {
      event.preventDefault();
      cancel();
      return;
    }

    if (event.key === "Tab" && keyboardMatching && selectedEndpoint) {
      const oppositeSide = selectedEndpoint.side === "source" ? "target" : "source";
      if (side !== oppositeSide) return;
      const candidates = availableOpposite(selectedEndpoint.side);
      if (!candidates.length) return;
      event.preventDefault();
      const currentIndex = Math.max(0, candidates.indexOf(id));
      const direction = event.shiftKey ? -1 : 1;
      const nextId = candidates[(currentIndex + direction + candidates.length) % candidates.length];
      setKeyboardTarget({ side: oppositeSide, id: nextId });
      focusSoon(endpointRefs.current.get(keyFor(oppositeSide, nextId)));
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activateEndpoint(side, id, true);
    }
  };

  const pointFor = (side, id) => {
    const container = containerRef.current;
    const dot = dotRefs.current.get(keyFor(side, id));
    if (!container || !dot) return null;
    const containerRect = container.getBoundingClientRect();
    const dotRect = dot.getBoundingClientRect();
    return {
      x: dotRect.left - containerRect.left + dotRect.width / 2,
      y: dotRect.top - containerRect.top + dotRect.height / 2,
    };
  };

  const lineFor = (sourceId, targetId) => {
    const start = pointFor("source", sourceId);
    const end = pointFor("target", targetId);
    return start && end ? { x1: start.x, y1: start.y, x2: end.x, y2: end.y } : null;
  };

  const previewLine =
    keyboardMatching && selectedEndpoint && keyboardTarget
      ? selectedEndpoint.side === "source"
        ? lineFor(selectedEndpoint.id, keyboardTarget.id)
        : lineFor(keyboardTarget.id, selectedEndpoint.id)
      : null;

  return {
    containerRef,
    selectedEndpoint,
    keyboardMatching,
    keyboardTarget,
    registerEndpoint,
    registerDot,
    activateEndpoint,
    handleKeyDown,
    isLocked,
    lineFor,
    previewLine,
    cancel,
  };
}
