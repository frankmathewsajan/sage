import { memo } from "react";
import type { Problem } from "../types";
import { Card, Badge } from "./shared/UI";

interface PatternBasketsProps {
  problemsByPattern: Record<string, Problem[]>;
}

export const PatternBaskets = memo(function PatternBaskets({ problemsByPattern }: PatternBasketsProps) {
  if (Object.keys(problemsByPattern).length === 0) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-base font-semibold text-slate-900">Problems by Pattern (Needs Review)</h2>
      <div className="space-y-2.5">
        {Object.entries(problemsByPattern).map(([patternName, patternProblems]) => (
          <div key={patternName} className="rounded-lg border border-slate-200 bg-linear-to-r from-slate-50 to-gray-50 p-3">
            <div className="mb-1.5 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">{patternName}</h3>
              <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-[10px] font-semibold text-slate-700">
                {patternProblems.length} problem{patternProblems.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="space-y-0.5">
              {patternProblems.map((problem) => (
                <a
                  key={problem.id}
                  href={problem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs text-blue-600 hover:text-blue-700"
                >
                  • {problem.title}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
