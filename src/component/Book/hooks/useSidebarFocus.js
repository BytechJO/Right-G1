import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

export default function useSidebarFocus(isOpen, close, panelRef) {
  const lastFocused = useRef(null);
  const closeRef = useRef(close);
  closeRef.current = close;

  useEffect(() => {
    if (!isOpen) return;

    // نحفظ الزر الي فتح الـ sidebar عشان نرجّع التركيز إلو
    lastFocused.current = document.activeElement;
    const panel = panelRef.current;

    // نقل التركيز لأول عنصر جوا الـ sidebar
    const raf = requestAnimationFrame(() => {
      const first = panel?.querySelector(FOCUSABLE);
      (first || panel)?.focus();
    });

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeRef.current();
        return;
      }

      if (e.key !== "Tab" || !panel) return;

      // حبس التركيز جوا الـ sidebar
      const items = Array.from(panel.querySelectorAll(FOCUSABLE));

      if (items.length === 0) {
        e.preventDefault();
        panel.focus();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && (active === first || active === panel)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown);
      // رجوع التركيز للزر الي فتح الـ sidebar
      lastFocused.current?.focus?.();
    };
  }, [isOpen, panelRef]);
}
