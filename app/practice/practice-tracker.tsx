"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/providers/auth-provider";
import { collection, addDoc, query, where, getDocs, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firestore";

interface Problem {
  id: string;
  url: string;
  title: string;
  notes: string;
  description: string;
  solvedDate: string;
  userId: string;
  neuralPathwayCreated: boolean;
  pattern: string;
  nextReviewDate?: string;
  reviewCount: number;
}

export function PracticeTracker() {
  const { user } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [description, setDescription] = useState("");
  const [solvedDate, setSolvedDate] = useState(new Date().toISOString().split("T")[0]);
  const [neuralPathwayCreated, setNeuralPathwayCreated] = useState(false);
  const [pattern, setPattern] = useState("");

  useEffect(() => {
    if (user) {
      loadProblems();
    }
  }, [user]);

  async function loadProblems() {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, "problems"),
        where("userId", "==", user.uid),
        orderBy("solvedDate", "desc")
      );
      const snapshot = await getDocs(q);
      const loadedProblems = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Problem[];
      setProblems(loadedProblems);
    } catch (error) {
      console.error("Error loading problems:", error);
    }
    setLoading(false);
  }

  async function extractTitle(problemUrl: string) {
    if (!problemUrl) return;
    try {
      const response = await fetch("/api/extract-title", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: problemUrl }),
      });
      const data = await response.json();
      if (data.title) {
        setTitle(data.title);
      }
    } catch (error) {
      console.error("Error extracting title:", error);
    }
  }

  // Auto-extract title when URL changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (url && !title) {
        extractTitle(url);
      }
    }, 500);
    re// Calculate next review date based on spaced repetition
      const nextReview = new Date(solvedDate);
      nextReview.setDate(nextReview.getDate() + 3); // First review after 3 days

      await addDoc(collection(db, "problems"), {
        url,
        title,
        notes,
        description,
        solvedDate,
        userId: user.uid,
        neuralPathwayCreated,
        pattern,
        nextReviewDate: neuralPathwayCreated ? null : nextReview.toISOString().split("T")[0],
        reviewCount: 0,
      });
      
      // Reset form
      setUrl("");
      setTitle("");
      setNotes("");
      setDescription("");
      setSolvedDate(new Date().toISOString().split("T")[0]);
      setNeuralPathwayCreated(false);
      setPattern("");
      setShowForm(false);
      
      // Reload problems
      await loadProblems();
    } catch (error) {
      console.error("Error adding problem:", error);
    }
  }

  async function markAsReviewed(problemId: string, currentReviewCount: number) {
    try {
      // Spaced repetition intervals: 3 days -> 7 days -> 30 days -> completed
      const intervals = [3, 7, 30];
      const nextInterval = intervals[currentReviewCount] || null;
      
      const updates: any = {
        reviewCount: currentReviewCount + 1,
      }; for GitHub-style heatmap
  const getCalendarData = () => {
    const calendar: { [key: string]: number } = {};
    problems.forEach((problem) => {
      calendar[problem.solvedDate] = (calendar[problem.solvedDate] || 0) + 1;
    });
    return calendar;
  };

  const calendarData = getCalendarData();
  const today = new Date();
  
  // Generate last 52 weeks (364 days)
  const weeks: { date: string; count: number }[][] = [];
  for (let week = 51; week >= 0; week--) {
    const weekDays: { date: string; count: number }[] = [];
    for (let day = 0; day < 7; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (week * 7 + (6 - day)));
      const dateStr = date.toISOString().split("T")[0];
      weekDays.push({ date: dateStr, count: calendarData[dateStr] || 0 });
    }
    weeks.push(weekDays);
  }

  // Get problems that need review
  const needsReview = problems.filter(
    (p) => !p.neuralPathwayCreated && p.nextReviewDate && p.nextReviewDate <= new Date().toISOString().split("T")[0]
  );

  // Group problems by pattern
  const problemsByPattern: { [key: string]: Problem[] } = {};
  problems.forEach((problem) => {
    if (problem.pattern && !problem.neuralPathwayCreated) {
      if (!problemsByPattern[problem.pattern]) {
        problemsByPattern[problem.pattern] = [];
      }
      problemsByPattern[problem.pattern].push(problem);
    }
  });   // Reload problems
      await loadProblems();
    } catch (error) {
      console.error("Error adding problem:", error);
    }
  }

  async function handleDelete(problemId: string) {
    if (!confirm("Are you sure you want to delete this problem?")) return;
    try {
      await deleteDoc(doc(db, "problems", problemId));
      await loadProblems();
    } catch (error) {
      console.error("Error deleting problem:", error);
    }
  }

  // Get calendar data
  const getCalendarData = () => {
    const calendar: { [key: string]: number } = {};
    problems.forEach((problem) => {
      calendar[problem.solvedDate] = (calendar[problem.solvedDate] || 0) + 1;
    });
    return calendar;
  };

  const calendarData = getCalendarData();
  const today = new Date();- GitHub Style */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Activity Calendar</h2>
        <div className="overflow-x-auto pb-2">
          <div className="inline-flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={day.date}
                    className={`h-3 w-3 rounded-sm transition-colors ${
                      day.count === 0
                        ? "bg-slate-100 hover:bg-slate-200"
                        : day.count === 1
                        ? "bg-emerald-300 hover:bg-emerald-400"
                        : day.count === 2
                        ? "bg-emerald-500 hover:bg-emerald-600"
                        : day.count >= 3
                        ? "bg-emerald-700 hover:bg-emerald-800"
                        : "bg-emerald-900 hover:bg-emerald-950"
                    }`}
                    title={`${new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}: ${day.count} problem${day.count !== 1 ? 's' : ''}`}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span>Less</span>
              <div className="h-3 w-3 rounded-sm bg-slate-100 border border-slate-200" />
              <div className="h-3 w-3 rounded-sm bg-emerald-300" />
              <div className="h-3 w-3 rounded-sm bg-emerald-500" />
              <div className="h-3 w-3 rounded-sm bg-emerald-700" />
              <div className="h-3 w-3 rounded-sm bg-emerald-900" />
              <span>More</span>
            </div>
          </div>
        </div>
      </div>

      {/* Review Reminders - Modern Centered Design */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Add LeetCode Problem</h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-slate-400 transition hover:text-slate-600"
              >
                <i className="fa-solid fa-xmark text-xl" aria-hidden />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Problem URL *
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://leetcode.com/problems/two-sum"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                  {url && !title && (
                    <p className="mt-1.5 text-xs text-slate-500">
                      <i className="fa-solid fa-circle-notch fa-spin mr-1" aria-hidden />
                      Extracting title...
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Problem Title *
                  </label>
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
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Pattern/Category
                  </label>
                  <input
                    type="text"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    placeholder="Two Pointers, Dynamic Programming..."
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Solved Date *
                  </label>
                  <input
                    type="date"
                    value={solvedDate}
                    onChange={(e) => setSolvedDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the problem..."
                    rows={2}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Notes & Solution Approach
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Your approach, time/space complexity, edge cases, etc..."
                    rows={4}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 transition hover:bg-slate-100">
                    <input
                      type="checkbox"
                      checked={neuralPathwayCreated}
                      onChange={(e) => setNeuralPathwayCreated(e.target.checked)}
                      className="mt-0.5 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">Neural Pathway Created</p>
                      <p className="mt-1 text-xs text-slate-600">
                        Check this if you fully understand the pattern and can easily solve similar problems. 
                        If unchecked, we'll schedule spaced repetition reviews (3 days → 7 days → 30 days).
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:from-blue-600 hover:to-blue-700"
                >
                  Add Problem
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </divlassName="grid grid-flow-col auto-cols-max gap-1">
            {calendarDays.map((day) => (
              <div
                key={day.date}
                className={`h-3 w-3 rounded-sm ${
                  day.count === 0
                    ? "bg-slate-100"
                    : day.count === 1
                    ? "bg-emerald-200"
                    : day.count === 2
                    ? "bg-emerald-400"
                    : "bg-emerald-600"
                }`}
                title={`${day.date}: ${day.count} problem(s)`}
              />
            ))} flex-wrap">
                      <i className="fa-solid fa-check-circle text-emerald-500" aria-hidden />
                      <a
                        href={problem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-semibold text-blue-600 hover:text-blue-700"
                      >
                        {problem.title}
                      </a>
                      {problem.neuralPathwayCreated && (
                        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                          <i className="fa-solid fa-brain mr-1" aria-hidden />
                          Mastered
                        </span>
                      )}
                      {problem.pattern && (
                        <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                          {problem.pattern}
                        </span>
                      )}
                    </div>
                    {problem.description && (
                      <p className="mt-2 text-sm text-slate-600">{problem.description}</p>
                    )}
                    {problem.notes && (
                      <div className="mt-2 rounded-md bg-slate-50 p-3">
                        <p className="text-xs font-semibold text-slate-700">Notes:</p>
                        <p className="mt-1 text-sm text-slate-600 whitespace-pre-wrap">{problem.notes}</p>
                      </div>
                    )}
                    <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                      <span>Solved on {new Date(problem.solvedDate).toLocaleDateString()}</span>
                      {problem.nextReviewDate && (
                        <>
                          <span>•</span>
                          <span className="text-amber-600 font-medium">
                            Review on {new Date(problem.nextReviewDate).toLocaleDateString()}
                          </span>
                        </>
                      )}
                      {problem.reviewCount > 0 && (
                        <>
                          <span>•</span>
                          <span>Reviewed {problem.reviewCount}x</span>
                        </>
                      )}
                    </divorm */}
      {showForm && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Add LeetCode Problem</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Problem URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://leetcode.com/problems/..."
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={extractTitle}
                  disabled={extracting || !url}
                  className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
                >
                  {extracting ? "Extracting..." : "Extract Title"}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Problem Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Two Sum"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the problem..."
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Your solution approach, time complexity, etc..."
                rows={4}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Solved Date
              </label>
              <input
                type="date"
                value={solvedDate}
                onChange={(e) => setSolvedDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
              >
                Add Problem
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Problems List */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Solved Problems</h2>
        {loading ? (
          <p className="text-center text-slate-600">Loading...</p>
        ) : problems.length === 0 ? (
          <p className="text-center text-slate-600">No problems tracked yet. Add your first one!</p>
        ) : (
          <div className="space-y-3">
            {problems.map((problem) => (
              <div
                key={problem.id}
                className="rounded-lg border border-slate-200 p-4 transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-check-circle text-emerald-500" aria-hidden />
                      <a
                        href={problem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-semibold text-blue-600 hover:text-blue-700"
                      >
                        {problem.title}
                      </a>
                    </div>
                    {problem.description && (
                      <p className="mt-2 text-sm text-slate-600">{problem.description}</p>
                    )}
                    {problem.notes && (
                      <div className="mt-2 rounded-md bg-slate-50 p-3">
                        <p className="text-xs font-semibold text-slate-700">Notes:</p>
                        <p className="mt-1 text-sm text-slate-600 whitespace-pre-wrap">{problem.notes}</p>
                      </div>
                    )}
                    <p className="mt-2 text-xs text-slate-500">
                      Solved on {new Date(problem.solvedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(problem.id)}
                    className="text-slate-400 transition hover:text-red-500"
                    aria-label="Delete problem"
                  >
                    <i className="fa-solid fa-trash" aria-hidden />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
