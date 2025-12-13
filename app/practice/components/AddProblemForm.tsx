import { useEffect } from "react";
import type { ProblemFormData } from "../types";
import { useFormStore } from "../store/useFormStore";

interface AddProblemFormProps {
  onSubmit: (data: ProblemFormData) => Promise<void>;
  onClose: () => void;
}

export function AddProblemForm({ onSubmit, onClose }: AddProblemFormProps) {
  const {
    url,
    title,
    notes,
    description,
    solvedDate,
    neuralPathwayCreated,
    patterns,
    difficulty,
    loading,
    setUrl,
    setTitle,
    setNotes,
    setDescription,
    setSolvedDate,
    setNeuralPathwayCreated,
    setPatterns,
    setLoading,
    setAutoFilledData,
    resetForm,
  } = useFormStore();

  // Auto-extract title and metadata when URL changes
  useEffect(() => {
    if (!url || title) return;

    const extractData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/extract-title", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        const data = await response.json();
        if (data.title) {
          setAutoFilledData({
            title: data.title,
            difficulty: data.difficulty || "",
            patterns: data.patterns || "",
            description: data.description || "",
          });
        }
      } catch (error) {
        console.error("Error extracting data:", error);
      } finally {
        setLoading(false);
      }
    };

    extractData();
  }, [url]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit({ url, title, notes, description, solvedDate, neuralPathwayCreated, pattern: patterns });
    resetForm();
    onClose();
  }

  // Reset form when component unmounts
  useEffect(() => {
    return () => resetForm();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Add LeetCode Problem
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 transition hover:text-slate-600"
          >
            <i className="fa-solid fa-xmark text-lg" aria-hidden />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Problem URL *</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://leetcode.com/problems/two-sum"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
              {loading && (
                <p className="mt-1.5 text-xs text-emerald-600 font-medium">
                  <i className="fa-solid fa-circle-notch fa-spin mr-1" aria-hidden />
                  Auto-filling fields...
                </p>
              )}
              {!loading && title && (
                <p className="mt-1.5 text-xs text-emerald-600 font-medium">
                  <i className="fa-solid fa-check-circle mr-1" aria-hidden />
                  Fields auto-filled • {difficulty}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Problem Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Two Sum"
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Pattern/Category</label>
              <input
                type="text"
                value={patterns}
                onChange={(e) => setPatterns(e.target.value)}
                placeholder="Two Pointers, DP..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Solved Date *</label>
              <input
                type="date"
                value={solvedDate}
                onChange={(e) => setSolvedDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description..."
                rows={2}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700">Notes & Solution</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Approach, complexity..."
                rows={2}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="md:col-span-3">
              <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-emerald-200 bg-linear-to-r from-emerald-50 to-teal-50 p-3 transition hover:from-emerald-100 hover:to-teal-100">
                <input
                  type="checkbox"
                  checked={neuralPathwayCreated}
                  onChange={(e) => setNeuralPathwayCreated(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                />
                <div>
                  <p className="text-sm font-semibold text-emerald-900">✓ Mastered</p>
                  <p className="mt-0.5 text-[10px] text-emerald-700">
                    Check if you've fully mastered this problem. Otherwise, we'll schedule spaced repetition reviews (3d → 7d → 30d).
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="flex gap-2.5 pt-1">
            <button
              type="submit"
              className="flex-1 rounded-lg bg-linear-to-r from-blue-500 via-cyan-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-blue-600 hover:via-cyan-600 hover:to-teal-600"
            >
              <i className="fa-solid fa-plus mr-1.5" aria-hidden />
              Add Problem
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-linear-to-r from-slate-50 to-gray-50 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:from-slate-100 hover:to-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
