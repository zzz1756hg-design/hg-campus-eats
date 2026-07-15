"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export function CollapsibleResults({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="flex items-center justify-between text-sm text-muted-foreground"
      >
        <span>{label}</span>
        <span className="flex items-center gap-1 font-medium text-foreground">
          {expanded ? "목록 접어두기" : "목록 펼치기"}
          {expanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </span>
      </button>
      {expanded && children}
    </div>
  );
}
