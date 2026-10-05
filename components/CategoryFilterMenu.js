"use client";

import { useEffect, useRef, useState } from "react";

export default function CategoryFilterMenu({ categories, current }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const currentName = categories.find((c) => c.handle === current)?.name || "Categories";

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    function onKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="category-menu" ref={wrapRef}>
      <button
        type="button"
        className="category-menu-btn"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>{currentName}</span>
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s ease" }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="category-menu-panel">
          {categories.map((cat) => (
            <a
              key={cat.handle}
              href={`/collections/${cat.handle}`}
              className={`category-menu-item ${current === cat.handle ? "selected" : ""}`}
              onClick={() => setOpen(false)}
            >
              {cat.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
