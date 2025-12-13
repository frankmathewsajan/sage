import { memo } from "react";
import type { CalendarDay } from "../types";
import { Card } from "./shared/UI";

interface CalendarHeatmapProps {
  weeks: CalendarDay[][];
  totalProblems: number;
  solvedToday: number;
  activeDays: number;
}

export const CalendarHeatmap = memo(function CalendarHeatmap({ weeks, totalProblems, solvedToday, activeDays }: CalendarHeatmapProps) {
  return (
    <Card className="p-4 overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Calendar - 75% */}
        <div className="flex-3 min-w-0">
          <h2 className="mb-3 text-base font-semibold text-slate-900">
            {totalProblems} problems in the last year
          </h2>
          <div className="overflow-x-auto overflow-y-hidden">
            <div className="inline-flex gap-[3px] min-w-max">
              {/* Day labels */}
              <div className="flex flex-col justify-around pr-3 text-[10px] text-slate-500">
                <span>Mon</span>
                <span className="invisible">Tue</span>
                <span>Wed</span>
                <span className="invisible">Thu</span>
                <span>Fri</span>
                <span className="invisible">Sat</span>
                <span className="invisible">Sun</span>
              </div>
              
              {/* Calendar grid */}
              {weeks.map((week, weekIndex) => {
                const firstDay = week[0];
                const showMonth = new Date(firstDay.date).getDate() <= 7;
                const monthLabel = showMonth ? new Date(firstDay.date).toLocaleDateString('en-US', { month: 'short' }) : '';
                const addMonthSpacing = showMonth && weekIndex > 0;
                
                return (
                  <div key={weekIndex} className={`flex flex-col gap-[3px] ${addMonthSpacing ? 'ml-3' : ''}`}>
                    {/* Month label */}
                    <div className="h-4 text-[10px] text-slate-500 font-medium">
                      {monthLabel}
                    </div>
                    {/* Days */}
                    {week.map((day) => (
                      <div
                        key={day.date}
                        className={`h-3.5 w-3.5 rounded-sm cursor-pointer border border-slate-200/50 transition-all hover:border-slate-400 ${
                          day.count === 0
                            ? "bg-slate-100"
                            : day.count === 1
                            ? "bg-emerald-300"
                            : day.count === 2
                            ? "bg-emerald-500"
                            : day.count === 3
                            ? "bg-emerald-600"
                            : "bg-emerald-700"
                        }`}
                        title={`${new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}: ${day.count} problem${day.count !== 1 ? 's' : ''}`}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-slate-600">
              <span>Less</span>
              <div className="h-3 w-3 rounded-sm bg-slate-100 border border-slate-200" />
              <div className="h-3 w-3 rounded-sm bg-emerald-300 border border-slate-200/50" />
              <div className="h-3 w-3 rounded-sm bg-emerald-500 border border-slate-200/50" />
              <div className="h-3 w-3 rounded-sm bg-emerald-600 border border-slate-200/50" />
              <div className="h-3 w-3 rounded-sm bg-emerald-700 border border-slate-200/50" />
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Stats - 25% */}
        <div className="flex-1 space-y-2 shrink-0">
          <div className="rounded-lg border border-slate-200 bg-linear-to-br from-blue-50 to-cyan-50 p-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
                <i className="fa-solid fa-check text-sm text-white" aria-hidden />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{totalProblems}</p>
                <p className="text-[10px] text-slate-600">Total Solved</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-linear-to-br from-emerald-50 to-teal-50 p-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
                <i className="fa-solid fa-fire text-sm text-white" aria-hidden />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{solvedToday}</p>
                <p className="text-[10px] text-slate-600">Solved Today</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-linear-to-br from-purple-50 to-pink-50 p-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500">
                <i className="fa-solid fa-calendar text-sm text-white" aria-hidden />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{activeDays}</p>
                <p className="text-[10px] text-slate-600">Active Days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
});
