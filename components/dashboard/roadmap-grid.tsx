"use client";

import { rows, phaseColors, Phase, Step } from "@/lib/data/roadmap";

export function RoadmapGrid() {
  return (
    <div className="flex flex-col gap-6">
      {rows.map((row: Phase[], rowIndex: number) => (
        <div key={rowIndex} className="flex w-full filter drop-shadow-md">
          {row.map((phase: Phase, colIndex: number) => {
            // Determine if this is the Left or Right card
            const isLeft = colIndex === 0;

            // Calculate the original index to fetch the correct color
            const originalIndex = rowIndex * 2 + colIndex;

            // Styles based on position (Left vs Right)
            // Left: Cut Bottom-Right corner, Rounded Left
            // Right: Cut Top-Left corner, Rounded Right, Negative Margin to pull it left
            const positionClasses = isLeft
              ? "rounded-l-2xl z-10 pr-16 [clip-path:polygon(0_0,100%_0,90%_100%,0_100%)]"
              : "rounded-r-2xl z-0 pl-16 -ml-10 [clip-path:polygon(10%_0,100%_0,100%_100%,0%_100%)]";

            return (
              <div
                key={phase.title}
                className={`w-1/2 p-8 border border-slate-100 ${positionClasses} ${phaseColors[originalIndex]}`}
              >
                <div className="mb-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {phase.title.split(":")[0]}
                  </h3>
                  <p className="text-base font-semibold text-slate-800">{phase.title.split(":")[1]}</p>
                </div>
                <div className="space-y-2">
                  {phase.items.map((item: Step) => (
                    <div
                      key={item.title}
                      className={'rounded-lg border border-slate-100 bg-white/90 shadow-[0_1px_0_rgba(15,23,42,0.04)]'}
                      // Keeping the item's internal clip-path as originally requested
                      style={{ clipPath: 'polygon(0 0, 95% 0, 100% 25%, 100% 100%, 0 100%)' }}
                    >
                      <div className="p-3">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                          <span>{item.title}</span>
                          <span className="text-[var(--accent)]">{item.progress}%</span>
                        </div>
                        <div className="mt-1 h-1.5 rounded-full bg-slate-100">
                          <div
                            className="h-1.5 rounded-full bg-[var(--accent)] transition-all"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}