export interface Step {
  title: string;
  progress: number;
  isPhase: boolean;
}

export interface Phase {
  title: string;
  items: Step[];
}

export const steps: Step[] = [
  { title: "Phase 1: The Basics (The Language of Efficiency)", progress: 0, isPhase: true },
  { title: "Big O Notation (Time & Space Complexity)", progress: 0, isPhase: false },
  { title: "Memory Management (Stack vs. Heap, Reference vs. Value)", progress: 0, isPhase: false },
  { title: "Basic Arrays & Strings (Under the hood)", progress: 0, isPhase: false },
  { title: "Phase 2: Linear Data Structures (The Toolbox)", progress: 0, isPhase: true },
  { title: "Hash Maps (Collision handling, internal logic)", progress: 0, isPhase: false },
  { title: "Two Pointers & Sliding Window", progress: 0, isPhase: false },
  { title: "Linked Lists", progress: 0, isPhase: false },
  { title: "Stacks & Queues", progress: 0, isPhase: false },
  { title: "Phase 3: Non-Linear Data Structures (The Major League)", progress: 0, isPhase: true },
  { title: "Recursion & Backtracking", progress: 0, isPhase: false },
  { title: "Trees (Binary, BST, Heaps)", progress: 0, isPhase: false },
  { title: "Graphs (BFS, DFS, Topo Sort)", progress: 0, isPhase: false },
  { title: "Phase 4: Optimization (The Boss Battles)", progress: 0, isPhase: true },
  { title: "Dynamic Programming", progress: 0, isPhase: false },
  { title: "Greedy Algorithms", progress: 0, isPhase: false },
  { title: "Bit Manipulation", progress: 0, isPhase: false },
];

export const phases: Phase[] = steps.reduce<Phase[]>((acc, step) => {
  if (step.isPhase) {
    acc.push({
      title: step.title,
      items: [],
    });
  } else {
    acc[acc.length - 1].items.push(step);
  }
  return acc;
}, []);

// Helper to chunk phases into pairs (Rows)
export const rows: Phase[][] = [];
for (let i = 0; i < phases.length; i += 2) {
  rows.push(phases.slice(i, i + 2));
}

export const phaseColors = [
  "bg-gradient-to-br from-amber-50 via-white to-amber-100",
  "bg-gradient-to-br from-red-50 via-white to-red-100",
  "bg-gradient-to-br from-purple-50 via-white to-purple-100",
  "bg-gradient-to-br from-slate-50 via-white to-slate-100",
];