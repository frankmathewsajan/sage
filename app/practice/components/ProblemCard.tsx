import { memo } from "react";
import type { Problem } from "../types";
import { Badge, Card } from "./shared/UI";

interface ProblemCardProps {
  problem: Problem;
  onDelete: (id: string) => void;
}

export const ProblemCard = memo(function ProblemCard({ problem, onDelete }: ProblemCardProps) {
  return (
    <Card className="bg-linear-to-r from-white to-slate-50 p-3" hover>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <i className="fa-solid fa-check-circle text-sm text-emerald-500" aria-hidden />
            <a
              href={problem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 truncate"
            >
              {problem.title}
            </a>
            {problem.neuralPathwayCreated && (
              <Badge variant="success" icon="fa-solid fa-check-circle">
                Mastered
              </Badge>
            )}
            {problem.pattern && (
              <Badge variant="info">{problem.pattern}</Badge>
            )}
          </div>
          {problem.description && (
            <p className="mt-1.5 text-xs text-slate-600">{problem.description}</p>
          )}
          {problem.notes && (
            <div className="mt-1.5 rounded-md bg-slate-100 p-2">
              <p className="text-[10px] font-semibold text-slate-700">Notes:</p>
              <p className="mt-0.5 text-xs text-slate-600 whitespace-pre-wrap">{problem.notes}</p>
            </div>
          )}
          <div className="mt-1.5 flex items-center gap-2 text-[10px] text-slate-500">
            <span>Solved {new Date(problem.solvedDate).toLocaleDateString()}</span>
            {problem.nextReviewDate && (
              <>
                <span>•</span>
                <span className="text-amber-600 font-medium">
                  Review {new Date(problem.nextReviewDate).toLocaleDateString()}
                </span>
              </>
            )}
            {problem.reviewCount > 0 && (
              <>
                <span>•</span>
                <span>Reviewed {problem.reviewCount}x</span>
              </>
            )}
          </div>
        </div>
        <button
          onClick={() => onDelete(problem.id)}
          className="text-slate-400 transition hover:text-red-500 shrink-0"
          aria-label="Delete problem"
        >
          <i className="fa-solid fa-trash text-xs" aria-hidden />
        </button>
      </div>
    </Card>
  );
});
