const REVIEW_INTERVALS = [3, 7, 30];

export function calculateNextReview(
  solvedDate: string,
  reviewCount: number,
  neuralPathwayCreated: boolean
): string | null {
  if (neuralPathwayCreated) return null;
  
  const interval = REVIEW_INTERVALS[reviewCount];
  if (!interval) return null;
  
  const nextReview = new Date(solvedDate);
  nextReview.setDate(nextReview.getDate() + interval);
  return nextReview.toISOString().split("T")[0];
}

export function getNextReviewUpdate(currentReviewCount: number) {
  const nextInterval = REVIEW_INTERVALS[currentReviewCount] || null;
  
  const updates: {
    reviewCount: number;
    nextReviewDate?: string | null;
    neuralPathwayCreated?: boolean;
  } = {
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

  return updates;
}
