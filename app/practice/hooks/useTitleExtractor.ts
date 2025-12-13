import { useState, useEffect } from "react";

interface ExtractedData {
  title: string;
  difficulty?: string;
  patterns?: string;
  description?: string;
}

export function useTitleExtractor(url: string, existingTitle: string) {
  const [title, setTitle] = useState(existingTitle);
  const [difficulty, setDifficulty] = useState("");
  const [patterns, setPatterns] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  async function extractData(problemUrl: string) {
    if (!problemUrl) return;
    setLoading(true);
    try {
      const response = await fetch("/api/extract-title", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: problemUrl }),
      });
      const data: ExtractedData = await response.json();
      if (data.title) {
        setTitle(data.title);
        setDifficulty(data.difficulty || "");
        setPatterns(data.patterns || "");
        setDescription(data.description || "");
      }
    } catch (error) {
      console.error("Error extracting data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Remove debounce - extract immediately when URL changes
    if (url && !title) {
      extractData(url);
    }
  }, [url]);

  return { title, setTitle, difficulty, patterns, setPatterns, description, setDescription, loading };
}
