import { memo } from "react";
import type { Problem } from "../types";
import { ProblemCard } from "./ProblemCard";

interface ProblemsListProps {
  problems: Problem[];
  loading: boolean;
  onDelete: (id: string) => void;
}

export const ProblemsList = memo(function ProblemsList({ problems, loading, onDelete }: ProblemsListProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-base font-semibold text-slate-900">Solved Problems</h2>
      {loading ? (
        <p className="text-center text-sm text-slate-600">Loading...</p>
      ) : problems.length === 0 ? (
        <p className="text-center text-sm text-slate-600">No problems tracked yet. Add your first one!</p>
      ) : (
        <div className="space-y-2">
          {problems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
});
