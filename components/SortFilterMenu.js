"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_SORT = "newest";

function buildUrl(handle, sort, instock) {
  const qs = new URLSearchParams();
  if (sort !== DEFAULT_SORT) qs.set("sort", sort);
  if (instock) qs.set("instock", "1");
  const query = qs.toString();
  return query ? `/collections/${handle}?${query}` : `/collections/${handle}`;
}

export default function SortFilterMenu({ handle, sortOptions, sort, instock }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const currentLabel = sortOptions.find((o) => o.value === sort)?.label || "Sort";

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
        <span>
          {currentLabel}
          {instock ? " · In stock" : ""}
        </span>
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
        <div className="category-menu-panel sort-menu-panel">
          {sortOptions.map((opt) => (
            <a
              key={opt.value}
              href={buildUrl(handle, opt.value, instock)}
              className={`category-menu-item ${sort === opt.value ? "selected" : ""}`}
              onClick={() => setOpen(false)}
            >
              {opt.label}
            </a>
          ))}
          <a
            href={buildUrl(handle, sort, !instock)}
            className={`category-menu-item sort-menu-divider ${instock ? "selected" : ""}`}
            onClick={() => setOpen(false)}
          >
            In stock only
          </a>
        </div>
      )}
    </div>
  );
}
