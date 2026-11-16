const SCORM_API = "API";
const COURSE_TABS = new Set(["student", "work", "teacher"]);
const SESSION_STARTED_AT = Date.now();

let api = null;
let initialized = false;
let completed = false;

function findApiInWindow(startWindow) {
  let currentWindow = startWindow;

  for (let depth = 0; currentWindow && depth < 500; depth += 1) {
    try {
      if (currentWindow[SCORM_API]) return currentWindow[SCORM_API];
      if (currentWindow.parent === currentWindow) break;
      currentWindow = currentWindow.parent;
    } catch {
      break;
    }
  }

  return null;
}

function findScormApi() {
  const parentApi = findApiInWindow(window);
  if (parentApi) return parentApi;

  try {
    return window.opener ? findApiInWindow(window.opener) : null;
  } catch {
    return null;
  }
}

function getValue(element) {
  if (!initialized || !api) return "";

  try {
    return api.LMSGetValue(element) || "";
  } catch {
    return "";
  }
}

function setValue(element, value) {
  if (!initialized || !api) return false;

  try {
    return api.LMSSetValue(element, String(value)) === "true";
  } catch {
    return false;
  }
}

function commit() {
  if (!initialized || !api) return;

  try {
    api.LMSCommit("");
  } catch {
    // A disconnected LMS should not interrupt the reading experience.
  }
}

function readProgress() {
  try {
    const saved = JSON.parse(getValue("cmi.suspend_data") || "{}");
    return {
      counts: saved.counts || {},
      visited: saved.visited || {},
    };
  } catch {
    return { counts: {}, visited: {} };
  }
}

function writeProgress(progress) {
  setValue("cmi.suspend_data", JSON.stringify(progress));

  const requiredTabsComplete = [...COURSE_TABS].every((tab) => {
    const count = Number(progress.counts[tab]);
    const visited = progress.visited[tab] || "";
    return count > 0 && visited.length >= count && !visited.slice(0, count).includes("0");
  });

  if (requiredTabsComplete) {
    completed = true;
    setValue("cmi.core.lesson_status", "completed");
    setValue("cmi.core.exit", "");
  } else if (!completed) {
    setValue("cmi.core.lesson_status", "incomplete");
    setValue("cmi.core.exit", "suspend");
  }

  commit();
}

function formatSessionTime(milliseconds) {
  const totalSeconds = Math.max(0, milliseconds) / 1000;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = (totalSeconds % 60).toFixed(2).padStart(5, "0");
  return `${String(hours).padStart(4, "0")}:${String(minutes).padStart(2, "0")}:${seconds}`;
}

function finishSession() {
  if (!initialized || !api) return;

  setValue("cmi.core.session_time", formatSessionTime(Date.now() - SESSION_STARTED_AT));
  if (!completed) setValue("cmi.core.exit", "suspend");
  commit();

  try {
    api.LMSFinish("");
  } catch {
    // The LMS may already have closed the session.
  }

  initialized = false;
}

export function initializeScorm() {
  if (initialized) return;

  api = findScormApi();
  if (!api) return;

  try {
    initialized = api.LMSInitialize("") === "true";
  } catch {
    initialized = false;
  }

  if (!initialized) return;

  const status = getValue("cmi.core.lesson_status");
  completed = status === "completed" || status === "passed";

  window.addEventListener("pagehide", finishSession, { once: true });
  window.addEventListener("beforeunload", finishSession, { once: true });
}

export function getScormLaunchLocation() {
  const location = getValue("cmi.core.lesson_location");
  const match = /^(student|work|flash|poster|posterVocab):(\d{1,6})$/.exec(location);
  if (!match) return null;

  return { tab: match[1], index: Number(match[2]) };
}

export function saveScormLocation(tab, index) {
  if (!initialized) return;
  setValue("cmi.core.lesson_location", `${tab}:${Math.max(0, Math.floor(index))}`);
  commit();
}

export function trackScormPageVisits(tab, pageIndexes, pageCount) {
  if (!initialized || !COURSE_TABS.has(tab)) return;

  const progress = readProgress();
  const safeCount = Math.max(0, Math.floor(pageCount));
  const previous = (progress.visited[tab] || "").padEnd(safeCount, "0");
  const bits = previous.slice(0, safeCount).split("");

  for (const pageIndex of pageIndexes) {
    if (Number.isInteger(pageIndex) && pageIndex >= 0 && pageIndex < safeCount) {
      bits[pageIndex] = "1";
    }
  }

  progress.counts[tab] = safeCount;
  progress.visited[tab] = bits.join("");
  writeProgress(progress);
}
