
export interface Feedback {
  id: number;
  recipientName: string;
  feedback: string;
  isAnonymous: boolean;
  createdAt: string;
  senderName: string;
}

// Helper functions to work with localStorage
export const getFeedbackList = (): Feedback[] => {
  try {
    const storedFeedback = localStorage.getItem("feedbackList");
    return storedFeedback ? JSON.parse(storedFeedback) : [];
  } catch (error) {
    console.error("Error retrieving feedback:", error);
    return [];
  }
};

export const saveFeedback = (feedback: Feedback): void => {
  try {
    const feedbackList = getFeedbackList();
    feedbackList.push(feedback);
    localStorage.setItem("feedbackList", JSON.stringify(feedbackList));
  } catch (error) {
    console.error("Error saving feedback:", error);
  }
};

export const createFeedback = (data: Omit<Feedback, "id" | "createdAt" | "senderName">, senderName: string): Feedback => {
  return {
    id: Date.now(),
    ...data,
    createdAt: new Date().toISOString(),
    senderName: data.isAnonymous ? "Anonymous" : senderName,
  };
};
