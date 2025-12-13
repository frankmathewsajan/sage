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
    return () => clearTimeout(timeoutId);
  }, [url]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    try {
      // Calculate next review date based on spaced repetition
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
      };

      if (nextInterval) {
        const nextReview = new Date();
        nextReview.setDate(nextReview.getDate() + nextInterval);
        updates.nextReviewDate = nextReview.toISOString().split("T")[0];
      } else {
        updates.nextReviewDate = null;
        updates.neuralPathwayCreated = true;
      }

      await updateDoc(doc(db, "problems", problemId), updates);
      await loadProblems();
    } catch (error) {
      console.error("Error marking as reviewed:", error);
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

  // Get calendar data for GitHub-style heatmap
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
  });

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <i className="fa-solid fa-check text-xl text-blue-600" aria-hidden />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{problems.length}</p>
              <p className="text-sm text-slate-600">Total Solved</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
              <i className="fa-solid fa-fire text-xl text-emerald-600" aria-hidden />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {problems.filter((p) => p.solvedDate === new Date().toISOString().split("T")[0]).length}
              </p>
              <p className="text-sm text-slate-600">Solved Today</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
              <i className="fa-solid fa-calendar text-xl text-purple-600" aria-hidden />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {Object.keys(calendarData).length}
              </p>
              <p className="text-sm text-slate-600">Active Days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Heatmap - GitHub/LeetCode Style */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          {problems.filter((p) => p.solvedDate >= new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0]).length} problems in the last year
        </h2>
        <div className="overflow-x-auto">
          <div className="inline-flex gap-0.5">
            {/* Day labels */}
            <div className="flex flex-col justify-around pr-2 text-[10px] text-slate-500">
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
              
              return (
                <div key={weekIndex} className="flex flex-col gap-0.5">
                  {/* Month label */}
                  <div className="h-3 text-[10px] text-slate-500 -ml-1">
                    {monthLabel}
                  </div>
                  {/* Days */}
                  {week.map((day) => (
                    <div
                      key={day.date}
                      className={`h-2.5 w-2.5 rounded-[2px] cursor-pointer border border-slate-200/50 transition-all hover:border-slate-400 ${
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
          
          <div className="mt-4 flex items-center justify-end gap-2 text-xs text-slate-600">
            <span>Less</span>
            <div className="h-2.5 w-2.5 rounded-[2px] bg-slate-100 border border-slate-200" />
            <div className="h-2.5 w-2.5 rounded-[2px] bg-emerald-300 border border-slate-200/50" />
            <div className="h-2.5 w-2.5 rounded-[2px] bg-emerald-500 border border-slate-200/50" />
            <div className="h-2.5 w-2.5 rounded-[2px] bg-emerald-600 border border-slate-200/50" />
            <div className="h-2.5 w-2.5 rounded-[2px] bg-emerald-700 border border-slate-200/50" />
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Review Reminders */}
      {needsReview.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <i className="fa-solid fa-bell text-xl text-amber-600" aria-hidden />
            <div className="flex-1">
              <h2 className="mb-2 text-lg font-semibold text-amber-900">
                {needsReview.length} Problem{needsReview.length !== 1 ? 's' : ''} Need Review
              </h2>
              <p className="mb-3 text-sm text-amber-800">
                Time to review these problems to reinforce your understanding using spaced repetition.
              </p>
              <div className="space-y-2">
                {needsReview.map((problem) => (
                  <div key={problem.id} className="flex items-center justify-between rounded-lg bg-white p-3">
                    <a
                      href={problem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:text-blue-700"
                    >
                      {problem.title}
                    </a>
                    <button
                      onClick={() => markAsReviewed(problem.id, problem.reviewCount)}
                      className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-600"
                    >
                      Mark Reviewed
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pattern Baskets */}
      {Object.keys(problemsByPattern).length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Problems by Pattern (Needs Review)</h2>
          <div className="space-y-4">
            {Object.entries(problemsByPattern).map(([patternName, patternProblems]) => (
              <div key={patternName} className="rounded-lg border border-slate-200 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">{patternName}</h3>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {patternProblems.length} problem{patternProblems.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="space-y-1">
                  {patternProblems.map((problem) => (
                    <a
                      key={problem.id}
                      href={problem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-blue-600 hover:text-blue-700"
                    >
                      • {problem.title}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Problem Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center text-slate-600 transition hover:border-blue-500 hover:text-blue-500"
      >
        <i className="fa-solid fa-plus mb-2 text-2xl" aria-hidden />
        <p className="font-semibold">Add New Problem</p>
      </button>

      {/* Add Problem Form - Modern Centered Design */}
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
                  className="flex-1 rounded-lg bg-linera-to-r from-blue-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:from-blue-600 hover:to-blue-700"
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
          </div>
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
                    <div className="flex items-center gap-2 flex-wrap">
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
                    </div>
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
